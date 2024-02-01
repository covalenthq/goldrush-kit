import { useEffect, useState } from "react";
import { type GasCardProps } from "@/utils/types/molecules.types";
import { useCovalent } from "@/utils/store/Covalent";
import type { Option } from "@/utils/option";
import { None, Some } from "@/utils/option";
import type { GasPricesResponse, PriceItem } from "@covalenthq/client-sdk";
import { IconWrapper } from "@/components/Shared";

export const GasCard: React.FC<GasCardProps> = ({ chain_name, event_type }) => {
    const [maybeResult, setResult] = useState<Option<GasPricesResponse>>(None);
    const { covalentClient } = useCovalent();

    const handleGas = async () => {
        setResult(None);
        let response;
        try {
            response = await covalentClient.BaseService.getGasPrices(
                chain_name,
                event_type
            );
            setResult(new Some(response.data));
        } catch (error) {
            console.error(`Error fetching Gas for ${chain_name}:`, error);
        }
    };

    useEffect(() => {
        handleGas();
    }, []);

    return (
        <>
            <div className="flex w-full flex-col gap-4 rounded border p-4">
                <div className="flex flex-col  items-center justify-center gap-2 p-6">
                    <IconWrapper
                        icon_class_name="content_copy"
                        icon_size="text-7xl"
                        class_name="text-secondary dark:text-secondary"
                    />
                    <h2 className="text-xl ">Current Network Fee</h2>
                    <label className="text-base text-secondary">
                        Base Gee: 24.5 Gwei
                    </label>
                </div>
                <div className="flex w-full flex-col gap-6">
                    {maybeResult.match({
                        None: () => <>Loading</>,
                        Some: (result: any) => {
                            return result.items.map(
                                (o: PriceItem, i: number) => {
                                    return (
                                        <div
                                            className="flex justify-between "
                                            key={i}
                                        >
                                            <div className="flex gap-2">
                                                <IconWrapper
                                                    icon_class_name="content_copy"
                                                    icon_size="text-4xl"
                                                    class_name="text-secondary dark:text-secondary"
                                                />
                                                <div className="flex flex-col">
                                                    <label>24</label>
                                                    <label className="text-sm text-secondary">
                                                        {o.interval}
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                {/* <label>Low</label> */}
                                                <label className="text-sm text-secondary">
                                                    {o.pretty_total_gas_quote}
                                                </label>
                                            </div>
                                        </div>
                                    );
                                }
                            );
                        },
                    })}
                </div>
            </div>
        </>
    );
};
