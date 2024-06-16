import { type Option } from "@/utils/option";
import type {
    NftApprovalSpender,
    TokenSpenderItem,
} from "@covalenthq/client-sdk";
import {
    type BalanceItem,
    type Chain,
    type ChainActivityEvent,
    type ChainID,
    type ChainItem,
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
import { type ActionableType, type TransactionsProps } from "./shared.types";

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

export interface NFTApprovalListProps {
    chain_name: Chain;
    address: string;
    on_revoke_approval?: (
        spender: NftApprovalSpender,
        contract_address: string
    ) => void;
    actionable_spender?: (address: string) => ActionableType;
    actionable_token?: (address: string) => ActionableType;
}

export interface TokenApprovalListProps {
    chain_name: Chain;
    address: string;
    on_revoke_approval?: (
        spender: TokenSpenderItem,
        token_address: string
    ) => void;
    actionable_spender?: (address: string) => ActionableType;
    actionable_token?: (address: string) => ActionableType;
}

export interface BlockDetailsProps {
    chain_name: Chain;
    height: number;
}

export interface BlocksListProps {
    chain_name: Chain;
    page_size?: number;
    actionable_block?: (block_height: number) => ActionableType;
}

export interface LatestBlocksProps {
    chain_name: Chain;
    page_size?: number;
    actionable_block?: (block_height: number) => ActionableType;
}

export interface TransactionsListProps {
    chain_name: Chain;
    actionable_block?: (block_height: number) => ActionableType;
    actionable_transaction?: (tx_hash: string) => ActionableType;
    actionable_address?: (address: string) => ActionableType;
}

export interface LatestTransactionsProps {
    chain_name: Chain;
    actionable_transaction?: (address: string) => ActionableType;
    actionable_address?: (address: string) => ActionableType;
}

export interface LatestPriceProps {
    chain_name: Chain;
}

export interface GasCardProps {
    chain_name: Chain;
}

export interface AddressDetailsProps {
    address: string;
    chain_name: Chain;
    actionable_transaction?: (tx_hash: string) => ActionableType;
}

export interface ChainSelectorProps {
    chain_options?: (Chain | ChainID)[];
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
    actionable_contract?: (address: string) => ActionableType;
}

export interface AddressTransactionsProps extends Partial<TransactionsProps> {
    chain_name: Chain;
    address: string;
}

export interface BlockTransactionsProps extends Partial<TransactionsProps> {
    chain_name: Chain;
    block_height: number;
}

export interface XYKPoolTimeseriesProps {
    chain_name: Chain;
    dex_name: string;
    pool_address: string;
    maybeResult?: Option<PoolWithTimeseries | null> | null;
    errorMessage?: string | null;
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
    actionable_token?: (token_address: string) => ActionableType;
}

export interface TokenTransfersListProps {
    chain_name: Chain;
    address: string;
    contract_address: string;
    page_size?: number;
    actionable_from?: (address: string) => ActionableType;
    actionable_to?: (address: string) => ActionableType;
}

export interface CrossChainBalanceItem extends BalanceItem {
    chain_name: Chain;
}

export interface XYKPoolDetailsProps {
    pool_address: string;
    chain_name: Chain;
    dex_name: string;
    maybeResult?: Option<PoolWithTimeseries | null> | null;
    errorMessage?: string | null;
    actionable_token_0?: (address: string) => ActionableType;
    actionable_token_1?: (address: string) => ActionableType;
    actionable_address?: (address: string) => ActionableType;
}

export interface XYKPoolListProps {
    chain_name: Chain;
    dex_name: string;
    page_size?: number;
    actionable_pool?: (address: string) => ActionableType;
}

export interface XYKPoolTransactionsListProps {
    chain_name: Chain;
    dex_name: string;
    pool_address: string;
    actionable_transaction?: (address: string) => ActionableType;
    actionable_token_0?: (address: string) => ActionableType;
    actionable_token_1?: (address: string) => ActionableType;
}

export interface XYKTransactionsListProps {
    chain_name: Chain;
    dex_name: string;
    actionable_transaction?: (address: string) => ActionableType;
    actionable_token_0?: (address: string) => ActionableType;
    actionable_token_1?: (address: string) => ActionableType;
}

export interface XYKTokenDetailsProps {
    token_address: string;
    chain_name: Chain;
    dex_name: string;
    maybeResult?: Option<TokenV2VolumeWithChartData | null> | null;
    errorMessage?: string | null;
    actionable_address?: (address: string) => ActionableType;
}

export interface XYKTokenListProps {
    chain_name: Chain;
    dex_name: string;
    page_size?: number;
    actionable_address?: (address: string) => ActionableType;
}

export interface XYKTokenPoolListProps {
    chain_name: Chain;
    dex_name: string;
    token_address: string;
    actionable_pool?: (address: string) => ActionableType;
}

export interface XYKTimeseriesProps {
    chain_name: Chain;
    dex_name: string;
    maybeResult?: Option<UniswapLikeEcosystemCharts | null> | null;
    errorMessage?: string | null;
}

export interface XYKTokenTimeseriesProps {
    chain_name: Chain;
    dex_name: string;
    token_address: string;
    maybeResult?: Option<TokenV2VolumeWithChartData | null> | null;
    errorMessage?: string | null;
}

export interface XYKTokenTransactionsListProps {
    chain_name: Chain;
    dex_name: string;
    token_address: string;
    actionable_transaction?: (address: string) => ActionableType;
    actionable_token_0?: (address: string) => ActionableType;
    actionable_token_1?: (address: string) => ActionableType;
}

export interface XYKWalletDetailsProps {
    wallet_address: string;
    chain_name: Chain;
    dex_name: string;
}

export interface XYKWalletTransactionsListProps {
    chain_name: Chain;
    dex_name: string;
    wallet_address: string;
    actionable_transaction?: (address: string) => ActionableType;
    actionable_token_0?: (address: string) => ActionableType;
    actionable_token_1?: (address: string) => ActionableType;
}

export interface XYKWalletPoolListProps {
    chain_name: Chain;
    dex_name: string;
    wallet_address: string;
    actionable_pool?: (address: string) => ActionableType;
}

export interface XYKWalletPositionsListProps {
    chain_name: Chain;
    dex_name: string;
    wallet_address: string;
    actionable_pool?: (address: string) => ActionableType;
}

export interface TransactionDetailsProps {
    chain_name: Chain;
    tx_hash: string;
    actionable_block?: (block: number) => ActionableType;
    actionable_transaction?: (address: string) => ActionableType;
    actionable_from?: (address: string) => ActionableType;
    actionable_to?: (address: string) => ActionableType;
}

export type EventDetails = {
    heading: string;
    value: string;
    type: "address" | "text" | "timestamp";
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
    actionable_transaction?: (address: string) => ActionableType;
    actionable_from?: (address: string) => ActionableType;
    actionable_to?: (address: string) => ActionableType;
}
