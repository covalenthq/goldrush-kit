module.exports = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    staticDirs: ["../src/static/"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "storybook-addon-themes",
        "storybook-dark-mode",
        // 'storybook-tailwind-dark-mode',
    ],
    typescript: {
        reactDocgen: "react-docgen-typescript",
    },
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
};
