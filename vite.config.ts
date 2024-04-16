import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { peerDependencies } from "./package.json";

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    plugins: [
        react(),
        dts({
            rollupTypes: true,
        }),
    ],
    build: {
        lib: {
            entry: resolve("./src", "index.ts"),
            formats: ["es"],
        },
        rollupOptions: {
            external: Object.keys(peerDependencies),
            output: {
                preserveModules: false,
                globals: {
                    react: "React",
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    },
});
