import React, { useEffect } from "react";
import { type Option, Some, None } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { copyToClipboard, truncate } from "@/utils/functions";
import { type PoolWithTimeseries } from "@covalenthq/client-sdk";
import { useState } from "react";
import { useToast } from "../../../../utils/hooks";
import { IconWrapper } from "@/components/Shared";
import { type XYKPoolInformationProps } from "@/utils/types/molecules.types";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { Button } from "@/components/ui/button";

export const XYKPoolInformation: React.FC<XYKPoolInformationProps> = ({
    pool_address,
    chain_name,
    dex_name,
    pool_data,
}) => {
    const [maybeResult, setResult] = useState<Option<PoolWithTimeseries>>(None);
    const { toast } = useToast();
    const { covalentClient } = useGoldRush();

    const handlePoolInformation = async () => {
        setResult(None);
        let response;
        try {
            response = await covalentClient.XykService.getPoolByAddress(
                chain_name,
                dex_name,
                pool_address
            );
            setResult(new Some(response.data.items[0]));
        } catch (error) {
            console.error(`Error fetching pool for ${chain_name}:`, error);
        }
    };

    const InformationContainer: React.FC<{
        label: string;
        text: string;
        copy?: boolean;
    }> = ({ label, text, copy = false }) => {
        const [showCopy, setShowCopy] = useState(false);

        const handleCopyClick = () => {
            toast({
                description: "Address copied!",
            });
            copyToClipboard(text);
            setShowCopy(true);
            setTimeout(() => {
                setShowCopy(false);
            }, 3000);
        };

        return (
            <div className="flex flex-col gap-1">
                <h2 className="text-md text-secondary-light dark:text-secondary-dark">
                    {label}
                </h2>
                <div className="flex gap-2">
                    {truncate(text)}
                    {showCopy ? (
                        <IconWrapper
                            icon_class_name="done"
                            icon_size="text-sm"
                            class_name="text-secondary-light dark:text-secondary-dark"
                        />
                    ) : (
                        copy && (
                            <IconWrapper
                                icon_class_name="content_copy"
                                icon_size="text-sm"
                                class_name="text-secondary-light dark:text-secondary-dark cursor-pointer"
                                on_click={() => handleCopyClick()}
                            />
                        )
                    )}
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (pool_data) {
            setResult(new Some(pool_data));
            return;
        }
        handlePoolInformation();
    }, [dex_name, pool_address, chain_name]);

    return (
        <div className="flex items-center rounded border border-secondary-light p-4 dark:border-secondary-dark">
            {maybeResult.match({
                None: () => {
                    return (
                        <div className="flex flex-grow items-center gap-x-8">
                            {[1, 2, 3, 4].map((o, i) => {
                                return (
                                    <Skeleton key={i} size={GRK_SIZES.LARGE} />
                                );
                            })}
                        </div>
                    );
                },
                Some: (result) => {
                    const token_0 = result.token_0;
                    const token_1 = result.token_1;

                    return (
                        <div className="flex flex-grow flex-wrap items-center gap-8">
                            <InformationContainer
                                label="Pair Name"
                                text={`${token_0.contract_ticker_symbol}-${result.token_1.contract_ticker_symbol}`}
                            />
                            <InformationContainer
                                label="Pair Address"
                                text={pool_address}
                                copy
                            />
                            <InformationContainer
                                label={`${token_0.contract_ticker_symbol} Address`}
                                text={token_0.contract_address}
                                copy
                            />
                            <InformationContainer
                                label={`${token_1.contract_ticker_symbol} Address`}
                                text={token_1.contract_address}
                                copy
                            />
                        </div>
                    );
                },
            })}
            {maybeResult.match({
                None: () => <Skeleton size={GRK_SIZES.LARGE} />,
                Some: (result) => (
                    <a target="_blank" href={result.explorers[0].url}>
                        <Button>View on Explorer</Button>
                    </a>
                ),
            })}
        </div>
    );
};
