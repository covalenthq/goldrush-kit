import {
    type Chain,
    type PoolWithTimeseries,
    type UniswapLikeEcosystemCharts,
    type TokenV2VolumeWithChartData,
} from "@covalenthq/client-sdk";

export interface AccountCardProps {
    name?: string;
    address: string;
    type?: "fingerprint" | "effigy" | "wallet";
}

export interface CollectionCardProps {
    chain_name: Chain;
    collection_address: string;
}

export interface NFTFloorPriceProps {
    chain_name: Chain;
    collection_address: string;
    token_id?: string;
}

export interface NFTSalesCountProps {
    chain_name: Chain;
    collection_address: string;
    token_id?: string;
}

export interface XYKPoolTimeSeriesProps {
    chain_name: Chain;
    dex_name: string;
    pool_address: string;
    pool_data?: PoolWithTimeseries;
    displayMetrics?: "both" | "liquidity" | "volume";
}

export interface NFTVolumeProps {
    chain_name: Chain;
    collection_address: string;
    token_id?: string;
}

export interface XYKOverviewTimeSeriesViewProps {
    chain_name: Chain;
    dex_name: string;
    overview_data?: UniswapLikeEcosystemCharts;
    displayMetrics?: "both" | "liquidity" | "volume";
}

export interface XYKTokenTimeSeriesViewProps {
    chain_name: Chain;
    dex_name: string;
    token_address: string;
    token_data?: TokenV2VolumeWithChartData;
    displayMetrics?: "both" | "liquidity" | "volume";
}
