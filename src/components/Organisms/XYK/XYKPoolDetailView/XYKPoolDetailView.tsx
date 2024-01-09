import { TypographyH4 } from "@/components/ui/typography";
import { useCovalent } from "@/utils/store/Covalent";
import { type Option, Some, None } from "@/utils/option";
import { type XYKPoolDetailViewProps } from "@/utils/types/organisms.types";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { XYKPoolTimeSeriesView } from "@/components/Molecules/XYK/XYKPoolTimeSeriesView/XYKPoolTimeSeriesView";

export const XYKPoolDetailView: React.FC<XYKPoolDetailViewProps> = ({
    chain_name,
    dex_name,
    address,
}) => {
    const [maybeResult, setResult] = useState<Option<any>>(None);
    const [error, setError] = useState({ error: false, error_message: "" });
    const { covalentClient } = useCovalent();

    useEffect(() => {
        (async () => {
            let response;
            setResult(None);
            try {
                response = await covalentClient.XykService.getPoolByAddress(
                    chain_name,
                    dex_name,
                    address
                );
                console.log(response);
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
            <div className="mt-4 flex gap-4">
                {maybeResult.match({
                    None: () => (
                        <div className="rounded">
                            <div className="h-[30rem] w-[30rem] animate-pulse rounded bg-accent-foreground" />

                            <div className="mt-2 p-4">
                                <TypographyH4>Attributes</TypographyH4>

                                <div className="mt-2 flex flex-wrap gap-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((o, i) => {
                                        return (
                                            <Skeleton
                                                key={i}
                                                size={GRK_SIZES.LARGE}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ),
                    Some: () => {
                        return (
                            <div className="flex min-w-[25rem] max-w-[70rem] flex-col gap-2 rounded ">
                                <div className="flex w-full flex-grow flex-col justify-center gap-2 rounded border p-4">
                                    <h2 className="text-md text-secondary">
                                        Total Liquidity
                                    </h2>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl">
                                            {maybeResult.match({
                                                None: () => (
                                                    <Skeleton
                                                        size={GRK_SIZES.MEDIUM}
                                                    />
                                                ),
                                                Some: (result) => {
                                                    return (
                                                        <span>
                                                            {
                                                                result.total_liquidity_quote
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
                                        Volume 24h
                                    </h2>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl">
                                            {maybeResult.match({
                                                None: () => (
                                                    <Skeleton
                                                        size={GRK_SIZES.MEDIUM}
                                                    />
                                                ),
                                                Some: (result) => {
                                                    return (
                                                        <span>
                                                            {
                                                                result.volume_24h_quote
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
                                        Fee 24h
                                    </h2>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl">
                                            {maybeResult.match({
                                                None: () => (
                                                    <Skeleton
                                                        size={GRK_SIZES.MEDIUM}
                                                    />
                                                ),
                                                Some: (result) => {
                                                    return (
                                                        <span>
                                                            {
                                                                result.fee_24h_quote
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
                                        Total Liquidity
                                    </h2>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl">
                                            {maybeResult.match({
                                                None: () => (
                                                    <Skeleton
                                                        size={GRK_SIZES.MEDIUM}
                                                    />
                                                ),
                                                Some: (result) => {
                                                    return (
                                                        <span>
                                                            {
                                                                result.total_liquidity_quote
                                                            }
                                                        </span>
                                                    );
                                                },
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    },
                })}
                <div className=" flex w-full flex-col gap-4">
                    <div className="">
                        <XYKPoolTimeSeriesView
                            chain_name={chain_name}
                            dex_name={dex_name}
                            address={address}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
