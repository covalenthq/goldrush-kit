import { IconWrapper, TableHeaderSorting, TableList } from ".";
import { Badge } from "../ui/badge";
import { Address } from "@/components/Atoms";
import { Timestamp } from "@/components/Atoms";
import { actionableWrapper } from "@/utils/functions";
import { Some } from "@/utils/option";
import { type TransactionsProps } from "@/utils/types/shared.types";
import {
    calculatePrettyBalance,
    type Transaction,
} from "@covalenthq/client-sdk";
import { type ColumnDef } from "@tanstack/react-table";

export const Transactions: React.FC<TransactionsProps> = ({
    address = null,
    errorMessage = null,
    maybeResult = new Some(null),
    actionable_address,
    actionable_block = () => null,
    actionable_transaction,
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
            cell: ({ row }) => (
                <Address
                    address={row.original.tx_hash}
                    actionable_address={actionable_transaction}
                />
            ),
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
                return (
                    <p>
                        {actionableWrapper(
                            actionable_block(row.original.block_height),
                            row.original.block_height?.toLocaleString(),
                        )}
                    </p>
                );
            },
        },
        {
            id: "block_signed_at",
            accessorKey: "block_signed_at",
            header: ({ column }) => (
                <TableHeaderSorting<Transaction>
                    align="left"
                    header={"Signed At"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <Timestamp
                        timestamp={row.original.block_signed_at}
                        defaultType="relative"
                    />
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
            cell: ({ row }) => (
                <div className="w-20">
                    <Address
                        label={row.original.from_address_label}
                        avatar={{}}
                        address={row.original.from_address}
                        actionable_address={actionable_address}
                    />
                </div>
            ),
        },
        {
            id: "in_out",
            accessorKey: "in_out",
            header: () => null,
            cell: ({ row }) => (
                <div className="w-10 flex justify-center">
                    <Badge
                        variant={
                            (address
                                ? address?.toLowerCase() ===
                                  row.original.from_address?.toLowerCase()
                                    ? "danger"
                                    : address?.toLowerCase() ===
                                        row.original.to_address?.toLowerCase()
                                      ? "success"
                                      : null
                                : null) || "ghost"
                        }
                    >
                        {(address
                            ? address.toLowerCase() ===
                              row.original.from_address?.toLowerCase()
                                ? "OUT"
                                : address.toLowerCase() ===
                                    row.original.to_address?.toLowerCase()
                                  ? "IN"
                                  : null
                            : null) || (
                            <IconWrapper
                                icon_class_name="arrow_right_alt"
                                class_name="text-secondary-light dark:text-secondary-dark"
                            />
                        )}
                    </Badge>
                </div>
            ),
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
            cell: ({ row }) => (
                <div className="w-20">
                    <Address
                        label={row.original.to_address_label}
                        avatar={{}}
                        address={row.original.to_address}
                        actionable_address={actionable_address}
                    />
                </div>
            ),
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
            cell: ({ row }) => (
                <p className="text-right">
                    {row.original.value
                        ? `${calculatePrettyBalance(
                              row.original.value,
                              row.original.gas_metadata?.contract_decimals,
                          )} ${row.original.gas_metadata?.contract_ticker_symbol}`
                        : "-"}
                </p>
            ),
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
                            row.original.gas_metadata?.contract_decimals,
                        )}
                    </p>
                ) : (
                    <p className="text-center">-</p>
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
