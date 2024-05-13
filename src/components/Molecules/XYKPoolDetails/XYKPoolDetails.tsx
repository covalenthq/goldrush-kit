import { useEffect } from "react";
import { type Option, Some, None } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type PoolWithTimeseries } from "@covalenthq/client-sdk";
import { useState } from "react";
import { CardDetail } from "@/components/Shared";
import { type XYKPoolDetailsProps } from "@/utils/types/molecules.types";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type CardDetailProps } from "@/utils/types/shared.types";
import { Address } from "@/components/Atoms";

export const XYKPoolDetails: React.FC<XYKPoolDetailsProps> = ({
    chain_name,
    dex_name,
    pool_address,
    pool_data,
}) => {
    const [maybeResult, setResult] = useState<Option<PoolWithTimeseries>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        (async () => {
            if (pool_data) {
                setResult(new Some(pool_data));
                return;
            }

            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.XykService.getPoolByAddress(
                        chain_name,
                        dex_name,
                        pool_address
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
    }, [chain_name, dex_name, pool_address, pool_data]);

    return (
        <Card className="grid w-full grid-cols-1 items-center gap-4 break-all p-2 md:grid-cols-2 lg:grid-cols-5">
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
                Some: ({ explorers, token_0, token_1 }) =>
                    errorMessage ? (
                        <p className="col-span-5">{errorMessage}</p>
                    ) : (
                        <>
                            {(
                                [
                                    {
                                        heading: "PAIR NAME",
                                        content: `${token_0.contract_ticker_symbol}-${token_1.contract_ticker_symbol}`,
                                    },
                                    {
                                        heading: "PAIR ADDRESS",
                                        content: (
                                            <Address address={pool_address} />
                                        ),
                                    },
                                    {
                                        heading: `${token_0.contract_ticker_symbol} ADDRESS`,
                                        content: (
                                            <Address
                                                address={
                                                    token_0.contract_address
                                                }
                                            />
                                        ),
                                    },
                                    {
                                        heading: `${token_1.contract_ticker_symbol} ADDRESS`,
                                        content: (
                                            <Address
                                                address={
                                                    token_1.contract_address
                                                }
                                            />
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
