import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsConfigPaths from "vite-tsconfig-paths";
// import * as packageJson from "./package.json";

export default defineConfig(() => ({
    plugins: [react(), tsConfigPaths(), dts()],
    build: {
        lib: {
            entry: resolve("./", "index.ts"),
            name: "goldrush-kit",
            fileName: (format) => `goldrush-kit.${format}.js`,
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    },
}));
