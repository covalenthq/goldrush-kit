import { useEffect } from "react";
import { type Option, Some, None } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type TokenV2VolumeWithChartData } from "@covalenthq/client-sdk";
import { useState } from "react";
import { CardDetail } from "@/components/Shared";
import { type XYKTokenDetailsProps } from "@/utils/types/molecules.types";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type CardDetailProps } from "@/utils/types/shared.types";
import { Address } from "@/components/Atoms";

export const XYKTokenDetails: React.FC<XYKTokenDetailsProps> = ({
    chain_name,
    dex_name,
    token_address,
    token_data,
}) => {
    const [maybeResult, setResult] =
        useState<Option<TokenV2VolumeWithChartData>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        (async () => {
            if (token_data) {
                setResult(new Some(token_data));
                return;
            }

            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.XykService.getLpTokenView(
                        chain_name,
                        dex_name,
                        token_address
                    );
                if (error.error) {
                    setErrorMessage(error.error_message);
                    throw error;
                }
                setResult(new Some(data.items[0]));
            } catch (error) {
                console.error(error);
            }
        })();
    }, [chain_name, dex_name, token_address, token_data]);

    return (
        <Card className="grid w-full grid-cols-1 items-center gap-4 break-all p-2 md:grid-cols-2 lg:grid-cols-4">
            {maybeResult.match({
                None: () => (
                    <>
                        {Array(4)
                            .fill(null)
                            .map(() => (
                                <div key={Math.random()}>
                                    <Skeleton size={GRK_SIZES.LARGE} />
                                </div>
                            ))}
                    </>
                ),
                Some: ({ contract_ticker_symbol, contract_name, explorers }) =>
                    errorMessage ? (
                        <p className="col-span-4">{errorMessage}</p>
                    ) : (
                        <>
                            {(
                                [
                                    {
                                        heading: "SYMBOL",
                                        content: contract_ticker_symbol,
                                    },
                                    {
                                        heading: "NAME",
                                        content: contract_name,
                                    },
                                    {
                                        heading: "ADDRESS",
                                        content: (
                                            <Address address={token_address} />
                                        ),
                                    },
                                ] as CardDetailProps[]
                            ).map((props) => (
                                <CardDetail
                                    key={props.heading?.toString()}
                                    {...props}
                                />
                            ))}

                            <a
                                target="_blank"
                                href={explorers[0].url}
                                className="lg:mx-auto"
                            >
                                <Button>View on Explorer</Button>
                            </a>
                        </>
                    ),
            })}
        </Card>
    );
};
