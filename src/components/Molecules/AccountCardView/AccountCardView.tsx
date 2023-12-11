import { copyToClipboard, truncate } from "@/utils/functions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { useState } from "react";
import { useToast } from "../../../utils/hooks/use-toast";
import { AddressAvatar } from "../../Atoms/AddressAvatar/AddressAvatar";
import { IconWrapper } from "../../Atoms/IconWrapper/IconWrapper";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type AccountCardViewProps } from "@/utils/types/molecules.types";

export const AccountCardView: React.FC<AccountCardViewProps> = ({
    address,
    type = "effigy",
    name = "Unnamed Wallet",
}) => {
    const [showCopy, setShowCopy] = useState(false);
    const { toast } = useToast();

    const handleCopyClick = () => {
        toast({
            description: "Address copied!",
        });
        setShowCopy(true);
        setTimeout(() => {
            setShowCopy(false);
        }, 3000);
    };

    return (
        <>
            <div className="flex w-full items-center gap-x-4 rounded border p-2 md:max-w-[18rem] lg:max-w-[18rem]">
                <AddressAvatar
                    type={type}
                    address={address}
                    rounded
                    size={GRK_SIZES.SMALL}
                />
                <div className="flex h-full flex-col justify-center">
                    <h2 className="text-base font-semibold text-muted-foreground">
                        {name}
                    </h2>
                    <div className="flex items-center gap-x-2  ">
                        <p className="neo-text-white-dark text-base">
                            {truncate(address)}
                        </p>
                        <div
                            className="duration-400 h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-all"
                            onClick={() => copyToClipboard(address)}
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
                                    on_click={() => handleCopyClick()}
                                />
                            )}
                        </div>
                        <div className="cursor-pointer">
                            <Dialog>
                                <DialogTrigger>
                                    <div className="h-5 w-5 items-center justify-center rounded-full">
                                        <IconWrapper
                                            icon_class_name="qr_code_2"
                                            icon_size="text-sm pt-1"
                                            class_name="text-secondary dark:text-secondary"
                                        />
                                    </div>
                                </DialogTrigger>

                                <DialogContent className="flex aspect-square items-center justify-center rounded border-0 bg-background text-text-color-900 dark:bg-background-dark/80 dark:text-text-color-50">
                                    <DialogHeader>
                                        <p className="pb-4 text-center text-lg font-semibold text-text-color-900 dark:text-text-color-50">
                                            QR Code
                                        </p>
                                    </DialogHeader>
                                    <div className="flex items-center justify-center rounded border-2 border-border bg-white p-6 dark:border-x-border-dark">
                                        <QRCode
                                            value={address}
                                            viewBox="0 0 30 30"
                                            className="bg-white"
                                        />
                                    </div>
                                    <p className="rounded bg-accent-foreground/20 p-2 text-xs text-text-color-500 dark:bg-accent-foreground/10">
                                        {address}
                                    </p>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
