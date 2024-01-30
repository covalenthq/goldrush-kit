import React, { useEffect } from "react";
import { type Option, Some, None } from "@/utils/option";
import { useCovalent } from "@/utils/store/Covalent";
import { copyToClipboard } from "@/utils/functions";
import {
    prettifyCurrency,
    type ExchangeTransaction,
} from "@covalenthq/client-sdk";
import { useState } from "react";
import { useToast } from "../../../../utils/hooks/use-toast";
import { IconWrapper } from "@/components/Shared";
import { type XYKWalletInformationProps } from "@/utils/types/molecules.types";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";

export const XYKWalletInformation: React.FC<XYKWalletInformationProps> = ({
    wallet_address,
    chain_name,
    dex_name,
    wallet_data,
}) => {
    const [maybeResult, setResult] =
        useState<Option<ExchangeTransaction[]>>(None);
    const { toast } = useToast();
    const { covalentClient } = useCovalent();

    const handlePoolInformation = async () => {
        setResult(None);
        let response;
        try {
            response =
                await covalentClient.XykService.getTransactionsForAccountAddress(
                    chain_name,
                    dex_name,
                    wallet_address
                );
            setResult(new Some(response.data.items));
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
                <div className="flex gap-2">
                    <h2 className="text-xl">{text}</h2>
                    {showCopy ? (
                        <IconWrapper
                            icon_class_name="done"
                            icon_size="text-sm"
                            class_name="text-secondary dark:text-secondary"
                        />
                    ) : (
                        copy && (
                            <IconWrapper
                                icon_class_name="content_copy"
                                icon_size="text-sm"
                                class_name="text-secondary dark:text-secondary cursor-pointer"
                                on_click={() => handleCopyClick()}
                            />
                        )
                    )}
                </div>
                <div className="text-md text-secondary">{label}</div>
            </div>
        );
    };

    useEffect(() => {
        if (wallet_data) {
            setResult(new Some(wallet_data));
            return;
        }
        handlePoolInformation();
    }, [dex_name, wallet_address, chain_name]);

    return (
        <>
            <div className="flex items-center rounded border p-4">
                {maybeResult.match({
                    None: () => {
                        return (
                            <div className="flex flex-grow items-center gap-x-8">
                                {[1, 2].map((o, i) => {
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
                        const sumOfValueQuotes = result
                            .filter((o) => o.act === "SWAP")
                            .reduce((acc, obj) => {
                                const valueQuote = obj.total_quote;
                                return acc + valueQuote;
                            }, 0);
                        return (
                            <div className="flex flex-grow flex-wrap items-center gap-8">
                                <InformationContainer
                                    label="Total Value Swapped"
                                    text={prettifyCurrency(sumOfValueQuotes)}
                                />
                                <InformationContainer
                                    label="Total Transactions"
                                    text={result.length.toString()}
                                />
                            </div>
                        );
                    },
                })}
            </div>
        </>
    );
};
