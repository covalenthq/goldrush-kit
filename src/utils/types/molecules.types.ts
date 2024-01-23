import {
    type Chain,
    type PoolWithTimeseries,
    type UniswapLikeEcosystemCharts,
} from "@covalenthq/client-sdk";

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

export interface XYKPoolTimeSeriesViewProps {
    chain_name: Chain;
    dex_name: string;
    pool_address: string;
    pool_data?: PoolWithTimeseries;
    displayMetrics?: "both" | "liquidity" | "volume";
}

export interface NFTVolumeViewProps {
    chain_name: Chain;
    collection_address: string;
    token_id?: string;
}

export interface XYKOverviewLiquidityViewProps {
    chain_name: Chain;
    dex_name: string;
    pool_address: string;
    pool_data?: UniswapLikeEcosystemCharts;
    displayMetrics?: "both" | "liquidity" | "volume";
}
