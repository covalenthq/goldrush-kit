import {
    type GoldRushThemeType,
    type GoldRushThemePrimaryShades,
} from "../types/store.types";

export const primaryShades = (
    inputColor: string,
    mode: GoldRushThemeType["mode"],
): GoldRushThemePrimaryShades => {
    function adjustBrightness(color: string, percent: number): string {
        const hex = color.replace(/[^0-9A-F]/gi, "");
        const num = parseInt(hex, 16);
        const amt = Math.round(2.55 * percent);
        let r = (num >> 16) + amt;
        let g = ((num >> 8) & 0x00ff) + amt;
        let b = (num & 0x0000ff) + amt;

        r = Math.min(Math.max(0, r), 255);
        g = Math.min(Math.max(0, g), 255);
        b = Math.min(Math.max(0, b), 255);

        return (
            "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        );
    }

    const shades: Partial<GoldRushThemePrimaryShades> = {
        DEFAULT: inputColor,
    };
    let currentColor = inputColor;

    // * INFO: adjust brightness for darker/lighter colors
    const brightnessFactor = mode === "light" ? -5 : 5;

    for (let i = 1; i <= 9; i++) {
        currentColor = adjustBrightness(currentColor, brightnessFactor);
        shades[(i * 100) as keyof GoldRushThemePrimaryShades] =
            currentColor.toUpperCase();
    }

    return shades as GoldRushThemePrimaryShades;
};
