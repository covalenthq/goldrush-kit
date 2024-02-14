import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CovalentClient } from "@covalenthq/client-sdk";
import { type ChainItem } from "@covalenthq/client-sdk";
import { Toaster } from "@/components/ui/toaster";
import { updateTheme } from "../functions";

interface CovalentContextType {
    apikey: string;
    covalentClient: CovalentClient;
    chains: ChainItem[] | null;
    selectedChain: ChainItem | null;
    setSelectedChain: React.Dispatch<React.SetStateAction<ChainItem | null>>;
}

interface CovalentProviderProps {
    children: React.ReactNode;
    apikey: string;
    mode?: "dark" | "light";
    theme?: "classic" | "neo";
    border_radius?: "none" | "small" | "medium" | "large" | "full";
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

const CovalentContext = createContext<CovalentContextType>(
    {} as CovalentContextType
);

export const CovalentProvider: React.FC<CovalentProviderProps> = ({
    children,
    apikey,
    mode = "light",
    theme = "classic",
    color = "slate",
    border_radius = "medium",
}) => {
    const covalentClient = useMemo<CovalentClient>(
        () => new CovalentClient(apikey, {}, "GoldRush"),
        [apikey]
    );
    const [chains, setChains] = useState<ChainItem[] | null>(null);
    const [selectedChain, setSelectedChain] = useState<ChainItem | null>(null);

    function changeOnlyColor(accentcolor: string, border_radius: string) {
        if (typeof document !== "undefined") {
            const theme = {
                accentcolor: accentcolor,
                borderradius: border_radius,
            };
            updateTheme(theme);
        }
    }

    function changeMode(mode: "dark" | "light") {
        if (typeof document !== "undefined") {
            const body = document.body;
            const root = document.documentElement;

            if (mode === "dark") {
                body.classList.add("dark");
                root.classList.add("dark");
                return;
            }
            body.classList.remove("dark");
            root.classList.remove("dark");
        }
    }

    function changeToNeo() {
        if (typeof document !== "undefined") {
            const theme = {
                backgroundColor: {
                    light: "#eff6ff",
                    dark: "#1d4ed8",
                },
                borderColor: {
                    light: "#bfdbfe",
                    dark: "#1e40af",
                },
                secondary: {
                    light: "#64748b",
                },
                surfaceColor: {
                    light: "#bfdbfe",
                    dark: "#bfdbfe",
                },
                secondaryColor: {
                    light: "#64748b",
                    dark: "#64748b",
                },
            };
            updateTheme(theme);
            const body = document.body;
            body.classList.add("neo");
        }
    }

    function changeToClassic() {
        if (typeof document !== "undefined") {
            const theme = {
                backgroundColor: {
                    light: "#ffffff",
                    dark: "#030711",
                },
                borderColor: {
                    light: "#e5e7eb",
                    dark: "#1f2937",
                },
                surfaceColor: {
                    light: "#e5e7eb",
                    dark: "#e5e7eb",
                },
                secondaryColor: {
                    light: "#94a3b8",
                    dark: "#94a3b8",
                },
            };
            updateTheme(theme);
            const body = document.body;
            body.classList.remove("neo");
        }
    }
    if (typeof document !== "undefined") {
        changeOnlyColor(color, border_radius);
        changeMode(mode);
        switch (theme) {
            case "classic":
                changeToClassic();
                break;
            case "neo":
                changeToNeo();
                break;
            default:
                changeToClassic();
                break;
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const allChainsResp =
                    await covalentClient.BaseService.getAllChains();
                setChains(allChainsResp.data.items);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    return (
        <CovalentContext.Provider
            value={{
                selectedChain: selectedChain,
                setSelectedChain: setSelectedChain,
                apikey: apikey,
                covalentClient: covalentClient,
                chains: chains,
            }}
        >
            {children}
            <Toaster />
        </CovalentContext.Provider>
    );
};

export const useCovalent = () => useContext(CovalentContext);
