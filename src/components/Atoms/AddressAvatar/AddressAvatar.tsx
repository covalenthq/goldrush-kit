import Fingerprint from "@/static/avatar/fingerprint.svg";
import WalletRound from "@/static/avatar/wallet-round.svg";
import WalletSquare from "@/static/avatar/wallet-square.svg";
import { stringToColor } from "@/utils/functions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { type AddressAvatarProps } from "@/utils/types/atoms.types";
import { useMemo } from "react";

export const AddressAvatar: React.FC<AddressAvatarProps> = ({
    address,
    type,
    size,
    fallback,
    rounded = false,
    class_name,
}) => {
    const SRC = useMemo<string>(() => {
        switch (type) {
            case "effigy":
                return `https://effigy.im/a/${address}.png`;

            case "fingerprint":
                return Fingerprint;

            case "wallet":
                return rounded ? WalletRound : WalletSquare;

            default:
                return Fingerprint;
        }
    }, [type, address, rounded]);

    const SIZE_CLASS = useMemo<string>(() => {
        switch (size) {
            case "xxs":
                return "w-6 h-6";
            case "xs":
                return "w-8 h-8";
            case "sm":
                return "w-10 h-10";
            case "md":
                return "w-20 h-20";
            case "lg":
                return "w-24 h-24";
            default:
                return "w-12 h-12";
        }
    }, [size]);

    const BG_COLOR = useMemo<React.CSSProperties>(
        () => ({
            backgroundColor: stringToColor(address),
        }),
        [address]
    );

    return (
        <Avatar
            className={`${SIZE_CLASS} ${rounded ? "rounded-full" : "rounded"} ${
                class_name || ""
            }`}
        >
            <AvatarImage style={BG_COLOR} src={SRC} />
            <AvatarFallback style={BG_COLOR}>{fallback}</AvatarFallback>
        </Avatar>
    );
};
