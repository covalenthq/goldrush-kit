module.exports = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)", "../src/pages/*.jsx"],
    staticDirs: ["../src/static/"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "storybook-addon-themes",
        "storybook-dark-mode",
        // 'storybook-tailwind-dark-mode',
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    docs: {
        docsPage: true,
    },
};
