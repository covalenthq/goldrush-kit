import { type Option } from "@/utils/option";
import {
    type Block,
    type Chain,
    type ChainItem,
    type ExchangeTransaction,
    type PoolWithTimeseries,
    type TokenV2VolumeWithChartData,
    type Transaction,
    type UniswapLikeEcosystemCharts,
} from "@covalenthq/client-sdk";
import {
    type DECODED_ACTION,
    type DECODED_EVENT_CATEGORY,
} from "../constants/shared.constants";

export interface AccountCardProps {
    name?: string;
    address: string;
    type?: "fingerprint" | "effigy" | "wallet";
}

export interface BlockDetailsProps {
    chain_name: Chain;
    height: number;
}

export interface LatestBlocksProps {
    chain_name: Chain;
    limit?: number;
    on_view_details?: (block: Block) => void;
}

export interface LatestPriceProps {
    chain_name: Chain;
}

export interface LatestTransactionsProps {
    chain_name: Chain;
    limit?: number;
    on_view_details?: (block: Transaction) => void;
}

export interface GasCardProps {
    chain_name: Chain;
    event_type: "erc20" | "nativetokens";
}

export interface AddressDetailsProps {
    address: string;
    chain_name: Chain;
}

export interface ChainSelectorProps {
    chain_options?: Chain[];
    onChangeChain?: (chain: ChainItem) => unknown;
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

export interface AddressTransactionsProps {
    chain_name: Chain;
    address: string;
    on_native_explorer_click?: Function;
    on_goldrush_receipt_click?: Function;
    on_transaction_click?: Function;
}

export interface BlockTransactionsProps {
    chain_name: Chain;
    block_height: number;
    on_native_explorer_click?: Function;
    on_goldrush_receipt_click?: Function;
    on_transaction_click?: Function;
}

export interface XYKPoolTimeSeriesProps {
    chain_name: Chain;
    dex_name: string;
    pool_address: string;
    pool_data?: PoolWithTimeseries | null;
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
    pool_data?: PoolWithTimeseries | null;
}

export interface XYKTokenInformationProps {
    token_address: string;
    chain_name: Chain;
    dex_name: string;
    token_data?: TokenV2VolumeWithChartData | null;
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
    token_data?: TokenV2VolumeWithChartData | null;
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
    setTxMetadata?: React.Dispatch<
        React.SetStateAction<Option<DecodedTransactionMetadata | null>>
    >;
}

export interface TransactionDetailsProps {
    chain_name: Chain;
    tx_hash: string;
}

export type EventDetails = {
    heading: string;
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
