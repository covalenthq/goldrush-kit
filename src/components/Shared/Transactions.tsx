import {
    calculatePrettyBalance,
    type Transaction,
} from "@covalenthq/client-sdk";
import { type ColumnDef } from "@tanstack/react-table";
import { timestampParser } from "@/utils/functions";
import { IconWrapper, TableHeaderSorting, TableList } from ".";
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

export const Transactions: React.FC<TransactionsProps> = ({
    on_goldrush_receipt_click,
    on_native_explorer_click,
    on_transaction_click,
    errorMessage,
    maybeResult,
}) => {
    const columns: ColumnDef<Transaction>[] = [
        {
            id: "tx_hash",
            accessorKey: "tx_hash",
            header: ({ column }) => (
                <TableHeaderSorting<Transaction>
                    align="left"
                    header={"Transaction Hash"}
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
                <TableHeaderSorting<Transaction>
                    align="left"
                    header={"Block Height"}
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
                <TableHeaderSorting<Transaction>
                    align="left"
                    header={"Age"}
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
                <TableHeaderSorting<Transaction>
                    align="left"
                    header={"From"}
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
                <TableHeaderSorting<Transaction>
                    align="left"
                    header={"To"}
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
                <TableHeaderSorting<Transaction>
                    align="right"
                    header={"Value"}
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
                <TableHeaderSorting<Transaction>
                    align="right"
                    header={"Fees Paid"}
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

    return (
        <TableList<Transaction>
            columns={columns}
            errorMessage={errorMessage}
            maybeData={maybeResult}
            sorting_state={[
                {
                    id: "block_signed_at",
                    desc: true,
                },
            ]}
        />
    );
};
