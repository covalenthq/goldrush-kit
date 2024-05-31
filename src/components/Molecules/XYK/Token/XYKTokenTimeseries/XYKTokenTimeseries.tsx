import { type Option, None, Some } from "@/utils/option";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AreaChart, BarChart } from "@tremor/react";
import { timestampParser } from "@/utils/functions";
import { Heading } from "@/components/Shared";
import { Skeleton } from "@/components/ui/skeleton";
import {
    CHART_COLORS,
    GRK_SIZES,
    PERIOD,
    defaultErrorMessage,
} from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type XYKTokenTimeseriesProps } from "@/utils/types/molecules.types";
import {
    prettifyCurrency,
    type PriceTokenTimeseries,
    type TokenV2VolumeWithChartData,
} from "@covalenthq/client-sdk";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { Card } from "@/components/ui/card";

export const XYKTokenTimeseries: React.FC<XYKTokenTimeseriesProps> = ({
    chain_name,
    dex_name,
    token_address,
    maybeResult: initialMaybeResult = null,
    errorMessage: initialErrorMessage = null,
}) => {
    const { covalentClient, theme } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<TokenV2VolumeWithChartData | null>>(None);
    const [chartData, setChartData] =
        useState<Option<{ [key: string]: string | number | Date }[]>>(None);
    const [period, setPeriod] = useState<PERIOD>(PERIOD.DAYS_7);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [activeChart, setActiveChart] = useState<"liquidity" | "volume">(
        "liquidity"
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
        maybeResult.match({
            None: () => null,
            Some: (response) => {
                if (response) {
                    const chart_key = `${activeChart}_timeseries_${period}d`;
                    const value_key = `${activeChart}_quote`;

                    const result = (
                        response[
                            chart_key as keyof typeof response
                        ] as TokenV2VolumeWithChartData["price_timeseries_7d"]
                    ).map((x) => {
                        const dt = timestampParser(x.dt, "DD MMM YY");
                        return {
                            date: dt,
                            [`${capitalizeFirstLetter(activeChart)} (USD)`]:
                                x[value_key as keyof PriceTokenTimeseries],
                        };
                    });
                    setChartData(new Some(result));
                }
            },
        });
    }, [maybeResult, period, activeChart]);

    useEffect(() => {
        (async () => {
            if (!initialMaybeResult) {
                try {
                    setMaybeResult(None);
                    setErrorMessage(null);
                    const { data, ...error } =
                        await covalentClient.XykService.getLpTokenView(
                            chain_name,
                            dex_name,
                            token_address
                        );
                    if (error.error) {
                        throw error;
                    }
                    setMaybeResult(new Some(data.items[0]));
                } catch (error: CovalentAPIError | any) {
                    setErrorMessage(
                        error?.error_message ?? defaultErrorMessage
                    );
                    setMaybeResult(new Some(null));
                    console.error(error);
                }
            }
        })();
    }, [dex_name, token_address, chain_name, initialMaybeResult]);

    return (
        <Card className="min-h-80 w-full p-4">
            <div className="pb-4">
                <Heading size={4}>
                    {`${capitalizeFirstLetter(activeChart)} (USD)`}
                </Heading>
            </div>
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <Button
                        disabled={!maybeResult.isDefined}
                        variant={
                            activeChart === "liquidity" ? "primary" : "outline"
                        }
                        onClick={() => setActiveChart("liquidity")}
                    >
                        Liquidity
                    </Button>
                    <Button
                        disabled={!maybeResult.isDefined}
                        variant={
                            activeChart === "volume" ? "primary" : "outline"
                        }
                        onClick={() => setActiveChart("volume")}
                    >
                        Volume
                    </Button>
                </div>

                <div className="flex gap-2">
                    <Button
                        disabled={!maybeResult.isDefined}
                        variant={
                            period === PERIOD.DAYS_7 ? "primary" : "outline"
                        }
                        onClick={() => setPeriod(PERIOD.DAYS_7)}
                    >
                        7 days
                    </Button>
                    <Button
                        disabled={!maybeResult.isDefined}
                        variant={
                            period === PERIOD.DAYS_30 ? "primary" : "outline"
                        }
                        onClick={() => setPeriod(PERIOD.DAYS_30)}
                    >
                        30 days
                    </Button>
                </div>
            </div>
            {chartData.match({
                None: () => {
                    return (
                        <div className="mt-8">
                            <Skeleton size={GRK_SIZES.LARGE} />
                        </div>
                    );
                },
                Some: (result) => {
                    if (errorMessage) {
                        return <p>{errorMessage}</p>;
                    }

                    if (activeChart === "liquidity") {
                        return (
                            <AreaChart
                                className="mt-2 p-2"
                                data={result}
                                index="date"
                                valueFormatter={prettifyCurrency}
                                yAxisWidth={100}
                                categories={[
                                    `${capitalizeFirstLetter(activeChart)} (USD)`,
                                ]}
                                colors={CHART_COLORS[theme.mode]}
                            />
                        );
                    } else if (activeChart === "volume") {
                        return (
                            <BarChart
                                className="mt-2 p-2"
                                data={result}
                                index="date"
                                valueFormatter={prettifyCurrency}
                                yAxisWidth={100}
                                categories={[
                                    `${capitalizeFirstLetter(activeChart)} (USD)`,
                                ]}
                                colors={CHART_COLORS[theme.mode]}
                            />
                        );
                    }
                },
            })}
        </Card>
    );
};
