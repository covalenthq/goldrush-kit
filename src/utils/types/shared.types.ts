import { type ChainItem, type CovalentClient } from "@covalenthq/client-sdk";

export interface BalancePriceDeltaProps {
    numerator: number;
    denominator: number;
}

export interface ChainsType {
    chains: ChainItem[] | null;
}

export interface ChainsProviderProps {
    children: React.ReactNode;
}

export interface CopyImageProps {
    url: string;
}

export interface CovalentContextType {
    covalentClient: CovalentClient;
}

export interface CovalentProviderProps {
    children: React.ReactNode;
    apikey: string;
}

export interface IconWrapperProps {
    class_name?: string;
    icon_class_name?: string;
    on_click?: (e?: React.MouseEvent<HTMLDivElement>) => void;
    icon_size?: string;
    icon_type?: string;
}

export type ThemeColors = Partial<{
    surface_color: {
        light: string;
        dark: string;
    };
    border_radius: string;
    background_color: {
        light: string;
        dark: string;
    };
    border_color: {
        light: string;
        dark: string;
    };
    secondary_color: {
        light: string;
        dark: string;
    };
}>;

export interface ThemeContextType {
    changeAccent: (accent_color: string) => void;
    changeBorderRadius: (border_radius: string) => void;
    changeMode: (mode: "dark" | "light") => void;
    changeStyle: (style: "classic" | "neo") => void;
}

export interface ThemeProviderProps {
    children: React.ReactNode;
    theme: Partial<{
        mode: "dark" | "light";
        style: "classic" | "neo";
        border_radius: "none" | "small" | "medium" | "large" | "full";
        accent:
            | "slate"
            | "stone"
            | "red"
            | "orange"
            | "amber"
            | "yellow"
            | "lime"
            | "green"
            | "emerald"
            | "cyan"
            | "sky"
            | "blue"
            | "indigo"
            | "violet"
            | "purple"
            | "fuchsia"
            | "pink"
            | "rose";
    }>;
}
