import { type Option, None, Some } from "@/utils/option";
import { type TokensApprovalItem } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { type TokenApprovalListProps } from "@/utils/types/molecules.types";
import { useGoldRush } from "@/utils/store";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { defaultErrorMessage } from "@/utils/constants/shared.constants";
import { CardDetail, TableHeaderSorting, TableList } from "@/components/Shared";
import { ColumnDef } from "@tanstack/react-table";
import { Address } from "@/components/Atoms";
import { Button } from "@/components/ui/button";

export const TokenApprovalList: React.FC<TokenApprovalListProps> = ({
    chain_name,
    address,
    on_revoke_approval,
}) => {
    const { covalentClient } = useGoldRush();

    const [maybeResult, setMaybeResult] =
        useState<Option<TokensApprovalItem[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.SecurityService.getApprovals(
                        chain_name,
                        address.trim()
                    );
                if (error.error) {
                    throw error;
                }
                setMaybeResult(new Some(data.items));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? defaultErrorMessage);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, address]);

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
                        <CardDetail
                            content={
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
                                        <Address
                                            address={row.original.token_address}
                                        />
                                    )}
                                </div>
                            }
                        />
                        <CardDetail
                            subtext={
                                <Address address={row.original.token_address} />
                            }
                        />
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
                        <CardDetail
                            content={
                                Number(row.original.balance) /
                                Math.pow(10, row.original.contract_decimals)
                            }
                        />
                        <CardDetail subtext={row.original.pretty_balance_quote}/>
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
                    <p>
                        {row.original.pretty_value_at_risk_quote
                            ? row.original.pretty_value_at_risk_quote
                            : Number(row.original.value_at_risk) /
                              Math.pow(10, row.original.contract_decimals)}
                    </p>
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
                                <Address
                                    address={spender.spender_address}
                                    key={spender.spender_address}
                                />
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

    if (on_revoke_approval) {
        columns.push({
            id: "revoke",
            accessorKey: "revoke",
            header: () => <div className="w-12"></div>,
            cell: ({ row }) => {
                return (
                    <Button onClick={() => on_revoke_approval(row.original)}>
                        Revoke
                    </Button>
                );
            },
        });
    }

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
