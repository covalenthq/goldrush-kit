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
import { IconWrapper } from "../../Shared";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type GasCardProps } from "@/utils/types/molecules.types";

export const GasCard: React.FC<GasCardProps> = ({
    address,
    type = "effigy",
}) => {

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
                    
                </div>
            </div>
        </>
    );
};
