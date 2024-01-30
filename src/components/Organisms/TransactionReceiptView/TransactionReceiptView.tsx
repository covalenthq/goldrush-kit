import { type TransactionReceiptViewProps } from "@/utils/types/organisms.types";
import { TypographyH1 } from "@/components/ui/typography";
import { Address } from "@/components/Atoms/Address/Address";
import { DecodedTransaction } from "@/components/Molecules/DecodedTransaction/DecodedTransaction";
import { useMemo, useState } from "react";
import { type Option, None } from "@/utils/option";
import { type DecodedTransactionMetadata } from "@/utils/types/molecules.types";
import { timestampParser } from "@/utils/functions";
import { AccountCardView } from "@/components/Molecules/AccountCardView/AccountCardView";
import { CardContent, CardDescription } from "@/components/ui/card";
import { type ChainItem, calculatePrettyBalance } from "@covalenthq/client-sdk";
import { useCovalent } from "@/utils/store/Covalent";
import { Button } from "@/components/ui/button";

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
        <section className="flex w-full flex-col gap-y-8">
            <div className="flex gap-x-8">
                <TypographyH1>Transaction Receipt</TypographyH1>
            </div>

            {maybeResult.match({
                None: () => null,
                Some: (metadata) => (
                    <>
                        <div className="flex items-center gap-x-8">
                            <div>
                                <CardDescription>
                                    Transaction Hash
                                </CardDescription>
                                <CardContent>
                                    <Address address={tx_hash} />
                                </CardContent>
                            </div>

                            <div>
                                <CardDescription>Network</CardDescription>
                                <CardContent>{CHAIN?.label}</CardContent>
                            </div>

                            <div>
                                <CardDescription>
                                    Transaction Time
                                </CardDescription>
                                <CardContent>
                                    {timestampParser(
                                        metadata.block_signed_at.toString(),
                                        "descriptive"
                                    )}
                                </CardContent>
                            </div>

                            <div>
                                <a
                                    href={metadata.explorers[0].url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button role="link">
                                        View on{" "}
                                        {metadata.explorers[0].label ??
                                            "Explorer"}
                                    </Button>
                                </a>
                            </div>
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
                        <div className="flex gap-x-8">
                            <div>
                                <CardDescription>
                                    Transaction Fee
                                </CardDescription>
                                <CardContent className="flex items-center gap-x-2">
                                    {calculatePrettyBalance(
                                        BigInt(metadata.fees_paid || 0)!,
                                        metadata.gas_metadata.contract_decimals
                                    )}{" "}
                                    {
                                        metadata.gas_metadata
                                            .contract_ticker_symbol
                                    }{" "}
                                    <CardDescription>
                                        {" "}
                                        {metadata.pretty_gas_quote}
                                    </CardDescription>
                                </CardContent>
                            </div>

                            <div>
                                <CardDescription>Exchange Rate</CardDescription>
                                <CardContent>
                                    1 USD = {1 / (metadata.gas_quote_rate ?? 1)}{" "}
                                    {
                                        metadata.gas_metadata
                                            .contract_ticker_symbol
                                    }
                                </CardContent>
                            </div>

                            <div>
                                <CardDescription>Gas Price</CardDescription>
                                <CardContent>
                                    {calculatePrettyBalance(
                                        BigInt(metadata.gas_price),
                                        metadata.gas_metadata.contract_decimals
                                    )}{" "}
                                    {
                                        metadata.gas_metadata
                                            .contract_ticker_symbol
                                    }
                                </CardContent>
                            </div>
                        </div>
                    </>
                ),
            })}
        </section>
    );
};
