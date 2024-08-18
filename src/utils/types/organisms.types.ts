import { type ActionableType } from "./shared.types";
import { type Chain } from "@covalenthq/client-sdk";

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

export interface AddressDetailsViewProps {
    address: string;
    chain_name: Chain;
}
