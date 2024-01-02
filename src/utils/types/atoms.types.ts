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

export interface TokenAvatarProps {
    token_url?: string | null;
    sub_url?: string | null;
    size: GRK_SIZES;
    is_chain_logo?: boolean;
    chain_color?: string | null;
}
