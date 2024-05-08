import { type Option, None, Some } from "@/utils/option";
import {
    type BalanceItem,
    type ChainItem,
    calculatePrettyBalance,
    prettifyCurrency,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import { TokenAvatar } from "@/components/Atoms";
import { Button } from "@/components/ui/button";
import { timestampParser } from "@/utils/functions";
import { AccountCard } from "@/components/Molecules";
import {
    BalancePriceDelta,
    IconWrapper,
    TableHeaderSorting,
    TableList,
} from "@/components/Shared";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import {
    type CrossChainBalanceItem,
    type TokenBalancesListViewProps,
} from "@/utils/types/organisms.types";

export const TokenBalancesListView: React.FC<TokenBalancesListViewProps> = ({
    chain_names,
    address,
    mask_balances,
    hide_small_balances,
    on_transfer_click,
}) => {
    const { covalentClient, chains } = useGoldRush();
    const [maybeResult, setResult] =
        useState<Option<CrossChainBalanceItem[]>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [filterResult, setFilterResult] =
        useState<Option<CrossChainBalanceItem[]>>(None);
    const [windowWidth, setWindowWidth] = useState<number>(0);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            const results = await Promise.all(
                chain_names.map(async (chain) => {
                    try {
                        const { data, ...error } =
                            await covalentClient.BalanceService.getTokenBalancesForWalletAddress(
                                chain,
                                address.trim()
                            );
                        if (error.error) {
                            setErrorMessage(error.error_message);
                            throw error;
                        }
                        return data.items.map((o) => {
                            return { ...o, chain };
                        });
                    } catch (error) {
                        console.error(error);
                        return [];
                    }
                })
            );
            setResult(new Some(results.flat()));
        })();
    }, [chain_names, address]);

    useEffect(() => {
        maybeResult.match({
            None: () => [],
            Some: (result) => {
                if (hide_small_balances) {
                    setFilterResult(
                        new Some(
                            result.filter(
                                (o) =>
                                    o.quote !== null &&
                                    o.quote > 0 &&
                                    o.type !== "dust"
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
                <div className="ml-4">
                    <TableHeaderSorting
                        align="left"
                        header_name={"Token"}
                        column={column}
                    />
                </div>
            ),
            cell: ({ row }) => {
                const chain: ChainItem | null =
                    chains?.find((o) => o.name === row.original.chain) ?? null;
                const chainColor = chain?.color_theme.hex;
                const chain_label = (chain?.label ? chain.label : "").replace(
                    " Mainnet",
                    ""
                );
                const protocol_url = row.original.logo_urls.protocol_logo_url;

                return (
                    <div className="ml-4 flex items-center gap-3">
                        <TokenAvatar
                            size={GRK_SIZES.EXTRA_SMALL}
                            chain_color={chainColor}
                            sub_url={protocol_url}
                            token_url={row.original.logo_urls.token_logo_url}
                        />
                        <div className="flex flex-col">
                            <div style={{ color: chainColor }}>
                                {chain_label}
                            </div>
                            <label className="text-base">
                                {row.original.contract_display_name
                                    ? row.original.contract_display_name
                                    : ""}
                            </label>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "quote_rate",
            accessorKey: "quote_rate",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Quote Rate"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        {" "}
                        {prettifyCurrency(
                            row.getValue("quote_rate"),
                            2,
                            "USD",
                            true
                        )}{" "}
                    </div>
                );
            },
        },
        {
            id: "balance",
            accessorKey: "balance",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Balance"}
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
                <TableHeaderSorting
                    align="right"
                    header_name={"Quote"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        {" "}
                        {row.original.pretty_quote
                            ? row.original.pretty_quote
                            : "$0.00"}{" "}
                    </div>
                );
            },
        },
        {
            id: "delta",
            accessorKey: "quote_24h",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Delta"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                // * INFO: debugger
                // const delta =  row.original.quote / (row.original as any).quote_24h

                return (
                    <div className="text-right">
                        {" "}
                        <BalancePriceDelta
                            numerator={row.original.quote_24h}
                            denominator={row.original.quote}
                        />{" "}
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="ml-auto">
                                    <span className="sr-only">Open menu</span>
                                    <IconWrapper icon_class_name="expand_more" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => {
                                        if (on_transfer_click) {
                                            on_transfer_click({
                                                chain_name: row.original.chain,
                                                contract_address:
                                                    row.original
                                                        .contract_address,
                                            });
                                        }
                                    }}
                                >
                                    <IconWrapper
                                        icon_class_name="swap_horiz"
                                        class_name="mr-2"
                                    />{" "}
                                    View Transfer History
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>
                                    <div className="flex">
                                        <IconWrapper
                                            icon_class_name="history"
                                            class_name="mr-2"
                                        />
                                        {row.original.last_transferred_at
                                            ? `Last transferred ${timestampParser(
                                                  row.original.last_transferred_at.toDateString(),
                                                  "relative"
                                              )} `
                                            : "FIX ME"}
                                    </div>{" "}
                                </DropdownMenuLabel>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    const mobile_columns: ColumnDef<CrossChainBalanceItem>[] = [
        {
            id: "contract_name",
            accessorKey: "contract_name",
            // header: <div className="text-left">Token</div>,
            header: ({ column }) => (
                <div className="ml-4">
                    <TableHeaderSorting
                        align="left"
                        header_name={"Token"}
                        column={column}
                    />
                </div>
            ),
            cell: ({ row }) => {
                const original = row.original as BalanceItem;
                const valueFormatted = calculatePrettyBalance(
                    original.balance ?? 0,
                    row.original.contract_decimals,
                    true,
                    4
                );
                const formattedNumber = parseFloat(
                    valueFormatted.toString()
                ).toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                });

                const chain: ChainItem | null =
                    chains?.find((o) => o.name === row.original.chain) ?? null;
                const chainColor = chain?.color_theme.hex;
                const chain_label = (chain?.label ? chain.label : "").replace(
                    " Mainnet",
                    ""
                );
                const protocol_url = row.original.logo_urls.protocol_logo_url;

                return (
                    <div className="ml-4 flex items-center gap-3">
                        <TokenAvatar
                            size={GRK_SIZES.EXTRA_SMALL}
                            chain_color={chainColor}
                            sub_url={protocol_url}
                            token_url={row.original.logo_urls.token_logo_url}
                        />
                        <div className="flex flex-col gap-1">
                            <div style={{ color: chainColor }}>
                                {chain_label}
                            </div>
                            <label className="text-base">
                                {row.getValue("contract_display_name")}
                            </label>
                            <div className="text-secondary">
                                {!mask_balances ? formattedNumber : "*****"}{" "}
                                {row.original.contract_ticker_symbol}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "pretty_quote",
            accessorKey: "quote",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Quote"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col">
                        <div className="text-right text-base">
                            {row.original.pretty_quote
                                ? row.original.pretty_quote
                                : "$0.00"}
                        </div>
                        <div className="text-right ">
                            <BalancePriceDelta
                                numerator={row.original.quote_24h}
                                denominator={row.original.quote}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="ml-auto  ">
                                    <span className="sr-only">Open menu</span>
                                    <IconWrapper icon_class_name="expand_more" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => {
                                        if (on_transfer_click) {
                                            on_transfer_click({
                                                chain_name: row.original.chain,
                                                contract_address:
                                                    row.original
                                                        .contract_address,
                                            });
                                        }
                                    }}
                                >
                                    <IconWrapper
                                        icon_class_name="swap_horiz"
                                        class_name="mr-2"
                                    />{" "}
                                    View Transfer History
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem>
                                    <IconWrapper
                                        icon_class_name="swap_calls"
                                        class_name="mr-2"
                                    />{" "}
                                    Swap {row.original.contract_ticker_symbol}
                                </DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>
                                    <div className="flex">
                                        <IconWrapper
                                            icon_class_name="history"
                                            class_name="mr-2"
                                        />
                                        {row.original.last_transferred_at
                                            ? `Last transferred ${timestampParser(
                                                  row.original.last_transferred_at.toDateString(),
                                                  "relative"
                                              )} `
                                            : "FIX ME"}
                                    </div>{" "}
                                </DropdownMenuLabel>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap place-content-between gap-2">
                <AccountCard address={address} />
                <div className="w-full rounded border border-secondary-light p-2 dark:border-secondary-dark md:max-w-60 lg:max-w-60">
                    <h2 className="text-md text-secondary-light dark:text-secondary-dark">
                        Total Quote
                    </h2>
                    <div className="flex items-end gap-2">
                        <span className="text-base">
                            {filterResult.match({
                                None: () => (
                                    <Skeleton size={GRK_SIZES.MEDIUM} />
                                ),
                                Some: (result) => {
                                    let totalQuote: number = 0;
                                    result.forEach(
                                        ({ quote }) => (totalQuote += quote)
                                    );
                                    return (
                                        <span>
                                            {prettifyCurrency(
                                                totalQuote,
                                                2,
                                                "USD",
                                                true
                                            )}
                                        </span>
                                    );
                                },
                            })}
                        </span>
                        <span className="flex text-sm text-secondary-light dark:text-secondary-dark">
                            {filterResult.match({
                                None: () => (
                                    <Skeleton
                                        size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                    />
                                ),
                                Some: (result) => {
                                    return (
                                        <span>({result.length} Tokens)</span>
                                    );
                                },
                            })}
                        </span>
                    </div>
                </div>
            </div>

            <TableList<CrossChainBalanceItem>
                columns={windowWidth < 700 ? mobile_columns : columns}
                errorMessage={errorMessage}
                maybeData={maybeResult}
                sorting_state={[
                    {
                        id: "pretty_quote",
                        desc: true,
                    },
                ]}
            />
        </div>
    );
};
