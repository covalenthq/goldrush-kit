import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { updateTheme } from "../functions";
import { CovalentClient } from "@covalenthq/client-sdk";

interface GoldrushContextType {
    covalentClient: CovalentClient;
}

interface GoldRushProviderProps {
    children: ReactNode;
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

const GoldRushContext = createContext<GoldrushContextType>(
    {} as GoldrushContextType
);

export const GoldRushProvider: React.FC<GoldRushProviderProps> = ({
    children,
    apikey,
    mode = "light",
    theme = "classic",
    color = "slate",
    border_radius = "medium",
}) => {
    const covalentClient = useMemo<CovalentClient>(
        () => new CovalentClient(apikey),
        [apikey]
    );

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

    return (
        <GoldRushContext.Provider value={{ covalentClient: covalentClient }}>
            {children}
        </GoldRushContext.Provider>
    );
};

export const useGoldrush = () => useContext(GoldRushContext);
