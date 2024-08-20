import type { Chain } from "@covalenthq/client-sdk";
import { ChainID, ChainName } from "@covalenthq/client-sdk";

export const DEFAULT_ERROR_MESSAGE: string = "Something went wrong!";

export const DEFAULT_ERROR_NFT: string =
    "https://www.datocms-assets.com/86369/1685489960-nft.svg";

export enum ADDRESS_AVATAR_TYPE {
    FINGERPRINT = "fingerprint",
    EFFIGY = "effigy",
    WALLET = "wallet",
}

export enum GRK_SIZES {
    LARGE = "lg",
    MEDIUM = "md",
    SMALL = "sm",
    EXTRA_SMALL = "xs",
    EXTRA_EXTRA_SMALL = "xxs",
}

export enum TIME_SERIES_GROUP {
    LAST_24H = "Last 24 hours",
    LAST_7D = "Last 7 days",
    LAST_30D = "Last 30 days",
    EARLIER = "Earlier",
}

export enum SEARCH_RESULTS_TYPE {
    ADDRESS = "address",
    TRANSACTION = "tx",
    BLOCK = "block",
    TOKEN = "token",
    NOT_FOUND = "not found",
}

export enum PERIOD {
    DAYS_7 = 7,
    DAYS_30 = 30,
    DAYS_90 = 90,
}

export enum CURRENCY {
    USD,
    NATIVE,
}

export const ALLOWED_CACHE_CHAINS: Chain[] = [
    ChainName.BTC_MAINNET,
    ChainName.ETH_MAINNET,
    ChainName.BSC_TESTNET,
    ChainName.ETH_SEPOLIA,
    ChainName.GNOSIS_MAINNET,
    ChainName.GNOSIS_TESTNET,
    ChainName.MATIC_MAINNET,
    ChainName.MATIC_MUMBAI,

    ChainID.BTC_MAINNET,
    ChainID.ETH_MAINNET,
    ChainID.BSC_TESTNET,
    ChainID.ETH_SEPOLIA,
    ChainID.GNOSIS_MAINNET,
    ChainID.GNOSIS_TESTNET,
    ChainID.MATIC_MAINNET,
    ChainID.MATIC_MUMBAI,
];

export enum DECODED_EVENT_CATEGORY {
    NFT = "NFT Transaction",
    LENDING = "Lending",
    SAFE = "SAFE",
    DEX = "DEX",
    TOKEN = "Token",
    SWAP = "Swap",
    MINT = "Mint",
    DEFI = "DeFi",
    BRIDGE = "Bridge",
    GAMING = "Gaming",
    SOCIAL = "Social",
    OTHERS = "Others",
}

export enum DECODED_ACTION {
    SWAPPED = "Swapped",
    MULTISIG_ACTION = "MultiSig",
    APPROVAL = "Approval",
    TRANSFERRED = "Transferred",
    RECEIVED_BRIDGE = "Received Bridge",
    ACCOUNT_ABSTRACTION = "Account Abstraction Transaction",
}
