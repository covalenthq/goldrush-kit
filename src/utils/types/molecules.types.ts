import { type Option } from "@/utils/option";
import {
    BalanceItem,
    type Block,
    type Chain,
    type ChainActivityEvent,
    type ChainItem,
    type ExchangeTransaction,
    type NftTokenContractBalanceItem,
    type PoolWithTimeseries,
    type TokenV2VolumeWithChartData,
    type Transaction,
    type UniswapLikeEcosystemCharts,
} from "@covalenthq/client-sdk";
import {
    type DECODED_ACTION,
    type DECODED_EVENT_CATEGORY,
} from "../constants/shared.constants";
import { type TransactionsProps } from "./shared.types";

export interface AddressActivityDetailsProps {
    address: string;
    hide_no_activity?: boolean;
    maybeResult?: Option<ChainActivityEvent[] | null> | null;
    errorMessage?: string | null;
}

export interface AddressActivityListProps {
    address: string;
    maybeResult?: Option<ChainActivityEvent[] | null> | null;
    errorMessage?: string | null;
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

export interface NFTCollectionDetailsProps {
    chain_name: Chain;
    collection_address: string;
}

export interface NFTCollectionTokensListProps {
    chain_name: Chain;
    collection_address: string;
    page_size?: number;
}

export interface NFTDetailsProps {
    chain_name: Chain;
    collection_address: string;
    token_id: string;
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

export interface NFTWalletCollectionDetailsProps {
    chain_name: Chain;
    address: string;
    maybeResult?: Option<NftTokenContractBalanceItem[] | null> | null;
    errorMessage?: string | null;
}

export interface NFTWalletCollectionListProps {
    chain_name: Chain;
    address: string;
    maybeResult?: Option<NftTokenContractBalanceItem[] | null> | null;
    errorMessage?: string | null;
}

export interface AddressTransactionsProps {
    chain_name: Chain;
    address: string;
}

export interface BlockTransactionsProps extends TransactionsProps {
    chain_name: Chain;
    block_height: number;
}

export interface XYKPoolTimeseriesProps {
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

export interface TokenBalancesListProps {
    chain_names: Chain[];
    address: string;
    hide_small_balances?: boolean;
    mask_balances?: boolean;
}

export interface TokenTransfersListProps {
    chain_name: Chain;
    address: string;
    contract_address: string;
    page_size?: number;
}

export interface CrossChainBalanceItem extends BalanceItem {
    chain_name: Chain;
}

export interface XYKPoolDetailsProps {
    pool_address: string;
    chain_name: Chain;
    dex_name: string;
    pool_data?: PoolWithTimeseries | null;
}

export interface XYKTransactionsListProps {
    chain_name: Chain;
    dex_name: string;
}

export interface XYKTokenDetailsProps {
    token_address: string;
    chain_name: Chain;
    dex_name: string;
    token_data?: TokenV2VolumeWithChartData | null;
}

export interface XYKTimeseriesProps {
    chain_name: Chain;
    dex_name: string;
    overview_data?: UniswapLikeEcosystemCharts;
    displayMetrics?: "both" | "liquidity" | "volume";
}

export interface XYKTokenTimeseriesProps {
    chain_name: Chain;
    dex_name: string;
    token_address: string;
    token_data?: TokenV2VolumeWithChartData | null;
    displayMetrics?: "both" | "liquidity" | "volume";
}

export interface XYKWalletDetailsProps {
    wallet_address: string;
    chain_name: Chain;
    dex_name: string;
    wallet_data?: ExchangeTransaction[];
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

export interface DecodedTransactionType {
    success: boolean;
    message?: string;
    events?: DecodedEventType[];
    tx_metadata: DecodedTransactionMetadata | null;
}

export interface TransactionReceiptProps {
    chain_name: Chain;
    tx_hash: string;
}
