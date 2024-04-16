import { copyToClipboard, truncate } from "@/utils/functions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { useToast } from "@/utils/hooks";
import { AddressAvatar } from "@/components/Atoms";
import { IconWrapper } from "@/components/Shared";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type CollectionCardProps } from "@/utils/types/molecules.types";
import { useGoldRush } from "@/utils/store";
import { type NftTokenContract } from "@covalenthq/client-sdk";
import { type Option, Some, None } from "@/utils/option";
import { Skeleton } from "@/components/ui/skeleton";

export const CollectionCard: React.FC<CollectionCardProps> = ({
    chain_name,
    collection_address,
}) => {
    const [showCopy, setShowCopy] = useState(false);
    const { toast } = useToast();
    const [maybeResult, setResult] = useState<Option<NftTokenContract[]>>(None);
    const { covalentClient } = useGoldRush();

    const handleCopyClick = () => {
        toast({
            description: "Address copied!",
        });
        setShowCopy(true);
        setTimeout(() => {
            setShowCopy(false);
        }, 3000);
    };

    const handleNftsToken = async () => {
        setResult(None);
        let response;
        try {
            response =
                await covalentClient.NftService.getTokenIdsForContractWithMetadataByPage(
                    chain_name,
                    collection_address
                );
            setResult(new Some(response.data.items));
        } catch (error) {
            console.error(`Error fetching nfts for ${chain_name}:`, error);
        }
    };

    useEffect(() => {
        handleNftsToken();
    }, [chain_name, collection_address]);

    return maybeResult.match({
        None: () => <Skeleton size={GRK_SIZES.LARGE} />,
        Some: (nfts) => {
            return (
                <div className="flex items-center gap-x-4 rounded border border-secondary-light p-2 dark:border-secondary-dark">
                    <AddressAvatar
                        type={"nft"}
                        address={nfts[0].nft_data?.external_data?.image_512}
                        rounded
                        size={GRK_SIZES.SMALL}
                    />
                    <div className="flex h-full flex-col justify-center">
                        <h2 className="text-base font-semibold text-primary-light dark:text-primary-dark">
                            {nfts[0].contract_name}
                        </h2>
                        <div className="flex items-center gap-x-2">
                            <p className="text-base">
                                {truncate(collection_address)}
                            </p>
                            <div
                                className="duration-400 h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-all"
                                onClick={() =>
                                    copyToClipboard(collection_address)
                                }
                            >
                                {showCopy ? (
                                    <IconWrapper
                                        icon_class_name="done"
                                        icon_size="text-sm"
                                        class_name="text-secondary-light dark:text-secondary-dark"
                                    />
                                ) : (
                                    <IconWrapper
                                        icon_class_name="content_copy"
                                        icon_size="text-sm"
                                        class_name="text-secondary-light dark:text-secondary-dark"
                                        on_click={() => handleCopyClick()}
                                    />
                                )}
                            </div>

                            <Dialog>
                                <DialogTrigger>
                                    <div className="h-5 w-5 items-center justify-center rounded-full">
                                        <IconWrapper
                                            icon_class_name="qr_code_2"
                                            icon_size="text-sm"
                                            class_name="text-secondary-light dark:text-secondary-dark"
                                        />
                                    </div>
                                </DialogTrigger>

                                <DialogContent className="flex aspect-square items-center justify-center rounded border-0 bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-50">
                                    <DialogHeader>
                                        <p className="pb-4 text-center text-lg font-semibold text-slate-900 dark:text-slate-50">
                                            QR Code
                                        </p>
                                    </DialogHeader>
                                    <div className="border-border dark:border-x-border-dark flex items-center justify-center rounded border-2 bg-white p-6">
                                        <QRCode
                                            value={collection_address}
                                            viewBox="0 0 30 30"
                                            className="bg-white"
                                        />
                                    </div>
                                    <p className="p-2 text-xs text-secondary-light dark:text-secondary-dark">
                                        {collection_address}
                                    </p>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            );
        },
    });
};
