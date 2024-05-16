import { type Option, None, Some } from "@/utils/option";
import type { NftApprovalsItem } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { type NFTApprovalListProps } from "@/utils/types/molecules.types";
import { useGoldRush } from "@/utils/store";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { defaultErrorMessage } from "@/utils/constants/shared.constants";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import { ColumnDef } from "@tanstack/react-table";
import { Address } from "@/components/Atoms";

export const NFTApprovalList: React.FC<NFTApprovalListProps> = ({
    chain_name,
    address,
    ...props
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
                <TableHeaderSorting<NftApprovalsItem>
                    align="left"
                    header={"Token"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            {row.original.contract_ticker_symbol || (
                                <Address
                                    address={row.original.contract_address}
                                />
                            )}
                        </div>
                        <p className="text-xs opacity-80">
                            <Address address={row.original.contract_address} />
                        </p>
                    </div>
                );
            },
        },
        {
            id: "token_balance",
            accessorKey: "token_balance",
            header: ({ column }) => (
                <TableHeaderSorting<NftApprovalsItem>
                    align="left"
                    header={"Wallet Balance"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col">
                        <p>{row.original.token_balances.length}</p>
                        <p className="text-xs opacity-80">
                            ID:{" "}
                            {row.original.token_balances.map((balance) => (
                                <span key={balance.token_id}>
                                    {balance.token_id?.toString()}
                                </span>
                            )) || "N/A"}
                        </p>
                    </div>
                );
            },
        },
        {
            id: "spender_address_label",
            accessorKey: "spender_address_label",
            header: ({ column }) => (
                <TableHeaderSorting<NftApprovalsItem>
                    align="left"
                    header={"Spender"}
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
                <TableHeaderSorting<NftApprovalsItem>
                    align="left"
                    header={"Risk Factor"}
                    column={column}
                />
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
