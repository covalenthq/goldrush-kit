import { type Chain, type PoolWithTimeseries } from "@covalenthq/client-sdk";

export interface AccountCardProps {
    name?: string;
    address: string;
    type?: "fingerprint" | "effigy" | "wallet";
}

export interface CollectionCardProps {
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

export interface XYKPoolTimeSeriesViewProps {
    chain_name: Chain;
    dex_name: string;
    pool_address: string;
    pool_data?: PoolWithTimeseries;
}

export interface NFTVolumeViewProps {
    chain_name: Chain;
    collection_address: string;
    token_id?: string;
}
