import {
    type DECODED_ACTION,
    type DECODED_EVENT_CATEGORY,
} from "../constants/shared.constants";
import type {
    ActionableType,
    PaginationProps,
    TransactionsProps,
} from "./shared.types";
import { type Option } from "@/utils/option";
import type {
    GasPricesResponse,
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
    type Transaction,
} from "@covalenthq/client-sdk";

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
    changeSelectedChain?: boolean;
}

export interface NFTApprovalListProps {
    chain_name: Chain;
    address: string;
    on_revoke_approval?: (
        spender: NftApprovalSpender | null,
        contract_address: string | null,
    ) => void;
    actionable_spender?: (address: string | null) => ActionableType;
    actionable_token?: (address: string | null) => ActionableType;
}

export interface TokenApprovalListProps {
    chain_name: Chain;
    address: string;
    on_revoke_approval?: (
        spender: TokenSpenderItem | null,
        token_address: string | null,
    ) => void;
    actionable_spender?: (address: string | null) => ActionableType;
    actionable_token?: (address: string | null) => ActionableType;
}

export interface BlockDetailsProps {
    chain_name: Chain;
    height: number;
}

export interface BlocksListProps extends PaginationProps {
    chain_name: Chain;
    actionable_block?: (block_height: number | null) => ActionableType;
}

export interface LatestBlocksProps {
    chain_name: Chain;
    page_size?: number;
    actionable_block?: (block_height: number | null) => ActionableType;
    actionable_redirect?: () => ActionableType;
}

export interface TransactionsListProps extends Partial<TransactionsProps> {
    chain_name: Chain;
}

export interface LatestTransactionsProps {
    chain_name: Chain;
    actionable_transaction?: (address: string | null) => ActionableType;
    actionable_address?: (address: string | null) => ActionableType;
    actionable_redirect?: () => ActionableType;
}

export interface LatestPriceProps {
    chain_name: Chain;
}

export interface GasCardProps {
    chain_name: Chain;
}

export type GasCardData = {
    erc: GasPricesResponse;
    native: GasPricesResponse;
};

export interface AddressDetailsProps {
    address: string;
    chain_name: Chain;
    actionable_transaction?: (tx_hash: string | null) => ActionableType;
}

export interface ChainSelectorProps {
    chain_options?: (Chain | ChainID)[];
    onChangeChain?: (chain: ChainItem) => unknown;
}

export interface NFTCollectionTokensListProps {
    chain_name: Chain;
    collection_address: string;
    page_size?: number;
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
    actionable_contract?: (address: string | null) => ActionableType;
}

export interface AddressTransactionsProps extends Partial<TransactionsProps> {
    chain_name: Chain;
    address: string;
}

export interface BlockTransactionsProps extends Partial<TransactionsProps> {
    chain_name: Chain;
    block_height: number;
}

export interface TokenBalancesListProps {
    chain_names: Chain[];
    address: string;
    hide_small_balances?: boolean;
    mask_balances?: boolean;
    actionable_token?: (token_address: string | null) => ActionableType;
}

export interface TokenTransfersListProps {
    chain_name: Chain;
    address: string;
    contract_address: string;
    page_size?: number;
    actionable_from?: (address: string | null) => ActionableType;
    actionable_to?: (address: string | null) => ActionableType;
}

export interface CrossChainBalanceItem extends BalanceItem {
    chain_name: Chain;
}

export interface TransactionDetailsProps {
    chain_name: Chain;
    tx_hash: string;
    actionable_block?: (block: number | null) => ActionableType;
    actionable_transaction?: (address: string | null) => ActionableType;
    actionable_from?: (address: string | null) => ActionableType;
    actionable_to?: (address: string | null) => ActionableType;
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
    actionable_transaction?: (address: string | null) => ActionableType;
    actionable_address?: (address: string | null) => ActionableType;
}

export interface TransactionRawLogsProps {
    chain_name: Chain;
    tx_hash: string;
    actionable_address?: (address: string | null) => ActionableType;
}
