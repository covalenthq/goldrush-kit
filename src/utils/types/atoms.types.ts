import {
    type ADDRESS_AVATAR_TYPE,
    type GRK_SIZES,
} from "../constants/shared.constants";
import { type ActionableType } from "./shared.types";
import {
    type Chain,
    type NftCollectionAttribute,
} from "@covalenthq/client-sdk";

export interface AddressProps {
    address: string | null;
    label?: string | null;
    avatar?: Omit<AddressAvatarProps, "address">;
    actionable_address?: (address: string | null) => ActionableType;
}

export interface AddressCardProps {
    label?: string | null;
    address: string;
    avatar: Omit<AddressAvatarProps, "address">;
    show_qr_code?: boolean;
    actionable_address?: (address: string | null) => ActionableType;
}

export interface NFTProps {
    collection_name?: string | null;
    collection_address?: string | null;
    token_id?: string | number | bigint | null;
    src: string | null;
    attributes?: NftCollectionAttribute[];
    children?: React.ReactNode;
    chain_name?: Chain;
    actionable_contract?: (contract_address: string | null) => ActionableType;
}

export interface TimestampProps {
    timestamp: string | Date | null;
    defaultType?: "relative" | "descriptive";
    dynamic?: boolean;
}

export interface AddressAvatarProps {
    address: string;
    type?: ADDRESS_AVATAR_TYPE;
    size?: GRK_SIZES;
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
    actionable_pool?: (address: string | null) => ActionableType;
}

export interface TokenAvatarProps {
    primary_url?: string | null;
    secondary_url?: string | null;
    size: GRK_SIZES;
    only_primary?: boolean;
    chain_color?: string | null;
    rounded?: boolean;
    border?: boolean;
}
