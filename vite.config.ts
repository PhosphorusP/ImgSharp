import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { manifest } from "./configs";
import { pluginGenerate } from "./generateIcon";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import dayjs from "dayjs";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    pluginGenerate({ source: "icon.svg", bundleSource: true }),
    VitePWA({
      injectRegister: "inline",
      strategies: "injectManifest",
      injectManifest: {
        globPatterns: ["**/*"],
      },
      registerType: "prompt",
      srcDir: "src",
      filename: "sw.ts",
      manifest: manifest,
    }),
    ViteMinifyPlugin({}),
    visualizer() as any,
  ],
  define: {
    __BUILD_TIMESTAMP__: JSON.stringify(dayjs().unix()),
  },
  server: {
    host: "0.0.0.0",
  },
});
