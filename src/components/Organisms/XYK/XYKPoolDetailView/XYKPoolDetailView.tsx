import { TypographyH1 } from "@/components/ui/typography";
import { useGoldRush } from "@/utils/store";
import { type Option, Some, None } from "@/utils/option";
import { type XYKPoolDetailViewProps } from "@/utils/types/organisms.types";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { XYKPoolTimeSeries } from "@/components/Molecules/XYK/XYKPoolTimeSeries/XYKPoolTimeSeries";
import { TokenAvatar } from "@/components/Atoms/TokenAvatar/TokenAvatar";
import { prettyToken } from "@/utils/functions/pretty-token";
import { XYKPoolInformation } from "@/components/Molecules/XYK/XYKPoolInformation/XYKPoolInformation";
import { type PoolWithTimeseries } from "@covalenthq/client-sdk";

export const XYKPoolDetailView: React.FC<XYKPoolDetailViewProps> = ({
    chain_name,
    dex_name,
    pool_address,
}) => {
    const [maybeResult, setResult] = useState<Option<PoolWithTimeseries>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.XykService.getPoolByAddress(
                        chain_name,
                        dex_name,
                        pool_address
                    );
                setResult(new Some(data.items[0]));
                if (error.error) {
                    setErrorMessage(error.error_message);
                    throw error;
                }
            } catch (exception) {
                console.error(exception);
            }
        })();
    }, [chain_name, dex_name]);

    if (errorMessage) {
        return <>{errorMessage}</>;
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center gap-4">
                {maybeResult.match({
                    None: () => (
                        <div className="relative mr-2 flex">
                            <div className="animate-pulse h-20 w-20 rounded-[100%] bg-slate-600" />
                            <div className="animate-pulse absolute left-12 h-20 w-20 rounded-[100%] bg-slate-200" />
                        </div>
                    ),
                    Some: (result) => (
                        <div className="relative mr-2 flex">
                            <TokenAvatar
                                size={GRK_SIZES.MEDIUM}
                                token_url={result.token_0.logo_url}
                            />
                            <div className="absolute left-12">
                                <TokenAvatar
                                    size={GRK_SIZES.MEDIUM}
                                    token_url={result.token_1.logo_url}
                                />
                            </div>
                        </div>
                    ),
                })}{" "}
                {maybeResult.match({
                    None: () => (
                        <div className="ml-8 flex items-center gap-4">
                            <Skeleton size={GRK_SIZES.LARGE} /> -
                            <Skeleton size={GRK_SIZES.LARGE} />
                        </div>
                    ),
                    Some: (result) => (
                        <TypographyH1>
                            <span className="ml-8">
                                {" "}
                                {result.token_0.contract_ticker_symbol}-
                                {result.token_1.contract_ticker_symbol}{" "}
                            </span>
                            Pair
                        </TypographyH1>
                    ),
                })}{" "}
            </div>

            <div className="mt-4 flex flex-col gap-4 md:flex-row">
                <div className="flex min-w-[20rem] max-w-[70rem] flex-col gap-2 rounded">
                    <div className="flex w-full flex-grow flex-col justify-center gap-2 rounded border p-4">
                        <h2 className="text-md text-secondary-light">
                            Total Liquidity
                        </h2>
                        <div className="flex items-end gap-2">
                            <span className="text-xl">
                                {maybeResult.match({
                                    None: () => (
                                        <Skeleton size={GRK_SIZES.MEDIUM} />
                                    ),
                                    Some: (result) => {
                                        return (
                                            <span>
                                                {
                                                    result.pretty_total_liquidity_quote
                                                }
                                            </span>
                                        );
                                    },
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="flex w-full flex-grow flex-col justify-center gap-2 rounded border p-4">
                        <h2 className="text-md text-secondary-light">
                            Volume (24hrs)
                        </h2>
                        <div className="flex items-end gap-2">
                            <span className="text-xl">
                                {maybeResult.match({
                                    None: () => (
                                        <Skeleton size={GRK_SIZES.MEDIUM} />
                                    ),
                                    Some: (result) => {
                                        return (
                                            <span>
                                                {result.pretty_volume_24h_quote}
                                            </span>
                                        );
                                    },
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="flex w-full flex-grow flex-col justify-center gap-2 rounded border p-4">
                        <h2 className="text-md text-secondary-light">
                            Fee (24hrs)
                        </h2>
                        <div className="flex items-end gap-2">
                            <span className="text-xl">
                                {maybeResult.match({
                                    None: () => (
                                        <Skeleton size={GRK_SIZES.MEDIUM} />
                                    ),
                                    Some: (result) => {
                                        return (
                                            <span>
                                                {result.pretty_fee_24h_quote}
                                            </span>
                                        );
                                    },
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="flex w-full flex-grow flex-col justify-center gap-2 rounded border p-4">
                        <h2 className="text-md text-secondary-light">
                            Pooled Tokens
                        </h2>
                        <div className="flex items-end gap-2">
                            <span className="text-xl">
                                {maybeResult.match({
                                    None: () => (
                                        <Skeleton size={GRK_SIZES.MEDIUM} />
                                    ),
                                    Some: (result) => {
                                        const token_0 = result.token_0;
                                        const token_1 = result.token_1;

                                        return (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <TokenAvatar
                                                        size={
                                                            GRK_SIZES.EXTRA_SMALL
                                                        }
                                                        token_url={
                                                            token_0.logo_url
                                                        }
                                                    />
                                                    {`${prettyToken(
                                                        +token_0.reserve,
                                                        +token_0.contract_decimals
                                                    )} ${
                                                        token_0.contract_ticker_symbol
                                                    }`}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <TokenAvatar
                                                        size={
                                                            GRK_SIZES.EXTRA_SMALL
                                                        }
                                                        token_url={
                                                            token_1.logo_url
                                                        }
                                                    />
                                                    {`${prettyToken(
                                                        +token_1.reserve,
                                                        +token_1.contract_decimals
                                                    )} ${
                                                        token_1.contract_ticker_symbol
                                                    }`}
                                                </div>
                                            </div>
                                        );
                                    },
                                })}
                            </span>
                        </div>
                    </div>
                </div>
                <div className=" flex w-full flex-col gap-4">
                    <div className="">
                        <XYKPoolTimeSeries
                            pool_data={maybeResult.match({
                                None: () => null,
                                Some: (pool_data) => pool_data,
                            })}
                            chain_name={chain_name}
                            dex_name={dex_name}
                            pool_address={pool_address}
                        />
                    </div>
                </div>
            </div>
            <XYKPoolInformation
                pool_address={pool_address}
                chain_name={chain_name}
                dex_name={dex_name}
                pool_data={maybeResult.match({
                    None: () => null,
                    Some: (pool_data) => pool_data,
                })}
            />
        </div>
    );
};
