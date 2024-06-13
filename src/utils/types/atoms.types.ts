import {
    type Chain,
    type NftCollectionAttribute,
} from "@covalenthq/client-sdk";
import { type GRK_SIZES } from "../constants/shared.constants";
import { type ActionableType } from "./shared.types";

export interface AddressProps {
    address: string;
    label?: string | null;
    show_copy_icon?: boolean;
    show_avatar?: boolean;
    actionable_address?: (address: string) => ActionableType;
}

export interface AddressCardProps {
    label?: string | null;
    address: string;
    type?: "fingerprint" | "effigy" | "wallet";
    show_copy_icon?: boolean;
    show_qr_code?: boolean;
    actionable_address?: (address: string) => ActionableType;
}

export interface NFTProps {
    collection_name?: string | null;
    token_id?: string | number | bigint | null;
    src: string | null;
    attributes?: NftCollectionAttribute[];
    children?: React.ReactNode;
    chain_name?: Chain;
}

export interface TimestampProps {
    timestamp: string | Date;
    defaultType?: "relative" | "descriptive";
    dynamic?: boolean;
}

export interface AddressAvatarProps {
    address: string;
    type: "fingerprint" | "effigy" | "wallet";
    size: GRK_SIZES;
    rounded?: boolean;
    class_name?: string;
    custom_avatar?: string;
}

export interface PoolProps {
    pool_address: string;
    token_0_ticker_symbol: string;
    token_1_ticker_symbol: string;
    token_0_logo_url: string;
    token_1_logo_url: string;
    actionable_pool?: (address: string) => ActionableType;
}

export interface TokenAvatarProps {
    primary_url?: string | null;
    secondary_url?: string | null;
    size: GRK_SIZES;
    only_primary?: boolean;
    chain_color?: string | null;
    rounded?: boolean;
}
