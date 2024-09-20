import { TableHeaderSorting, TableList } from ".";
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
                            row.original.block_height?.toLocaleString()
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
                <Address
                    label={row.original.from_address_label}
                    avatar={{}}
                    address={row.original.from_address}
                    actionable_address={actionable_address}
                />
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
                <Address
                    label={row.original.to_address_label}
                    avatar={{}}
                    address={row.original.to_address}
                    actionable_address={actionable_address}
                />
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
            cell: ({ row }) => {
                return row.original.value ? (
                    <p className="text-right">
                        {calculatePrettyBalance(
                            row.original.value,
                            row.original.gas_metadata?.contract_decimals
                        )}{" "}
                        {row.original.gas_metadata?.contract_ticker_symbol}
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
                            row.original.gas_metadata?.contract_decimals
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
