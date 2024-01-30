import {
    type Transaction,
    type Chain,
    type PoolWithTimeseries,
} from "@covalenthq/client-sdk";
import {
    type DECODED_ACTION,
    type DECODED_EVENT_CATEGORY,
} from "../constants/shared.constants";
import { type Option } from "@/utils/option";

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
}

export interface NFTVolumeViewProps {
    chain_name: Chain;
    collection_address: string;
    token_id?: string;
}

export interface DecodedTransactionProps {
    chain_name: Chain;
    tx_hash: string;
    setMetadata?: React.Dispatch<
        React.SetStateAction<Option<DecodedTransactionMetadata>>
    >;
}

export interface DecodedEventType {
    category: DECODED_EVENT_CATEGORY;
    action: DECODED_ACTION;
    name: string;
    protocol?: {
        name: string;
        logo: string;
    };
    tokens?: {
        heading: string;
        value: string;
        decimals: number;
        ticker_symbol: string | null;
        ticker_logo: string | null;
        pretty: string;
    }[];
    nfts?: {
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
    details?: {
        title: string;
        value: string;
    }[];
}

export type DecodedTransactionMetadata = Omit<
    Transaction,
    | "log_events"
    | "dex_details"
    | "nft_sale_details"
    | "lending_details"
    | "safe_details"
>;
