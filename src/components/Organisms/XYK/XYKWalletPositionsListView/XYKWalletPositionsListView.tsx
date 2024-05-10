import { type Option, None, Some } from "@/utils/option";
import {
    type UniswapLikeBalanceItem,
    prettifyCurrency,
    calculatePrettyBalance,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { TokenAvatar } from "@/components/Atoms";
import { Button } from "@/components/ui/button";
import {
    IconWrapper,
    TableHeaderSorting,
    TableList,
} from "@/components/Shared";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type XYKWalletPositionsListViewProps } from "@/utils/types/organisms.types";

export const XYKWalletPositionsListView: React.FC<
    XYKWalletPositionsListViewProps
> = ({ chain_name, dex_name, on_pool_click, wallet_address }) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setResult] =
        useState<Option<UniswapLikeBalanceItem[]>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.XykService.getAddressExchangeBalances(
                        chain_name,
                        dex_name,
                        wallet_address
                    );
                if (error.error) {
                    setErrorMessage(error.error_message);
                    throw error;
                }
                setResult(new Some(data.items));
            } catch (error) {
                console.error(error);
            }
        })();
    }, [chain_name, dex_name, wallet_address]);

    const columns: ColumnDef<UniswapLikeBalanceItem>[] = [
        {
            id: "contract_name",
            accessorKey: "contract_name",
            header: ({ column }) => (
                <TableHeaderSorting<UniswapLikeBalanceItem>
                    align="left"
                    header={"Pool"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const token_0 = row.original.token_0;
                const token_1 = row.original.token_1;
                const pool = `${token_0.contract_ticker_symbol}-${token_1.contract_ticker_symbol}`;

                return (
                    <div className="flex items-center gap-3">
                        <div className="relative mr-2 flex">
                            <TokenAvatar
                                size={GRK_SIZES.EXTRA_SMALL}
                                token_url={token_0.logo_url}
                            />
                            <div className="absolute left-4">
                                <TokenAvatar
                                    size={GRK_SIZES.EXTRA_SMALL}
                                    token_url={token_1.logo_url}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            {on_pool_click ? (
                                <a
                                    className="cursor-pointer hover:opacity-75"
                                    onClick={() => {
                                        if (on_pool_click) {
                                            on_pool_click(
                                                row.original.pool_token
                                                    .contract_address
                                            );
                                        }
                                    }}
                                >
                                    {pool ? pool : ""}
                                </a>
                            ) : (
                                <label className="text-base">
                                    {pool ? pool : ""}
                                </label>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            id: "total_liquidity_quote",
            accessorKey: "total_liquidity_quote",
            header: ({ column }) => (
                <TableHeaderSorting<UniswapLikeBalanceItem>
                    align="right"
                    header={"Liquidity"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    {prettifyCurrency(
                        row.original.token_0.quote + row.original.token_1.quote
                    )}
                </div>
            ),
        },
        {
            id: "token_0",
            accessorKey: "token_0",
            header: ({ column }) => (
                <TableHeaderSorting<UniswapLikeBalanceItem>
                    align="right"
                    header={"Token amount"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const token = row.original.token_0;
                const valueFormatted = token.balance
                    ? calculatePrettyBalance(
                          token.balance,
                          token.contract_decimals,
                          true,
                          4
                      )
                    : 0;

                return (
                    <div className="text-right">
                        {`${valueFormatted} ${token.contract_ticker_symbol}`}
                    </div>
                );
            },
        },
        {
            id: "token_1",
            accessorKey: "token_1",
            header: ({ column }) => (
                <TableHeaderSorting<UniswapLikeBalanceItem>
                    align="right"
                    header={"Token amount"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const token = row.original.token_1;
                const valueFormatted = token.balance
                    ? calculatePrettyBalance(
                          token.balance,
                          token.contract_decimals,
                          true,
                          4
                      )
                    : 0;

                return (
                    <div className="text-right">
                        {`${valueFormatted} ${token.contract_ticker_symbol}`}
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
                                        if (on_pool_click) {
                                            on_pool_click(
                                                row.original.pool_token
                                                    .contract_address
                                            );
                                        }
                                    }}
                                >
                                    <IconWrapper
                                        icon_class_name="swap_horiz"
                                        class_name="mr-2"
                                    />{" "}
                                    View Pool
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-4">
            <TableList<UniswapLikeBalanceItem>
                columns={columns}
                errorMessage={errorMessage}
                maybeData={maybeResult}
                sorting_state={[
                    {
                        id: "total_liquidity_quote",
                        desc: true,
                    },
                ]}
            />
        </div>
    );
};
