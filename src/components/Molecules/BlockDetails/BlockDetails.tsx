import { copyToClipboard, truncate } from "@/utils/functions";
import { useEffect, useState } from "react";
import { type BlockDetailsProps } from "@/utils/types/molecules.types";
import { useCovalent } from "@/utils/store/Covalent";
import { useToast } from "../../../utils/hooks/use-toast";
import { type Transaction } from "@covalenthq/client-sdk";
import { type Option, Some, None } from "@/utils/option";
import { IconWrapper } from "../../Atoms/IconWrapper/IconWrapper";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { TokenAvatar } from "@/components/Atoms/TokenAvatar/TokenAvatar";
import { Skeleton } from "@/components/ui/skeleton";

export const BlockDetails: React.FC<BlockDetailsProps> = ({
    chain_name,
    block_id,
    icon_url
}) => {
    const [maybeResult, setResult] = useState<Option<Transaction[]>>(None);
    const { covalentClient } = useCovalent();
    const [showCopy, setShowCopy] = useState(false);
    const [showCopyMiner, setShowCopyMiner] = useState(false);
    const { toast } = useToast();
    const handleCopyClick = () => {
        toast({
            description: "Blockhash copied!",
        });
        setShowCopy(true);
        setTimeout(() => {
            setShowCopy(false);
        }, 3000);
    };
    const handleCopyClickMiner = () => {
        toast({
            description: "Miner Address copied!",
        });
        setShowCopyMiner(true);
        setTimeout(() => {
            setShowCopyMiner(false);
        }, 3000);
    };
    const fetchBlockData = async () => {
        setResult(None);
        let response;
        try {
            response =
                await covalentClient.TransactionService.getTransactionsForBlock(
                    chain_name,
                    block_id,
                    { quoteCurrency: "USD", noLogs: true, withSafe: false }
                );
            setResult(new Some(response?.data?.items));
        } catch (error) {
            console.error(
                `Error fetching block data for ${chain_name}:`,
                error
            );
        }
    };

    useEffect(() => {
        fetchBlockData();
    }, [chain_name, block_id]);

    return (
        <>
            <div className="flex w-full items-center gap-x-4 rounded border p-2 md:max-w-[18rem] lg:max-w-[18rem]">
                <TokenAvatar
                    is_chain_logo={false}
                    token_url={icon_url}
                    size={GRK_SIZES.MEDIUM}
                />
                <div className="flex h-full flex-col justify-center">
                    <h2 className="text-base font-semibold text-muted-foreground">
                        {block_id.toString()}
                    </h2>
                    <div className="flex h-full flex-col justify-center">
                        {maybeResult.match({
                            None: () => {
                                return <Skeleton size={GRK_SIZES.MEDIUM} />;
                            },
                            Some: (data) => {
                                if (data?.at(0)) {
                                    return (
                                        <>
                                            <div className="flex items-center gap-x-2  ">
                                                <IconWrapper
                                                    icon_class_name="tag"
                                                    icon_size="text-sm"
                                                    class_name="text-secondary dark:text-secondary"
                                                />
                                                {truncate(data[0].block_hash)}
                                                <div
                                                    className="duration-400 h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-all"
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            data[0].block_hash
                                                        )
                                                    }
                                                >
                                                    {showCopy ? (
                                                        <IconWrapper
                                                            icon_class_name="done"
                                                            icon_size="text-sm"
                                                            class_name="text-secondary dark:text-secondary"
                                                        />
                                                    ) : (
                                                        <IconWrapper
                                                            icon_class_name="content_copy"
                                                            icon_size="text-sm"
                                                            class_name="text-secondary dark:text-secondary"
                                                            on_click={() =>
                                                                handleCopyClick()
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-x-2  ">
                                                <IconWrapper
                                                    icon_class_name="calendar_month"
                                                    icon_size="text-sm"
                                                    class_name="text-secondary dark:text-secondary"
                                                />
                                                {data[0].block_signed_at
                                                    .toISOString()
                                                    .slice(0, 10)}
                                            </div>
                                            <div className="flex items-center gap-x-2  ">
                                                <IconWrapper
                                                    icon_class_name="accessibility"
                                                    icon_size="text-sm"
                                                    class_name="text-secondary dark:text-secondary"
                                                />
                                                {truncate(
                                                    data[0].miner_address
                                                )}
                                                <div
                                                    className="duration-400 h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-all"
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            data[0]
                                                                .miner_address
                                                        )
                                                    }
                                                >
                                                    {showCopyMiner ? (
                                                        <IconWrapper
                                                            icon_class_name="done"
                                                            icon_size="text-sm"
                                                            class_name="text-secondary dark:text-secondary"
                                                        />
                                                    ) : (
                                                        <IconWrapper
                                                            icon_class_name="content_copy"
                                                            icon_size="text-sm"
                                                            class_name="text-secondary dark:text-secondary"
                                                            on_click={() =>
                                                                handleCopyClickMiner()
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-x-2  ">
                                                <IconWrapper
                                                    icon_class_name="123"
                                                    icon_size="text-sm"
                                                    class_name="text-secondary dark:text-secondary"
                                                />
                                                {data.length}
                                            </div>
                                        </>
                                    );
                                } else {
                                    return <>No Data</>;
                                }
                            },
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};
