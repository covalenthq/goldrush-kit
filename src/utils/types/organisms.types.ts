import { type ActionableType } from "./shared.types";
import { type Chain } from "@covalenthq/client-sdk";

export interface NFTDetailsViewProps {
    chain_name: Chain;
    collection_address: string;
    token_id: string;
}

export interface XYKPoolViewProps {
    chain_name: Chain;
    dex_name: string;
    pool_address: string;
    actionable_token_0?: (address: string) => ActionableType;
    actionable_token_1?: (address: string) => ActionableType;
    actionable_address?: (address: string) => ActionableType;
}

export interface NFTWalletCollectionViewProps {
    chain_name: Chain;
    address: string;
    actionable_address?: (address: string) => ActionableType;
}

export interface NFTWalletTokenListViewProps {
    chain_names: Chain[];
    address: string;
}

export interface NFTCollectionViewProps {
    chain_name: Chain;
    collection_address: string;
    page_size?: number;
    actionable_address?: (address: string) => ActionableType;
}

export interface AddressActivityViewProps {
    address: string;
    actionable_address?: (address: string) => ActionableType;
}

export interface XYKTokenViewProps {
    chain_name: Chain;
    dex_name: string;
    token_address: string;
}

export interface AddressDetailsViewProps {
    address: string;
    chain_name: Chain;
}
