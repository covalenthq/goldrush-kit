import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    type GoldRushThemeType,
    type GoldRushContextType,
    type GoldRushProviderProps,
} from "../types/store.types";
import { type ChainItem, CovalentClient } from "@covalenthq/client-sdk";
import { primaryShades } from "../functions";
import { SEARCH_RESULTS_TYPE } from "../constants/shared.constants";
import defaultsDeep from "lodash/defaultsDeep";

const GoldRushContext = createContext<GoldRushContextType>(
    {} as GoldRushContextType
);

export const GoldRushProvider: React.FC<GoldRushProviderProps> = ({
    children,
    apikey,
    newTheme,
}) => {
    const covalentClient = useMemo<CovalentClient>(
        () => new CovalentClient(apikey, {}, "GoldRush"),
        [apikey]
    );

    const defaultTheme = useMemo<GoldRushThemeType>(
        () => ({
            borderRadius: 8,
            colors: {
                dark: {
                    primary: "#F7CD60",
                    background: "#0F172A",
                    foreground: "#FFFFFF",
                    secondary: "#B3B3B3",
                },
                light: {
                    primary: "#EA46CB",
                    background: "#F8F8F8",
                    foreground: "#090909",
                    secondary: "#94A3B8",
                },
            },
            mode: "light",
            style: "classic",
        }),
        []
    );

    const [chains, setChains] = useState<ChainItem[] | null>(null);
    const [selectedChain, setSelectedChain] = useState<ChainItem | null>(null);
    const [theme, setTheme] = useState<GoldRushThemeType>(
        defaultsDeep(
            JSON.parse(localStorage.getItem("goldrush_theme") || "null") ?? {},
            defaultsDeep(newTheme, defaultTheme)
        )
    );

    useEffect(() => {
        (async () => {
            try {
                const allChainsResp =
                    await covalentClient.BaseService.getAllChains();
                if (allChainsResp?.data?.items) {
                    setChains(allChainsResp.data.items);
                }
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    useEffect(() => {
        localStorage.setItem("goldrush_theme", JSON.stringify(theme));
        const { borderRadius, colors, mode, style } = theme;

        const body = document.body;
        const root = document.documentElement;

        switch (mode) {
            case "dark": {
                body.classList.add("dark");
                root.classList.add("dark");
                break;
            }
            case "light": {
                body.classList.remove("dark");
                root.classList.remove("dark");
                break;
            }
        }

        switch (style) {
            case "neo": {
                body.classList.add("neo");
                root.classList.add("neo");
                break;
            }
            case "classic": {
                body.classList.remove("neo");
                root.classList.remove("neo");
                break;
            }
        }

        root.style.setProperty("--grk-border-radius", `${borderRadius}px`);

        Object.entries(colors).forEach(([_mode, _types]) => {
            Object.entries(_types).forEach(([_type, value]) => {
                if (_type === "primary") {
                    const shades = primaryShades(
                        value,
                        _mode as GoldRushThemeType["mode"]
                    );
                    Object.entries(shades).forEach(([shade, color]) => {
                        root.style.setProperty(
                            `--grk-${_type}-${_mode}-${shade}`,
                            color
                        );
                    });
                } else {
                    root.style.setProperty(`--grk-${_type}-${_mode}`, value);
                }
            });
        });
    }, [theme]);

    const updateThemeHandler = useCallback(
        (updateTheme: Partial<GoldRushThemeType>) => {
            const updatedTheme: GoldRushThemeType = defaultsDeep(
                updateTheme,
                theme
            );
            setTheme(updatedTheme);
        },
        [theme]
    );

    const resetThemeHandler = useCallback(() => {
        updateThemeHandler(defaultTheme);
    }, []);

    const searchHandler = useCallback(
        (searchInput: string): SEARCH_RESULTS_TYPE => {
            const addressRegex = /^0x[a-fA-F0-9]{40}$/;
            const txnHashRegex = /^0x[a-fA-F0-9]{64}$/;
            const blockRegex = /^\d+$/;
            const tokenRegex = /^[a-zA-Z0-9]+$/;
            const domainNameRegex = /^[a-zA-Z0-9.-]+$/;

            if (addressRegex.test(searchInput)) {
                return SEARCH_RESULTS_TYPE.ADDRESS;
            } else if (txnHashRegex.test(searchInput)) {
                return SEARCH_RESULTS_TYPE.TRANSACTION;
            } else if (blockRegex.test(searchInput)) {
                return SEARCH_RESULTS_TYPE.BLOCK;
            } else if (tokenRegex.test(searchInput)) {
                return SEARCH_RESULTS_TYPE.TOKEN;
            } else if (domainNameRegex.test(searchInput)) {
                return SEARCH_RESULTS_TYPE.ADDRESS;
            } else {
                return SEARCH_RESULTS_TYPE.NOT_FOUND;
            }
        },
        []
    );

    return (
        <GoldRushContext.Provider
            value={{
                apikey,
                chains,
                covalentClient,
                selectedChain,
                theme,
                setSelectedChain,
                updateThemeHandler,
                resetThemeHandler,
                searchHandler,
            }}
        >
            {children}
        </GoldRushContext.Provider>
    );
};

export const useGoldRush = () => useContext(GoldRushContext);
