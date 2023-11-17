import { COLORS } from "../constants/shared.constants";
import { hexToHsl } from "../functions";

type THEME = {
    accentcolor?: string;
    surfaceColor?: {
        light?: string;
        dark?: string;
    };
    borderradius?: string;
    backgroundColor?: {
        light: string;
        dark: string;
    };
    borderColor?: {
        light: string;
        dark: string;
    };
    secondaryColor?: {
        light: string;
        dark: string;
    };
};

export const updateTheme = (theme: THEME) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    if (theme.backgroundColor?.light) {
        root.style.setProperty(
            "--grk-background",
            hexToHsl(theme.backgroundColor.light)
        );
    }
    if (theme.backgroundColor?.dark) {
        root.style.setProperty(
            "--grk-background-dark",
            hexToHsl(theme.backgroundColor.dark)
        );
    }

    if (theme.secondaryColor?.light) {
        root.style.setProperty(
            "--grk-secondary",
            hexToHsl(theme.secondaryColor.light)
        );
    }
    if (theme.secondaryColor?.dark) {
        root.style.setProperty(
            "--grk-secondary-dark",
            hexToHsl(theme.secondaryColor.dark)
        );
    }

    if (theme.surfaceColor?.light) {
        root.style.setProperty(
            "--grk-surface",
            hexToHsl(theme.surfaceColor.light)
        );
    }
    if (theme.surfaceColor?.dark) {
        root.style.setProperty(
            "--grk-surface-dark",
            hexToHsl(theme.surfaceColor.dark)
        );
    }
    if (theme.borderColor?.light) {
        root.style.setProperty(
            "--grk-border",
            hexToHsl(theme.borderColor.light)
        );
    }
    if (theme.borderColor?.dark) {
        root.style.setProperty(
            "--grk-border-dark",
            hexToHsl(theme.borderColor.dark)
        );
    }

    if (theme.accentcolor) {
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

        root.classList.add(theme.accentcolor);

        root.style.setProperty(
            "--grk-accent",
            hexToHsl(COLORS[theme.accentcolor][500])
        );
        root.style.setProperty(
            "--grk-accent-foreground",
            hexToHsl(COLORS[theme.accentcolor][200])
        );
        root.style.setProperty(
            "--grk-accent-dark",
            hexToHsl(COLORS[theme.accentcolor][800])
        );

        root.style.setProperty(
            "--grk-muted",
            hexToHsl(COLORS[theme.accentcolor][200])
        );
        root.style.setProperty(
            "--grk-muted-foreground",
            hexToHsl(COLORS[theme.accentcolor][500])
        );
        root.style.setProperty(
            "--grk-muted-dark",
            hexToHsl(COLORS[theme.accentcolor][200])
        );
        root.style.setProperty(
            "--grk-muted-foreground-dark",
            hexToHsl(COLORS[theme.accentcolor][200])
        );
    }

    // To change the broder radius
    if (theme.borderradius) {
        let borderradius = "";
        switch (theme.borderradius) {
            case "none":
                borderradius = "0.0rem";
                break;
            case "small":
                borderradius = "0.25rem";
                break;
            case "medium":
                borderradius = "0.5rem";
                break;
            case "large":
                borderradius = "0.75rem";
                break;
            case "full":
                borderradius = "1rem";
                break;
            default:
                borderradius = "0.5rem";
                break;
        }
        root.style.setProperty("--grk-radius", borderradius);
    }
};
