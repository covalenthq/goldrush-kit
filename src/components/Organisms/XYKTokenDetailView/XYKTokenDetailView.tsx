import { Heading } from "@/components/Shared";
import { useGoldRush } from "@/utils/store";
import { type Option, Some, None } from "@/utils/option";
import { type XYKTokenDetailViewProps } from "@/utils/types/organisms.types";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { TokenAvatar } from "@/components/Atoms";
import {
    XYKTokenInformation,
    XYKTokenTimeSeries,
} from "@/components/Molecules";
import { type TokenV2VolumeWithChartData } from "@covalenthq/client-sdk";

export const XYKTokenDetailView: React.FC<XYKTokenDetailViewProps> = ({
    chain_name,
    dex_name,
    token_address,
}) => {
    const [maybeResult, setResult] =
        useState<Option<TokenV2VolumeWithChartData>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.XykService.getLpTokenView(
                        chain_name,
                        dex_name,
                        token_address
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
    }, [chain_name, dex_name, token_address]);

    if (errorMessage) {
        return <>{errorMessage}</>;
    }

    if (
        !maybeResult.match({
            None: () => null,
            Some: (result) => result,
        })
    ) {
        return <>No data found.</>;
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center gap-4">
                {maybeResult.match({
                    None: () => (
                        <div className="relative mr-2 flex">
                            <div className="h-20 w-20 animate-pulse rounded-full bg-slate-600" />
                            <div className="absolute left-12 h-20 w-20 animate-pulse rounded-full bg-slate-200" />
                        </div>
                    ),
                    Some: (result) => (
                        <div className="relative mr-2 flex">
                            <TokenAvatar
                                size={GRK_SIZES.MEDIUM}
                                token_url={result.logo_url}
                            />
                        </div>
                    ),
                })}{" "}
                {maybeResult.match({
                    None: () => (
                        <div className="ml-8 flex items-center gap-4">
                            <Skeleton size={GRK_SIZES.LARGE} />
                        </div>
                    ),
                    Some: (result) => (
                        <Heading size={1}>
                            <span>
                                {result.contract_name}{" "}
                                {`(${result.contract_ticker_symbol})`}
                            </span>
                        </Heading>
                    ),
                })}{" "}
            </div>

            <div className="mt-4 flex flex-col gap-4 md:flex-row">
                <div className="flex min-w-80 max-w-[70rem] flex-col gap-2 rounded">
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
                                                {
                                                    result.pretty_total_volume_24h_quote
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
                            Transactions (24hrs)
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
                                                {result.transactions_24h.toLocaleString()}
                                            </span>
                                        );
                                    },
                                })}
                            </span>
                        </div>
                    </div>
                </div>
                <div className=" flex w-full flex-col gap-4">
                    <div className="">
                        <XYKTokenTimeSeries
                            token_data={maybeResult.match({
                                None: () => null,
                                Some: (pool_data) => pool_data,
                            })}
                            chain_name={chain_name}
                            dex_name={dex_name}
                            token_address={token_address}
                        />
                    </div>
                </div>
            </div>
            <XYKTokenInformation
                token_data={maybeResult.match({
                    None: () => null,
                    Some: (pool_data) => pool_data,
                })}
                chain_name={chain_name}
                dex_name={dex_name}
                token_address={token_address}
            />
        </div>
    );
};
