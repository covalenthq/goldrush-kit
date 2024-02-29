import { type TransactionReceiptViewProps } from "@/utils/types/organisms.types";
import { TypographyH4 } from "@/components/ui/typography";
import { Address } from "@/components/Atoms/Address/Address";
import { DecodedTransaction } from "@/components/Molecules/DecodedTransaction/DecodedTransaction";
import { useMemo, useState } from "react";
import { type Option, None } from "@/utils/option";
import { type DecodedTransactionMetadata } from "@/utils/types/molecules.types";
import { timestampParser } from "@/utils/functions";
import { CardDescription } from "@/components/ui/card";
import { calculatePrettyBalance, type ChainItem } from "@covalenthq/client-sdk";
import { useGoldRush } from "@/utils/store";
import { ClockIcon } from "@radix-ui/react-icons";
import { AccountCard } from "@/components/Molecules/AccountCard/AccountCard";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";

export const TransactionReceiptView: React.FC<TransactionReceiptViewProps> = ({
    chain_name,
    tx_hash,
}) => {
    const { chains } = useGoldRush();

    const [maybeResult, setResult] =
        useState<Option<DecodedTransactionMetadata | null>>(None);
    const [relativeTime, setRelativeTime] = useState<boolean>(false);

    const CHAIN = useMemo<ChainItem | null>(() => {
        return chains?.find((o) => o.name === chain_name) ?? null;
    }, [chains, chain_name]);

    return (
        <section className="overflow-hidden rounded border">
            <figure className="h-10 w-full bg-accent" />

            <main className="flex h-full w-full flex-col gap-y-4 p-4">
                <header className="flex flex-col gap-y-1">
                    <TypographyH4>Transaction Receipt</TypographyH4>
                    <div className="text-sm text-muted-foreground">
                        <Address address={tx_hash} />
                    </div>
                </header>

                {maybeResult.match({
                    None: () => (
                        <div className="flex flex-col gap-y-4">
                            <div className="flex flex-col gap-y-2">
                                <Skeleton size={GRK_SIZES.LARGE} />
                                <Skeleton size={GRK_SIZES.LARGE} />
                            </div>

                            <div className="flex gap-6 pb-2">
                                <Skeleton size={GRK_SIZES.LARGE} />
                                <Skeleton size={GRK_SIZES.LARGE} />
                            </div>
                        </div>
                    ),
                    Some: (metadata) =>
                        !metadata ? (
                            <></>
                        ) : (
                            <>
                                <div className="flex flex-col gap-y-1">
                                    <CardDescription>
                                        Chain:{" "}
                                        <span className="text-black dark:text-text-color-50">
                                            {CHAIN?.label}
                                        </span>
                                    </CardDescription>

                                    <CardDescription>
                                        Transaction Time:{" "}
                                        <span className="inline-flex items-center gap-x-1 text-black dark:text-text-color-50">
                                            {timestampParser(
                                                metadata.block_signed_at.toString(),
                                                relativeTime
                                                    ? "relative"
                                                    : "descriptive"
                                            )}
                                            <button
                                                onClick={() =>
                                                    setRelativeTime(
                                                        !relativeTime
                                                    )
                                                }
                                            >
                                                <ClockIcon />
                                            </button>
                                        </span>
                                    </CardDescription>
                                </div>

                                <div className="flex gap-x-8">
                                    <div className="flex flex-col">
                                        <CardDescription>
                                            Address
                                        </CardDescription>
                                        <AccountCard
                                            address={metadata.from_address}
                                            name={metadata.from_address_label}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <CardDescription>
                                            Interacted with
                                        </CardDescription>
                                        <AccountCard
                                            address={metadata.to_address}
                                            name={metadata.to_address_label}
                                        />
                                    </div>
                                </div>
                            </>
                        ),
                })}

                <DecodedTransaction
                    chain_name={chain_name}
                    tx_hash={tx_hash}
                    setTxMetadata={setResult}
                />

                {maybeResult.match({
                    None: () => (
                        <div className="flex flex-col gap-y-4">
                            <div className="flex flex-col gap-y-2">
                                <Skeleton size={GRK_SIZES.LARGE} />
                                <Skeleton size={GRK_SIZES.LARGE} />
                                <Skeleton size={GRK_SIZES.LARGE} />
                            </div>

                            <Skeleton size={GRK_SIZES.LARGE} />
                        </div>
                    ),
                    Some: (metadata) =>
                        !metadata ? (
                            <></>
                        ) : (
                            <>
                                <div className="flex flex-col gap-y-2">
                                    <div>
                                        <CardDescription>
                                            Transaction Fee
                                        </CardDescription>
                                        <CardDescription>
                                            <span
                                                className="text-black dark:text-text-color-50"
                                                title={calculatePrettyBalance(
                                                    BigInt(
                                                        metadata.fees_paid || 0
                                                    )!,
                                                    metadata.gas_metadata
                                                        .contract_decimals
                                                )}
                                            >
                                                {calculatePrettyBalance(
                                                    BigInt(
                                                        metadata.fees_paid || 0
                                                    )!,
                                                    metadata.gas_metadata
                                                        .contract_decimals,
                                                    true,
                                                    4
                                                )}{" "}
                                                {
                                                    metadata.gas_metadata
                                                        .contract_ticker_symbol
                                                }{" "}
                                            </span>
                                            {metadata.pretty_gas_quote}
                                        </CardDescription>
                                    </div>

                                    <div>
                                        <CardDescription>
                                            Exchange Rate
                                        </CardDescription>
                                        <CardDescription>
                                            <span className="text-black dark:text-text-color-50">
                                                1 USD ={" "}
                                                {1 /
                                                    (metadata.gas_quote_rate ??
                                                        1)}{" "}
                                                {
                                                    metadata.gas_metadata
                                                        .contract_ticker_symbol
                                                }
                                            </span>
                                        </CardDescription>
                                    </div>

                                    <div>
                                        <CardDescription>
                                            Gas Price
                                        </CardDescription>
                                        <CardDescription>
                                            <span className="text-black dark:text-text-color-50">
                                                {calculatePrettyBalance(
                                                    BigInt(metadata.gas_price),
                                                    metadata.gas_metadata
                                                        .contract_decimals,
                                                    true,
                                                    10
                                                )}{" "}
                                                {
                                                    metadata.gas_metadata
                                                        .contract_ticker_symbol
                                                }
                                            </span>
                                        </CardDescription>
                                    </div>
                                </div>

                                <a
                                    href={metadata.explorers[0].url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-semibold hover:underline"
                                >
                                    View on{" "}
                                    {metadata.explorers[0].label ?? "Explorer"}
                                </a>
                            </>
                        ),
                })}
            </main>
        </section>
    );
};
