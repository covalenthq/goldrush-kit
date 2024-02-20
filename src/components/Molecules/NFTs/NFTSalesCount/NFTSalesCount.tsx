import { type Option, None, Some } from "@/utils/option";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart } from "@tremor/react";
import { rootColor, timestampParser } from "@/utils/functions";
import { TypographyH4 } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES, PERIOD } from "@/utils/constants/shared.constants";
import { CHART_COLORS } from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type NFTSalesCountProps } from "@/utils/types/molecules.types";

export const NFTSalesCount: React.FC<NFTSalesCountProps> = ({
    chain_name,
    collection_address,
}) => {
    const [maybeResult, setResult] = useState<Option<any[]>>(None);
    const [period, setPeriod] = useState<PERIOD>(PERIOD.DAYS_7);
    const [chartColor, setColor] = useState<any>("");
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        (async () => {
            setResult(None);
            const response =
                await covalentClient.NftService.getNftMarketSaleCount(
                    chain_name,
                    collection_address,
                    { days: period }
                );
            setColor(rootColor());

            setResult(
                new Some(
                    response.data.items.map((x: any) => {
                        const dt = timestampParser(x.date, "DD MMM YY");
                        return {
                            date: dt,
                            "Sale Count": x.sale_count,
                        };
                    })
                )
            );
        })();
    }, [chain_name, collection_address, period]);

    const body = maybeResult.match({
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
                        categories={["Sale Count"]}
                        colors={chartColor ? [chartColor] : CHART_COLORS}
                    />
                </div>
            );
        },
    });

    return (
        <div className="min-h-[20rem] w-full rounded border p-4">
            <div className="pb-4">
                <TypographyH4>Sales History</TypographyH4>
            </div>

            <div className="flex justify-between">
                <div className="flex gap-2"></div>
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
                    <Button
                        disabled={!maybeResult.isDefined}
                        variant={
                            period === PERIOD.DAYS_90 ? "accent" : "outline"
                        }
                        onClick={() => setPeriod(PERIOD.DAYS_90)}
                    >
                        90 days
                    </Button>
                </div>
            </div>

            {body}
        </div>
    );
};
