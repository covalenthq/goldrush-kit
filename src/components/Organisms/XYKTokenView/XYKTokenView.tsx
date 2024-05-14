import { useGoldRush } from "@/utils/store";
import { type Option, Some, None } from "@/utils/option";
import { type XYKTokenViewProps } from "@/utils/types/organisms.types";
import { useEffect, useState } from "react";
import { XYKTokenDetails, XYKTokenTimeseries } from "@/components/Molecules";
import { type TokenV2VolumeWithChartData } from "@covalenthq/client-sdk";

export const XYKTokenView: React.FC<XYKTokenViewProps> = ({
    chain_name,
    dex_name,
    token_address,
}) => {
    const [maybeResult, setResult] =
        useState<Option<TokenV2VolumeWithChartData>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.XykService.getLpTokenView(
                        chain_name,
                        dex_name,
                        token_address
                    );
                setResult(new Some(data.items[0]));
                if (error.error) {
                    setErrorMessage(error.error_message);
                    throw error;
                }
            } catch (exception) {
                console.error(exception);
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
