import { type Option, None, Some } from "@/utils/option";
import {
    type BalanceItem,
    type ChainItem,
    calculatePrettyBalance,
    prettifyCurrency,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { TokenAvatar } from "@/components/Atoms";
import {
    BalancePriceDelta,
    TableHeaderSorting,
    TableList,
} from "@/components/Shared";
import {
    GRK_SIZES,
    defaultErrorMessage,
} from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import {
    type CrossChainBalanceItem,
    type TokenBalancesListProps,
} from "@/utils/types/molecules.types";
import { actionableWrapper } from "@/utils/functions";

export const TokenBalancesList: React.FC<TokenBalancesListProps> = ({
    chain_names,
    address,
    mask_balances,
    hide_small_balances,
    actionable_token = () => null,
}) => {
    const { covalentClient, chains } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<CrossChainBalanceItem[] | null>>(None);
    const [filterResult, setFilterResult] =
        useState<Option<CrossChainBalanceItem[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            const results = await Promise.all(
                chain_names.map(async (chain_name) => {
                    try {
                        const { data, ...error } =
                            await covalentClient.BalanceService.getTokenBalancesForWalletAddress(
                                chain_name,
                                address.trim()
                            );
                        if (error.error) {
                            throw error;
                        }
                        return data.items.map((balance) => ({
                            ...balance,
                            chain_name: chain_name,
                        }));
                    } catch (error: CovalentAPIError | any) {
                        setErrorMessage(
                            error?.error_message ?? defaultErrorMessage
                        );
                        setMaybeResult(new Some(null));
                        console.error(error);
                        return [];
                    }
                })
            );
            setMaybeResult(new Some(results.flat()));
        })();
    }, [chain_names, address]);

    useEffect(() => {
        maybeResult.match({
            None: () => [],
            Some: (result) => {
                if (hide_small_balances && result) {
                    setFilterResult(
                        new Some(
                            result.filter(
                                ({ quote, type }) =>
                                    quote !== null &&
                                    quote > 0 &&
                                    type !== "dust"
                            )
                        )
                    );
                    return result;
                }
                setFilterResult(new Some(result));
            },
        });
    }, [maybeResult, hide_small_balances]);

    const columns: ColumnDef<CrossChainBalanceItem>[] = [
        {
            id: "contract_name",
            accessorKey: "contract_name",
            header: ({ column }) => (
                <TableHeaderSorting<CrossChainBalanceItem>
                    align="left"
                    header={"Token"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const chain: ChainItem | null =
                    chains?.find((o) => o.name === row.original.chain_name) ??
                    null;
                const chainColor = chain?.color_theme.hex;

                return (
                    <div className="flex items-center gap-3">
                        <TokenAvatar
                            size={GRK_SIZES.EXTRA_SMALL}
                            chain_color={chainColor}
                            secondary_url={
                                row.original.logo_urls.chain_logo_url
                            }
                            primary_url={row.original.logo_urls.token_logo_url}
                        />
                        <div className="flex flex-col">
                            <p style={{ color: chainColor }}>
                                {chain?.label.replace(" Mainnet", "")}
                            </p>
                            {actionableWrapper(
                                actionable_token(row.original),
                                <p className="w-fit text-base">
                                    {row.original.contract_display_name}
                                </p>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            id: "quote_rate",
            accessorKey: "quote_rate",
            header: ({ column }) => (
                <TableHeaderSorting<CrossChainBalanceItem>
                    align="right"
                    header={"Quote Rate"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    {prettifyCurrency(
                        row.getValue("quote_rate"),
                        2,
                        "USD",
                        true
                    )}
                </div>
            ),
        },
        {
            id: "balance",
            accessorKey: "balance",
            header: ({ column }) => (
                <TableHeaderSorting<CrossChainBalanceItem>
                    align="right"
                    header={"Balance"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const original = row.original as BalanceItem;
                const valueFormatted = calculatePrettyBalance(
                    original.balance ?? 0,
                    row.original.contract_decimals,
                    true,
                    4
                );
                return (
                    <div className="text-right">
                        {!mask_balances ? valueFormatted : "*****"}{" "}
                        {row.original.contract_ticker_symbol}
                    </div>
                );
            },
        },
        {
            id: "pretty_quote",
            accessorKey: "quote",
            header: ({ column }) => (
                <TableHeaderSorting<CrossChainBalanceItem>
                    align="right"
                    header={"Quote"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    {row.original.pretty_quote
                        ? row.original.pretty_quote
                        : "$0.00"}
                </div>
            ),
        },
        {
            id: "delta",
            accessorKey: "quote_24h",
            header: ({ column }) => (
                <TableHeaderSorting<CrossChainBalanceItem>
                    align="right"
                    header={"Delta"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    <BalancePriceDelta
                        numerator={row.original.quote_24h}
                        denominator={row.original.quote}
                    />
                </div>
            ),
        },
    ];

    return (
        <TableList<CrossChainBalanceItem>
            columns={columns}
            errorMessage={errorMessage}
            maybeData={filterResult}
            sorting_state={[
                {
                    id: "pretty_quote",
                    desc: true,
                },
            ]}
        />
    );
};
