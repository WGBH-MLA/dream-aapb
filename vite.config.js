import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"
import jsconfigPaths from 'vite-jsconfig-paths'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [reactRouter()],
  server: {
    cors: true,
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
