import React, { useEffect } from "react";
import { type Option, Some, None } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { copyToClipboard, truncate } from "@/utils/functions";
import { type TokenV2VolumeWithChartData } from "@covalenthq/client-sdk";
import { useState } from "react";
import { useToast } from "../../../../utils/hooks";
import { IconWrapper } from "@/components/Shared";
import { type XYKTokenInformationProps } from "@/utils/types/molecules.types";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { Button } from "@/components/ui/button";

export const XYKTokenInformation: React.FC<XYKTokenInformationProps> = ({
    token_address,
    chain_name,
    dex_name,
    token_data,
}) => {
    const [maybeResult, setResult] =
        useState<Option<TokenV2VolumeWithChartData>>(None);
    const { toast } = useToast();
    const { covalentClient } = useGoldRush();

    const handlePoolInformation = async () => {
        setResult(None);
        let response;
        try {
            response = await covalentClient.XykService.getLpTokenView(
                chain_name,
                dex_name,
                token_address
            );
            setResult(new Some(response.data.items[0]));
        } catch (error) {
            console.error(`Error fetching token for ${chain_name}:`, error);
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
        if (token_data) {
            setResult(new Some(token_data));
            return;
        }
        handlePoolInformation();
    }, [dex_name, token_address, chain_name]);

    return (
        <>
            <div className="flex items-center rounded border border-secondary-light p-4 dark:border-secondary-dark">
                {maybeResult.match({
                    None: () => {
                        return (
                            <div className="flex flex-grow items-center gap-x-8">
                                {[1, 2, 3, 4].map((o, i) => {
                                    return (
                                        <Skeleton
                                            key={i}
                                            size={GRK_SIZES.LARGE}
                                        />
                                    );
                                })}
                            </div>
                        );
                    },
                    Some: (result) => {
                        return (
                            <div className="flex flex-grow flex-wrap items-center gap-8">
                                <InformationContainer
                                    label="Symbol"
                                    text={`${result.contract_ticker_symbol}`}
                                />
                                <InformationContainer
                                    label={"Name"}
                                    text={`${result.contract_name}`}
                                    copy
                                />
                                <InformationContainer
                                    label="Address"
                                    text={token_address}
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
        </>
    );
};
