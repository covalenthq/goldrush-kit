import { type Option, None, Some } from "@/utils/option";
import {
    type TokenV2Volume,
    prettifyCurrency,
    type Pagination,
} from "@covalenthq/client-sdk";
import { useCallback, useEffect, useState } from "react";
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

export const XYKTokenListView: React.FC<XYKTokenListViewProps> = ({
    chain_name,
    dex_name,
    on_token_click,
    page_size = 10,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setResult] = useState<Option<TokenV2Volume[]>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    useEffect(() => {
        updateResult(null);
    }, [chain_name, dex_name, page_size]);

    const updateResult = useCallback(async (_pagination: Pagination | null) => {
        try {
            setResult(None);
            setErrorMessage(null);
            const { data, ...error } =
                await covalentClient.XykService.getNetworkExchangeTokens(
                    chain_name,
                    dex_name,
                    {
                        pageNumber: _pagination?.page_number ?? 0,
                        pageSize: _pagination?.page_size ?? page_size,
                    }
                );
            if (error.error) {
                setErrorMessage(error.error_message);
                throw error;
            }
            setPagination(data.pagination);
            setResult(new Some(data.items));
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleOnChangePagination = (updatedPagination: Pagination) => {
        setPagination(updatedPagination);
        updateResult(updatedPagination);
    };

    const columns: ColumnDef<TokenV2Volume>[] = [
        {
            id: "contract_name",
            accessorKey: "contract_name",
            header: ({ column }) => (
                <TableHeaderSorting<TokenV2Volume>
                    align="left"
                    header={"Token"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
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
            ),
        },
        {
            id: "contract_ticker_symbol",
            accessorKey: "contract_ticker_symbol",
            header: ({ column }) => (
                <TableHeaderSorting<TokenV2Volume>
                    align="right"
                    header={"Symbol"}
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
                <TableHeaderSorting<TokenV2Volume>
                    align="right"
                    header={"Liquidity"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    {prettifyCurrency(row.original.total_liquidity_quote)}
                </div>
            ),
        },
        {
            id: "total_volume_24h_quote",
            accessorKey: "total_volume_24h_quote",
            header: ({ column }) => (
                <TableHeaderSorting<TokenV2Volume>
                    align="right"
                    header={"Volume (24hrs)"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    {prettifyCurrency(row.original.total_volume_24h_quote)}
                </div>
            ),
        },
        {
            id: "quote_rate",
            accessorKey: "quote_rate",
            header: ({ column }) => (
                <TableHeaderSorting<TokenV2Volume>
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
                    )}{" "}
                </div>
            ),
        },
        {
            id: "quote_rate_24h",
            accessorKey: "quote_rate_24h",
            header: ({ column }) => (
                <TableHeaderSorting<TokenV2Volume>
                    align="right"
                    header={"Price Change (24hrs)"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    <BalancePriceDelta
                        numerator={row.original.quote_rate_24h}
                        denominator={row.original.quote_rate}
                    />
                </div>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
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
            ),
        },
    ];

    return (
        <TableList<TokenV2Volume>
            columns={columns}
            errorMessage={errorMessage}
            maybeData={maybeResult}
            sorting_state={[
                {
                    id: "total_volume_24h_quote",
                    desc: true,
                },
            ]}
            pagination={pagination}
            onChangePaginationHandler={handleOnChangePagination}
        />
    );
};
