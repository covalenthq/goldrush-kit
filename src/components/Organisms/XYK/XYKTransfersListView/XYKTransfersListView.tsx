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
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { timestampParser } from "@/utils/functions";
import { Badge } from "@/components/ui/badge";
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type XYKTransfersListViewProps } from "@/utils/types/organisms.types";
import { useCovalent } from "@/utils/store/Covalent";
import { handleTokenTransactions } from "@/utils/functions/pretty-exchange-amount";
import { handleExchangeType } from "@/utils/functions/exchange-type";

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

            if (row.original.act !== "SWAP") {
                return (
                    <div>
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
                <div>
                    <Badge
                        className="mr-2"
                        variant={POOL_TRANSACTION_MAP[row.original.act].color}
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
                    {row.original[`token_${token_in}`].contract_ticker_symbol}
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
                    {row.original[`token_${token_in}`].contract_ticker_symbol}
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
    }, [pool_address, dex_name, chain_name]);

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
                <TableCell className="h-12 text-center">
                    <Skeleton size={GRK_SIZES.MEDIUM} />
                </TableCell>
                <TableCell className="h-12 text-right">
                    <div className="float-right">
                        <Skeleton size={GRK_SIZES.MEDIUM} />
                    </div>
                </TableCell>
                <TableCell className="h-12 text-right">
                    <div className="float-right">
                        <Skeleton size={GRK_SIZES.MEDIUM} />
                    </div>
                </TableCell>
                <TableCell className="h-12  ">
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
