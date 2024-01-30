import {
    type Chain,
    type PoolWithTimeseries,
    type UniswapLikeEcosystemCharts,
    type TokenV2VolumeWithChartData,
    type ExchangeTransaction,
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

export interface XYKPoolInformationProps {
    pool_address: string;
    chain_name: Chain;
    dex_name: string;
    pool_data?: PoolWithTimeseries;
}

export interface XYKTokenInformationProps {
    token_address: string;
    chain_name: Chain;
    dex_name: string;
    token_data?: TokenV2VolumeWithChartData;
}

export interface XYKOverviewTimeSeriesProps {
    chain_name: Chain;
    dex_name: string;
    overview_data?: UniswapLikeEcosystemCharts;
    displayMetrics?: "both" | "liquidity" | "volume";
}

export interface XYKTokenTimeSeriesProps {
    chain_name: Chain;
    dex_name: string;
    token_address: string;
    token_data?: TokenV2VolumeWithChartData;
    displayMetrics?: "both" | "liquidity" | "volume";
}

export interface XYKWalletInformationProps {
    wallet_address: string;
    chain_name: Chain;
    dex_name: string;
    wallet_data?: ExchangeTransaction[];
}
