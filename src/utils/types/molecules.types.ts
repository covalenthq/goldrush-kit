import {
    type Chain,
    type PoolWithTimeseries,
    type UniswapLikeEcosystemCharts,
    type TokenV2VolumeWithChartData,
    type ExchangeTransaction,
    type Transaction,
    type TransactionsSummary,
} from "@covalenthq/client-sdk";
import {
    type DECODED_ACTION,
    type DECODED_EVENT_CATEGORY,
} from "../constants/shared.constants";
import { type Option } from "@/utils/option";

export interface AccountCardProps {
    name?: string;
    address: string;
    type?: "fingerprint" | "effigy" | "wallet";
}

export interface GasCardProps {
    chain_name: Chain;
    event_type: string;
}

export interface AccountOverviewProps {
    address: string;
    chain_names: Chain[];
}

export interface AccountInfoProps {
    address: string;
    chain_names: Chain[];
}

export interface CrossChainTransactionsSummary extends TransactionsSummary {
    chain_name: Chain;
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

export interface TransactionListProps {
    chain_name: Chain;
    address: string;
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

export interface DecodedTransactionProps {
    chain_name: Chain;
    tx_hash: string;
    setMetadata?: React.Dispatch<
        React.SetStateAction<Option<DecodedTransactionMetadata>>
    >;
}

export type EventDetails = {
    title: string;
    value: string;
    type: "address" | "text";
}[];

export type EventNFTs = {
    heading: string;
    collection_name: string | null;
    token_identifier: string | null;
    collection_address: string;
    images: {
        default: string | null;
        256: string | null;
        512: string | null;
        1024: string | null;
    };
}[];

export type EventTokens = {
    heading: string;
    value: string;
    decimals: number;
    ticker_symbol: string | null;
    ticker_logo: string | null;
    pretty_quote: string;
}[];

export interface DecodedEventType {
    category: DECODED_EVENT_CATEGORY;
    action: DECODED_ACTION;
    name: string;
    protocol?: {
        name: string;
        logo: string;
    };
    tokens?: EventTokens;
    nfts?: EventNFTs;
    details?: EventDetails;
}

export type DecodedTransactionMetadata = Omit<
    Transaction,
    | "log_events"
    | "dex_details"
    | "nft_sale_details"
    | "lending_details"
    | "safe_details"
>;
