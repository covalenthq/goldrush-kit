import { type Option, None, Some } from "@/utils/option";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart } from "@tremor/react";
import { timestampParser } from "@/utils/functions";
import { Heading } from "@/components/Shared";
import { Skeleton } from "@/components/ui/skeleton";
import {
    CHART_COLORS,
    GRK_SIZES,
    PERIOD,
} from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type NFTSalesCountProps } from "@/utils/types/molecules.types";

export const NFTSalesCount: React.FC<NFTSalesCountProps> = ({
    chain_name,
    collection_address,
}) => {
    const [maybeResult, setResult] = useState<
        Option<
            {
                date: string;
                "Sale Count": number;
            }[]
        >
    >(None);
    const [period, setPeriod] = useState<PERIOD>(PERIOD.DAYS_7);
    const { covalentClient, theme } = useGoldRush();

    useEffect(() => {
        (async () => {
            setResult(None);
            const response =
                await covalentClient.NftService.getNftMarketSaleCount(
                    chain_name,
                    collection_address,
                    { days: period }
                );

            setResult(
                new Some(
                    response.data.items.map((x) => {
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
                        colors={CHART_COLORS[theme.mode]}
                    />
                </div>
            );
        },
    });

    return (
        <div className="min-h-80 w-full rounded border border-secondary-light p-4 dark:border-secondary-dark">
            <div className="pb-4">
                <Heading size={4}>Sales History</Heading>
            </div>

            <div className="flex justify-between">
                <div className="flex gap-2"></div>
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
                    <Button
                        disabled={!maybeResult.isDefined}
                        variant={
                            period === PERIOD.DAYS_90 ? "primary" : "outline"
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
