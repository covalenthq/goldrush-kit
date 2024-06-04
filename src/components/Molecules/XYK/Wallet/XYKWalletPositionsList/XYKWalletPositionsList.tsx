import { type Option, None, Some } from "@/utils/option";
import {
    type UniswapLikeBalanceItem,
    prettifyCurrency,
    calculatePrettyBalance,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Pool } from "@/components/Atoms";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import { defaultErrorMessage } from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type XYKWalletPositionsListProps } from "@/utils/types/molecules.types";
import { type CovalentAPIError } from "@/utils/types/shared.types";

export const XYKWalletPositionsList: React.FC<XYKWalletPositionsListProps> = ({
    chain_name,
    dex_name,
    wallet_address,
    actionable_pool,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<UniswapLikeBalanceItem[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setMaybeResult(None);
                setErrorMessage(null);
                const { data, ...error } =
                    await covalentClient.XykService.getAddressExchangeBalances(
                        chain_name,
                        dex_name,
                        wallet_address
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
    }, [chain_name, dex_name, wallet_address]);

    const columns: ColumnDef<UniswapLikeBalanceItem>[] = [
        {
            id: "contract_name",
            accessorKey: "contract_name",
            header: "Pool",
            cell: ({ row }) => (
                <Pool
                    pool_address={row.original.pool_token.contract_address}
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
                <TableHeaderSorting<UniswapLikeBalanceItem>
                    align="right"
                    header={"Liquidity"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    {prettifyCurrency(
                        row.original.token_0?.quote +
                            row.original.token_1?.quote
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
    ];

    return (
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
    );
};
