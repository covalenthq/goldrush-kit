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
import { type XYKPoolTimeseriesProps } from "@/utils/types/molecules.types";
import {
    prettifyCurrency,
    type PoolWithTimeseries,
    type LiquidityTimeseries,
} from "@covalenthq/client-sdk";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize";

export const XYKPoolTimeseries: React.FC<XYKPoolTimeseriesProps> = ({
    chain_name,
    dex_name,
    pool_address,
    pool_data,
    displayMetrics = "both",
}) => {
    const [maybeResult, setResult] = useState<Option<PoolWithTimeseries>>(None);
    const [chartData, setChartData] =
        useState<Option<{ [key: string]: string | number | Date }[]>>(None);
    const [period, setPeriod] = useState<PERIOD>(PERIOD.DAYS_7);
    const [timeseries, setTimeseries] = useState<string>(
        displayMetrics !== "both" ? displayMetrics : "liquidity"
    );
    const { covalentClient, theme } = useGoldRush();

    useEffect(() => {
        maybeResult.match({
            None: () => null,
            Some: (response) => {
                const chart_key = `${timeseries}_timeseries_${period}d`;
                const value_key =
                    timeseries === "price"
                        ? "price_of_token0_in_token1"
                        : `${timeseries}_quote`;

                const result = (
                    response[
                        chart_key as keyof typeof response
                    ] as PoolWithTimeseries["liquidity_timeseries_7d"]
                ).map((x) => {
                    const dt = timestampParser(x.dt, "DD MMM YY");
                    return {
                        date: dt,
                        [`${capitalizeFirstLetter(timeseries)} (USD)`]:
                            x[value_key as keyof LiquidityTimeseries],
                    };
                });
                setChartData(new Some(result));
            },
        });
    }, [maybeResult, period, timeseries, displayMetrics]);

    useEffect(() => {
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
        if (displayMetrics === "both") return;
        setTimeseries(displayMetrics);
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
            if (timeseries === "liquidity") {
                return (
                    <AreaChart
                        className="mt-2 p-2"
                        data={result}
                        index="date"
                        valueFormatter={prettifyCurrency}
                        yAxisWidth={100}
                        categories={[
                            `${capitalizeFirstLetter(timeseries)} (USD)`,
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
                            `${capitalizeFirstLetter(timeseries)} (USD)`,
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
                    {`${capitalizeFirstLetter(timeseries)} (USD)`}
                </Heading>
            </div>

            <div className="flex justify-between">
                {displayMetrics === "both" && (
                    <div className="flex gap-2">
                        <Button
                            disabled={!maybeResult.isDefined}
                            variant={
                                timeseries === "liquidity"
                                    ? "primary"
                                    : "outline"
                            }
                            onClick={() => setTimeseries("liquidity")}
                        >
                            Liquidity
                        </Button>
                        <Button
                            disabled={!maybeResult.isDefined}
                            variant={
                                timeseries === "volume" ? "primary" : "outline"
                            }
                            onClick={() => setTimeseries("volume")}
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
