import { type Color } from "@tremor/react";

export enum GRK_SIZES {
    LARGE = "lg",
    MEDIUM = "md",
    SMALL = "sm",
    EXTRA_SMALL = "xs",
    EXTRA_EXTRA_SMALL = "xxs",
}

export const CHART_COLORS: Color[] = [
    "slate",
    "violet",
    "indigo",
    "rose",
    "cyan",
    "amber",
    "lime",
    "orange",
    "fuchsia",
];

export const NFT_COLLECTIONS: { [collection_name: string]: string } = {
    BAYC: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
};

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

export enum CUSTOM_DATE_FORMAT {
    "8:02 PM" = "LT",
    "8:02:18 PM" = "LTS",
    "08/16/2018" = "L",
    "August 16, 2018" = "LL",
    "August 16, 2018 8:02 PM" = "lll",
    "Aug 16, 2018" = "ll",
    "Thu, Aug 16, 2018 8:02 PM" = "llll",
    "Aug 2018" = "MMMM YYYY",
    "8:02 PM August 16, 2018 " = "LT LL",
    "8:02 PM 08/16/2018 " = "LT L",
    "5/2/23" = "M/D/YY",
}

export enum PERIOD {
    DAYS_7 = 7,
    DAYS_30 = 30,
    DAYS_90 = 90,
}

export const POOL_TRANSACTION_MAP: Record<
    string,
    { name: string; color: "default" | "secondary" | "destructive" | "outline" }
> = {
    SWAP: {
        name: "SWAP",
        color: "secondary",
    },
    REMOVE_LIQUIDITY: {
        name: "REMOVE",
        color: "destructive",
    },
    ADD_LIQUIDITY: {
        name: "ADD",
        color: "default",
    },
};

export enum CURRENCY {
    USD,
    NATIVE,
}

export const allowedCacheChains = [
    "bsc-mainnet",
    "eth-mainnet",
    "bsc-testnet",
    "eth-sepolia",
    "gnosis-mainnet",
    "gnosis-testnet",
    "matic-mainnet",
    "matic-mumbai",
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
