import { type Option, None, Some } from "@/utils/option";
import type { NftApprovalsItem } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { type NFTApprovalListProps } from "@/utils/types/molecules.types";
import { useGoldRush } from "@/utils/store";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { DEFAULT_ERROR_MESSAGE } from "@/utils/constants/shared.constants";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import type { ColumnDef } from "@tanstack/react-table";
import { Address } from "@/components/Atoms";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const NFTApprovalList: React.FC<NFTApprovalListProps> = ({
    chain_name,
    address,
    on_revoke_approval,
    actionable_spender,
    actionable_token,
}) => {
    const { covalentClient } = useGoldRush();

    const [maybeResult, setMaybeResult] =
        useState<Option<NftApprovalsItem[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.SecurityService.getNftApprovals(
                        chain_name,
                        address.trim()
                    );
                if (error.error) {
                    throw error;
                }
                setMaybeResult(new Some(data.items));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, address]);

    const columns: ColumnDef<NftApprovalsItem>[] = [
        {
            id: "token_details",
            accessorKey: "token_details",
            header: () => "Token",
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col">
                        <p className="flex items-center gap-1">
                            {row.original.contract_ticker_symbol}
                        </p>
                        <p className="text-xs opacity-75">
                            <Address
                                address={row.original.contract_address}
                                actionable_address={actionable_token}
                            />
                        </p>
                    </div>
                );
            },
        },
        {
            id: "token_balance",
            accessorKey: "token_balances",
            header: ({ column }) => (
                <TableHeaderSorting<NftApprovalsItem>
                    align="left"
                    header={"Wallet Balance"}
                    column={column}
                />
            ),
            cell: ({ row }) => row.original.token_balances.length,
        },
        {
            id: "token_id",
            accessorKey: "token_id",
            header: () => "Token ID",
            cell: ({ row }) => {
                const token_ids = row.original.token_balances.map(
                    (balance) => balance.token_id
                );
                return (
                    <p className="max-w-40 break-all">{token_ids.join(", ")}</p>
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
                                row.original.spenders[0].allowance ===
                                "CONSIDER REVOKING"
                                    ? "danger"
                                    : "success"
                            }
                        >
                            {row.original.spenders[0].allowance ===
                            "CONSIDER REVOKING"
                                ? "High"
                                : "Low"}
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
                        {row.original.spenders.map((spender) => (
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
                                                row.original.contract_address
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
        <TableList<NftApprovalsItem>
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
