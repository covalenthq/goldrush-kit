import { type Option, None, Some } from "@/utils/option";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LineChart } from "@tremor/react";
import { rootColor, timestampParser } from "@/utils/functions";
import { TypographyH4 } from "@/components/ui/typography";
import { calculatePrettyBalance, prettifyCurrency } from "@covalenthq/client-sdk";
import { Skeleton } from "@/components/ui/skeleton";
import {
    CURRENCY,
    GRK_SIZES,
    PERIOD,
} from "@/utils/constants/shared.constants";
import { CHART_COLORS } from "@/utils/constants/shared.constants";
import { useGoldrush } from "@/utils/store/Goldrush";
import { type NFTFloorPriceViewProps } from "@/utils/types/molecules.types";

export const NFTFloorPriceView: React.FC<NFTFloorPriceViewProps> = ({
    chain_name,
    collection_address,
}) => {
    const [maybeResult, setResult] = useState<Option<any[]>>(None);
    const [period, setPeriod] = useState<PERIOD>(PERIOD.DAYS_7);
    const [currency, setCurrency] = useState<CURRENCY>(CURRENCY.USD);
    const [nativeCurrency, setNativeCurrency] = useState<Option<string>>(None);
    const [chartColor, setColor] = useState<any>("");
    const { covalentClient } = useGoldrush();

    useEffect(() => {
        (async () => {
            setResult(None);

            const response =
                await covalentClient.NftService.getNftMarketFloorPrice(
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
                            [`Floor price (${x.native_ticker_symbol})`]:
                                calculatePrettyBalance(
                                    Number(x.floor_price_native_quote) *
                                        Math.pow(10, 18)
                                ),
                            "Floor price (USD)": x.floor_price_quote,
                            pretty_floor_price_quote:
                                x.pretty_floor_price_quote,
                        };
                    })
                )
            );

            setNativeCurrency(
                new Some(response.data.items[0].native_ticker_symbol)
            );
        })();
    }, [chain_name, collection_address, period, currency]);

    const body = maybeResult.match({
        None: () => {
            return (
                <div className="mt-4">
                    <Skeleton size={GRK_SIZES.LARGE} />
                </div>
            );
        },
        Some: (result) => {
            const floor_price_native =
                "Floor price (" +
                nativeCurrency.match({ None: () => "", Some: (n) => n }) +
                ")";
            return (
                <div>
                    <LineChart
                        className="mt-2 h-72 p-2"
                        data={result}
                        index="date"
                        valueFormatter={
                            currency === CURRENCY.USD
                                ? prettifyCurrency
                                : undefined
                        }
                        categories={[
                            currency === CURRENCY.USD
                                ? "Floor price (USD)"
                                : floor_price_native,
                        ]}
                        colors={chartColor ? [chartColor] : CHART_COLORS}
                        yAxisWidth={80}
                    />
                </div>
            );
        },
    });

    return (
        <div className="rounded border p-4">
            <div className="pb-4">
                <TypographyH4>Floor Price</TypographyH4>
            </div>

            <div className="flex justify-between">
                <div className="flex gap-2">
                    <Button
                        disabled={!maybeResult.isDefined}
                        variant={
                            currency === CURRENCY.USD ? "accent" : "outline"
                        }
                        onClick={() => setCurrency(CURRENCY.USD)}
                    >
                        USD
                    </Button>
                    {maybeResult.match({
                        None: () => (
                            <Button
                                variant={"outline"}
                                disabled={!maybeResult.isDefined}
                            >
                                ETH
                            </Button>
                        ),
                        Some: () => (
                            <Button
                                variant={
                                    currency === CURRENCY.NATIVE
                                        ? "accent"
                                        : "outline"
                                }
                                onClick={() => setCurrency(CURRENCY.NATIVE)}
                            >
                                {" "}
                                {nativeCurrency.match({
                                    None: () => "",
                                    Some: (n) => n,
                                })}{" "}
                            </Button>
                        ),
                    })}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={
                            period === PERIOD.DAYS_7 ? "accent" : "outline"
                        }
                        onClick={() => setPeriod(PERIOD.DAYS_7)}
                        disabled={!maybeResult.isDefined}
                    >
                        7 days
                    </Button>
                    <Button
                        variant={
                            period === PERIOD.DAYS_30 ? "accent" : "outline"
                        }
                        onClick={() => setPeriod(PERIOD.DAYS_30)}
                        disabled={!maybeResult.isDefined}
                    >
                        30 days
                    </Button>
                    <Button
                        variant={
                            period === PERIOD.DAYS_90 ? "accent" : "outline"
                        }
                        disabled={!maybeResult.isDefined}
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
