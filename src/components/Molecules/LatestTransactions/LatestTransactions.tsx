import { Address } from "@/components/Atoms";
import { CardDetail } from "@/components/Shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { timestampParser } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type LatestTransactionsProps } from "@/utils/types/molecules.types";
import { type CardDetailProps } from "@/utils/types/shared.types";
import { type Transaction } from "@covalenthq/client-sdk";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export const LatestTransactions: React.FC<LatestTransactionsProps> = ({
    chain_name,
    limit = 5,
    on_view_details,
}) => {
    const { covalentClient } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [maybeResult, setResult] = useState<Option<Transaction[]>>(None);

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            try {
                const { data: blockData, ...blockError } =
                    await covalentClient.BaseService.getBlockHeightsByPage(
                        chain_name,
                        timestampParser(Date(), "YYYY MM DD"),
                        "2100-01-01",
                        {
                            pageSize: 1,
                        }
                    );
                if (blockError.error) {
                    setErrorMessage(blockError.error_message);
                    throw blockError;
                }
                const latestBlock = blockData.items[0];
                const { data: txData, ...txError } =
                    await covalentClient.TransactionService.getTransactionsForBlock(
                        chain_name,
                        latestBlock.height - 2,
                        {
                            noLogs: true,
                            quoteCurrency: "USD",
                            withSafe: false,
                        }
                    );
                if (txError.error) {
                    setErrorMessage(txError.error_message);
                    throw txError;
                }
                setResult(new Some(txData.items.slice(-limit)));
            } catch (error) {
                console.error(error);
            }
        })();
    }, [chain_name, limit]);

    return maybeResult.match({
        None: () => (
            <>
                {new Array(limit).fill(null).map(() => (
                    <Skeleton key={Math.random()} size={GRK_SIZES.LARGE} />
                ))}
            </>
        ),
        Some: (txs) =>
            errorMessage ? (
                <p className="col-span-5">{errorMessage}</p>
            ) : (
                txs.map((tx) => (
                    <Card
                        key={tx.tx_hash}
                        className="flex w-full flex-col rounded border border-secondary-light p-2 dark:border-secondary-dark dark:bg-background-dark dark:text-white"
                    >
                        {(
                            [
                                {
                                    heading: "TRANSACTION HASH",
                                    content: <Address address={tx.tx_hash} />,
                                },
                                {
                                    heading: "BLOCK HEIGHT",
                                    content: tx.block_height.toLocaleString(),
                                },
                                {
                                    heading: "FROM",
                                    content: (
                                        <Address address={tx.from_address} />
                                    ),
                                },
                                {
                                    heading: "TO",
                                    content: (
                                        <Address address={tx.to_address} />
                                    ),
                                },
                                {
                                    heading: "VALUE",
                                    content: `${
                                        Number(tx.value) /
                                        Math.pow(
                                            10,
                                            tx.gas_metadata.contract_decimals
                                        )
                                    } ${tx.gas_metadata.contract_ticker_symbol}`,
                                    subtext: tx.pretty_value_quote,
                                },
                            ] as CardDetailProps[]
                        ).map((props) => (
                            <CardDetail
                                key={props.heading?.toString()}
                                wrapperClassName="flex justify-between"
                                {...props}
                            />
                        ))}

                        {on_view_details ? (
                            <Button
                                variant="ghost"
                                className="mx-auto mb-2 mt-4 flex items-center justify-center gap-x-2 text-sm"
                                onClick={() => on_view_details(tx)}
                            >
                                View Transaction Details
                                <ExternalLinkIcon />
                            </Button>
                        ) : (
                            <></>
                        )}
                    </Card>
                ))
            ),
    });
};
