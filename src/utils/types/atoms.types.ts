import { type GRK_SIZES } from "../constants/shared.constants";

export interface AddressProps {
    address: string;
}

export interface AddressAvatarProps {
    address: string;
    type: "fingerprint" | "effigy" | "wallet" | "nft";
    size: GRK_SIZES;
    rounded?: boolean;
    fallback?: string;
    class_name?: string;
}

export interface BalancePriceDeltaProps {
    numerator: number;
    denominator: number;
}

export interface CopyImageProps {
    url: string;
}

export interface IconWrapperPropsType {
    class_name?: string;
    icon_class_name?: string;
    on_click?: (e?: React.MouseEvent<HTMLDivElement>) => void;
    icon_size?: string;
    icon_type?: string;
}

export interface NetPriceDeltaProps {
    numerator: number;
    denominator: number;
}

export interface TokenAvatarProps {
    token_url?: string | null;
    sub_url?: string | null;
    size: GRK_SIZES;
    is_chain_logo?: boolean;
    chain_color?: string | null;
}
