/*eslint-env node*/
/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
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
                "text-color": colors.slate,
                danger: "hsl(var(--grk-destructive))",
                success: "hsl(var(--grk-success))",
                input: {
                    DEFAULT: "hsl(var(--grk-input) / <alpha-value>)",
                    dark: "hsl(var(--grk-input-dark) / <alpha-value>)",
                },
                ring: {
                    DEFAULT: "hsl(var(--grk-ring) / <alpha-value>)",
                    dark: "hsl(var(--grk-ring-dark) / <alpha-value>)",
                },
                primary: {
                    DEFAULT: "hsl(var(--grk-primary) / <alpha-value>)",
                    foreground:
                        "hsl(var(--grk-primary-foreground) / <alpha-value>)",
                    dark: "hsl(var(--grk-primary-dark) / <alpha-value>)",
                },
                background: {
                    DEFAULT: "hsl(var(--grk-background) / <alpha-value>)",
                    dark: "hsl(var(--grk-background-dark) / <alpha-value>)",
                },
                border: {
                    DEFAULT: "hsl(var(--grk-border) / <alpha-value>)",
                    dark: "hsl(var(--grk-border-dark) / <alpha-value>)",
                },
                secondary: {
                    DEFAULT: "hsl(var(--grk-secondary) / <alpha-value>)",
                    foreground:
                        "hsl(var(--grk-secondary-foreground) / <alpha-value>)",
                    dark: "hsl(var(--grk-secondary-dark) / <alpha-value>)",
                },
                surface: {
                    DEFAULT: "hsl(var(--grk-surface) / <alpha-value>)",
                    dark: "hsl(var(--grk-surface-dark) / <alpha-value>)",
                },
                // surface: {
                //     DEFAULT: colors.slate[200],
                //     dark: colors.slate[200]
                // },

                // background: {
                //     DEFAULT: colors.blue[50],
                //     dark: colors.blue[700]
                // },
                // border: {
                //     DEFAULT: colors.blue[200],
                //     dark: colors.blue[800],
                // },
                // secondary: {
                //     DEFAULT: colors.slate[900],
                //     foreground: "hsl(var(--grk-secondary-foreground) / <alpha-value>)",
                //     dark: "hsl(var(--grk-secondary-dark) / <alpha-value>)"
                // },

                // surface: {
                //     DEFAULT: colors.blue[200],
                //     dark: colors.blue[200]
                // },
                foreground: {
                    DEFAULT: "hsl(var(--grk-foreground) / <alpha-value>)",
                    dark: "hsl(var(--grk-foreground-dark) / <alpha-value>)",
                },
                destructive: {
                    DEFAULT: "hsl(var(--grk-destructive) / <alpha-value>)",
                    foreground:
                        "hsl(var(--grk-destructive-foreground) / <alpha-value>)",
                    dark: "hsl(var(--grk-destructive-dark) / <alpha-value>)",
                },
                muted: {
                    DEFAULT: "hsl(var(--grk-muted) / <alpha-value>)",
                    foreground:
                        "hsl(var(--grk-muted-foreground) / <alpha-value>)",
                    dark: "hsl(var(--grk-muted-dark) / <alpha-value>)",
                },
                accentcolor: colors["var(--grk-accent-tw-color)"],
                accent: {
                    DEFAULT: "hsl(var(--grk-accent) / <alpha-value>)",
                    foreground:
                        "hsl(var(--grk-accent-foreground) / <alpha-value>)",
                    dark: "hsl(var(--grk-accent-dark) / <alpha-value>)",
                },
                popover: {
                    DEFAULT: "hsl(var(--grk-popover) / <alpha-value>)",
                    foreground:
                        "hsl(var(--grk-popover-foreground) / <alpha-value>)",
                    dark: "hsl(var(--grk-popover-dark) / <alpha-value>)",
                },
                card: {
                    DEFAULT: "hsl(var(--grk-card) / <alpha-value>)",
                    foreground:
                        "hsl(var(--grk-card-foreground) / <alpha-value>)",
                    dark: "hsl(var(--grk-card-dark) / <alpha-value>)",
                },
                tremor: {
                    brand: {
                        faint: "#eff6ff", // blue-50
                        muted: "#bfdbfe", // blue-200
                        subtle: "#60a5fa", // blue-400
                        DEFAULT: "#3b82f6", // blue-500
                        emphasis: "#1d4ed8", // blue-700
                        inverted: "#ffffff", // white
                    },
                    background: {
                        muted: "#f9fafb", // gray-50
                        subtle: "#f3f4f6", // gray-100
                        DEFAULT: "#ffffff", // white
                        emphasis: "#374151", // gray-700
                    },
                    border: {
                        DEFAULT: "#e5e7eb", // gray-200
                    },
                    ring: {
                        DEFAULT: "#e5e7eb", // gray-200
                    },
                    content: {
                        subtle: "#9ca3af", // gray-400
                        DEFAULT: "#6b7280", // gray-500
                        emphasis: "#374151", // gray-700
                        strong: "#111827", // gray-900
                        inverted: "#ffffff", // white
                    },
                },
                // dark mode
                "dark-tremor": {
                    brand: {
                        faint: "#0B1229", // custom
                        muted: "#172554", // blue-950
                        subtle: "#1e40af", // blue-800
                        DEFAULT: "#3b82f6", // blue-500
                        emphasis: "#60a5fa", // blue-400
                        inverted: "#030712", // gray-950
                    },
                    background: {
                        muted: "#131A2B", // custom
                        subtle: "#1f2937", // gray-800
                        DEFAULT: "#111827", // gray-900
                        emphasis: "#d1d5db", // gray-300
                    },
                    border: {
                        DEFAULT: "#1f2937", // gray-800
                    },
                    ring: {
                        DEFAULT: "#1f2937", // gray-800
                    },
                    content: {
                        subtle: "#4b5563", // gray-600
                        DEFAULT: "#6b7280", // gray-500
                        emphasis: "#e5e7eb", // gray-200
                        strong: "#f9fafb", // gray-50
                        inverted: "#000000", // black
                    },
                },
            },
            borderRadius: {
                DEFAULT: "var(--grk-radius)",
                full: "calc(var(--grk-radius) + 2px)",
                large: "var(--grk-radius)",
                medium: "calc(var(--grk-radius) - 2px)",
                small: "calc(var(--grk-radius) - 4px)",
                none: "0px",
                "tremor-small": "0.375rem",
                "tremor-default": "0.5rem",
                "tremor-full": "9999px",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--grk-radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: {
                        height: "var(--grk-radix-accordion-content-height)",
                    },
                    to: { height: 0 },
                },
            },
            fontSize: {
                "tremor-label": ["0.8em"],
                "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
                "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
                "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
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
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    safelist: [
        {
            pattern:
                /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ["hover", "ui-selected"],
        },
        {
            pattern:
                /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ["hover", "ui-selected"],
        },
        {
            pattern:
                /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ["hover", "ui-selected"],
        },
        {
            pattern:
                /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        {
            pattern:
                /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        {
            pattern:
                /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
    ],
    plugins: [
        require("tailwindcss-animate"),
        require("@headlessui/tailwindcss"),
    ],
};
