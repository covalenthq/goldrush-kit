import { type Option, None, Some } from "@/utils/option";
import { type TokenV2Volume, prettifyCurrency } from "@covalenthq/client-sdk";
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
    BalancePriceDelta,
    IconWrapper,
    TableHeaderSorting,
    TableList,
} from "@/components/Shared";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type XYKTokenListViewProps } from "@/utils/types/organisms.types";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export const XYKTokenListView: React.FC<XYKTokenListViewProps> = ({
    chain_name,
    dex_name,
    on_token_click,
    page_size = 10,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setResult] = useState<Option<TokenV2Volume[]>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [pagination, setPagination] = useState({
        page_number: 1,
    });
    const [hasMore, setHasMore] = useState<boolean>();

    const handlePagination = (page_number: number) => {
        setPagination((prev) => {
            return {
                ...prev,
                page_number,
            };
        });
    };

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.XykService.getNetworkExchangeTokens(
                        chain_name,
                        dex_name,
                        {
                            pageNumber: pagination.page_number - 1,
                            pageSize: page_size,
                        }
                    );
                if (error.error) {
                    setErrorMessage(error.error_message);
                    throw error;
                }
                setHasMore(data.pagination.has_more);
                setResult(new Some(data.items));
            } catch (error) {
                console.error(error);
                return [];
            }
        })();
    }, [chain_name, dex_name, pagination]);

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

    const columns: ColumnDef<TokenV2Volume>[] = [
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
                return (
                    <div className="ml-4 flex items-center gap-3">
                        <TokenAvatar
                            size={GRK_SIZES.EXTRA_SMALL}
                            token_url={row.original.logo_url}
                        />
                        <div className="flex flex-col">
                            {on_token_click ? (
                                <a
                                    className="cursor-pointer hover:opacity-75"
                                    onClick={() => {
                                        if (on_token_click) {
                                            on_token_click(
                                                row.original.contract_address
                                            );
                                        }
                                    }}
                                >
                                    {row.original.contract_name
                                        ? row.original.contract_name
                                        : ""}
                                </a>
                            ) : (
                                <label className="text-base">
                                    {row.original.contract_name
                                        ? row.original.contract_name
                                        : ""}
                                </label>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            id: "contract_ticker_symbol",
            accessorKey: "contract_ticker_symbol",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Symbol"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        {row.original.contract_ticker_symbol}
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
                    row.original.total_volume_24h_quote
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
            id: "quote_rate_24h",
            accessorKey: "quote_rate_24h",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Price Change (24hrs)"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        <BalancePriceDelta
                            numerator={row.original.quote_rate_24h}
                            denominator={row.original.quote_rate}
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
                                <Button variant="ghost" className="ml-auto  ">
                                    <span className="sr-only">Open menu</span>
                                    <IconWrapper icon_class_name="expand_more" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => {
                                        if (on_token_click) {
                                            on_token_click(
                                                row.original.contract_address
                                            );
                                        }
                                    }}
                                >
                                    <IconWrapper
                                        icon_class_name="swap_horiz"
                                        class_name="mr-2"
                                    />{" "}
                                    View Token
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    const mobile_columns: ColumnDef<TokenV2Volume>[] = [
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
                return (
                    <div className="flex items-center gap-3">
                        <TokenAvatar
                            size={GRK_SIZES.EXTRA_SMALL}
                            token_url={row.original.logo_url}
                        />
                        <div className="flex flex-col">
                            {on_token_click ? (
                                <a
                                    className="cursor-pointer hover:opacity-75"
                                    onClick={() => {
                                        if (on_token_click) {
                                            on_token_click(
                                                row.original.contract_address
                                            );
                                        }
                                    }}
                                >
                                    {row.original.contract_name
                                        ? row.original.contract_name
                                        : ""}
                                </a>
                            ) : (
                                <label className="text-base">
                                    {row.original.contract_name
                                        ? row.original.contract_name
                                        : ""}
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
                    row.original.total_volume_24h_quote
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
                                        if (on_token_click) {
                                            on_token_click(
                                                row.original.contract_address
                                            );
                                        }
                                    }}
                                >
                                    <IconWrapper
                                        icon_class_name="swap_horiz"
                                        class_name="mr-2"
                                    />{" "}
                                    View Token
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
            <TableList<TokenV2Volume>
                columns={windowWidth < 700 ? mobile_columns : columns}
                errorMessage={errorMessage}
                maybeData={maybeResult}
                sorting_state={[
                    {
                        id: "total_volume_24h_quote",
                        desc: true,
                    },
                ]}
            />

            <Pagination className="select-none">
                <PaginationContent>
                    <PaginationItem
                        // ! ERROR: `disabled does not exist on prop
                        // disabled={pagination.page_number === 1}
                        onClick={() => {
                            handlePagination(pagination.page_number - 1);
                        }}
                    >
                        <PaginationPrevious />
                    </PaginationItem>
                    {pagination.page_number > 1 && (
                        <PaginationItem
                            onClick={() => {
                                handlePagination(pagination.page_number - 1);
                            }}
                        >
                            <PaginationLink>
                                {pagination.page_number - 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}
                    <PaginationItem>
                        <PaginationLink isActive>
                            {pagination.page_number}
                        </PaginationLink>
                    </PaginationItem>
                    {hasMore && (
                        <PaginationItem
                            onClick={() => {
                                handlePagination(pagination.page_number + 1);
                            }}
                        >
                            <PaginationLink>
                                {pagination.page_number + 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem
                        // ! ERROR: `disabled does not exist on prop
                        // disabled={!hasMore}
                        onClick={() => {
                            handlePagination(pagination.page_number + 1);
                        }}
                    >
                        <PaginationNext />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};
