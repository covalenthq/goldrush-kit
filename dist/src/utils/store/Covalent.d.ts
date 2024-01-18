/// <reference types="react" />
import { CovalentClient } from "@covalenthq/client-sdk";
import { type ChainItem } from "@covalenthq/client-sdk";
interface CovalentContextType {
    covalentClient: CovalentClient;
    chains: ChainItem[] | null;
}
interface CovalentProviderProps {
    children: React.ReactNode;
    apikey: string;
    mode?: "dark" | "light";
    theme?: "classic" | "neo";
    border_radius?: "none" | "small" | "medium" | "large" | "full";
    color?: "slate" | "stone" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
}
export declare const CovalentProvider: React.FC<CovalentProviderProps>;
export declare const useCovalent: () => CovalentContextType;
export {};
//# sourceMappingURL=Covalent.d.ts.map