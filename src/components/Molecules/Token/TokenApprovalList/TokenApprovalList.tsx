import { Address, TokenAvatar } from "@/components/Atoms";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    GRK_SIZES,
    DEFAULT_ERROR_MESSAGE,
    FALLBACK_ERROR,
} from "@/utils/constants/shared.constants";
import { type Option, None, Some } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type TokenApprovalListProps } from "@/utils/types/molecules.types";
import {
    calculatePrettyBalance,
    type GoldRushResponse,
    type TokensApprovalItem,
} from "@covalenthq/client-sdk";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const TokenApprovalList: React.FC<TokenApprovalListProps> = ({
    chain_name,
    address,
    on_revoke_approval,
    actionable_spender,
    actionable_token,
}) => {
    const { goldrushClient } = useGoldRush();

    const [maybeResult, setMaybeResult] =
        useState<Option<TokensApprovalItem[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await goldrushClient.SecurityService.getApprovals(
                        chain_name,
                        address.trim(),
                    );
                if (error.error) {
                    throw error;
                }
                if (!data?.items) {
                    throw FALLBACK_ERROR;
                }
                setMaybeResult(new Some(data.items));
            } catch (error: GoldRushResponse<null> | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, address]);

    const columns: ColumnDef<TokensApprovalItem>[] = [
        {
            id: "token_details",
            accessorKey: "token_details",
            header: () => "Token",
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <TokenAvatar
                                primary_url={row.original.logo_url}
                                size={GRK_SIZES.EXTRA_SMALL}
                                only_primary
                            />
                            {row.original.ticker_symbol}
                        </div>

                        <p className="text-xs opacity-75">
                            <Address
                                address={row.original.token_address}
                                actionable_address={actionable_token}
                            />
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
                        {calculatePrettyBalance(
                            Number(row.original.balance),
                            Number(row.original.contract_decimals),
                        )}

                        <p className="text-xs opacity-75">
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
                    <p>
                        {row.original.pretty_value_at_risk_quote
                            ? row.original.pretty_value_at_risk_quote
                            : calculatePrettyBalance(
                                  Number(row.original.balance),
                                  Number(row.original.contract_decimals),
                              )}
                    </p>
                );
            },
        },
        {
            id: "risk_factor",
            accessorKey: "risk_factor",
            header: () => <p className="text-center">Risk Factor</p>,
            cell: ({ row }) => {
                return (
                    <div className="flex items-center justify-center">
                        <Badge
                            variant={
                                row.original.spenders?.[0].risk_factor ===
                                "LOW RISK"
                                    ? "success"
                                    : "danger"
                            }
                        >
                            {row.original.spenders?.[0].risk_factor ===
                            "LOW RISK"
                                ? "Low"
                                : "High"}
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: "spender_address_label",
            accessorKey: "spender_address_label",
            header: () => <p className="text-center">Spender(s)</p>,
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-4">
                        {row.original.spenders?.map((spender) => (
                            <div
                                key={spender.spender_address}
                                className="grid grid-cols-3 items-center gap-x-8 gap-y-4"
                            >
                                <div
                                    className={
                                        !on_revoke_approval
                                            ? "col-span-3"
                                            : "col-span-2"
                                    }
                                >
                                    <Address
                                        key={spender.spender_address}
                                        address={spender.spender_address}
                                        label={spender.spender_address_label}
                                        actionable_address={actionable_spender}
                                    />
                                </div>

                                {on_revoke_approval && (
                                    <Button
                                        onClick={() =>
                                            on_revoke_approval(
                                                spender,
                                                row.original.token_address,
                                            )
                                        }
                                        size={"sm"}
                                        className="flex w-fit"
                                    >
                                        Revoke
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
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
