import { useGoldRush } from "@/utils/store";
import { type Option, Some, None } from "@/utils/option";
import { type XYKPoolViewProps } from "@/utils/types/organisms.types";
import { useEffect, useState } from "react";
import { DEFAULT_ERROR_MESSAGE } from "@/utils/constants/shared.constants";
import { XYKPoolDetails, XYKPoolTimeseries } from "@/components/Molecules";
import { type PoolWithTimeseries } from "@covalenthq/client-sdk";
import { type CovalentAPIError } from "@/utils/types/shared.types";

export const XYKPoolView: React.FC<XYKPoolViewProps> = ({
    chain_name,
    dex_name,
    pool_address,
}) => {
    const [maybeResult, setMaybeResult] =
        useState<Option<PoolWithTimeseries | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.XykService.getPoolByAddress(
                        chain_name,
                        dex_name,
                        pool_address
                    );
                if (error.error) {
                    throw error;
                }
                setMaybeResult(new Some(data.items[0]));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, dex_name]);

    return (
        <div className="flex w-full flex-col gap-4">
            <XYKPoolDetails
                pool_address={pool_address}
                chain_name={chain_name}
                dex_name={dex_name}
                maybeResult={maybeResult}
                errorMessage={errorMessage}
            />

            <XYKPoolTimeseries
                chain_name={chain_name}
                dex_name={dex_name}
                pool_address={pool_address}
                maybeResult={maybeResult}
                errorMessage={errorMessage}
            />
        </div>
    );
};
