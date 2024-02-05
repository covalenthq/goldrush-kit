import { type TransactionReceiptViewProps } from "@/utils/types/organisms.types";
import { TypographyH4 } from "@/components/ui/typography";
import { Address } from "@/components/Atoms/Address/Address";
import { DecodedTransaction } from "@/components/Molecules/DecodedTransaction/DecodedTransaction";
import { useMemo, useState } from "react";
import { type Option, None } from "@/utils/option";
import { type DecodedTransactionMetadata } from "@/utils/types/molecules.types";
import { timestampParser } from "@/utils/functions";
import { AccountCardView } from "@/components/Molecules/AccountCardView/AccountCardView";
import { CardDescription } from "@/components/ui/card";
import { type ChainItem, calculatePrettyBalance } from "@covalenthq/client-sdk";
import { useCovalent } from "@/utils/store/Covalent";

export const TransactionReceiptView: React.FC<TransactionReceiptViewProps> = ({
    chain_name,
    tx_hash,
}) => {
    const { chains } = useCovalent();

    const [maybeResult, setResult] =
        useState<Option<DecodedTransactionMetadata>>(None);

    const CHAIN = useMemo<ChainItem | null>(() => {
        return chains?.find((o) => o.name === chain_name) ?? null;
    }, [chains, chain_name]);

    return (
        <section className="h-fit w-5/6 max-w-[37.5rem] overflow-hidden rounded border">
            <figure
                className="h-10 w-full"
                style={{
                    backgroundImage: `linear-gradient(to right, ${CHAIN?.color_theme.hex}, ${CHAIN?.color_theme.hex})`,
                }}
            />

            <main className="flex h-full w-full flex-col gap-y-4 p-4">
                <header className="flex flex-col gap-y-1">
                    <TypographyH4>Transaction Receipt</TypographyH4>
                    <CardDescription>
                        <Address address={tx_hash} />
                    </CardDescription>
                </header>

                {maybeResult.match({
                    None: () => null,
                    Some: (metadata) => (
                        <>
                            <div className="flex flex-col gap-y-1">
                                <CardDescription>
                                    Network:{" "}
                                    <span className="text-black">
                                        {CHAIN?.label}
                                    </span>
                                </CardDescription>

                                <CardDescription>
                                    Transaction Time:{" "}
                                    <span className="text-black">
                                        {timestampParser(
                                            metadata.block_signed_at.toString(),
                                            "descriptive"
                                        )}
                                    </span>
                                </CardDescription>
                            </div>

                            <div className="flex gap-x-8">
                                <div className="flex flex-col">
                                    <CardDescription>Address</CardDescription>
                                    <AccountCardView
                                        address={metadata.from_address}
                                        name={metadata.from_address_label}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <CardDescription>
                                        Interacted with
                                    </CardDescription>
                                    <AccountCardView
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
                    setMetadata={setResult}
                />

                {maybeResult.match({
                    None: () => null,
                    Some: (metadata) => (
                        <>
                            <div className="flex flex-col gap-y-2">
                                <div>
                                    <CardDescription>
                                        Transaction Fee
                                    </CardDescription>
                                    <CardDescription>
                                        <span
                                            className="text-black"
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
                                        <span className="text-black">
                                            1 USD ={" "}
                                            {1 / (metadata.gas_quote_rate ?? 1)}{" "}
                                            {
                                                metadata.gas_metadata
                                                    .contract_ticker_symbol
                                            }
                                        </span>
                                    </CardDescription>
                                </div>

                                <div>
                                    <CardDescription>Gas Price</CardDescription>
                                    <CardDescription>
                                        <span className="text-black">
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
