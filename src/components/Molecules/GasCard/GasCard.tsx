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
import { Button } from "@/components/ui/button";

export const GasCard: React.FC<GasCardProps> = ({ chain_name }) => {
    const [isErc20, setIsErc20] = useState<boolean>(false);
    const [maybeResult, setMaybeResult] = useState<
        Option<{
            erc: GasPricesResponse;
            native: GasPricesResponse;
        } | null>
    >(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const [
                    { data: ercData, ...ercError },
                    { data: nativeData, ...nativeError },
                ] = await Promise.all([
                    covalentClient.BaseService.getGasPrices(
                        chain_name,
                        "erc20"
                    ),
                    await covalentClient.BaseService.getGasPrices(
                        chain_name,
                        "nativetokens"
                    ),
                ]);
                if (ercError.error) {
                    throw ercError;
                }
                if (nativeError.error) {
                    throw nativeError;
                }
                setMaybeResult(
                    new Some({
                        erc: ercData,
                        native: nativeData,
                    })
                );
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? defaultErrorMessage);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name]);

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
                    <div className="flex items-center justify-between">
                        <Skeleton size={GRK_SIZES.LARGE} />
                        <Skeleton size={GRK_SIZES.LARGE} />
                    </div>
                ),
                Some: (result) =>
                    result ? (
                        <div className="flex items-center justify-between">
                            <p className="text-lg">
                                Base Fee:{" "}
                                {Math.round(
                                    (Number(
                                        result?.[isErc20 ? "erc" : "native"]
                                            .base_fee
                                    ) ?? 0) / Math.pow(10, 9)
                                )}{" "}
                                Gwei ⛽
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    disabled={!maybeResult.isDefined}
                                    variant={isErc20 ? "primary" : "outline"}
                                    onClick={() => setIsErc20(true)}
                                    size={"sm"}
                                >
                                    ERC20
                                </Button>
                                <Button
                                    disabled={!maybeResult.isDefined}
                                    variant={!isErc20 ? "primary" : "outline"}
                                    onClick={() => setIsErc20(false)}
                                    size={"sm"}
                                >
                                    Native Tokens
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <></>
                    ),
            })}

            <div className="mt-4 flex flex-col items-center justify-between gap-4 md:flex-row">
                {maybeResult.match({
                    None: () =>
                        Array(3)
                            .fill(null)
                            .map(() => (
                                <div key={Math.random()}>
                                    <Skeleton size={GRK_SIZES.LARGE} />
                                </div>
                            )),
                    Some: (result) =>
                        errorMessage ? (
                            <p className="mt-4">{errorMessage}</p>
                        ) : result ? (
                            result[isErc20 ? "erc" : "native"].items
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
