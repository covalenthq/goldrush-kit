import { Address } from "@/components/Atoms/Address/Address";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { timestampParser } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useCovalent } from "@/utils/store/Covalent";
import { type AccountInfoProps } from "@/utils/types/molecules.types";
import {
    type TransactionsSummary,
    type ChainItem,
} from "@covalenthq/client-sdk";
import { useEffect, useMemo, useState } from "react";

export const AddressInfo: React.FC<AccountInfoProps> = ({
    address,
    chain_name,
}) => {
    const { covalentClient, chains } = useCovalent();

    const [maybeResult, setResult] =
        useState<Option<TransactionsSummary>>(None);

    useEffect(() => {
        (async () => {
            setResult(None);

            try {
                const { data, ...error } =
                    await covalentClient.TransactionService.getTransactionSummary(
                        chain_name,
                        address.trim()
                    );
                if (error.error) {
                    throw error;
                }
                setResult(new Some(data.items[0]));
            } catch (error) {
                console.error(
                    `Error fetching transactions summary for ${chain_name}:`,
                    error
                );
            }
        })();
    }, [address, chain_name]);

    const CHAIN = useMemo<ChainItem | null>(() => {
        return chains?.find((o) => o.name === chain_name) ?? null;
    }, [chains, chain_name]);

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
                    Some: ({
                        earliest_transaction,
                        latest_transaction,
                        total_count,
                    }) => (
                        <div className="mt-4">
                            <CardDescription className="col-span-2">
                                <span
                                    className="font-medium"
                                    style={{
                                        color: CHAIN?.color_theme.hex,
                                    }}
                                >
                                    {total_count} TRANSACTIONS
                                </span>{" "}
                            </CardDescription>

                            <div className="mt-2 grid grid-cols-2 items-end gap-x-2">
                                <div>
                                    <CardDescription>
                                        LATEST TRANSACTION
                                    </CardDescription>

                                    <div className="mt-1 flex items-center gap-x-1.5">
                                        <Address
                                            address={latest_transaction.tx_hash}
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
                    ),
                })}
            </Card>
        </>
    );
};
