import { CardDetail } from "@/components/Shared";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type LatestPriceProps } from "@/utils/types/molecules.types";
import { type Price } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

export const LatestPrice: React.FC<LatestPriceProps> = ({ chain_name }) => {
    const { covalentClient } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [maybeResult, setResult] = useState<Option<Price>>(None);

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.PricingService.getTokenPrices(
                        chain_name,
                        "USD",
                        "0x0000000000000000000000000000000000000000"
                    );
                if (error.error) {
                    setErrorMessage(error.error_message);
                    throw error;
                }
                setResult(new Some(data[0].items[0]));
            } catch (error) {
                console.error(error);
            }
        })();
    }, [chain_name]);

    return (
        <Card className="flex w-full flex-col items-start gap-x-4 rounded border border-secondary-light p-2 dark:border-secondary-dark dark:bg-background-dark dark:text-white">
            {maybeResult.match({
                None: () => <Skeleton size={GRK_SIZES.LARGE} />,
                Some: ({
                    pretty_price,
                    contract_metadata: { contract_ticker_symbol },
                }) =>
                    errorMessage ? (
                        <p className="mt-4">{errorMessage}</p>
                    ) : (
                        <div className="w-full">
                            <CardDetail
                                heading={`${contract_ticker_symbol} PRICE`}
                                content={pretty_price}
                            />
                        </div>
                    ),
            })}
        </Card>
    );
};
