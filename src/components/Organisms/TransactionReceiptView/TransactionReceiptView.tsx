import { type TransactionReceiptViewProps } from "@/utils/types/organisms.types";
import { TypographyH1 } from "@/components/ui/typography";
import { Address } from "@/components/Atoms/Address/Address";
import { DecodedTransaction } from "@/components/Molecules/DecodedTransaction/DecodedTransaction";
import { useState } from "react";
import { type Option, None } from "@/utils/option";
import { type DecodedTransactionMetadata } from "@/utils/types/molecules.types";

export const TransactionReceiptView: React.FC<TransactionReceiptViewProps> = ({
    chain_name,
    tx_hash,
}) => {
    const [maybeResult, setResult] =
        useState<Option<DecodedTransactionMetadata>>(None);

    return (
        <section>
            <div className="flex gap-x-8">
                <TypographyH1>Transaction Receipt</TypographyH1>
                <Address address={tx_hash} />
            </div>

            <DecodedTransaction
                chain_name={chain_name}
                tx_hash={tx_hash}
                setMetadata={setResult}
            />

            {maybeResult.match({
                None: () => null,
                Some: (metadata) => null,
            })}
        </section>
    );
};
