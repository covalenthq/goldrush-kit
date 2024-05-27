import { type Option, None, Some } from "@/utils/option";
import { type TokensApprovalItem } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { type TokenApprovalListProps } from "@/utils/types/molecules.types";
import { useGoldRush } from "@/utils/store";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import {
    GRK_SIZES,
    defaultErrorMessage,
} from "@/utils/constants/shared.constants";
import { CardDetail, TableHeaderSorting, TableList } from "@/components/Shared";
import type { ColumnDef } from "@tanstack/react-table";
import { Address, TokenAvatar } from "@/components/Atoms";
import { Button } from "@/components/ui/button";
import { TableHeader } from "@/components/ui/table";

export const TokenApprovalList: React.FC<TokenApprovalListProps> = ({
    chain_name,
    address,
    on_revoke_approval,
    actionable_spender,
    actionable_token,
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
            header: ({ column }) => <TableHeader>Token</TableHeader>,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col">
                        <CardDetail
                            content={
                                <div className="flex items-center gap-1">
                                    <TokenAvatar
                                        token_url={row.original.logo_url}
                                        size={GRK_SIZES.EXTRA_SMALL}
                                    />
                                    {row.original.ticker_symbol}
                                </div>
                            }
                        />
                        <CardDetail
                            subtext={
                                <Address
                                    address={row.original.token_address}
                                    actionable_address={actionable_token}
                                />
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
                        <CardDetail
                            subtext={row.original.pretty_balance_quote}
                        />
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
            header: ({ column }) => <TableHeader>Spender(s)</TableHeader>,
            cell: ({ row }) => {
                return (
                    <p className="flex flex-col">
                        {row.original.spenders.map((spender) => (
                            <Address
                                address={spender.spender_address}
                                label={spender.spender_address_label}
                                key={spender.spender_address}
                                actionable_address={actionable_spender}
                            />
                        ))}
                    </p>
                );
            },
        },
        {
            id: "risk_factor",
            accessorKey: "risk_factor",
            header: ({ column }) => <TableHeader>Risk Factor</TableHeader>,
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
