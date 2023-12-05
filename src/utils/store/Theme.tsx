import { createContext, useCallback, useContext, useEffect } from "react";
import { hexToHsl } from "../functions";
import { COLORS } from "../constants/shared.constants";
import {
    type ThemeContextType,
    type ThemeColors,
    type ThemeProviderProps,
} from "../types/shared.types";

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    theme: {
        mode = "light",
        style = "classic",
        accent = "slate",
        border_radius = "medium",
    },
}) => {
    const changeBorderRadius = useCallback((border_radius: string) => {
        let _border_radius: string | null = null;
        switch (border_radius) {
            case "none":
                _border_radius = "0.0rem";
                break;
            case "small":
                _border_radius = "0.25rem";
                break;
            case "medium":
                _border_radius = "0.5rem";
                break;
            case "large":
                _border_radius = "0.75rem";
                break;
            case "full":
                border_radius = "1rem";
                break;
            default:
                _border_radius = "0.5rem";
                break;
        }
        const root = document.documentElement;
        root.style.setProperty("--grk-radius", _border_radius);
    }, []);

    const changeMode = useCallback((mode: "dark" | "light") => {
        const body = document.body;
        const root = document.documentElement;

        if (mode === "dark") {
            body.classList.add("dark");
            root.classList.add("dark");
            return;
        }
        body.classList.remove("dark");
        root.classList.remove("dark");
    }, []);

    const changeStyle = useCallback((style: "classic" | "neo") => {
        let themeColors: ThemeColors;
        const body = document.body;
        switch (style) {
            case "classic": {
                themeColors = {
                    background_color: {
                        light: "#ffffff",
                        dark: "#030711",
                    },
                    border_color: {
                        light: "#e5e7eb",
                        dark: "#1f2937",
                    },
                    surface_color: {
                        light: "#e5e7eb",
                        dark: "#e5e7eb",
                    },
                    secondary_color: {
                        light: "#94a3b8",
                        dark: "#94a3b8",
                    },
                };
                body.classList.remove("neo");
                break;
            }
            case "neo": {
                themeColors = {
                    background_color: {
                        light: "#eff6ff",
                        dark: "#1d4ed8",
                    },
                    border_color: {
                        light: "#bfdbfe",
                        dark: "#1e40af",
                    },
                    secondary_color: {
                        light: "#64748b",
                        dark: "#64748b",
                    },
                    surface_color: {
                        light: "#bfdbfe",
                        dark: "#bfdbfe",
                    },
                };
                body.classList.add("neo");
                break;
            }
        }
        changeColors(themeColors);
    }, []);

    const changeColors = useCallback((themeColors: ThemeColors) => {
        if (typeof document === "undefined") {
            return;
        }

        const root = document.documentElement;

        if (themeColors.background_color?.light) {
            root.style.setProperty(
                "--grk-background",
                hexToHsl(themeColors.background_color.light)
            );
        }
        if (themeColors.background_color?.dark) {
            root.style.setProperty(
                "--grk-background-dark",
                hexToHsl(themeColors.background_color.dark)
            );
        }

        if (themeColors.secondary_color?.light) {
            root.style.setProperty(
                "--grk-secondary",
                hexToHsl(themeColors.secondary_color.light)
            );
        }
        if (themeColors.secondary_color?.dark) {
            root.style.setProperty(
                "--grk-secondary-dark",
                hexToHsl(themeColors.secondary_color.dark)
            );
        }

        if (themeColors.surface_color?.light) {
            root.style.setProperty(
                "--grk-surface",
                hexToHsl(themeColors.surface_color.light)
            );
        }
        if (themeColors.surface_color?.dark) {
            root.style.setProperty(
                "--grk-surface-dark",
                hexToHsl(themeColors.surface_color.dark)
            );
        }

        if (themeColors.border_color?.light) {
            root.style.setProperty(
                "--grk-border",
                hexToHsl(themeColors.border_color.light)
            );
        }
        if (themeColors.border_color?.dark) {
            root.style.setProperty(
                "--grk-border-dark",
                hexToHsl(themeColors.border_color.dark)
            );
        }
    }, []);

    const changeAccent = useCallback((accentColor: string) => {
        const root = document.documentElement;
        const classes = root.classList;

        if (classes.contains("dark")) {
            classes.forEach((className) => {
                if (className !== "dark") {
                    classes.remove(className);
                }
            });
        } else {
            root.className = "";
        }

        root.classList.add(accentColor);

        root.style.setProperty(
            "--grk-accent",
            hexToHsl(COLORS[accentColor][500])
        );
        root.style.setProperty(
            "--grk-accent-foreground",
            hexToHsl(COLORS[accentColor][200])
        );
        root.style.setProperty(
            "--grk-accent-dark",
            hexToHsl(COLORS[accentColor][800])
        );

        root.style.setProperty(
            "--grk-muted",
            hexToHsl(COLORS[accentColor][200])
        );
        root.style.setProperty(
            "--grk-muted-foreground",
            hexToHsl(COLORS[accentColor][500])
        );
        root.style.setProperty(
            "--grk-muted-dark",
            hexToHsl(COLORS[accentColor][200])
        );
        root.style.setProperty(
            "--grk-muted-foreground-dark",
            hexToHsl(COLORS[accentColor][200])
        );
    }, []);

    useEffect(() => {
        if (typeof document !== "undefined") {
            changeBorderRadius(border_radius);
            changeAccent(accent);
            changeMode(mode);
            changeStyle(style);
        }
    }, []);

    return (
        <ThemeContext.Provider
            value={{
                changeAccent: changeAccent,
                changeBorderRadius: changeBorderRadius,
                changeMode: changeMode,
                changeStyle: changeStyle,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
