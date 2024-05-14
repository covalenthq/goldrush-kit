import { Address } from "@/components/Atoms";
import { Timestamp } from "@/components/Atoms/Timestamp/Timestamp";
import { CardDetail } from "@/components/Shared";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    GRK_SIZES,
    defaultErrorMessage,
} from "@/utils/constants/shared.constants";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type TransactionDetailsProps } from "@/utils/types/molecules.types";
import {
    type CovalentAPIError,
    type CardDetailProps,
} from "@/utils/types/shared.types";
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
    const [maybeResult, setMaybeResult] =
        useState<Option<Transaction | null>>(None);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
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
                    throw error;
                }
                setMaybeResult(new Some(data.items[0]));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? defaultErrorMessage);
                setMaybeResult(new Some(null));
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
                Some: (result) =>
                    errorMessage ? (
                        <p className="col-span-3">{errorMessage}</p>
                    ) : result ? (
                        (
                            [
                                {
                                    heading: "TX HASH",
                                    content: (
                                        <Address address={result.tx_hash} />
                                    ),
                                },
                                {
                                    heading: "BLOCK",
                                    content:
                                        result.block_height.toLocaleString(),
                                },
                                {
                                    heading: "SIGNED AT",
                                    content: <Timestamp timestamp={result.block_signed_at} />,
                                },
                                {
                                    heading: "BLOCK HASH",
                                    content: (
                                        <Address address={result.block_hash} />
                                    ),
                                },
                                {
                                    heading: "FROM",
                                    content: (
                                        <Address
                                            address={result.from_address}
                                        />
                                    ),
                                },
                                {
                                    heading: "TO",
                                    content: (
                                        <Address address={result.to_address} />
                                    ),
                                },
                                {
                                    heading: "VALUE",
                                    content: `${
                                        Number(result.value) /
                                        Math.pow(
                                            10,
                                            result.gas_metadata
                                                .contract_decimals
                                        )
                                    } ${result.gas_metadata.contract_ticker_symbol}`,
                                    subtext: result.pretty_value_quote,
                                },
                                {
                                    heading: "TX FEE",
                                    content: `${calculatePrettyBalance(
                                        BigInt(result.fees_paid || 0)!,
                                        result.gas_metadata.contract_decimals,
                                        true,
                                        4
                                    )} ${result.gas_metadata.contract_ticker_symbol}`,
                                    subtext: result.pretty_gas_quote,
                                },
                                {
                                    heading: "GAS PRICE",
                                    content: `${calculatePrettyBalance(
                                        BigInt(result.gas_price),
                                        result.gas_metadata.contract_decimals,
                                        true,
                                        10
                                    )} ${result.gas_metadata.contract_ticker_symbol}`,
                                },
                            ] as CardDetailProps[]
                        ).map((props) => (
                            <CardDetail
                                key={props.heading?.toString()}
                                {...props}
                            />
                        ))
                    ) : (
                        <></>
                    ),
            })}
        </Card>
    );
};
