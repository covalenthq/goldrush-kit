import { type Option, None, Some } from "@/utils/option";
import {
    type TokenV2Volume,
    prettifyCurrency,
    type Pagination,
} from "@covalenthq/client-sdk";
import { useCallback, useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { TokenAvatar } from "@/components/Atoms";
import {
    BalancePriceDelta,
    TableHeaderSorting,
    TableList,
} from "@/components/Shared";
import {
    GRK_SIZES,
    DEFAULT_ERROR_MESSAGE,
} from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type XYKTokenListProps } from "@/utils/types/molecules.types";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { actionableWrapper } from "@/utils/functions";

export const XYKTokenList: React.FC<XYKTokenListProps> = ({
    chain_name,
    dex_name,
    page_size = 10,
    actionable_address = () => null,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<TokenV2Volume[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    useEffect(() => {
        updateResult(null);
    }, [chain_name, dex_name, page_size]);

    const updateResult = useCallback(
        async (_pagination: Pagination | null) => {
            try {
                setMaybeResult(None);
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
                    throw error;
                }
                setPagination(data.pagination);
                setMaybeResult(new Some(data.items));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        },
        [chain_name, dex_name]
    );

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
                        primary_url={row.original.logo_url}
                    />

                    {actionableWrapper(
                        actionable_address(row.original.contract_address),
                        row.original.contract_name
                    )}
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
