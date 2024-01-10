import { type Option, None, Some } from "@/utils/option";
import {
    type ExchangeTransaction,
    type ChainItem,
    type Pagination,
    calculatePrettyBalance,
    prettifyCurrency,
} from "@covalenthq/client-sdk";
import {
    POOL_TRANSACTION_MAP,
    type TIME_SERIES_GROUP,
} from "@/utils/constants/shared.constants";
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
import { TokenAvatar } from "../../../Atoms/TokenAvatar/TokenAvatar";
import {
    timestampParser,
    truncate,
    calculateTimeSeriesGroup,
} from "@/utils/functions";
import { Badge } from "@/components/ui/badge";
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
import { AddressAvatar } from "@/components/Atoms/AddressAvatar/AddressAvatar";
import { IconWrapper } from "@/components/Atoms/IconWrapper/IconWrapper";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import {
    type XYKTransfersListViewProps,
    type TokenTransferMeta,
} from "@/utils/types/organisms.types";
import { useCovalent } from "@/utils/store/Covalent";

const columns: ColumnDef<ExchangeTransaction>[] = [
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
        accessorKey: "act",
        header: ({ column }) => (
            <TableHeaderSorting
                align="left"
                header_name={"Transaction type"}
                column={column}
            />
        ),
        cell: ({ row }) => {
            const token_0 = row.original.token_0;
            const token_1 = row.original.token_1;

            return (
                <div>
                    <Badge className="mr-2">
                        {POOL_TRANSACTION_MAP[row.original.act]}
                    </Badge>{" "}
                    {token_0.contract_ticker_symbol} for{" "}
                    {token_1.contract_ticker_symbol}
                </div>
            );
        },
    },
    {
        id: "total_quote",
        accessorKey: "total_quote",
        header: ({ column }) => (
            <TableHeaderSorting
                align="left"
                header_name={"Total value"}
                column={column}
            />
        ),
        cell: ({ row }) => {
            return <>{row.original.pretty_total_quote}</>;
        },
    },
    {
        id: "amount_0",
        accessorKey: "amount_0",
        header: ({ column }) => (
            <TableHeaderSorting
                align="left"
                header_name={"Token Amount"}
                column={column}
            />
        ),
        cell: ({ row }) => {
            return (
                <span>
                    {row.original.amount_0}{" "}
                    {row.original.token_0.contract_ticker_symbol}
                </span>
            );
        },
    },
    {
        id: "amount_1",
        accessorKey: "amount_1",
        header: ({ column }) => (
            <TableHeaderSorting
                align="left"
                header_name={"Token Amount"}
                column={column}
            />
        ),
        cell: ({ row }) => {
            return (
                <span>
                    {row.original.amount_1}{" "}
                    {row.original.token_1.contract_ticker_symbol}
                </span>
            );
        },
    },
];

export const XYKTransfersListView: React.FC<XYKTransfersListViewProps> = ({
    chain_name,
    dex_name,
    pool_address,
}) => {
    const { covalentClient, chains } = useCovalent();

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "block_signed_at",
            desc: true,
        },
    ]);
    const [rowSelection, setRowSelection] = useState({});
    const [paginator, setPaginator] = useState({
        pageNumber: 0,
        pageSize: 10,
    });
    const [maybePagination, setPagination] = useState<Option<Pagination>>(None);
    const [maybeResult, setResult] =
        useState<Option<ExchangeTransaction[]>>(None);
    const [error, setError] = useState({ error: false, error_message: "" });
    const [maybeMeta, setMeta] = useState<Option<TokenTransferMeta>>(None);

    useEffect(() => {
        setResult(None);
        (async () => {
            let response;
            try {
                response =
                    await covalentClient.XykService.getTransactionsForExchange(
                        chain_name,
                        dex_name,
                        pool_address.trim()
                    );
                console.log(response);
                setResult(new Some(response.data.items));

                setError({ error: false, error_message: "" });
            } catch (error) {
                setResult(new Some([]));
                setError({
                    error: response ? response.error : false,
                    error_message: response ? response.error_message : "",
                });
            }
        })();
    }, [pool_address, dex_name, chain_name, paginator]);

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
                    return (
                        <Fragment key={row.id}>
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
                {/* <AccountCardView address={address} /> */}
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
                                                <TokenAvatar
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
                                                <TokenAvatar
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
