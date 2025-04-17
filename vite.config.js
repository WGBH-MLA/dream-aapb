import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import jsconfigPaths from 'vite-jsconfig-paths'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [remix()],
  server: {
    port: 4000,
    host: '0.0.0.0',
    fs: {
      strict: true,
    },
    hmr: { overlay: false },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
})
