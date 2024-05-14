import { type Option, None, Some } from "@/utils/option";
import { type ExchangeTransaction } from "@covalenthq/client-sdk";
import {
    POOL_TRANSACTION_MAP,
    defaultErrorMessage,
} from "@/utils/constants/shared.constants";
import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { type XYKWalletTransactionsListProps } from "@/utils/types/molecules.types";
import { useGoldRush } from "@/utils/store";
import { handleTokenTransactions } from "@/utils/functions/pretty-exchange-amount";
import { handleExchangeType } from "@/utils/functions/exchange-type";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { Timestamp } from "@/components/Atoms/Timestamp/Timestamp";

export const XYKWalletTransactionsList: React.FC<
    XYKWalletTransactionsListProps
> = ({ chain_name, dex_name, wallet_address }) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<ExchangeTransaction[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setMaybeResult(None);
                setErrorMessage(null);
                const { data, ...error } =
                    await covalentClient.XykService.getTransactionsForAccountAddress(
                        chain_name,
                        dex_name,
                        wallet_address.trim()
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
    }, [wallet_address, dex_name, chain_name]);

    const columns: ColumnDef<ExchangeTransaction>[] = [
        {
            id: "block_signed_at",
            accessorKey: "block_signed_at",
            header: ({ column }) => (
                <TableHeaderSorting<ExchangeTransaction>
                    align="left"
                    header={"Time"}
                    column={column}
                />
            ),
            cell: ({ row }) =>
                <Timestamp
                    timestamp={row.getValue("block_signed_at")}
                    defaultType="relative"
                />,
        },
        {
            id: "act",
            accessorKey: "act",
            header: ({ column }) => (
                <TableHeaderSorting<ExchangeTransaction>
                    align="left"
                    header={"Transaction type"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const token_0 = row.original.token_0;
                const token_1 = row.original.token_1;

                if (row.original.act !== "SWAP") {
                    return (
                        <div>
                            <Badge
                                className="mr-2"
                                variant={
                                    POOL_TRANSACTION_MAP[row.original.act].color
                                }
                            >
                                {POOL_TRANSACTION_MAP[row.original.act].name}
                            </Badge>{" "}
                            {token_0.contract_ticker_symbol}{" "}
                            {row.original.act === "SWAP" ? "for" : "and"}{" "}
                            {token_1.contract_ticker_symbol}
                        </div>
                    );
                }
                const token_in =
                    handleExchangeType(row.original, 0) === "in"
                        ? token_0
                        : token_1;
                const token_out =
                    handleExchangeType(row.original, 0) === "out"
                        ? token_0
                        : token_1;
                return (
                    <div>
                        <Badge
                            className="mr-2"
                            variant={
                                POOL_TRANSACTION_MAP[row.original.act].color
                            }
                        >
                            {POOL_TRANSACTION_MAP[row.original.act].name}
                        </Badge>{" "}
                        {token_in.contract_ticker_symbol}{" "}
                        {row.original.act === "SWAP" ? "for" : "and"}{" "}
                        {token_out.contract_ticker_symbol}
                    </div>
                );
            },
        },
        {
            id: "total_quote",
            accessorKey: "total_quote",
            header: ({ column }) => (
                <TableHeaderSorting<ExchangeTransaction>
                    align="left"
                    header={"Total value"}
                    column={column}
                />
            ),
            cell: ({ row }) => row.original.pretty_total_quote,
        },
        {
            id: "amount_0",
            accessorKey: "amount_0",
            header: ({ column }) => (
                <TableHeaderSorting<ExchangeTransaction>
                    align="left"
                    header={"Token Amount"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                if (row.original.act !== "SWAP") {
                    return (
                        <span>
                            {handleTokenTransactions(
                                row.original.act,
                                "0",
                                row.original,
                                row.original.token_0.contract_decimals
                            )}{" "}
                            {row.original.token_0.contract_ticker_symbol}
                        </span>
                    );
                }
                const token_in =
                    handleExchangeType(row.original, 0) === "in" ? "0" : "1";
                return (
                    <span>
                        {handleTokenTransactions(
                            row.original.act,
                            token_in,
                            row.original,
                            row.original[`token_${token_in}`].contract_decimals
                        )}{" "}
                        {
                            row.original[`token_${token_in}`]
                                .contract_ticker_symbol
                        }
                    </span>
                );
            },
        },
        {
            id: "amount_1",
            accessorKey: "amount_1",
            header: ({ column }) => (
                <TableHeaderSorting<ExchangeTransaction>
                    align="left"
                    header={"Token Amount"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                if (row.original.act !== "SWAP") {
                    return (
                        <span>
                            {handleTokenTransactions(
                                row.original.act,
                                "1",
                                row.original,
                                row.original.token_1.contract_decimals
                            )}{" "}
                            {row.original.token_1.contract_ticker_symbol}
                        </span>
                    );
                }
                const token_in =
                    handleExchangeType(row.original, 0) === "out" ? "0" : "1";
                const token_amount = handleTokenTransactions(
                    row.original.act,
                    token_in,
                    row.original,
                    row.original[`token_${token_in}`].contract_decimals
                );
                return (
                    <span>
                        {token_amount}{" "}
                        {
                            row.original[`token_${token_in}`]
                                .contract_ticker_symbol
                        }
                    </span>
                );
            },
        },
    ];

    return (
        <TableList<ExchangeTransaction>
            columns={columns}
            errorMessage={errorMessage}
            maybeData={maybeResult}
            sorting_state={[
                {
                    id: "block_signed_at",
                    desc: true,
                },
            ]}
        />
    );
};
