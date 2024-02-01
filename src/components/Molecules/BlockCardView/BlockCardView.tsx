import { copyToClipboard, truncate } from "@/utils/functions";
import { useEffect, useState } from "react";
import { useToast } from "../../../utils/hooks/use-toast";
import { TokenAvatar } from "../../Atoms/TokenAvatar/TokenAvatar";
import { IconWrapper } from "../../Atoms/IconWrapper/IconWrapper";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type BlockCardViewProps } from "@/utils/types/molecules.types";
import { useCovalent } from "@/utils/store/Covalent";
import { type Transaction } from "@covalenthq/client-sdk";
import { type Option, Some, None } from "@/utils/option";
import { Skeleton } from "@/components/ui/skeleton";

export const BlockCardView: React.FC<BlockCardViewProps> = ({
    chain_name,
    block_height,
}) => {
    const [showCopy, setShowCopy] = useState(false);
    const { toast } = useToast();
    const [maybeResult, setResult] = useState<Option<Transaction[]>>(None);
    const { covalentClient, chains } = useCovalent();
    const chain = chains?.find((o) => o.name === chain_name.toString()) ?? null;

    const handleCopyClick = () => {
        toast({
            description: "Miner's address copied!",
        });
        setShowCopy(true);
        setTimeout(() => {
            setShowCopy(false);
        }, 3000);
    };

    const handleBlockHeight = async () => {
        setResult(None);
        let response;
        try {
            response =
                await covalentClient.TransactionService.getTransactionsForBlock(
                    chain_name,
                    block_height
                );
            setResult(new Some(response.data.items));
        } catch (error) {
            console.error(
                `Error fetching block height # ${block_height} for ${chain_name}:`,
                error
            );
        }
    };

    useEffect(() => {
        handleBlockHeight();
    }, [chain_name, block_height]);

    return maybeResult.match({
        None: () => <Skeleton size={GRK_SIZES.LARGE} />,
        Some: (block) => {
            return (
                <>
                    <div className="flex w-full items-center gap-x-4 rounded border p-2 md:max-w-[24rem] lg:max-w-[24rem]">
                        {chain ? (
                            <TokenAvatar
                                is_chain_logo
                                token_url={chain.logo_url}
                                size={GRK_SIZES.MEDIUM}
                            />
                        ) : (
                            <Skeleton size={GRK_SIZES.MEDIUM} />
                        )}
                        <div className="flex h-full flex-col justify-center">
                            <h2 className="text-base font-semibold text-muted-foreground">
                                {chain_name.toString()}
                            </h2>
                            {block.length > 0 ? (
                                <div>
                                    <div className="flex items-center gap-x-2">
                                        <IconWrapper
                                            icon_class_name="Height"
                                            icon_size="text-sm"
                                            class_name="text-secondary dark:text-secondary"
                                        />
                                        <p className="neo-text-white-dark text-base">
                                            {block_height.toString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <IconWrapper
                                            icon_class_name="Schedule"
                                            icon_size="text-sm"
                                            class_name="text-secondary dark:text-secondary"
                                        />
                                        <p className="neo-text-white-dark text-base">
                                            {block[0].block_signed_at.toUTCString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <IconWrapper
                                            icon_class_name="Construction"
                                            icon_size="text-sm"
                                            class_name="text-secondary dark:text-secondary"
                                        />
                                        <p className="neo-text-white-dark text-base">
                                            {truncate(block[0].miner_address)}
                                        </p>
                                        <div
                                            className="duration-400 h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-all"
                                            onClick={() =>
                                                copyToClipboard(
                                                    block[0].miner_address
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
                                    <div className="flex items-center gap-x-2">
                                        <IconWrapper
                                            icon_class_name="Functions"
                                            icon_size="text-sm"
                                            class_name="text-secondary dark:text-secondary"
                                        />
                                        <p className="neo-text-white-dark text-base">
                                            {block.length}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div>Missing block height information!</div>
                            )}
                        </div>
                    </div>
                </>
            );
        },
    });
};
