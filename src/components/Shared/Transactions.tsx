import {
    calculatePrettyBalance,
    type Transaction,
} from "@covalenthq/client-sdk";
import { type ColumnDef } from "@tanstack/react-table";
import { TableHeaderSorting, TableList } from ".";
import { type TransactionsProps } from "@/utils/types/shared.types";
import { Address } from "@/components/Atoms";

import { Timestamp } from "@/components/Atoms";
import { Some } from "@/utils/option";

export const Transactions: React.FC<TransactionsProps> = ({
    errorMessage = null,
    maybeResult = new Some(null),
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
            cell: ({ row }) => <Address address={row.original.tx_hash} />,
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
