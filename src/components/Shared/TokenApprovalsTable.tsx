import { type TokensApprovalItem } from "@covalenthq/client-sdk";
import { type ColumnDef } from "@tanstack/react-table";
import { TableHeaderSorting, TableList } from ".";
import { type TokenApprovalsTableProps } from "@/utils/types/shared.types";
import { Address } from "@/components/Atoms";

export const TokenApprovalsTable: React.FC<TokenApprovalsTableProps> = ({
    errorMessage,
    maybeResult,
}) => {
    const columns: ColumnDef<TokensApprovalItem>[] = [
        {
            id: "token_details",
            accessorKey: "token_details",
            header: ({ column }) => (
                <TableHeaderSorting<TokensApprovalItem>
                    align="left"
                    header={"Token"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <img
                                src={
                                    row.original.logo_url ||
                                    "https://goldrush.vercel.app/icons/token.svg"
                                }
                                alt={row.original.ticker_symbol}
                                className="h-6 w-6"
                            />
                            {row.original.ticker_symbol || (
                                <Address address={row.original.token_address} />
                            )}
                        </div>
                        <p className="text-xs opacity-80">
                            <Address address={row.original.token_address} />
                        </p>
                    </div>
                );
            },
        },
        {
            id: "balance_quote",
            accessorKey: "balance_quote",
            header: ({ column }) => (
                <TableHeaderSorting<TokensApprovalItem>
                    align="left"
                    header={"Wallet Balance"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col">
                        <p>
                            {Number(row.original.balance) /
                                Math.pow(10, row.original.contract_decimals)}
                        </p>
                        <p className="text-xs opacity-80">
                            {row.original.pretty_balance_quote}
                        </p>
                    </div>
                );
            },
        },
        {
            id: "pretty_value_at_risk_quote",
            accessorKey: "pretty_value_at_risk_quote",
            header: ({ column }) => (
                <TableHeaderSorting<TokensApprovalItem>
                    align="left"
                    header={"Value at Risk"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col">
                        <p>
                            {row.original.pretty_value_at_risk_quote
                                ? row.original.pretty_value_at_risk_quote
                                : Number(row.original.value_at_risk) /
                                  Math.pow(10, row.original.contract_decimals)}
                        </p>
                    </div>
                );
            },
        },
        {
            id: "spender_address_label",
            accessorKey: "spender_address_label",
            header: ({ column }) => (
                <TableHeaderSorting<TokensApprovalItem>
                    align="left"
                    header={"Spender(s)"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <p className="flex flex-col">
                        {row.original.spenders.map((spender) =>
                            spender.spender_address_label ? (
                                spender.spender_address_label
                            ) : (
                                <Address address={spender.spender_address} />
                            )
                        )}
                    </p>
                );
            },
        },
        {
            id: "risk_factor",
            accessorKey: "risk_factor",
            header: ({ column }) => (
                <TableHeaderSorting<TokensApprovalItem>
                    align="left"
                    header={"Risk Factor"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <span
                        className={`${
                            row.original.spenders[0].risk_factor ===
                            "CONSIDER REVOKING"
                                ? "bg-red-500"
                                : "bg-green-500"
                        } rounded px-2 py-1 text-white`}
                    >
                        {row.original.spenders[0].risk_factor ===
                        "CONSIDER REVOKING"
                            ? "High"
                            : "Low"}
                    </span>
                );
            },
        },
    ];

    return (
        <TableList<TokensApprovalItem>
            columns={columns}
            errorMessage={errorMessage}
            maybeData={maybeResult}
            sorting_state={[
                {
                    id: "value_at_risk",
                    desc: true,
                },
            ]}
        />
    );
};
