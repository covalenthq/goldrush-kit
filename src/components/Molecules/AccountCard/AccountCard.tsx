import { copyToClipboard, truncate } from "@/utils/functions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { useState } from "react";
import { useToast } from "../../../utils/hooks";
import { AddressAvatar } from "../../Atoms/AddressAvatar/AddressAvatar";
import { IconWrapper } from "../../Shared";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type AccountCardProps } from "@/utils/types/molecules.types";

export const AccountCard: React.FC<AccountCardProps> = ({
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
            <div className="flex w-fit items-center gap-x-4 rounded border p-2 md:max-w-72">
                <AddressAvatar
                    type={type}
                    address={address}
                    rounded
                    size={GRK_SIZES.SMALL}
                />
                <div className="flex h-full flex-col justify-center">
                    <h2 className="text-base font-semibold text-primary-light-200">
                        {name}
                    </h2>
                    <div className="flex items-center gap-x-2">
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
                        <div className="cursor-pointer">
                            <Dialog>
                                <DialogTrigger>
                                    <div className="h-5 w-5 items-center justify-center rounded-full">
                                        <IconWrapper
                                            icon_class_name="qr_code_2"
                                            icon_size="text-sm pt-1"
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
                                            value={address}
                                            viewBox="0 0 30 30"
                                            className="bg-white"
                                        />
                                    </div>
                                    <p className="bg-accent-foreground/20 dark:bg-accent-foreground/10 rounded p-2 text-xs text-slate-500">
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
