import { Address, AddressAvatar } from "../../Atoms";
import { IconWrapper } from "@/components/Shared";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { type AddressCardProps } from "@/utils/types/atoms.types";
import QRCode from "react-qr-code";

export const AddressCard: React.FC<AddressCardProps> = ({
    address,
    avatar,
    label = "Unnamed Wallet",
    show_qr_code = true,
    actionable_address,
}) => {
    return (
        <Card className="flex items-center gap-x-2 p-2">
            <AddressAvatar {...avatar} address={address} />
            <div className="flex h-full flex-col justify-center">
                <h2 className="text-base font-semibold text-foreground-light dark:text-foreground-dark">
                    {label}
                </h2>
                <div className="flex gap-1">
                    <Address
                        address={address}
                        label={null}
                        actionable_address={actionable_address}
                    />
                    {show_qr_code && (
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

                            <DialogContent className="flex aspect-square flex-col items-center justify-center rounded border-0 bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-50">
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
                                <p className="p-2 text-xs text-secondary-light dark:text-secondary-dark">
                                    {address}
                                </p>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
        </Card>
    );
};
