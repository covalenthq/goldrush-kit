import { useEffect, useMemo, useState } from "react";
import { type GasCardProps } from "@/utils/types/molecules.types";
import { useGoldRush } from "@/utils/store";
import type { Option } from "@/utils/option";
import { None, Some } from "@/utils/option";
import { type GasPricesResponse } from "@covalenthq/client-sdk";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";

export const GasCard: React.FC<GasCardProps> = ({ chain_name, event_type }) => {
    const [maybeResult, setResult] = useState<Option<GasPricesResponse>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.BaseService.getGasPrices(
                        chain_name,
                        event_type
                    );
                if (error.error) {
                    setErrorMessage(error.error_message);
                    throw error;
                }
                setResult(new Some(data));
            } catch (error) {
                console.error(error);
            }
        })();
    }, [chain_name, event_type]);

    const copy = useMemo<
        {
            logo: string;
            content: string;
        }[]
    >(
        () => [
            {
                logo: "🚴",
                content: "Low",
            },
            {
                logo: "🚗",
                content: "Normal",
            },
            {
                logo: "🚄",
                content: "High",
            },
        ],
        []
    );

    return (
        <div className="flex w-full flex-col gap-4 rounded border border-secondary-light p-2 dark:border-secondary-dark">
            {maybeResult.match({
                None: () => (
                    <div className="mx-auto">
                        <Skeleton size={GRK_SIZES.LARGE} />
                    </div>
                ),
                Some: ({ base_fee }) => (
                    <p className="text-center text-xl">
                        ⛽ Base Fee:{" "}
                        {Math.round((Number(base_fee) ?? 0) / Math.pow(10, 9))}{" "}
                        Gwei
                    </p>
                ),
            })}

            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
                {maybeResult.match({
                    None: () =>
                        Array(3)
                            .fill(null)
                            .map(() => (
                                <div key={Math.random()} className="mx-auto">
                                    <Skeleton size={GRK_SIZES.LARGE} />
                                </div>
                            )),
                    Some: ({ items }) =>
                        errorMessage ? (
                            <p className="mt-4">{errorMessage}</p>
                        ) : (
                            items
                                .sort(
                                    (a, b) =>
                                        parseInt(a.gas_price) -
                                        parseInt(b.gas_price)
                                )
                                .map(
                                    (
                                        {
                                            interval,
                                            gas_price,
                                            pretty_total_gas_quote,
                                        },
                                        i
                                    ) => (
                                        <div
                                            key={Math.random()}
                                            className="text-center"
                                        >
                                            <p className="text-3xl">
                                                {copy[i].logo}
                                            </p>
                                            <p className="mt-2">
                                                {copy[i].content}
                                            </p>

                                            <p>
                                                {Math.round(
                                                    parseInt(gas_price) /
                                                        Math.pow(10, 9)
                                                ).toFixed(0)}{" "}
                                                Gwei
                                                <span className="ml-1 text-sm text-secondary-light dark:text-secondary-dark">
                                                    ({pretty_total_gas_quote})
                                                </span>
                                            </p>

                                            <p className="text-sm text-secondary-light dark:text-secondary-dark">
                                                {interval}
                                            </p>
                                        </div>
                                    )
                                )
                        ),
                })}
            </div>
        </div>
    );
};
