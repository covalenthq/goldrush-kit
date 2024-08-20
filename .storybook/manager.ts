import { addons } from "@storybook/manager-api";
import { themes, type ThemeVars } from "@storybook/theming";

export const defaultTheme: ThemeVars = {
    ...themes.dark,
    appBg: "black",
    colorSecondary: "#FF4C8B",
    brandImage: "../src/static/goldrush-powered-by-covalent.svg",
    base: "light",
    brandTitle: "GoldRush Kit - powered by Covalent",
    brandUrl: "https://github.com/covalenthq/goldrush-kit/",
    brandTarget: "https://goldrush.dev",
};

addons.setConfig({
    theme: defaultTheme,
});
