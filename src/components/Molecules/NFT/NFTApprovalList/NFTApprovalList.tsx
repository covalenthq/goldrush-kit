import { type Option, None, Some } from "@/utils/option";
import type { NftApprovalsItem } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { type NFTApprovalListProps } from "@/utils/types/molecules.types";
import { useGoldRush } from "@/utils/store";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { defaultErrorMessage } from "@/utils/constants/shared.constants";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import type { ColumnDef } from "@tanstack/react-table";
import { Address } from "@/components/Atoms";
import { Button } from "@/components/ui/button";
import { TableHeader } from "@/components/ui/table";

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
                setErrorMessage(error?.error_message ?? defaultErrorMessage);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, address]);

    const columns: ColumnDef<NftApprovalsItem>[] = [
        {
            id: "token_details",
            accessorKey: "token_details",
            header: ({ column }) => (
                <TableHeader>Token</TableHeader>
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col">
                        <p className="flex items-center gap-1">
                            {row.original.contract_ticker_symbol}
                        </p>
                        <p className="text-xs opacity-80">
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
            header: ({ column }) => (
                <TableHeader>Token ID</TableHeader>
            ),
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
            id: "spender_address_label",
            accessorKey: "spender_address_label",
            header: ({ column }) => (
                <TableHeader>Spender Address Label</TableHeader>
            ),
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
            header: ({ column }) => (
                <TableHeader>Risk Factor</TableHeader>
            ),
            cell: ({ row }) => {
                return (
                    <span
                        className={`${
                            row.original.spenders[0].allowance === "Unlimited"
                                ? "bg-red-500"
                                : "bg-green-500"
                        } rounded px-2 py-1 text-white`}
                    >
                        {row.original.spenders[0].allowance === "Unlimited"
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
