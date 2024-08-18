import { SEARCH_RESULTS_TYPE } from "../constants/shared.constants";
import { primaryShades } from "../functions";
import {
    type GoldRushThemeType,
    type GoldRushContextType,
    type GoldRushProviderProps,
} from "../types/store.types";
import { type ChainItem, GoldRushClient } from "@covalenthq/client-sdk";
import defaultsDeep from "lodash/defaultsDeep";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const GoldRushContext = createContext<GoldRushContextType>(
    {} as GoldRushContextType
);

export const GoldRushProvider: React.FC<GoldRushProviderProps> = ({
    children,
    apikey,
    theme: initialTheme,
}) => {
    const goldrushClient = useMemo<GoldRushClient>(
        () =>
            new GoldRushClient(apikey, {
                source: "GoldRush Kit",
            }),
        [apikey]
    );

    const defaultTheme = useMemo<GoldRushThemeType>(
        () => ({
            borderRadius: 8,
            colors: {
                dark: {
                    primary: "#FF4C8B",
                    background: "#000426",
                    foreground: "#FFFFFF",
                    secondary: "#868E96",
                },
                light: {
                    primary: "#00D8D5",
                    background: "#FFFFFF",
                    foreground: "#1C2024",
                    secondary: "#868E96",
                },
            },
            mode: "light",
        }),
        []
    );

    const [chains, setChains] = useState<ChainItem[] | null>(null);
    const [selectedChain, setSelectedChain] = useState<ChainItem | null>(null);
    const [theme, setTheme] = useState<GoldRushThemeType>(
        defaultsDeep(
            JSON.parse(localStorage.getItem("goldrush_theme") || "null") ?? {},
            defaultsDeep(initialTheme, defaultTheme)
        )
    );

    useEffect(() => {
        (async () => {
            try {
                const allChainsResp =
                    await goldrushClient.BaseService.getAllChains();
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
        const { borderRadius, colors, mode } = theme;

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
                goldrushClient,
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
