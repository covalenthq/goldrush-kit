import { type Option, None, Some } from "@/utils/option";
import {
    type BlockTransactionWithContractTransfers,
    type ChainItem,
    type Pagination,
    calculatePrettyBalance,
    prettifyCurrency,
} from "@covalenthq/client-sdk";
import { type TIME_SERIES_GROUP } from "@/utils/constants/shared.constants";
import { Fragment, useEffect, useState } from "react";
import {
    type ColumnDef,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { TokenAvatarView } from "../../../Atoms/TokenAvatar/TokenAvatarView";
import {
    timestampParser,
    truncate,
    calculateTimeSeriesGroup,
} from "@/utils/functions";
import { Badge } from "@/components/ui/badge";
import { AccountCardView } from "@/components/Molecules/AccountCardView/AccountCardView";
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddressAvatarView } from "@/components/Atoms/AddressAvatar/AddressAvatarView";
import { IconWrapper } from "@/components/Shared";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import {
    type TokenTransfersListViewProps,
    type BlockTransactionWithContractTransfersWithDelta,
    type TokenTransferMeta,
} from "@/utils/types/organisms.types";
import { useChains } from "@/utils/store/Chains";
import { useCovalent } from "@/utils/store/Covalent";

const columns: ColumnDef<BlockTransactionWithContractTransfers>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: "block_signed_at",
        header: ({ column }) => (
            <TableHeaderSorting
                align="left"
                header_name={"Time"}
                column={column}
            />
        ),
        cell: ({ row }) => {
            const t = row.getValue("block_signed_at") as string;

            return <div>{timestampParser(t, "relative")}</div>;
        },
    },
    {
        accessorKey: "from_address",
        header: "From",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-x-1">
                    <AddressAvatarView
                        size={GRK_SIZES.EXTRA_SMALL}
                        type="fingerprint"
                        address={row.getValue("from_address")}
                    />
                    {truncate(row.getValue("from_address"))}
                </div>
            );
        },
    },
    {
        accessorKey: "to_address",
        header: "To",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-x-1">
                    <AddressAvatarView
                        size={GRK_SIZES.EXTRA_SMALL}
                        type="fingerprint"
                        address={row.getValue("to_address")}
                    />
                    {truncate(row.getValue("to_address"))}
                </div>
            );
        },
    },
    {
        accessorKey: "transfer_type",
        header: "In/Out",
        cell: ({ row }) => {
            return <Badge>{row.original.transfers[0].transfer_type}</Badge>;
        },
    },
    {
        id: "tokenAmount",
        accessorKey: "delta",
        header: ({ column }) => (
            <TableHeaderSorting
                align="right"
                header_name={"Token Amount"}
                column={column}
            />
        ),
        cell: ({ row }) => {
            const transfer = row.original.transfers[0];
            if (transfer) {
                return (
                    <div className="text-right">
                        {calculatePrettyBalance(
                            transfer?.delta ?? 0,
                            transfer?.contract_decimals
                        )}{" "}
                        {transfer?.contract_ticker_symbol}
                    </div>
                );
            }
            return null;
        },
    },
    {
        id: "value",
        accessorKey: "delta_quote",
        header: ({ column }) => (
            <TableHeaderSorting
                align="right"
                header_name={"Quote"}
                column={column}
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    {prettifyCurrency(
                        row.original.transfers[0].delta_quote,
                        2,
                        "USD",
                        true
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "tx_hash",
        header: "Transaction",
        cell: ({ row }) => {
            const txHash: string = row.getValue("tx_hash");
            return (
                <a
                    className="flex items-center gap-x-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={row.original.transfers[0].explorers[0].url}
                >
                    {truncate(txHash)}
                    <IconWrapper
                        icon_class_name="open_in_new"
                        class_name="h-3 w-3"
                        icon_size="text-sm text-black dark:text-white"
                    />
                </a>
            );
        },
    },
];

export const TokenTransfersListView: React.FC<TokenTransfersListViewProps> = ({
    chain_name,
    address,
    contract_address,
}) => {
    const { covalentClient } = useCovalent();
    const { chains } = useChains();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [paginator, setPaginator] = useState({
        pageNumber: 0,
        pageSize: 10,
    });
    const [maybePagination, setPagination] = useState<Option<Pagination>>(None);
    const [maybeResult, setResult] =
        useState<Option<BlockTransactionWithContractTransfersWithDelta[]>>(
            None
        );
    const [error, setError] = useState({ error: false, error_message: "" });
    const [maybeMeta, setMeta] = useState<Option<TokenTransferMeta>>(None);

    useEffect(() => {
        setResult(None);
        (async () => {
            let response;
            try {
                response =
                    await covalentClient.BalanceService.getErc20TransfersForWalletAddressByPage(
                        chain_name,
                        address.trim(),
                        {
                            contractAddress: contract_address.trim(),
                            pageNumber:
                                paginator.pageNumber >= 0
                                    ? paginator.pageNumber
                                    : 0,
                            pageSize: paginator.pageSize,
                        }
                    );

                if (response.data.items.length > 0) {
                    setMeta(
                        new Some({
                            chain_name: response.data.chain_name,
                            contract_ticker_symbol:
                                response.data.items[0].transfers[0]
                                    .contract_ticker_symbol,
                            logo_url:
                                response.data.items[0].transfers[0].logo_url,
                        })
                    );
                    setResult(
                        new Some(
                            response.data.items.map((o) => {
                                const _item: BlockTransactionWithContractTransfersWithDelta =
                                    {
                                        ...o,
                                        ["delta_quote"]:
                                            o.transfers[0].delta_quote,
                                        ["delta"]: o.transfers[0].delta,
                                    };

                                return _item;
                            })
                        )
                    );
                } else {
                    setMeta(
                        new Some({
                            chain_name: "",
                            contract_ticker_symbol: "",
                            logo_url: "",
                        })
                    );
                    setResult(new Some([]));
                }
                setPagination(new Some(response.data.pagination));
                setError({ error: false, error_message: "" });
            } catch (exception) {
                setMeta(
                    new Some({
                        chain_name: "",
                        contract_ticker_symbol: "",
                        logo_url: "",
                    })
                );
                setPagination(
                    new Some({
                        has_more: false,
                        page_number: 0,
                        page_size: 100,
                        total_count: 0,
                    })
                );
                setResult(new Some([]));
                setError({
                    error: response ? response.error : false,
                    error_message: response ? response.error_message : "",
                });
            }
        })();
    }, [address, contract_address, chain_name, paginator]);

    const table = useReactTable({
        data: maybeResult.match({
            None: () => [],
            Some: (result) => result,
        }),
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        },
    });

    const body = maybeResult.match({
        None: () => (
            <TableRow>
                <TableCell
                    // colSpan={columns.length}
                    className="h-12 text-center"
                >
                    <Skeleton size={GRK_SIZES.MEDIUM} />
                </TableCell>
                <TableCell
                    // colSpan={columns.length}
                    className="h-12 text-right"
                >
                    <div className="float-right">
                        <Skeleton size={GRK_SIZES.MEDIUM} />
                    </div>
                </TableCell>
                <TableCell
                    // colSpan={columns.length}
                    className="h-12 text-right"
                >
                    <div className="float-right">
                        <Skeleton size={GRK_SIZES.MEDIUM} />
                    </div>
                </TableCell>
                <TableCell
                    // colSpan={columns.length}
                    className="h-12  "
                >
                    <div className="float-right">
                        <Skeleton size={GRK_SIZES.MEDIUM} />
                    </div>
                </TableCell>
            </TableRow>
        ),
        Some: () => {
            let lastGroup: TIME_SERIES_GROUP | null = null;
            const now = new Date();

            return error.error ? (
                <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                    >
                        {error.error_message}
                    </TableCell>
                </TableRow>
            ) : !error.error && table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                    const currentGroup = calculateTimeSeriesGroup(
                        now,
                        row.original.block_signed_at
                    );

                    return (
                        <Fragment key={row.id}>
                            {(() => {
                                if (lastGroup !== currentGroup) {
                                    lastGroup = currentGroup;
                                    return (
                                        <TableRow className="bg-accent bg-opacity-10 text-xs uppercase text-muted-foreground">
                                            <TableCell
                                                colSpan={
                                                    row.getVisibleCells().length
                                                }
                                            >
                                                {currentGroup}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            })()}

                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </Fragment>
                    );
                })
            ) : (
                <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                    >
                        No results.
                    </TableCell>
                </TableRow>
            );
        },
    });

    const handlePagination = (action: "next" | "previous") => {
        setPaginator((prev) => {
            const flip =
                action === "next" ? prev.pageNumber + 1 : prev.pageNumber - 1;
            return {
                ...prev,
                pageNumber: flip,
            };
        });
    };

    // const handleSkipPagination = (page: number) => {
    //     setPaginator((prev) => {
    //         return {
    //             ...prev,
    //             pageNumber: page - 1,
    //         };
    //     });
    // };

    const handlePageSize = (size: number) => {
        setPaginator((prev) => {
            return {
                ...prev,
                pageSize: size,
            };
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap place-content-between gap-2">
                <AccountCardView address={address} />
                <div className="lg:max-w-[15rem]] w-full rounded border p-2 md:max-w-[15rem]">
                    <div className="items-center space-x-1">
                        <span>Network</span>
                        <div className="float-right">
                            <div className="flex">
                                {maybeMeta.match({
                                    None: () => (
                                        <Skeleton
                                            size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                        />
                                    ),
                                    Some: (result) => {
                                        const chain: ChainItem | null =
                                            chains?.find(
                                                (o) =>
                                                    o.name === result.chain_name
                                            ) ?? null;
                                        return (
                                            <>
                                                <TokenAvatarView
                                                    is_chain_logo
                                                    token_url={chain?.logo_url}
                                                    size={
                                                        GRK_SIZES.EXTRA_EXTRA_SMALL
                                                    }
                                                />
                                                <span className=" text-secondary ">
                                                    {chain?.category_label}
                                                </span>
                                            </>
                                        );
                                    },
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="items-center space-x-1">
                        <span>Token</span>
                        <div className="float-right">
                            <div className="flex">
                                {maybeMeta.match({
                                    None: () => (
                                        <Skeleton
                                            size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                        />
                                    ),
                                    Some: (result) => {
                                        return (
                                            <>
                                                <TokenAvatarView
                                                    token_url={result.logo_url}
                                                    size={
                                                        GRK_SIZES.EXTRA_EXTRA_SMALL
                                                    }
                                                />
                                                <span className=" text-secondary ">
                                                    {
                                                        result.contract_ticker_symbol
                                                    }
                                                </span>
                                            </>
                                        );
                                    },
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>{body}</TableBody>
            </Table>

            {maybePagination.match({
                None: () => <Skeleton size={GRK_SIZES.MEDIUM} />,
                Some: (data) => {
                    return (
                        <div className="flex items-center justify-between  gap-2">
                            <div className="flex items-center  gap-2">
                                <Button
                                    variant={"outline"}
                                    disabled={data.page_number === 0}
                                    onClick={() => {
                                        handlePagination("previous");
                                    }}
                                >
                                    Previous
                                </Button>
                                Page {data.page_number + 1}
                                <Button
                                    variant={"outline"}
                                    disabled={!data.has_more}
                                    onClick={() => {
                                        handlePagination("next");
                                    }}
                                >
                                    Next
                                </Button>
                            </div>
                            <div className="flex  gap-2">
                                {/* <div className="flex gap-2 items-center text-accent">
                                    Skip to page:
                                    <input
                                        type="number"
                                        defaultValue={1}
                                        onChange={(e) => {
                                            const page = e.target.value
                                                ? Number(e.target.value)
                                                : 0;
                                            handleSkipPagination(page);
                                        }}
                                        className="p-1 rounded w-16 border text-accent dark:text-text-color-50  bg-transparent shadow-sm hover:bg-accent border-accent-foreground hover:bg-accent-foreground"
                                    />
                                </div> */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            Rows per page: {data.page_size}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>
                                            Choose rows per page
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {[5, 10, 15, 20].map((pageSize) => (
                                            <DropdownMenuItem
                                                key={pageSize}
                                                onClick={() => {
                                                    handlePageSize(pageSize);
                                                }}
                                            >
                                                <span>{pageSize}</span>
                                            </DropdownMenuItem>
                                        ))}
                                        <DropdownMenuSeparator />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    );
                },
            })}
        </div>
    );
};
