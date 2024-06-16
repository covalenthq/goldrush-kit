import { type Option, None, Some } from "@/utils/option";
import {
    type PoolsDexDataItem,
    prettifyCurrency,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Pool } from "@/components/Atoms";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import { DEFAULT_ERROR_MESSAGE } from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type XYKTokenPoolListProps } from "@/utils/types/molecules.types";
import { type CovalentAPIError } from "@/utils/types/shared.types";

export const XYKTokenPoolList: React.FC<XYKTokenPoolListProps> = ({
    chain_name,
    dex_name,
    token_address,
    actionable_pool,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<PoolsDexDataItem[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setMaybeResult(None);
                setErrorMessage(null);
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
                    throw error;
                }
                setMaybeResult(new Some(data.items));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, dex_name]);

    const columns: ColumnDef<PoolsDexDataItem>[] = [
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
                <TableHeaderSorting<PoolsDexDataItem>
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
                <TableHeaderSorting<PoolsDexDataItem>
                    align="right"
                    header={"Volume (24hrs)"}
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
                <TableHeaderSorting<PoolsDexDataItem>
                    align="right"
                    header={"Volume (7d)"}
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
                <TableHeaderSorting<PoolsDexDataItem>
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
                <TableHeaderSorting<PoolsDexDataItem>
                    align="right"
                    header={"Fees (24hrs)"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    {prettifyCurrency(row.original.fee_24h_quote)}
                </div>
            ),
        },
    ];

    return (
        <TableList<PoolsDexDataItem>
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
    );
};
