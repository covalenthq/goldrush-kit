import { TypographyH1 } from "@/components/ui/typography";
import { useCovalent } from "@/utils/store/Covalent";
import { type Option, Some, None } from "@/utils/option";
import { type XYKTokenDetailViewProps } from "@/utils/types/organisms.types";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { TokenAvatar } from "@/components/Atoms/TokenAvatar/TokenAvatar";
import { XYKTokenTimeSeriesView } from "@/components/Molecules/XYK/XYKTokenTimeSeriesView/XYKTokenTimeSeriesView";

export const XYKTokenDetailView: React.FC<XYKTokenDetailViewProps> = ({
    chain_name,
    dex_name,
    token_address,
}) => {
    const [maybeResult, setResult] = useState<Option<any>>(None);
    const [error, setError] = useState({ error: false, error_message: "" });
    const { covalentClient } = useCovalent();

    useEffect(() => {
        (async () => {
            let response;
            setResult(None);
            try {
                response = await covalentClient.XykService.getLpTokenView(
                    chain_name,
                    dex_name,
                    token_address
                );
                setResult(new Some(response.data.items[0]));
            } catch (error) {
                setError({
                    error: response ? response.error : false,
                    error_message: response ? response.error_message : "",
                });
            }
        })();
    }, [chain_name, dex_name]);

    if (error.error) {
        return <>{error.error_message}</>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center gap-4">
                {maybeResult.match({
                    None: () => (
                        <div className="relative mr-2 flex">
                            <div className="h-20 w-20 animate-pulse rounded-[100%] bg-slate-600" />
                            <div className="absolute left-12 h-20 w-20 animate-pulse rounded-[100%] bg-slate-200" />
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
                        <TypographyH1>
                            <span>
                                {result.contract_name}{" "}
                                {`(${result.contract_ticker_symbol})`}
                            </span>
                        </TypographyH1>
                    ),
                })}{" "}
            </div>

            <div className="mt-4 flex flex-col gap-4 md:flex-row">
                <div className="flex min-w-[20rem] max-w-[70rem] flex-col gap-2 rounded">
                    <div className="flex w-full flex-grow flex-col justify-center gap-2 rounded border p-4">
                        <h2 className="text-md text-secondary">
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
                        <h2 className="text-md text-secondary">
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
                        <h2 className="text-md text-secondary">
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
                        <XYKTokenTimeSeriesView
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
        </div>
    );
};
