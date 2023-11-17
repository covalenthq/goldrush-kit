export const hexToHsl = (hex: string): string => {
    // Remove the '#' character if present
    hex = hex.replace("#", "");

    // Convert HEX to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Find the maximum and minimum values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    // Calculate the hue
    let h;
    if (max === min) {
        h = 0;
    } else if (max === r) {
        h = ((g - b) / (max - min)) % 6;
    } else if (max === g) {
        h = (b - r) / (max - min) + 2;
    } else {
        h = (r - g) / (max - min) + 4;
    }

    h = Math.round(h * 60);

    // Calculate the lightness
    let l = (max + min) / 2;

    // Calculate the saturation
    let s;
    if (l === 0 || l === 1) {
        s = 0;
    } else {
        s = (max - min) / (1 - Math.abs(2 * l - 1));
    }

    s = Math.round(s * 100);
    l = Math.round(l * 100);

    // Tailwind Formatted return
    return `${h} ${s}% ${l}%`;
};
