import { Address } from "@/components/Atoms";
import { CardDetail } from "@/components/Shared";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { timestampParser } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type TransactionDetailsProps } from "@/utils/types/molecules.types";
import { type CardDetailProps } from "@/utils/types/shared.types";
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
        <Card className="grid w-full grid-cols-1 items-start gap-4 break-all border p-2 md:grid-cols-3">
            {maybeResult.match({
                None: () => (
                    <>
                        {Array(9)
                            .fill(null)
                            .map(() => (
                                <div key={Math.random()}>
                                    <Skeleton size={GRK_SIZES.LARGE} />
                                </div>
                            ))}
                    </>
                ),
                Some: (tx) =>
                    errorMessage ? (
                        <p className="col-span-3">{errorMessage}</p>
                    ) : (
                        (
                            [
                                {
                                    heading: "TX HASH",
                                    content: <Address address={tx.tx_hash} />,
                                },
                                {
                                    heading: "BLOCK",
                                    content: tx.block_height.toLocaleString(),
                                },
                                {
                                    heading: "SIGNED AT",
                                    content: timestampParser(
                                        tx.block_signed_at,
                                        "descriptive"
                                    ),
                                    subtext: `(${timestampParser(
                                        tx.block_signed_at,
                                        "relative"
                                    )})`,
                                },
                                {
                                    heading: "BLOCK HASH",
                                    content: (
                                        <Address address={tx.block_hash} />
                                    ),
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
                                {
                                    heading: "TX FEE",
                                    content: `${calculatePrettyBalance(
                                        BigInt(tx.fees_paid || 0)!,
                                        tx.gas_metadata.contract_decimals,
                                        true,
                                        4
                                    )} ${tx.gas_metadata.contract_ticker_symbol}`,
                                    subtext: tx.pretty_gas_quote,
                                },
                                {
                                    heading: "GAS PRICE",
                                    content: `${calculatePrettyBalance(
                                        BigInt(tx.gas_price),
                                        tx.gas_metadata.contract_decimals,
                                        true,
                                        10
                                    )} ${tx.gas_metadata.contract_ticker_symbol}`,
                                },
                            ] as CardDetailProps[]
                        ).map((props) => (
                            <CardDetail
                                key={props.heading?.toString()}
                                {...props}
                            />
                        ))
                    ),
            })}
        </Card>
    );
};
