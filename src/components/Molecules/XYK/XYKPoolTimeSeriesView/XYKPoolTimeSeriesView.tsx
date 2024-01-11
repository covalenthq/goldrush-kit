import { type Option, None, Some } from "@/utils/option";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart } from "@tremor/react";
import { rootColor, timestampParser } from "@/utils/functions";
import { TypographyH4 } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES, PERIOD } from "@/utils/constants/shared.constants";
import { CHART_COLORS } from "@/utils/constants/shared.constants";
import { useCovalent } from "@/utils/store/Covalent";
import { type XYKPoolTimeSeriesViewProps } from "@/utils/types/molecules.types";
import { prettifyCurrency } from "@covalenthq/client-sdk";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize";

export const XYKPoolTimeSeriesView: React.FC<XYKPoolTimeSeriesViewProps> = ({
    chain_name,
    dex_name,
    pool_address,
}) => {
    const [maybeResult, setResult] = useState<Option<any>>(None);
    const [chartData, setChartData] = useState<Option<any>>(None);
    const [period, setPeriod] = useState<PERIOD>(PERIOD.DAYS_7);
    const [timeSeries, setTimeSerious] = useState<string>("liquidity");
    const [chartColor, setColor] = useState<any>("");
    const { covalentClient } = useCovalent();

    const handleChartData = () => {
        maybeResult.match({
            None: () => null,
            Some: (response) => {
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
        (async () => {
            setResult(None);
            const response = await covalentClient.XykService.getPoolByAddress(
                chain_name,
                dex_name,
                pool_address
            );
            setColor(rootColor());
            setResult(new Some(response.data.items[0]));
        })();
    }, [chain_name, dex_name]);

    useEffect(() => {
        handleChartData();
    }, [maybeResult, period, timeSeries]);

    const body = chartData.match({
        None: () => {
            return (
                <div className="mt-8">
                    <Skeleton size={GRK_SIZES.LARGE} />
                </div>
            );
        },
        Some: (result) => {
            return (
                <div>
                    <BarChart
                        className="mt-2 p-2"
                        data={result}
                        index="date"
                        valueFormatter={prettifyCurrency}
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
                <div className="flex gap-2">
                    <Button
                        disabled={!maybeResult.isDefined}
                        variant={
                            timeSeries === "liquidity" ? "accent" : "outline"
                        }
                        onClick={() => setTimeSerious("liquidity")}
                    >
                        Liquidity
                    </Button>
                    <Button
                        disabled={!maybeResult.isDefined}
                        variant={timeSeries === "volume" ? "accent" : "outline"}
                        onClick={() => setTimeSerious("volume")}
                    >
                        Volume
                    </Button>
                    {/* <Button
                        disabled={!maybeResult.isDefined}
                        variant={timeSeries === "price" ? "accent" : "outline"}
                        onClick={() => setTimeSerious("price")}
                    >
                        Price
                    </Button> */}
                </div>
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
