import { type BalanceItem, type Chain } from "@covalenthq/client-sdk";

export interface NFTDetailsViewProps {
    chain_name: Chain;
    collection_address: string;
    token_id: string;
}

export interface XYKPoolDetailViewProps {
    chain_name: Chain;
    dex_name: string;
    pool_address: string;
}

export interface NFTWalletCollectionViewProps {
    chain_name: Chain;
    address: string;
}

export interface NFTWalletTokenListViewProps {
    chain_names: Chain[];
    address: string;
}

export interface NFTCollectionViewProps {
    chain_name: Chain;
    collection_address: string;
    page_size?: number;
}

export interface AddressActivityViewProps {
    address: string;
}

export interface TokenTransferMeta {
    chain_name: string;
    contract_ticker_symbol: string;
    logo_url: string;
}

export interface TokenTransfersListViewProps {
    chain_name: Chain;
    address: string;
    contract_address: string;
    page_size?: number;
}

export interface XYKPoolTransactionsListViewProps {
    chain_name: Chain;
    dex_name: string;
    pool_address: string;
    on_transaction_click?: Function;
    on_native_explorer_click?: Function;
    on_goldrush_receipt_click?: Function;
}

export interface XYKTokenTransactionsListViewProps {
    chain_name: Chain;
    dex_name: string;
    token_address: string;
    on_transaction_click?: Function;
    on_native_explorer_click?: Function;
    on_goldrush_receipt_click?: Function;
}

export interface XYKWalletTransactionsListViewProps {
    chain_name: Chain;
    dex_name: string;
    wallet_address: string;
    on_transaction_click?: Function;
    on_native_explorer_click?: Function;
    on_goldrush_receipt_click?: Function;
}

export interface TokenBalancesListViewProps {
    chain_names: Chain[];
    address: string;
    hide_small_balances?: boolean;
    mask_balances?: boolean;
    on_transfer_click?: Function;
}

export interface XYKTokenListViewProps {
    chain_name: Chain;
    dex_name: string;
    on_token_click: Function;
    page_size?: number;
}

export interface CrossChainBalanceItem extends BalanceItem {
    chain: Chain;
}

export interface XYKPoolListViewProps {
    chain_name: Chain;
    dex_name: string;
    on_pool_click?: Function;
    page_size?: number;
}

export interface XYKTokenPoolListViewProps {
    chain_name: Chain;
    dex_name: string;
    token_address: string;
    on_pool_click?: Function;
}

export interface XYKWalletPoolListViewProps {
    chain_name: Chain;
    dex_name: string;
    wallet_address: string;
    on_pool_click?: Function;
}

export interface XYKWalletPositionsListViewProps {
    chain_name: Chain;
    dex_name: string;
    wallet_address: string;
    on_pool_click?: Function;
}

export interface XYKTokenDetailViewProps {
    chain_name: Chain;
    dex_name: string;
    token_address: string;
}

export interface XYKOverviewTransactionsListViewProps {
    chain_name: Chain;
    dex_name: string;
    on_transaction_click?: Function;
    on_native_explorer_click?: Function;
    on_goldrush_receipt_click?: Function;
}

export interface TransactionReceiptViewProps {
    chain_name: Chain;
    tx_hash: string;
}

export interface AddressDetailsViewProps {
    address: string;
    chain_name: Chain;
}
