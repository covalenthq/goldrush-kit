import { type Option, None, Some } from "@/utils/option";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LineChart } from "@tremor/react";
import { timestampParser } from "@/utils/functions";
import { Heading } from "@/components/Shared";
import {
    calculatePrettyBalance,
    prettifyCurrency,
} from "@covalenthq/client-sdk";
import { Skeleton } from "@/components/ui/skeleton";
import {
    CHART_COLORS,
    CURRENCY,
    GRK_SIZES,
    PERIOD,
} from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type NFTFloorPriceProps } from "@/utils/types/molecules.types";

export const NFTFloorPrice: React.FC<NFTFloorPriceProps> = ({
    chain_name,
    collection_address,
}) => {
    const [maybeResult, setResult] = useState<
        Option<
            {
                date: string;
                [floor_price: `Floor price (${string})`]: number | string;
                pretty_floor_price_quote: string;
            }[]
        >
    >(None);
    const [period, setPeriod] = useState<PERIOD>(PERIOD.DAYS_7);
    const [currency, setCurrency] = useState<CURRENCY>(CURRENCY.USD);
    const [nativeCurrency, setNativeCurrency] = useState<Option<string>>(None);
    const { covalentClient, theme } = useGoldRush();

    useEffect(() => {
        (async () => {
            setResult(None);

            const response =
                await covalentClient.NftService.getNftMarketFloorPrice(
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
                        className="mt-2 p-2"
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
                        colors={CHART_COLORS[theme.mode]}
                        yAxisWidth={80}
                    />
                </div>
            );
        },
    });

    return (
        <div className="min-h-96 w-full rounded border border-secondary-light p-4 dark:border-secondary-dark">
            <div className="pb-4">
                <Heading size={4}>Floor Price</Heading>
            </div>

            <div className="flex justify-between">
                <div className="flex gap-2">
                    <Button
                        disabled={!maybeResult.isDefined}
                        variant={
                            currency === CURRENCY.USD ? "primary" : "outline"
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
                                        ? "primary"
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
                            period === PERIOD.DAYS_7 ? "primary" : "outline"
                        }
                        onClick={() => setPeriod(PERIOD.DAYS_7)}
                        disabled={!maybeResult.isDefined}
                    >
                        7 days
                    </Button>
                    <Button
                        variant={
                            period === PERIOD.DAYS_30 ? "primary" : "outline"
                        }
                        onClick={() => setPeriod(PERIOD.DAYS_30)}
                        disabled={!maybeResult.isDefined}
                    >
                        30 days
                    </Button>
                    <Button
                        variant={
                            period === PERIOD.DAYS_90 ? "primary" : "outline"
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
