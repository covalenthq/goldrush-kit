import type { ChainActivityEvent } from "@covalenthq/client-sdk";
import {
    type BalanceItem,
    type BlockTransactionWithContractTransfers,
    type Chain,
} from "@covalenthq/client-sdk";

export interface NFTDetailViewProps {
    chain_name: Chain;
    collection_address: string;
    token_id: string;
}

export interface NFTWalletCollectionViewProps {
    chain_name: Chain;
    address: string;
}

export interface NFTWalletTokenListViewProps {
    chain_names: Chain[];
    address: string;
}

export interface NFTCollectionTokenListViewProps {
    chain_name: Chain;
    collection_address: string;
    on_nft_click: Function;
}

export interface AddressActivityListViewProps {
    address: string;
    get_all_row_selection?: (newValue: ChainActivityEvent[]) => void;
    get_row_selection_state?: (selectionState: {
        [key: string]: boolean;
    }) => void;
    row_selection_state?: { [key: string]: boolean };
}

export interface TokenTransferMeta {
    chain_name: string;
    contract_ticker_symbol: string;
    logo_url: string;
}

export interface BlockTransactionWithContractTransfersWithDelta
    extends BlockTransactionWithContractTransfers {
    delta_quote: number;
    delta: bigint | null;
}

export interface TokenTransfersListViewProps {
    chain_name: Chain;
    address: string;
    contract_address: string;
}

export interface TokenBalancesListViewProps {
    chain_names: Chain[];
    address: string;
    hide_small_balances?: boolean;
    mask_balances?: boolean;
    on_transfer_click?: Function;
}

export interface XYKTokenListViewProps {
    chain: Chain;
    dex_name: string;
    on_token_click: Function;
}

export interface CrossChainBalanceItem extends BalanceItem {
    chain: Chain;
}
