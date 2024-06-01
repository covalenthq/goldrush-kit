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
import { Card } from "@/components/ui/card";

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
            logo: React.ReactNode;
            content: string;
        }[]
    >(
        () => [
            {
                logo: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        viewBox="0 -960 960 960"
                        width="40"
                        fill="currentColor"
                    >
                        <path d="M200-170q-80.77 0-135.38-54.62Q10-279.23 10-360q0-80 55.62-135.38 55.61-55.39 134.38-55.39 72.77 0 124.69 46.19 51.92 46.2 62.85 114.58h48.31l-78.93-220H290v-60h180v60h-48.62l20.93 59.23h214.31L594-723.08q-1.15-3.46-3.85-5.19Q587.46-730 584-730h-94v-60h94q22.54 0 40.73 12.27t26.04 33.58L721.08-552H760q78.77 0 134.38 55.62Q950-440.77 950-362q0 79.38-55.31 135.31-55.31 55.92-134.69 55.92-70.46 0-122.85-45.19-52.38-45.19-64.69-114.04H387.54q-10.93 69-63.96 114.5Q270.54-170 200-170m0-60q45.62 0 79.54-27.11 33.92-27.12 45.54-72.89H210v-60h115.08q-11.62-46.38-45.54-73.19T200-490q-55.23 0-92.62 37.38Q70-415.23 70-360q0 53.85 37.38 91.92Q144.77-230 200-230m301.08-160h71.38q4.23-25.31 16.96-53.96 12.74-28.66 35.97-46.81H463.38zM760-230q55.23 0 92.62-38.08Q890-306.15 890-360q0-55.23-37.38-92.62Q815.23-490 760-490q-5.46 0-9.31.19-3.84.19-8.54 1.35l40.77 108.31-56.77 21.07-38.76-108.31q-27.31 18.16-42.35 46.54Q630-392.46 630-360q0 53.85 37.38 91.92Q704.77-230 760-230m0-130" />
                    </svg>
                ),
                content: "Low",
            },
            {
                logo: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        viewBox="0 -960 960 960"
                        width="40"
                        fill="currentColor"
                    >
                        <path d="M247.31-236.16q-43.27 0-73.56-30.28-30.29-30.29-30.29-73.56H65v-340q0-24.75 17.63-42.37Q100.25-740 125-740h541.54L895-517.69V-340h-72.31q0 43.27-30.29 73.56-30.29 30.28-73.55 30.28-43.27 0-73.56-30.28Q615-296.73 615-340H351.15q0 43.07-30.28 73.46-30.29 30.38-73.56 30.38M585-548.46h189.23L638.08-680H585zm-230 0h170V-680H355zm-230 0h170V-680H125zM247.31-290q21 0 35.5-14.5t14.5-35.5-14.5-35.5-35.5-14.5-35.5 14.5-14.5 35.5 14.5 35.5 35.5 14.5m471.54 0q21 0 35.5-14.5t14.5-35.5-14.5-35.5-35.5-14.5-35.5 14.5-14.5 35.5 14.5 35.5 35.5 14.5M125-400h39.69q12.77-18 34.2-30.92 21.42-12.93 48.42-12.93t47.84 12.35Q316-419.15 329.92-400h306.31q12.77-18 34.19-30.92 21.43-12.93 48.43-12.93t47.84 12.35q20.85 12.35 34.77 31.5H835v-88.46H125zm710-88.46H125z" />
                    </svg>
                ),
                content: "Normal",
            },
            {
                logo: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        viewBox="0 -960 960 960"
                        width="40"
                        fill="currentColor"
                    >
                        <path d="m285.92-285.92-116.46-63.47 32.77-32.76 96.54 14 161-161-303.15-164.62 42.92-43.31 372 94.93 137.38-136.54q14.31-14.31 35-14.31t35 14.31 14.31 35.19q0 20.89-14.31 35.19L642.54-571.15l94.54 371.61-42.93 43.31-165-303.16-160.23 160.24 13.62 96.92-33.15 33.15z" />
                    </svg>
                ),
                content: "High",
            },
        ],
        []
    );

    return (
        <Card className="mt-4 flex w-full flex-col items-center justify-between gap-4 p-4 md:flex-row">
            {maybeResult.match({
                None: () => (
                    <>
                        {Array(5)
                            .fill(null)
                            .map(() => (
                                <div key={Math.random()}>
                                    <Skeleton size={GRK_SIZES.LARGE} />
                                </div>
                            ))}
                    </>
                ),
                Some: (result) =>
                    errorMessage ? (
                        <p>{errorMessage}</p>
                    ) : result ? (
                        <>
                            <div
                                key={Math.random()}
                                className="flex items-center gap-2"
                            >
                                <p className="text-4xl">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="40"
                                        viewBox="0 -960 960 960"
                                        width="40"
                                        fill="currentColor"
                                    >
                                        <path d="M180-140v-607.69Q180-778 201-799t51.31-21h215.38Q498-820 519-799t21 51.31v260h38.46q29.83 0 51.07 21.24t21.24 51.06v181.54q0 19.31 13.42 32.73 13.42 13.43 32.73 13.43t32.73-13.43q13.43-13.42 13.43-32.73v-280.3q-9 5.38-19 7.46-10 2.07-21 2.07-36.83 0-62.27-25.43-25.43-25.43-25.43-62.26 0-29.69 16.93-52.88 16.92-23.19 44.77-31.12l-90.16-90.15L620.46-800l142.61 140.16q13.47 13.46 20.58 31.19 7.12 17.73 7.12 36.34v358.46q0 39.42-27.2 66.63Q736.38-140 697-140q-39.39 0-66.66-27.22-27.26-27.21-27.26-66.63v-193.84q0-5.39-3.47-8.85-3.46-3.46-8.84-3.46H540v300zm60-410h240v-197.69q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46zm463.08-2.31q17 0 28.5-11.5t11.5-28.5-11.5-28.5-28.5-11.5-28.5 11.5-11.5 28.5 11.5 28.5 28.5 11.5M240-200h240v-290H240zm240 0H240z" />
                                    </svg>
                                </p>

                                <div>
                                    <p className="text-sm text-secondary-light dark:text-secondary-dark">
                                        Base Fee
                                    </p>

                                    <p className="text-lg">
                                        {Math.round(
                                            (Number(
                                                result?.[
                                                    isErc20 ? "erc" : "native"
                                                ].base_fee
                                            ) ?? 0) / Math.pow(10, 9)
                                        )}{" "}
                                        Gwei
                                    </p>
                                </div>
                            </div>

                            {result[isErc20 ? "erc" : "native"].items
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
                                            className="flex items-center gap-4"
                                        >
                                            <p className="text-4xl">
                                                {copy[i].logo}
                                            </p>

                                            <div>
                                                {copy[i].content}

                                                <p>
                                                    {Math.round(
                                                        parseInt(gas_price) /
                                                            Math.pow(10, 9)
                                                    ).toFixed(0)}{" "}
                                                    Gwei
                                                    <span className="ml-1 text-sm text-secondary-light dark:text-secondary-dark">
                                                        (
                                                        {pretty_total_gas_quote}
                                                        )
                                                    </span>
                                                </p>

                                                <p className="text-sm text-secondary-light dark:text-secondary-dark">
                                                    {interval}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )}

                            <div className="flex flex-col gap-2">
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
                        </>
                    ) : (
                        <></>
                    ),
            })}
        </Card>
    );
};
