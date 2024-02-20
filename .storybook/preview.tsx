import "../src/tailwind-output.css";
import { themes } from "@storybook/theming";
import { GoldRushProvider } from "../src/utils/store";
// import { useDarkMode } from 'storybook-dark-mode' // uncomment out this one line for dark mode

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    themes: {
        clearable: false,
        list: [
            {
                name: "Light",
                class: [],
                color: "#ffffff",
                default: true,
            },
            {
                name: "Dark",
                class: ["dark"],
                color: "#000000",
            },
        ],
    },
    darkMode: {
        // Override the default dark theme
        dark: {
            ...themes.dark,
            appBg: "black",
            colorSecondary: "#EA088C",
            brandImage:
                "https://github.com/covalenthq/web3-resources/assets/7921710/1ab51c53-1115-4989-8f93-a1e8d13c8640",
        },
        // Override the default light theme
        light: {
            ...themes.normal,
            appBg: "white",
            colorSecondary: "#EA088C",
            brandImage:
                "https://github.com/covalenthq/web3-components/assets/7921710/36909291-c669-448b-abcd-988cabc83cf3",
        },
    },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};

import React from "react";
import { Preview } from "@storybook/react";

const preview: Preview = {
    decorators: [
        (Story) => (
            <GoldRushProvider
                apikey={import.meta.env.STORYBOOK_COVALENT_API_KEY}
            >
                <Story />
            </GoldRushProvider>
        ),
    ],
};

export default preview;
