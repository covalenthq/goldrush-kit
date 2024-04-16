import { addons } from "@storybook/manager-api";
import { type ThemeVars, themes } from "@storybook/theming";

export const defaultTheme: ThemeVars = {
    ...themes.dark,
    appBg: "black",
    colorSecondary: "#EA088C",
    brandImage:
        "https://github.com/covalenthq/web3-resources/assets/7921710/1ab51c53-1115-4989-8f93-a1e8d13c8640",
    base: "light",
    brandTitle: "GoldRush Kit - powered by Covalent",
    brandUrl: "https://github.com/covalenthq/goldrush-kit/",
    brandTarget: "https://www.covalenthq.com/",
};

addons.setConfig({
    theme: defaultTheme,
});
