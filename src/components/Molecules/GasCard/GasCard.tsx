import { useEffect, useState } from "react";
import { type GasCardProps } from "@/utils/types/molecules.types";
import { useCovalent } from "@/utils/store/Covalent";
import type { Option } from "@/utils/option";
import { None, Some } from "@/utils/option";
import type { GasPricesResponse, PriceItem } from "@covalenthq/client-sdk";

export const GasCard: React.FC<GasCardProps> = ({ chain_name, event_type }) => {
    const [maybeResult, setResult] = useState<Option<GasPricesResponse>>(None);
    const [error, setError] = useState({ error: false, error_message: "" });
    const { covalentClient } = useCovalent();

    const handleGas = async () => {
        setResult(None);
        let response;
        try {
            response = await covalentClient.BaseService.getGasPrices(
                chain_name,
                event_type
            );
            if (response.error) {
                setError({
                    error: response ? response.error : false,
                    error_message: response ? response.error_message : "",
                });
                return;
            }
            setResult(new Some(response.data));
            setError({ error: false, error_message: "" });
        } catch (error) {
            setError({
                error: response ? response.error : false,
                error_message: response ? response.error_message : "",
            });
            console.error(`Error fetching Gas for ${chain_name}:`, error);
        }
    };

    useEffect(() => {
        handleGas();
    }, [chain_name, event_type]);

    return (
        <>
            <div className="flex w-full flex-col gap-4 rounded border">
                <div className="h-12 rounded-t bg-accent" />
                <div className="flex flex-col  items-center justify-center gap-2 p-4">
                    <span className="text-7xl">⛽</span>
                    <h2 className="text-xl">Current Network Fee</h2>
                    <label className="text-base text-secondary">
                        Base Fee: 24.5 Gwei
                    </label>
                </div>
                <div className="flex w-full flex-col gap-6 p-6">
                    {error && (
                        <div className="flex items-center justify-center">
                            {error.error_message}
                        </div>
                    )}
                    {!error &&
                        maybeResult.match({
                            None: () => <>Loading</>,
                            Some: (result: any) => {
                                console.log(result);
                                return result.items
                                    .sort(
                                        (
                                            a: { gas_price: string },
                                            b: { gas_price: string }
                                        ) =>
                                            parseInt(a.gas_price) -
                                            parseInt(b.gas_price)
                                    )
                                    .map((o: PriceItem, i: number) => {
                                        const gwei = Math.round(
                                            parseInt(o.gas_price) /
                                                Math.pow(10, 9)
                                        );
                                        return (
                                            <div
                                                className="flex justify-between "
                                                key={i}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="text-3xl">
                                                        {i === 0
                                                            ? "🚴"
                                                            : i === 1
                                                              ? "🚗"
                                                              : "🚄"}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <label>
                                                            {i === 0
                                                                ? "Low"
                                                                : i === 1
                                                                  ? "Normal"
                                                                  : "High"}
                                                        </label>
                                                        <label className="text-sm text-secondary">
                                                            {o.interval}
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <label>
                                                        {gwei.toFixed(0)} Gwei
                                                    </label>
                                                    <label className="text-sm text-secondary">
                                                        {
                                                            o.pretty_total_gas_quote
                                                        }
                                                    </label>
                                                </div>
                                            </div>
                                        );
                                    });
                            },
                        })}
                </div>
            </div>
        </>
    );
};
