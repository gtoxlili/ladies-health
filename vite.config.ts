import {defineConfig, splitVendorChunkPlugin} from "vite";
import react from "@vitejs/plugin-react";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";
import tsConfigPath from "vite-tsconfig-paths";
import {VitePWA} from "vite-plugin-pwa";
import UnoCSS from 'unocss/vite'
import {presetWind} from "unocss";

// https://vitejs.dev/config/
export default defineConfig((env) => {
    return {
        plugins: [
            env.mode === "development" && react({
                babel: {plugins: [jotaiDebugLabel, jotaiReactRefresh]},
            }),
            tsConfigPath(),
            UnoCSS({
                presets: [presetWind()],
                theme: {},
            }),
            splitVendorChunkPlugin(),
            VitePWA({
                registerType: "autoUpdate", // 自动更新
                injectRegister: "inline", // 注入到html中
                manifest: {
                    icons: [{
                        src:
                            "//cdn.jsdelivr.net/gh/gtoxlili/give-advice/frontend/src/assets/logo.png",
                        sizes: "128x128",
                        type: "image/png",
                    }],
                    start_url: "/",
                    short_name: "WoMen",
                    name: "WoMen",
                    theme_color: "#ffffff",
                },
            }),
        ],
        server: env.mode === "development"
            ? {
                host: "0.0.0.0",
                port: 3000,
                proxy: {
                    "/api": {
                        target: "http://localhost:16807",
                        changeOrigin: true,
                        rewrite: (path) => path.replace(/^\/api/, ""),
                    },
                },
            }
            : {},
        base: "./",
        build: {
            reportCompressedSize: false,
        },
    };
});
