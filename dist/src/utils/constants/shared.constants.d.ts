import { type Color } from "@tremor/react";
export declare enum GRK_SIZES {
    LARGE = "lg",
    MEDIUM = "md",
    SMALL = "sm",
    EXTRA_SMALL = "xs",
    EXTRA_EXTRA_SMALL = "xxs"
}
export type GRK_NFT_SIZES = "lg" | "md" | "sm" | "default";
export type GRK_WALLET_TYPES = "effigy" | "fingerprint" | "wallet";
export declare const CHART_COLORS: Color[];
export declare const NFT_COLLECTIONS: {
    [collection_name: string]: string;
};
export declare enum TIME_SERIES_GROUP {
    LAST_24H = "Last 24 hours",
    LAST_7D = "Last 7 days",
    LAST_30D = "Last 30 days",
    EARLIER = "Earlier"
}
export declare const COLORS: {
    [name: string]: {
        "50": string;
        "100": string;
        "200": string;
        "300": string;
        "400": string;
        "500": string;
        "600": string;
        "700": string;
        "800": string;
        "900": string;
    };
};
export declare enum CUSTOM_DATE_FORMAT {
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
    "5/2/23" = "M/D/YY"
}
export declare enum PERIOD {
    DAYS_7 = 7,
    DAYS_30 = 30,
    DAYS_90 = 90
}
export declare const POOL_TRANSACTION_MAP: any;
export declare enum CURRENCY {
    USD = 0,
    NATIVE = 1
}
export declare const allowedCacheChains: string[];
//# sourceMappingURL=shared.constants.d.ts.map