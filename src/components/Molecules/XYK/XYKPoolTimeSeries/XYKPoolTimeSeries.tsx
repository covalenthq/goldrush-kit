import { type Option, None, Some } from "@/utils/option";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AreaChart, BarChart } from "@tremor/react";
import { rootColor, timestampParser } from "@/utils/functions";
import { TypographyH4 } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES, PERIOD } from "@/utils/constants/shared.constants";
import { CHART_COLORS } from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type XYKPoolTimeSeriesProps } from "@/utils/types/molecules.types";
import {
    prettifyCurrency,
    type PoolWithTimeseries,
} from "@covalenthq/client-sdk";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize";

export const XYKPoolTimeSeries: React.FC<XYKPoolTimeSeriesProps> = ({
    chain_name,
    dex_name,
    pool_address,
    pool_data,
    displayMetrics = "both",
}) => {
    const [maybeResult, setResult] = useState<Option<PoolWithTimeseries>>(None);
    const [chartData, setChartData] = useState<Option<any>>(None);
    const [period, setPeriod] = useState<PERIOD>(PERIOD.DAYS_7);
    const [timeSeries, setTimeSeries] = useState<string>(
        displayMetrics !== "both" ? displayMetrics : "liquidity"
    );
    const [chartColor, setColor] = useState<any>("");
    const { covalentClient } = useGoldRush();

    const handleChartData = () => {
        maybeResult.match({
            None: () => null,
            Some: (response: any) => {
                const chart_key = `${timeSeries}_timeseries_${period}d`;
                const value_key =
                    timeSeries === "price"
                        ? "price_of_token0_in_token1"
                        : `${timeSeries}_quote`;

                const result = response[chart_key].map((x: any) => {
                    const dt = timestampParser(x.dt, "DD MMM YY");
                    return {
                        date: dt,
                        [`${capitalizeFirstLetter(timeSeries)} (USD)`]:
                            x[value_key],
                    };
                });
                setChartData(new Some(result));
            },
        });
    };

    useEffect(() => {
        setColor(rootColor());
        if (pool_data) {
            setResult(new Some(pool_data));
            return;
        }
        (async () => {
            setResult(None);
            const response = await covalentClient.XykService.getPoolByAddress(
                chain_name,
                dex_name,
                pool_address
            );
            setResult(new Some(response.data.items[0]));
        })();
    }, [pool_data, dex_name, pool_address, chain_name, displayMetrics]);

    useEffect(() => {
        handleChartData();
    }, [maybeResult, period, timeSeries, displayMetrics]);

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
                        colors={chartColor ? [chartColor] : CHART_COLORS}
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
                        colors={chartColor ? [chartColor] : CHART_COLORS}
                    />
                </div>
            );
        },
    });

    return (
        <div className="min-h-[20rem] w-full rounded border p-4">
            <div className="pb-4">
                <TypographyH4>{`${capitalizeFirstLetter(
                    timeSeries
                )} (USD)`}</TypographyH4>
            </div>

            <div className="flex justify-between">
                {displayMetrics === "both" && (
                    <div className="flex gap-2">
                        <Button
                            disabled={!maybeResult.isDefined}
                            variant={
                                timeSeries === "liquidity"
                                    ? "accent"
                                    : "outline"
                            }
                            onClick={() => setTimeSeries("liquidity")}
                        >
                            Liquidity
                        </Button>
                        <Button
                            disabled={!maybeResult.isDefined}
                            variant={
                                timeSeries === "volume" ? "accent" : "outline"
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
                            period === PERIOD.DAYS_7 ? "accent" : "outline"
                        }
                        onClick={() => setPeriod(PERIOD.DAYS_7)}
                    >
                        7 days
                    </Button>
                    <Button
                        disabled={!maybeResult.isDefined}
                        variant={
                            period === PERIOD.DAYS_30 ? "accent" : "outline"
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
