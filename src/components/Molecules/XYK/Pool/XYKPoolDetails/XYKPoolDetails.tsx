import { useEffect } from "react";
import { type Option, Some, None } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type PoolWithTimeseries } from "@covalenthq/client-sdk";
import { useState } from "react";
import { CardDetail } from "@/components/Shared";
import { type XYKPoolDetailsProps } from "@/utils/types/molecules.types";
import { Skeleton } from "@/components/ui/skeleton";
import {
    GRK_SIZES,
    DEFAULT_ERROR_MESSAGE,
} from "@/utils/constants/shared.constants";
import { Card } from "@/components/ui/card";
import {
    type CovalentAPIError,
    type CardDetailProps,
} from "@/utils/types/shared.types";
import { Address, Pool } from "@/components/Atoms";

export const XYKPoolDetails: React.FC<XYKPoolDetailsProps> = ({
    chain_name,
    dex_name,
    pool_address,
    maybeResult: initialMaybeResult = null,
    errorMessage: initialErrorMessage = null,
    actionable_address,
    actionable_token_0,
    actionable_token_1,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<PoolWithTimeseries | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(
        initialErrorMessage
    );

    useEffect(() => {
        if (initialErrorMessage) {
            setErrorMessage(initialErrorMessage);
        }
    }, [initialErrorMessage]);

    useEffect(() => {
        if (initialMaybeResult) {
            setMaybeResult(initialMaybeResult);
        }
    }, [initialMaybeResult]);

    useEffect(() => {
        (async () => {
            if (!initialMaybeResult) {
                try {
                    setMaybeResult(None);
                    setErrorMessage(null);
                    const { data, ...error } =
                        await covalentClient.XykService.getPoolByAddress(
                            chain_name,
                            dex_name,
                            pool_address
                        );
                    if (error.error) {
                        throw error;
                    }
                    setMaybeResult(new Some(data.items[0]));
                } catch (error: CovalentAPIError | any) {
                    setErrorMessage(
                        error?.error_message ?? DEFAULT_ERROR_MESSAGE
                    );
                    setMaybeResult(new Some(null));
                    console.error(error);
                }
            }
        })();
    }, [chain_name, dex_name, pool_address, initialMaybeResult]);

    return (
        <Card className="grid w-full grid-cols-1 items-center gap-4 break-all p-2 md:grid-cols-2 lg:grid-cols-5">
            {maybeResult.match({
                None: () => (
                    <>
                        {Array(10)
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
                        <p className="col-span-5">{errorMessage}</p>
                    ) : result ? (
                        (
                            [
                                {
                                    content: (
                                        <Pool
                                            pool_address={result.exchange}
                                            token_0_logo_url={
                                                result.token_0?.logo_url
                                            }
                                            token_0_ticker_symbol={
                                                result.token_0
                                                    .contract_ticker_symbol
                                            }
                                            token_1_logo_url={
                                                result.token_1?.logo_url
                                            }
                                            token_1_ticker_symbol={
                                                result.token_1
                                                    .contract_ticker_symbol
                                            }
                                        />
                                    ),
                                },
                                {
                                    heading: `${result.token_0?.contract_ticker_symbol} ADDRESS`,
                                    content: (
                                        <Address
                                            address={
                                                result.token_0?.contract_address
                                            }
                                            label={
                                                result.token_0?.contract_name
                                            }
                                            actionable_address={
                                                actionable_token_0
                                            }
                                        />
                                    ),
                                },
                                {
                                    heading: `${result.token_1?.contract_ticker_symbol} ADDRESS`,
                                    content: (
                                        <Address
                                            address={
                                                result.token_1?.contract_address
                                            }
                                            label={
                                                result.token_1?.contract_name
                                            }
                                            actionable_address={
                                                actionable_token_1
                                            }
                                        />
                                    ),
                                },
                                {
                                    heading: `${result.token_0?.contract_ticker_symbol} RESERVE`,
                                    content: `${(
                                        +result.token_0?.reserve /
                                        Math.pow(
                                            10,
                                            +result.token_0?.contract_decimals
                                        )
                                    ).toLocaleString()} ${result.token_0?.contract_ticker_symbol}`,
                                },
                                {
                                    heading: `${result.token_1?.contract_ticker_symbol} RESERVE`,
                                    content: `${(
                                        +result.token_1?.reserve /
                                        Math.pow(
                                            10,
                                            +result.token_1?.contract_decimals
                                        )
                                    ).toLocaleString()} ${result.token_1?.contract_ticker_symbol}`,
                                },
                                {
                                    heading: "PAIR ADDRESS",
                                    content: (
                                        <Address
                                            address={pool_address}
                                            actionable_address={
                                                actionable_address
                                            }
                                        />
                                    ),
                                },
                                {
                                    heading: "TOTAL LIQUIDITY",
                                    content:
                                        result.pretty_total_liquidity_quote,
                                },
                                {
                                    heading: "VOLUME (24 HOURS)",
                                    content: result.pretty_volume_24h_quote,
                                },
                                {
                                    heading: "FEE (24 HOURS)",
                                    content: result.pretty_fee_24h_quote,
                                },
                                {
                                    heading: "SWAP COUNT (24 HOURS)",
                                    content: result.swap_count_24h,
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
