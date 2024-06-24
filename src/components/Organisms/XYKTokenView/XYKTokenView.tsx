import { useGoldRush } from "@/utils/store";
import { type Option, Some, None } from "@/utils/option";
import { type XYKTokenViewProps } from "@/utils/types/organisms.types";
import { useEffect, useState } from "react";
import { XYKTokenDetails, XYKTokenTimeseries } from "@/components/Molecules";
import { type TokenV2VolumeWithChartData } from "@covalenthq/client-sdk";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { DEFAULT_ERROR_MESSAGE } from "@/utils/constants/shared.constants";

export const XYKTokenView: React.FC<XYKTokenViewProps> = ({
    chain_name,
    dex_name,
    token_address,
}) => {
    const [maybeResult, setMaybeResult] =
        useState<Option<TokenV2VolumeWithChartData | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.XykService.getLpTokenView(
                        chain_name,
                        dex_name,
                        token_address
                    );
                setMaybeResult(new Some(data.items[0]));
                if (error.error) {
                    throw error;
                }
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, dex_name, token_address]);

    return (
        <div className="flex w-full flex-col gap-4">
            <XYKTokenDetails
                chain_name={chain_name}
                dex_name={dex_name}
                token_address={token_address}
                maybeResult={maybeResult}
                errorMessage={errorMessage}
            />

            <XYKTokenTimeseries
                chain_name={chain_name}
                dex_name={dex_name}
                token_address={token_address}
                maybeResult={maybeResult}
                errorMessage={errorMessage}
            />
        </div>
    );
};
