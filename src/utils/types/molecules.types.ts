import { type Chain, type PoolWithTimeseries } from "@covalenthq/client-sdk";

export interface AccountCardViewProps {
    name?: string;
    address: string;
    type?: "fingerprint" | "effigy" | "wallet";
}

export interface CollectionCardViewProps {
    chain_name: Chain;
    collection_address: string;
}

export interface NFTFloorPriceViewProps {
    chain_name: Chain;
    collection_address: string;
    token_id?: string;
}

export interface NFTSalesCountViewProps {
    chain_name: Chain;
    collection_address: string;
    token_id?: string;
}

export interface NFTVolumeViewProps {
    chain_name: Chain;
    collection_address: string;
    token_id?: string;
}

export interface XYKPoolInformationViewProps {
    pool_address: string;
    chain_name: Chain;
    dex_name: string;
    pool_data?: PoolWithTimeseries;
}

export interface XYKTokenInformationViewProps {
    pool_address: string;
    chain_name: Chain;
    dex_name: string;
    pool_data?: PoolWithTimeseries;
}
