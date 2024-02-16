import { type Option, None, Some } from "@/utils/option";
import { type ExchangeTransaction } from "@covalenthq/client-sdk";
import { POOL_TRANSACTION_MAP } from "@/utils/constants/shared.constants";
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
import { timestampParser } from "@/utils/functions";
import { Badge } from "@/components/ui/badge";
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { type XYKWalletTransactionsListViewProps } from "@/utils/types/organisms.types";
import { useCovalent } from "@/utils/store/Covalent";
import { handleTokenTransactions } from "@/utils/functions/pretty-exchange-amount";
import { handleExchangeType } from "@/utils/functions/exchange-type";
import { SkeletonTable } from "@/components/ui/skeletonTable";
import { IconWrapper } from "@/components/Shared";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const XYKWalletTransactionsListView: React.FC<
    XYKWalletTransactionsListViewProps
> = ({
    chain_name,
    dex_name,
    wallet_address,
    on_transaction_click,
    on_native_explorer_click,
    on_goldrush_receipt_click,
}) => {
    const { covalentClient } = useCovalent();

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "block_signed_at",
            desc: true,
        },
    ]);
    const [rowSelection, setRowSelection] = useState({});
    const [maybeResult, setResult] =
        useState<Option<ExchangeTransaction[]>>(None);
    const [error, setError] = useState({ error: false, error_message: "" });

    useEffect(() => {
        setResult(None);
        (async () => {
            let response;
            try {
                response =
                    await covalentClient.XykService.getTransactionsForAccountAddress(
                        chain_name,
                        dex_name,
                        wallet_address.trim()
                    );
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
    }, [wallet_address, dex_name, chain_name]);

    const columns: ColumnDef<ExchangeTransaction>[] = [
        {
            accessorKey: "block_signed_at",
            header: ({ column }) => (
                <div className="ml-4">
                    <TableHeaderSorting
                        align="left"
                        header_name={"Time"}
                        column={column}
                    />
                </div>
            ),
            cell: ({ row }) => {
                const t = row.getValue("block_signed_at") as string;

                return (
                    <div className="ml-4">{timestampParser(t, "relative")}</div>
                );
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

                if (row.original.act !== "SWAP") {
                    return (
                        <div
                            className={
                                on_transaction_click
                                    ? "cursor-pointer hover:opacity-75"
                                    : ""
                            }
                            onClick={() => {
                                if (on_transaction_click) {
                                    on_transaction_click(row.original);
                                }
                            }}
                        >
                            <Badge
                                className="mr-2"
                                variant={
                                    POOL_TRANSACTION_MAP[row.original.act].color
                                }
                            >
                                {POOL_TRANSACTION_MAP[row.original.act].name}
                            </Badge>{" "}
                            {token_0.contract_ticker_symbol}{" "}
                            {row.original.act === "SWAP" ? "for" : "and"}{" "}
                            {token_1.contract_ticker_symbol}
                        </div>
                    );
                }
                const token_in =
                    handleExchangeType(row.original, 0) === "in"
                        ? token_0
                        : token_1;
                const token_out =
                    handleExchangeType(row.original, 0) === "out"
                        ? token_0
                        : token_1;
                return (
                    <div
                        className={
                            on_transaction_click
                                ? "cursor-pointer hover:opacity-75"
                                : ""
                        }
                        onClick={() => {
                            if (on_transaction_click) {
                                on_transaction_click(row.original);
                            }
                        }}
                    >
                        <Badge
                            className="mr-2"
                            variant={
                                POOL_TRANSACTION_MAP[row.original.act].color
                            }
                        >
                            {POOL_TRANSACTION_MAP[row.original.act].name}
                        </Badge>{" "}
                        {token_in.contract_ticker_symbol}{" "}
                        {row.original.act === "SWAP" ? "for" : "and"}{" "}
                        {token_out.contract_ticker_symbol}
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
                if (row.original.act !== "SWAP") {
                    return (
                        <span>
                            {handleTokenTransactions(
                                row.original.act,
                                "0",
                                row.original,
                                row.original.token_0.contract_decimals
                            )}{" "}
                            {row.original.token_0.contract_ticker_symbol}
                        </span>
                    );
                }
                const token_in =
                    handleExchangeType(row.original, 0) === "in" ? "0" : "1";
                return (
                    <span>
                        {handleTokenTransactions(
                            row.original.act,
                            token_in,
                            row.original,
                            row.original[`token_${token_in}`].contract_decimals
                        )}{" "}
                        {
                            row.original[`token_${token_in}`]
                                .contract_ticker_symbol
                        }
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
                if (row.original.act !== "SWAP") {
                    return (
                        <span>
                            {handleTokenTransactions(
                                row.original.act,
                                "1",
                                row.original,
                                row.original.token_1.contract_decimals
                            )}{" "}
                            {row.original.token_1.contract_ticker_symbol}
                        </span>
                    );
                }
                const token_in =
                    handleExchangeType(row.original, 0) === "out" ? "0" : "1";
                const token_amount = handleTokenTransactions(
                    row.original.act,
                    token_in,
                    row.original,
                    row.original[`token_${token_in}`].contract_decimals
                );
                return (
                    <span>
                        {token_amount}{" "}
                        {
                            row.original[`token_${token_in}`]
                                .contract_ticker_symbol
                        }
                    </span>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                if (!on_native_explorer_click && !on_goldrush_receipt_click)
                    return;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="ml-auto  ">
                                    <span className="sr-only">Open menu</span>
                                    <IconWrapper icon_class_name="expand_more" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                {on_native_explorer_click && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            on_native_explorer_click(
                                                row.original
                                            );
                                        }}
                                    >
                                        <IconWrapper
                                            icon_class_name="open_in_new"
                                            class_name="mr-2"
                                        />{" "}
                                        View on explorer
                                    </DropdownMenuItem>
                                )}
                                {on_goldrush_receipt_click && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            on_goldrush_receipt_click(
                                                row.original
                                            );
                                        }}
                                    >
                                        <IconWrapper
                                            icon_class_name="open_in_new"
                                            class_name="mr-2"
                                        />{" "}
                                        View goldrush receipt
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

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
        None: () => <SkeletonTable cols={4} />,
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
                    if (
                        !row.original.token_0?.contract_ticker_symbol &&
                        !row.original.token_1?.contract_ticker_symbol
                    )
                        return;
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

    return (
        <div className="space-y-4">
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
        </div>
    );
};
