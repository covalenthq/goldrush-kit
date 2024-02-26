import { type ChainItem, type CovalentClient } from "@covalenthq/client-sdk";

export interface GoldRushContextType {
    apikey: string;
    covalentClient: CovalentClient;
    chains: ChainItem[] | null;
    selectedChain: ChainItem | null;
    theme: GoldRushThemeType;
    setSelectedChain: React.Dispatch<React.SetStateAction<ChainItem | null>>;
    handleUpdateTheme: (newTheme: Partial<GoldRushThemeType>) => void;
    handleResetTheme: () => void;
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
    theme?: Partial<GoldRushThemeType>;
}
