import { type Option, None, Some } from "@/utils/option";
import {
    type PoolsDexDataItem,
    prettifyCurrency,
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
import { type XYKTokenPoolListViewProps } from "@/utils/types/organisms.types";

export const XYKTokenPoolListView: React.FC<XYKTokenPoolListViewProps> = ({
    chain_name,
    dex_name,
    on_pool_click,
    token_address,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setResult] = useState<Option<PoolsDexDataItem[]>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [windowWidth, setWindowWidth] = useState<number>(0);

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.XykService.getPoolsForTokenAddress(
                        chain_name,
                        token_address,
                        0,
                        {
                            dexName: dex_name,
                        }
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
    }, [chain_name, dex_name]);

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

    const columns: ColumnDef<PoolsDexDataItem>[] = [
        {
            id: "contract_name",
            accessorKey: "contract_name",
            header: ({ column }) => (
                <div className="ml-4">
                    <TableHeaderSorting
                        align="left"
                        header_name={"Pool"}
                        column={column}
                    />
                </div>
            ),
            cell: ({ row }) => {
                const token_0 = row.original.token_0;
                const token_1 = row.original.token_1;
                const pool = `${token_0.contract_ticker_symbol}-${token_1.contract_ticker_symbol}`;

                return (
                    <div className="ml-4 flex items-center gap-3">
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
                                                row.original.exchange
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
                <TableHeaderSorting
                    align="right"
                    header_name={"Liquidity"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrency(
                    row.original.total_liquidity_quote
                );

                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "volume_24h_quote",
            accessorKey: "volume_24h_quote",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Volume (24hrs)"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrency(
                    row.original.volume_24h_quote
                );

                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "volume_7d_quote",
            accessorKey: "volume_7d_quote",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Volume (7d)"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrency(
                    row.original.volume_7d_quote
                );

                return <div className="text-right">{valueFormatted}</div>;
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
            id: "fee_24h_quote",
            accessorKey: "fee_24h_quote",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Fees (24hrs)"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrency(
                    row.original.fee_24h_quote
                );

                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        // {
        //     id: "annualized_fee",
        //     accessorKey: "annualized_fee",
        //     header: ({ column }) => (
        //         <TableHeaderSorting
        //             align="right"
        //             header_name={"1y Fees / Liquidity"}
        //             column={column}
        //         />
        //     ),
        //     cell: ({ row }) => {
        //         const valueFormatted = calculateFeePercentage(
        //             row.original.annualized_fee
        //         );

        //         return (
        //             <div
        //                 className={`text-right ${
        //                     parseFloat(row.original.annualized_fee) > 0 &&
        //                     "text-green-600"
        //                 }`}
        //             >
        //                 {valueFormatted}
        //             </div>
        //         );
        //     },
        // },
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
                                                row.original.exchange
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

    const mobile_columns: ColumnDef<PoolsDexDataItem>[] = [
        {
            id: "contract_name",
            accessorKey: "contract_name",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Token"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const token_0 = row.original.token_0;
                const token_1 = row.original.token_1;
                const pool = `${token_0.contract_ticker_symbol}/${token_1.contract_ticker_symbol}`;

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
                                                row.original.exchange
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
                <TableHeaderSorting
                    align="right"
                    header_name={"Liquidity"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrency(
                    row.original.total_liquidity_quote
                );

                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "total_volume_24h_quote",
            accessorKey: "total_volume_24h_quote",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Volume (24hrs)"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrency(
                    row.original.volume_24h_quote
                );

                return <div className="text-right">{valueFormatted}</div>;
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
                                                row.original.exchange
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
            <TableList<PoolsDexDataItem>
                columns={windowWidth < 700 ? mobile_columns : columns}
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
