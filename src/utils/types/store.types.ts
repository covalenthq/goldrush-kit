import { type ChainItem, type CovalentClient } from "@covalenthq/client-sdk";
import { type SEARCH_RESULTS_TYPE } from "../constants/shared.constants";

export interface GoldRushContextType {
    apikey: string;
    covalentClient: CovalentClient;
    chains: ChainItem[] | null;
    selectedChain: ChainItem | null;
    theme: GoldRushThemeType;
    setSelectedChain: React.Dispatch<React.SetStateAction<ChainItem | null>>;
    updateThemeHandler: (newTheme: Partial<GoldRushThemeType>) => void;
    resetThemeHandler: () => void;
    searchHandler: (searchInput: string) => SEARCH_RESULTS_TYPE;
}

export interface GoldRushThemePrimaryShades {
    DEFAULT: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
}

export interface GoldRushThemePrimaryType {
    dark: GoldRushThemePrimaryShades;
    light: GoldRushThemePrimaryShades;
}

export interface GoldRushThemeColorType {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
}

export interface GoldRushThemeType {
    mode: "dark" | "light";
    style: "classic" | "neo";
    borderRadius: number;
    colors: Partial<{
        dark: Partial<GoldRushThemeColorType>;
        light: Partial<GoldRushThemeColorType>;
    }>;
}

export interface GoldRushProviderProps {
    children: React.ReactNode;
    apikey: string;
    newTheme?: Partial<GoldRushThemeType>;
    /**
     * @deprecated `mode` is deprecated as support will be removed in the upcoming releases. Use `newTheme.mode` instead.
     */
    mode?: "dark" | "light";
    /**
     * @deprecated `theme` is deprecated as support will be removed in the upcoming releases. Use `newTheme.style` instead.
     */
    theme?: "classic" | "neo";
    /**
     * @deprecated `border_radius` is deprecated as support will be removed in the upcoming releases. Use `newTheme.borderRadius` instead.
     */
    border_radius?: "none" | "small" | "medium" | "large" | "full";
    /**
     * @deprecated `color` is deprecated as support will be removed in the upcoming releases. Use `newTheme.colors` instead.
     */
    color?:
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
}
