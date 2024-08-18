import { Address } from "..";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AvatarFingerprint from "@/static/avatar/avatar-fingerprint.svg";
import AvatarWallet from "@/static/avatar/avatar-wallet.svg";
import {
    ADDRESS_AVATAR_TYPE,
    GRK_SIZES,
} from "@/utils/constants/shared.constants";
import { stringToColor } from "@/utils/functions";
import { type AddressAvatarProps } from "@/utils/types/atoms.types";
import { useMemo } from "react";

export const AddressAvatar: React.FC<AddressAvatarProps> = ({
    address,
    type = ADDRESS_AVATAR_TYPE.FINGERPRINT,
    size = GRK_SIZES.SMALL,
    rounded = false,
    class_name = "",
    custom_avatar,
}) => {
    const SRC = useMemo<
        string | React.FunctionComponent<React.SVGAttributes<SVGElement>>
    >(() => {
        if (custom_avatar) {
            return custom_avatar;
        }
        switch (type) {
            case ADDRESS_AVATAR_TYPE.EFFIGY:
                return `https://effigy.im/a/${address}.png`;
            case ADDRESS_AVATAR_TYPE.WALLET:
                return AvatarWallet;
            case ADDRESS_AVATAR_TYPE.FINGERPRINT:
                return AvatarFingerprint;
        }
    }, [type, address, rounded, custom_avatar]);

    const SIZE_CLASS = useMemo<string>(() => {
        switch (size) {
            case GRK_SIZES.EXTRA_EXTRA_SMALL:
                return "w-6 h-6";
            case GRK_SIZES.EXTRA_SMALL:
                return "w-8 h-8";
            case GRK_SIZES.SMALL:
                return "w-10 h-10";
            case GRK_SIZES.MEDIUM:
                return "w-20 h-20";
            case GRK_SIZES.LARGE:
                return "w-24 h-24";
        }
    }, [size]);

    const BG_COLOR = useMemo<React.CSSProperties["backgroundColor"]>(
        () => stringToColor(address),
        [address]
    );

    return (
        <Avatar
            className={`${SIZE_CLASS} ${rounded ? "rounded-full" : "rounded"} ${
                class_name
            }`}
        >
            <AvatarImage
                style={{ backgroundColor: BG_COLOR }}
                src={SRC as string}
            />
            <AvatarFallback style={{ backgroundColor: BG_COLOR }}>
                <Address address={address} />
            </AvatarFallback>
        </Avatar>
    );
};
