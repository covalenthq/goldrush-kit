import { type Option, None, Some } from "@/utils/option";
import {
    calculatePrettyBalance,
    type Transaction,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
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
import { timestampParser } from "@/utils/functions";
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { SkeletonTable } from "@/components/ui/skeletonTable";
import { type TransactionsProps } from "@/utils/types/shared.types";
import { Address } from "@/components/Atoms";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import IconWrapper from "@/components/Shared/IconWrapper";

const Transactions: React.FC<TransactionsProps> = ({
    on_goldrush_receipt_click,
    on_native_explorer_click,
    on_transaction_click,
    errorMessage,
    maybeResult,
}) => {
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "block_signed_at",
            desc: true,
        },
    ]);
    const [rowSelection, setRowSelection] = useState({});
    const [filterResult, setFilterResult] =
        useState<Option<Transaction[]>>(None);

    useEffect(() => {
        maybeResult.match({
            None: () => [],
            Some: (result) => {
                setFilterResult(new Some(result));
                return [];
            },
        });
    }, [maybeResult]);

    const columns: ColumnDef<Transaction>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    className="mx-1"
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    className="mx-1"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "tx_hash",
            accessorKey: "tx_hash",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Transaction Hash"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-3">
                        {on_transaction_click ? (
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
                                <Address address={row.original.tx_hash} />
                            </div>
                        ) : (
                            <p className="flex flex-col text-base">
                                <Address address={row.original.tx_hash} />
                            </p>
                        )}
                    </div>
                );
            },
        },
        {
            id: "block_height",
            accessorKey: "block_height",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Block Height"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return <p>{row.original.block_height}</p>;
            },
        },
        {
            id: "block_signed_at",
            accessorKey: "block_signed_at",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Age"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <p>
                        {timestampParser(
                            row.original.block_signed_at.toString(),
                            "relative"
                        )}
                    </p>
                );
            },
        },
        {
            id: "from_address",
            accessorKey: "from_address",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"From"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <p>
                        {row.original.from_address_label || (
                            <Address address={row.original.from_address} />
                        )}
                    </p>
                );
            },
        },
        {
            id: "to_address",
            accessorKey: "to_address",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"To"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <p>
                        {row.original.to_address_label || (
                            <Address address={row.original.to_address} />
                        )}
                    </p>
                );
            },
        },
        {
            id: "value",
            accessorKey: "value",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Value"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return row.original.value ? (
                    <p className="text-right">
                        {calculatePrettyBalance(
                            row.original.value,
                            row.original.gas_metadata.contract_decimals
                        )}{" "}
                        {row.original.gas_metadata.contract_ticker_symbol}
                    </p>
                ) : (
                    <p className="text-center">-</p>
                );
            },
        },
        {
            id: "fees_paid",
            accessorKey: "fees_paid",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Fees Paid"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return row.original.fees_paid ? (
                    <p className="text-right">
                        {calculatePrettyBalance(
                            row.original.fees_paid,
                            row.original.gas_metadata.contract_decimals
                        )}
                    </p>
                ) : (
                    <p className="text-center">-</p>
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
        data: filterResult.match({
            None: () => [],
            Some: (result) => result,
        }),
        columns: columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        },
    });

    const body = filterResult.match({
        None: () => <SkeletonTable cols={7} />,
        Some: () =>
            errorMessage ? (
                <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                    >
                        {errorMessage}
                    </TableCell>
                </TableRow>
            ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
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
                ))
            ) : (
                <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                    >
                        No results.
                    </TableCell>
                </TableRow>
            ),
    });

    return (
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
                                              header.column.columnDef.header,
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
    );
};

export default Transactions;
