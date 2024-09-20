import { Address } from "@/components/Atoms";
import { Timestamp } from "@/components/Atoms";
import { CardDetail } from "@/components/Shared";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    GRK_SIZES,
    DEFAULT_ERROR_MESSAGE,
    FALLBACK_ERROR,
} from "@/utils/constants/shared.constants";
import { actionableWrapper } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type TransactionDetailsProps } from "@/utils/types/molecules.types";
import { type CardDetailProps } from "@/utils/types/shared.types";
import {
    calculatePrettyBalance,
    type Transaction,
    type GoldRushResponse,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
    chain_name,
    tx_hash,
    actionable_block = () => null,
    actionable_transaction,
    actionable_from,
    actionable_to,
}) => {
    const { goldrushClient } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [maybeResult, setMaybeResult] =
        useState<Option<Transaction | null>>(None);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await goldrushClient.TransactionService.getTransaction(
                        chain_name,
                        tx_hash,
                        {
                            noLogs: true,
                            quoteCurrency: "USD",
                            withSafe: false,
                        },
                    );
                if (error.error) {
                    throw error;
                }
                if (!data?.items?.[0]) {
                    throw FALLBACK_ERROR;
                }
                setMaybeResult(new Some(data.items[0]));
            } catch (error: GoldRushResponse<null> | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
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
                                        <Address
                                            address={result.tx_hash}
                                            actionable_address={
                                                actionable_transaction
                                            }
                                        />
                                    ),
                                },
                                {
                                    heading: "BLOCK",
                                    content: actionableWrapper(
                                        actionable_block(result.block_height),
                                        result.block_height?.toLocaleString(),
                                    ),
                                },
                                {
                                    heading: "SIGNED AT",
                                    content: (
                                        <Timestamp
                                            timestamp={result.block_signed_at}
                                        />
                                    ),
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
                                            label={result.from_address_label}
                                            address={result.from_address}
                                            actionable_address={actionable_from}
                                        />
                                    ),
                                },
                                {
                                    heading: "TO",
                                    content: (
                                        <Address
                                            label={result.to_address_label}
                                            address={result.to_address}
                                            actionable_address={actionable_to}
                                        />
                                    ),
                                },
                                {
                                    heading: "VALUE",
                                    content: `${calculatePrettyBalance(
                                        Number(result.value),
                                        result.gas_metadata?.contract_decimals,
                                    )} ${result.gas_metadata?.contract_ticker_symbol}`,
                                    subtext: result.pretty_value_quote,
                                },
                                {
                                    heading: "TX FEE",
                                    content: `${calculatePrettyBalance(
                                        BigInt(result.fees_paid || 0)!,
                                        result.gas_metadata?.contract_decimals,
                                        true,
                                        4,
                                    )} ${result.gas_metadata?.contract_ticker_symbol}`,
                                    subtext: result.pretty_gas_quote,
                                },
                                {
                                    heading: "GAS PRICE",
                                    content: `${calculatePrettyBalance(
                                        BigInt(result.gas_price || 0),
                                        result.gas_metadata?.contract_decimals,
                                        true,
                                        10,
                                    )} ${result.gas_metadata?.contract_ticker_symbol}`,
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
