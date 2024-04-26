import { Address } from "@/components/Atoms";
import { Card, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { timestampParser } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type TransactionDetailsProps } from "@/utils/types/molecules.types";
import {
    calculatePrettyBalance,
    type Transaction,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
    chain_name,
    tx_hash,
}) => {
    const { covalentClient } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [maybeResult, setResult] = useState<Option<Transaction>>(None);

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.TransactionService.getTransaction(
                        chain_name,
                        tx_hash,
                        {
                            noLogs: true,
                            quoteCurrency: "USD",
                            withDex: false,
                            withLending: false,
                            withNftSales: false,
                            withSafe: false,
                        }
                    );
                if (error.error) {
                    setErrorMessage(error.error_message);
                    throw error;
                }
                setResult(new Some(data.items[0]));
            } catch (error) {
                console.error(error);
            }
        })();
    }, [chain_name, tx_hash]);

    return (
        <Card className="flex w-full flex-col items-start gap-x-4 rounded border border-secondary-light p-2 dark:border-secondary-dark dark:bg-background-dark dark:text-white">
            {maybeResult.match({
                None: () => <Skeleton size={GRK_SIZES.LARGE} />,
                Some: (tx) =>
                    errorMessage ? (
                        <p className="mt-4">{errorMessage}</p>
                    ) : (
                        <div className="grid w-full grid-cols-3 gap-16 gap-y-4">
                            <div>
                                <CardDescription>TX HASH</CardDescription>

                                <div>
                                    <Address address={tx.tx_hash} />
                                </div>
                            </div>

                            <div>
                                <CardDescription>BLOCK</CardDescription>

                                <p>{tx.block_height.toLocaleString()}</p>
                            </div>

                            <div>
                                <CardDescription>SIGNED AT</CardDescription>

                                <div className="flex items-center gap-x-2">
                                    <div className="flex items-center gap-x-2">
                                        {timestampParser(
                                            tx.block_signed_at,
                                            "descriptive"
                                        )}{" "}
                                        <CardDescription>
                                            (
                                            {timestampParser(
                                                tx.block_signed_at,
                                                "relative"
                                            )}
                                            )
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <CardDescription>BLOCK HASH</CardDescription>

                                <div className="flex items-end gap-x-2">
                                    <Address address={tx.block_hash} />
                                </div>
                            </div>

                            <div>
                                <CardDescription>FROM</CardDescription>

                                <div>
                                    <Address address={tx.from_address} />
                                </div>
                            </div>

                            <div>
                                <CardDescription>TO</CardDescription>

                                <div>
                                    <Address address={tx.to_address} />
                                </div>
                            </div>

                            <div>
                                <CardDescription>VALUE</CardDescription>

                                <div className="flex items-center gap-x-2">
                                    {Number(tx.value) /
                                        Math.pow(
                                            10,
                                            tx.gas_metadata.contract_decimals
                                        )}{" "}
                                    {tx.gas_metadata.contract_ticker_symbol}{" "}
                                    <CardDescription>
                                        {tx.pretty_value_quote}
                                    </CardDescription>
                                </div>
                            </div>

                            <div>
                                <CardDescription>TX FEE</CardDescription>

                                <div className="flex items-center gap-x-2">
                                    {calculatePrettyBalance(
                                        BigInt(tx.fees_paid || 0)!,
                                        tx.gas_metadata.contract_decimals,
                                        true,
                                        4
                                    )}{" "}
                                    {tx.gas_metadata.contract_ticker_symbol}{" "}
                                    <CardDescription>
                                        {tx.pretty_gas_quote}
                                    </CardDescription>
                                </div>
                            </div>

                            <div>
                                <CardDescription>GAS PRICE</CardDescription>

                                <p className="flex items-center gap-x-2">
                                    {calculatePrettyBalance(
                                        BigInt(tx.gas_price),
                                        tx.gas_metadata.contract_decimals,
                                        true,
                                        10
                                    )}{" "}
                                    {tx.gas_metadata.contract_ticker_symbol}
                                </p>
                            </div>
                        </div>
                    ),
            })}
        </Card>
    );
};
