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
} from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type XYKTokenTimeSeriesProps } from "@/utils/types/molecules.types";
import {
    prettifyCurrency,
    type PriceTokenTimeseries,
    type TokenV2VolumeWithChartData,
} from "@covalenthq/client-sdk";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize";

export const XYKTokenTimeSeries: React.FC<XYKTokenTimeSeriesProps> = ({
    chain_name,
    dex_name,
    token_address,
    token_data,
    displayMetrics = "both",
}) => {
    const [maybeResult, setResult] =
        useState<Option<TokenV2VolumeWithChartData>>(None);
    const [chartData, setChartData] =
        useState<Option<{ [key: string]: string | number | Date }[]>>(None);
    const [period, setPeriod] = useState<PERIOD>(PERIOD.DAYS_7);
    const [timeSeries, setTimeSeries] = useState<string>(
        displayMetrics !== "both" ? displayMetrics : "liquidity"
    );
    const { covalentClient, theme } = useGoldRush();

    useEffect(() => {
        maybeResult.match({
            None: () => null,
            Some: (response) => {
                const chart_key = `${timeSeries}_timeseries_${period}d`;
                const value_key =
                    timeSeries === "price"
                        ? "price_of_token0_in_token1"
                        : `${timeSeries}_quote`;

                const result = (
                    response[
                        chart_key as keyof typeof response
                    ] as TokenV2VolumeWithChartData["price_timeseries_7d"]
                ).map((x) => {
                    const dt = timestampParser(x.dt, "DD MMM YY");
                    return {
                        date: dt,
                        [`${capitalizeFirstLetter(timeSeries)} (USD)`]:
                            x[value_key as keyof PriceTokenTimeseries],
                    };
                });
                setChartData(new Some(result));
            },
        });
    }, [maybeResult, period, timeSeries, displayMetrics]);

    useEffect(() => {
        if (token_data) {
            setResult(new Some(token_data));
            return;
        }
        (async () => {
            setResult(None);
            const response = await covalentClient.XykService.getLpTokenView(
                chain_name,
                dex_name,
                token_address
            );
            setResult(new Some(response.data.items[0]));
        })();
    }, [token_data, dex_name, token_address, chain_name, displayMetrics]);

    useEffect(() => {
        if (displayMetrics === "both") return;
        setTimeSeries(displayMetrics);
    }, [displayMetrics]);

    const body = chartData.match({
        None: () => {
            return (
                <div className="mt-8">
                    <Skeleton size={GRK_SIZES.LARGE} />
                </div>
            );
        },
        Some: (result) => {
            if (timeSeries === "liquidity") {
                return (
                    <AreaChart
                        className="mt-2 p-2"
                        data={result}
                        index="date"
                        valueFormatter={prettifyCurrency}
                        yAxisWidth={100}
                        categories={[
                            `${capitalizeFirstLetter(timeSeries)} (USD)`,
                        ]}
                        colors={CHART_COLORS[theme.mode]}
                    />
                );
            }
            return (
                <div>
                    <BarChart
                        className="mt-2 p-2"
                        data={result}
                        index="date"
                        valueFormatter={prettifyCurrency}
                        yAxisWidth={100}
                        categories={[
                            `${capitalizeFirstLetter(timeSeries)} (USD)`,
                        ]}
                        colors={CHART_COLORS[theme.mode]}
                    />
                </div>
            );
        },
    });

    return (
        <div className="min-h-80 w-full rounded border border-secondary-light p-4 dark:border-secondary-dark">
            <div className="pb-4">
                <Heading size={4}>
                    {`${capitalizeFirstLetter(timeSeries)} (USD)`}
                </Heading>
            </div>

            <div className="flex justify-between">
                {displayMetrics === "both" && (
                    <div className="flex gap-2">
                        <Button
                            disabled={!maybeResult.isDefined}
                            variant={
                                timeSeries === "liquidity"
                                    ? "primary"
                                    : "outline"
                            }
                            onClick={() => setTimeSeries("liquidity")}
                        >
                            Liquidity
                        </Button>
                        <Button
                            disabled={!maybeResult.isDefined}
                            variant={
                                timeSeries === "volume" ? "primary" : "outline"
                            }
                            onClick={() => setTimeSeries("volume")}
                        >
                            Volume
                        </Button>
                    </div>
                )}
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

            {body}
        </div>
    );
};
