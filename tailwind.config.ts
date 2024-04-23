import type { Config } from "tailwindcss";

const config = {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                danger: "hsl(var(--grk-destructive))",
                success: "hsl(var(--grk-success))",

                primary: {
                    dark: {
                        DEFAULT: "var(--grk-primary-dark-DEFAULT)",
                        100: "var(--grk-primary-dark-100)",
                        200: "var(--grk-primary-dark-200)",
                        300: "var(--grk-primary-dark-300)",
                        400: "var(--grk-primary-dark-400)",
                        500: "var(--grk-primary-dark-500)",
                        600: "var(--grk-primary-dark-600)",
                        700: "var(--grk-primary-dark-700)",
                        800: "var(--grk-primary-dark-800)",
                        900: "var(--grk-primary-dark-900)",
                    },
                    light: {
                        DEFAULT: "var(--grk-primary-light-DEFAULT)",
                        100: "var(--grk-primary-light-100)",
                        200: "var(--grk-primary-light-200)",
                        300: "var(--grk-primary-light-300)",
                        400: "var(--grk-primary-light-400)",
                        500: "var(--grk-primary-light-500)",
                        600: "var(--grk-primary-light-600)",
                        700: "var(--grk-primary-light-700)",
                        800: "var(--grk-primary-light-800)",
                        900: "var(--grk-primary-light-900)",
                    },
                },
                background: {
                    light: "var(--grk-background-light)",
                    dark: "var(--grk-background-dark)",
                },
                foreground: {
                    dark: "var(--grk-foreground-dark)",
                    light: "var(--grk-foreground-light)",
                },
                secondary: {
                    dark: "var(--grk-secondary-dark)",
                    light: "var(--grk-secondary-light)",
                },
                fill: {
                    DEFAULT: "var(--grk-primary-light)",
                },
                ring: {
                    DEFAULT: "var(--grk-primary-light)",
                },
                stroke: {
                    DEFAULT: "var(--grk-primary-light)",
                },
                tremor: {
                    background: {
                        muted: "var(--grk-secondary-light)",
                        subtle: "var(--grk-secondary-light)",
                        DEFAULT: "var(--grk-background-light)",
                        emphasis: "var(--grk-background-light)",
                    },
                    border: {
                        DEFAULT: "var(--grk-secondary-light)",
                    },
                    ring: {
                        DEFAULT: "var(--grk-secondary-light)",
                    },
                    content: {
                        subtle: "var(--grk-secondary-light)",
                        DEFAULT: "var(--grk-foreground-light)",
                        emphasis: "var(--grk-primary-light-100)",
                        strong: "var(--grk-primary-light-500)",
                        inverted: "var(--grk-foreground-light)",
                    },
                },
                "dark-tremor": {
                    background: {
                        muted: "var(--grk-secondary-dark)",
                        subtle: "var(--grk-secondary-dark)",
                        DEFAULT: "var(--grk-background-dark)",
                        emphasis: "var(--grk-background-dark)",
                    },
                    border: {
                        DEFAULT: "var(--grk-secondary-dark)",
                    },
                    ring: {
                        DEFAULT: "var(--grk-secondary-dark)",
                    },
                    content: {
                        subtle: "var(--grk-secondary-dark)",
                        DEFAULT: "var(--grk-foreground-dark)",
                        emphasis: "var(--grk-primary-dark-100)",
                        strong: "var(--grk-primary-dark-500)",
                        inverted: "var(--grk-foreground-dark)",
                    },
                },
            },
            boxShadow: {
                // light
                "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                "tremor-card":
                    "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                "tremor-dropdown":
                    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                // dark
                "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                "dark-tremor-card":
                    "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                "dark-tremor-dropdown":
                    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            },
            borderColor: {
                light: "var(--grk-secondary-light)",
                dark: "var(--grk-secondary-dark)",
            },
            borderRadius: {
                DEFAULT: "var(--grk-border-radius)",
                "tremor-small": "var(--grk-border-radius)",
                "tremor-default": "var(--grk-border-radius)",
                "tremor-full": "var(--grk-border-radius)",
            },
            fontSize: {
                "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
                "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
                "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
                "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--grk-radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: {
                        height: "var(--grk-radix-accordion-content-height)",
                    },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    safelist: [
        {
            pattern: RegExp(
                /^(bg|text|shadow|border|stroke|ring|fill)-(background|foreground|secondary)-(light|dark)$/
            ),
            variants: [
                "dark",
                "hover",
                "ui-selected",
                "dark:hover",
                "dark:ui-selected",
            ],
        },
        {
            pattern: RegExp(
                /^(bg|text|shadow|border|stroke|ring|fill)-(primary)-(light|dark)-(DEFAULT|100|200|300|400|500|600|700|800|900)$/
            ),
            variants: [
                "dark",
                "hover",
                "ui-selected",
                "dark:hover",
                "dark:ui-selected",
            ],
        },
    ],
    plugins: [
        require("tailwindcss-animate"),
        require("@headlessui/tailwindcss"),
    ],
} satisfies Config;

export default config;
