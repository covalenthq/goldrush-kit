import { type Option, None, Some } from "@/utils/option";
import {
    type Pool as PoolType,
    prettifyCurrency,
    type Pagination,
} from "@covalenthq/client-sdk";
import { useCallback, useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Pool } from "@/components/Atoms";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import { DEFAULT_ERROR_MESSAGE } from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type XYKPoolListProps } from "@/utils/types/molecules.types";
import { calculateFeePercentage } from "@/utils/functions/calculate-fees-percentage";
import { type CovalentAPIError } from "@/utils/types/shared.types";

export const XYKPoolList: React.FC<XYKPoolListProps> = ({
    chain_name,
    dex_name,
    page_size = 10,
    actionable_pool,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<PoolType[] | null>>(None);
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
                    await covalentClient.XykService.getPools(
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

    const columns: ColumnDef<PoolType>[] = [
        {
            id: "contract_name",
            accessorKey: "contract_name",
            header: "Pool",
            cell: ({ row }) => (
                <Pool
                    pool_address={row.original.exchange}
                    token_0_logo_url={row.original.token_0?.logo_url}
                    token_0_ticker_symbol={
                        row.original.token_0?.contract_ticker_symbol
                    }
                    token_1_logo_url={row.original.token_1?.logo_url}
                    token_1_ticker_symbol={
                        row.original.token_1?.contract_ticker_symbol
                    }
                    actionable_pool={actionable_pool}
                />
            ),
        },
        {
            id: "total_liquidity_quote",
            accessorKey: "total_liquidity_quote",
            header: ({ column }) => (
                <TableHeaderSorting<PoolType>
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
            id: "volume_24h_quote",
            accessorKey: "volume_24h_quote",
            header: ({ column }) => (
                <TableHeaderSorting<PoolType>
                    align="right"
                    header={"Volume (24 hours)"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    {prettifyCurrency(row.original.volume_24h_quote)}
                </div>
            ),
        },
        {
            id: "volume_7d_quote",
            accessorKey: "volume_7d_quote",
            header: ({ column }) => (
                <TableHeaderSorting<PoolType>
                    align="right"
                    header={"Volume (7 days)"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    {prettifyCurrency(row.original.volume_7d_quote)}
                </div>
            ),
        },
        {
            id: "quote_rate",
            accessorKey: "quote_rate",
            header: ({ column }) => (
                <TableHeaderSorting<PoolType>
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
            id: "fee_24h_quote",
            accessorKey: "fee_24h_quote",
            header: ({ column }) => (
                <TableHeaderSorting<PoolType>
                    align="right"
                    header={"Fees (24 hours)"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    {prettifyCurrency(row.original.fee_24h_quote)}
                </div>
            ),
        },
        {
            id: "annualized_fee",
            accessorKey: "annualized_fee",
            header: ({ column }) => (
                <TableHeaderSorting<PoolType>
                    align="right"
                    header={"1 year Fees / Liquidity"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div
                    className={`text-right ${
                        parseFloat(row.original.annualized_fee.toString()) >
                            0 && "text-green-600"
                    }`}
                >
                    {calculateFeePercentage(+row.original.annualized_fee)}
                </div>
            ),
        },
    ];

    return (
        <TableList<PoolType>
            columns={columns}
            errorMessage={errorMessage}
            maybeData={maybeResult}
            sorting_state={[
                {
                    id: "total_liquidity_quote",
                    desc: true,
                },
            ]}
            pagination={pagination}
            onChangePaginationHandler={handleOnChangePagination}
        />
    );
};
