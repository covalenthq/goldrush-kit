import { Address } from "@/components/Atoms/Address/Address";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { timestampParser } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useCovalent } from "@/utils/store/Covalent";
import {
    type CrossChainTransactionsSummary,
    type AccountInfoProps,
} from "@/utils/types/molecules.types";
import { type Chain } from "@covalenthq/client-sdk";
import { useCallback, useEffect, useState } from "react";

export const AddressInfo: React.FC<AccountInfoProps> = ({
    address,
    chain_names,
}) => {
    const { covalentClient, chains } = useCovalent();

    const [maybeResult, setResult] =
        useState<Option<CrossChainTransactionsSummary[]>>(None);

    useEffect(() => {
        (async () => {
            setResult(None);
            const results: CrossChainTransactionsSummary[] = [];
            await Promise.all(
                chain_names.map(async (chain_name) => {
                    let response;
                    try {
                        response =
                            await covalentClient.TransactionService.getTransactionSummary(
                                chain_name,
                                address.trim()
                            );

                        const summary = response.data.items[0];

                        results.push({
                            chain_name: chain_name,
                            ...summary,
                        });
                    } catch (error) {
                        console.error(
                            `Error fetching transactions summary for ${chain_name}:`,
                            error
                        );
                    }
                })
            );
            setResult(new Some(results));
        })();
    }, [address, chain_names]);

    const handleChain = useCallback(
        (chain_name: Chain) => {
            return chains?.find((o) => o.name === chain_name) ?? null;
        },
        [chains]
    );

    return (
        <>
            <Card className="w-[32rem] rounded border p-2">
                <CardTitle className="">Information</CardTitle>
                {maybeResult.match({
                    None: () => (
                        <div className="mt-4">
                            <Skeleton size={GRK_SIZES.LARGE} />
                        </div>
                    ),
                    Some: (summary) => (
                        <>
                            {summary.map(
                                ({
                                    chain_name,
                                    earliest_transaction,
                                    latest_transaction,
                                    total_count,
                                }) => {
                                    const chain = handleChain(chain_name);

                                    return (
                                        <div key={chain_name} className="mt-4">
                                            <CardDescription className="col-span-2">
                                                <span
                                                    className="text-lg font-medium"
                                                    style={{
                                                        color: chain
                                                            ?.color_theme.hex,
                                                    }}
                                                >
                                                    {chain?.label || chain_name}
                                                </span>{" "}
                                                <span>
                                                    ({total_count} transactions)
                                                </span>
                                            </CardDescription>

                                            <div className="mt-2 grid grid-cols-2">
                                                <div>
                                                    <CardDescription>
                                                        LATEST TRANSACTION
                                                    </CardDescription>

                                                    <div className="mt-1 flex items-center gap-x-1.5">
                                                        <Address
                                                            address={
                                                                latest_transaction.tx_hash
                                                            }
                                                        />
                                                        <CardDescription>
                                                            {timestampParser(
                                                                latest_transaction.block_signed_at,
                                                                "relative"
                                                            )}
                                                        </CardDescription>
                                                    </div>
                                                </div>

                                                <div>
                                                    <CardDescription>
                                                        EARLIEST TRANSACTION
                                                    </CardDescription>

                                                    <div className="flex items-center gap-x-2">
                                                        <Address
                                                            address={
                                                                earliest_transaction.tx_hash
                                                            }
                                                        />
                                                        <CardDescription>
                                                            {timestampParser(
                                                                earliest_transaction.block_signed_at,
                                                                "relative"
                                                            )}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </>
                    ),
                })}
            </Card>
        </>
    );
};
