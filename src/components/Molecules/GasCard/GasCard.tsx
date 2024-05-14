import { useEffect, useMemo, useState } from "react";
import { type GasCardProps } from "@/utils/types/molecules.types";
import { useGoldRush } from "@/utils/store";
import type { Option } from "@/utils/option";
import { None, Some } from "@/utils/option";
import { type GasPricesResponse } from "@covalenthq/client-sdk";
import { Skeleton } from "@/components/ui/skeleton";
import {
    GRK_SIZES,
    defaultErrorMessage,
} from "@/utils/constants/shared.constants";
import { type CovalentAPIError } from "@/utils/types/shared.types";

export const GasCard: React.FC<GasCardProps> = ({ chain_name, event_type }) => {
    const [maybeResult, setMaybeResult] =
        useState<Option<GasPricesResponse | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.BaseService.getGasPrices(
                        chain_name,
                        event_type
                    );
                if (error.error) {
                    throw error;
                }
                setMaybeResult(new Some(data));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? defaultErrorMessage);
                setMaybeResult(new Some(null));
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
                Some: (result) =>
                    result ? (
                        <p className="text-center text-xl">
                            ⛽ Base Fee:{" "}
                            {Math.round(
                                (Number(result.base_fee) ?? 0) / Math.pow(10, 9)
                            )}{" "}
                            Gwei
                        </p>
                    ) : (
                        <></>
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
                    Some: (result) =>
                        errorMessage ? (
                            <p className="mt-4">{errorMessage}</p>
                        ) : result ? (
                            result.items
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
                        ) : (
                            <></>
                        ),
                })}
            </div>
        </div>
    );
};
