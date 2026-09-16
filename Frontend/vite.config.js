import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  define: {
    global: 'globalThis',
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "Friends Chat",
        short_name: "Friends Chat",
        description:
          "Instantly send and receive messages in real-time with your friends.",

        theme_color: "#111B21",
        background_color: "#111B21",

        display: "standalone",
        start_url: "/",
        scope: "/",
        id: "/",

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
    })
  ],
});