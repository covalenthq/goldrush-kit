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
export declare const updateTheme: (theme: THEME) => void;
export {};
//# sourceMappingURL=update-theme.d.ts.map