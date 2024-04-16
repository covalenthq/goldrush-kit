import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
    pluginReactConfig,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        rules: {
            semi: "error",
            "no-multiple-empty-lines": "error",
            indent: "off",
            "react/jsx-no-target-blank": "off",
            "react/no-unescaped-entities": "off",
            "react/no-children-prop": "off",
            "no-unsafe-optional-chaining": "warn",
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/ban-types": [
                "error",
                {
                    types: {
                        Function: false,
                    },
                },
            ],
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-explicit-any": "warn",
            "prettier/prettier": "error",
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
];
