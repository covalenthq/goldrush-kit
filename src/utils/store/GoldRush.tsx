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
    type GoldRushThemeColorType,
} from "../types/store.types";
import { type ChainItem, CovalentClient } from "@covalenthq/client-sdk";
import { colorShades } from "../functions";

const GoldRushContext = createContext<GoldRushContextType>(
    {} as GoldRushContextType
);

export const GoldRushProvider: React.FC<GoldRushProviderProps> = ({
    children,
    apikey,
    theme: newTheme,
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
    const [theme, setTheme] = useState<GoldRushThemeType>(defaultTheme);

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
        const existingTheme = localStorage.getItem("goldrush_theme") || null;

        if (existingTheme) {
            handleApplyTheme(JSON.parse(existingTheme));
        } else if (newTheme) {
            handleUpdateTheme(newTheme);
        } else {
            handleApplyTheme(defaultTheme);
        }
    }, []);

    const handleUpdateTheme = useCallback(
        ({ borderRadius, colors, mode, style }: Partial<GoldRushThemeType>) => {
            const updatedTheme: GoldRushThemeType = { ...theme };

            if (borderRadius) {
                updatedTheme.borderRadius = borderRadius;
            }
            if (mode) {
                updatedTheme.mode = mode;
            }
            if (style) {
                updatedTheme.style = style;
            }
            if (colors) {
                Object.entries(colors).forEach(([_mode, _types]) => {
                    Object.entries(_types).forEach(([_type, value]) => {
                        updatedTheme.colors[_mode as "dark" | "light"]![
                            _type as keyof GoldRushThemeColorType
                        ] = value;
                    });
                });
            }

            handleApplyTheme(updatedTheme);
        },
        [theme]
    );

    const handleApplyTheme = useCallback(
        ({ borderRadius, colors, mode, style }: GoldRushThemeType) => {
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
                        const shades = colorShades(
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
                        root.style.setProperty(
                            `--grk-${_type}-${_mode}`,
                            value
                        );
                    }
                });
            });

            const _theme: GoldRushThemeType = {
                borderRadius,
                colors,
                mode,
                style,
            };

            setTheme(_theme);
            localStorage.setItem("goldrush_theme", JSON.stringify(_theme));
        },
        []
    );

    const handleResetTheme = useCallback(() => {
        handleUpdateTheme(defaultTheme);
    }, []);

    return (
        <GoldRushContext.Provider
            value={{
                apikey,
                chains,
                covalentClient,
                selectedChain,
                theme,
                setSelectedChain,
                handleUpdateTheme,
                handleResetTheme,
            }}
        >
            {children}
        </GoldRushContext.Provider>
    );
};

export const useGoldRush = () => useContext(GoldRushContext);
