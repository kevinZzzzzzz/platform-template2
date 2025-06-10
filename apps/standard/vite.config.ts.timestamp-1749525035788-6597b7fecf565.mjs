// vite.config.ts
import { defineConfig, loadEnv } from "file:///F:/project/platform-temp-new/platform-template/node_modules/.pnpm/vite@5.4.1_@types+node@18.11.18_less@4.3.0_sass@1.89.0/node_modules/vite/dist/node/index.js";
import react from "file:///F:/project/platform-temp-new/platform-template/node_modules/.pnpm/@vitejs+plugin-react@4.5.1_vite@5.4.1_@types+node@18.11.18_less@4.3.0_sass@1.89.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { manualChunksPlugin } from "file:///F:/project/platform-temp-new/platform-template/node_modules/.pnpm/vite-plugin-webpackchunkname@1.0.3_rollup@4.41.1/node_modules/vite-plugin-webpackchunkname/dist/vite-plugin-webpackchunkname.js";
import { visualizer } from "file:///F:/project/platform-temp-new/platform-template/node_modules/.pnpm/rollup-plugin-visualizer@5.14.0_rollup@4.41.1/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import AutoImport from "file:///F:/project/platform-temp-new/platform-template/node_modules/.pnpm/unplugin-auto-import@0.16.7_rollup@4.41.1/node_modules/unplugin-auto-import/dist/vite.js";
import federation from "file:///F:/project/platform-temp-new/platform-template/node_modules/.pnpm/@originjs+vite-plugin-federation@1.3.6/node_modules/@originjs/vite-plugin-federation/dist/index.mjs";
var __vite_injected_original_dirname = "F:\\project\\platform-temp-new\\platform-template\\apps\\standard";
var vite_config_default = defineConfig((mode) => {
  const env = loadEnv(mode.mode, process.cwd());
  const analysPlugins = mode.mode === "analys" ? [
    visualizer({
      emitFile: false,
      filename: "stats.html",
      gzipSize: true,
      open: true
    })
  ] : [];
  return {
    plugins: [
      react(),
      AutoImport({
        imports: ["react", "react-router-dom"],
        dts: "src/type/auto-import.d.ts",
        // 路径下自动生成文件夹存放全局指令
        eslintrc: {
          // 开启eslint校验
          enabled: true
        }
      }),
      federation({
        name: "remote_standard",
        filename: "remoteStandardEntry.js",
        exposes: {
          "./standardRouter": "./src/router/index.tsx"
        },
        shared: ["react", "react-dom", "react-router-dom"],
        remotes: {}
      }),
      manualChunksPlugin()
    ].concat(analysPlugins),
    build: {
      target: "esnext",
      // 设置为 esnext 以支持顶级 await
      emptyOutDir: true,
      sourcemap: false,
      minify: false,
      // 不压缩代码，方便调试
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          minifyInternalExports: false,
          chunkFileNames: "static/js/[name].[hash].js",
          entryFileNames: "static/js/[name].[hash].js",
          assetFileNames: "static/[ext]/[name].[hash].[ext]",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          }
        }
      }
    },
    base: "/standard/",
    define: {
      "process.env": process.env
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    server: {
      port: 8882,
      host: true,
      proxy: {
        "/api": {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          secure: false,
          // 解决代理https协议报错问题
          headers: {
            "Access-Control-Allow-Origin": "*"
          },
          rewrite: (path2) => path2.replace(/^\/api/, "")
        }
      }
    },
    preview: {
      port: 8882,
      host: true
    },
    css: {
      preprocessorOptions: {
        // 全局样式引入
        scss: {
          additionalData: `@import "@/assets/styles/global.less";`
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxwcm9qZWN0XFxcXHBsYXRmb3JtLXRlbXAtbmV3XFxcXHBsYXRmb3JtLXRlbXBsYXRlXFxcXGFwcHNcXFxcc3RhbmRhcmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkY6XFxcXHByb2plY3RcXFxccGxhdGZvcm0tdGVtcC1uZXdcXFxccGxhdGZvcm0tdGVtcGxhdGVcXFxcYXBwc1xcXFxzdGFuZGFyZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovcHJvamVjdC9wbGF0Zm9ybS10ZW1wLW5ldy9wbGF0Zm9ybS10ZW1wbGF0ZS9hcHBzL3N0YW5kYXJkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgQ29uZmlnRW52LCBkZWZpbmVDb25maWcsIGxvYWRFbnYsIFVzZXJDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IG1hbnVhbENodW5rc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXdlYnBhY2tjaHVua25hbWUnXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXG5pbXBvcnQgZmVkZXJhdGlvbiBmcm9tIFwiQG9yaWdpbmpzL3ZpdGUtcGx1Z2luLWZlZGVyYXRpb25cIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygobW9kZTogQ29uZmlnRW52KTogVXNlckNvbmZpZyA9PiB7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZS5tb2RlLCBwcm9jZXNzLmN3ZCgpKTsgICAvLyBcdTgzQjdcdTUzRDYuZW52XHU2NTg3XHU0RUY2XHU5MUNDXHU1QjlBXHU0RTQ5XHU3Njg0XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXG4gIGNvbnN0IGFuYWx5c1BsdWdpbnM6IGFueVtdID0gbW9kZS5tb2RlID09PSAnYW5hbHlzJyA/IFtcbiAgICB2aXN1YWxpemVyKHtcbiAgICAgIGVtaXRGaWxlOiBmYWxzZSxcbiAgICAgIGZpbGVuYW1lOiBcInN0YXRzLmh0bWxcIixcbiAgICAgIGd6aXBTaXplOiB0cnVlLFxuICAgICAgb3BlbjogdHJ1ZVxuICAgIH0pXG4gIF0gOiBbXVxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KCksXG4gICAgICBBdXRvSW1wb3J0KHtcbiAgICAgICAgaW1wb3J0czpbXCJyZWFjdFwiLCBcInJlYWN0LXJvdXRlci1kb21cIl0sXG4gICAgICAgIGR0czogJ3NyYy90eXBlL2F1dG8taW1wb3J0LmQudHMnLCAgICAvLyBcdThERUZcdTVGODRcdTRFMEJcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTBcdTY1ODdcdTRFRjZcdTU5MzlcdTVCNThcdTY1M0VcdTUxNjhcdTVDNDBcdTYzMDdcdTRFRTRcbiAgICAgICAgZXNsaW50cmM6IHsgLy8gXHU1RjAwXHU1NDJGZXNsaW50XHU2ODIxXHU5QThDXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgZmVkZXJhdGlvbih7XG4gICAgICAgIG5hbWU6IFwicmVtb3RlX3N0YW5kYXJkXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJlbW90ZVN0YW5kYXJkRW50cnkuanNcIixcbiAgICAgICAgZXhwb3Nlczoge1xuICAgICAgICAgICcuL3N0YW5kYXJkUm91dGVyJzogJy4vc3JjL3JvdXRlci9pbmRleC50c3gnLFxuICAgICAgICB9LFxuICAgICAgICBzaGFyZWQ6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgcmVtb3Rlczoge30sXG4gICAgICB9KSxcbiAgICAgIG1hbnVhbENodW5rc1BsdWdpbigpXG4gICAgXS5jb25jYXQoYW5hbHlzUGx1Z2lucyksXG4gICAgYnVpbGQ6IHtcbiAgICAgIHRhcmdldDogJ2VzbmV4dCcsIC8vIFx1OEJCRVx1N0Y2RVx1NEUzQSBlc25leHQgXHU0RUU1XHU2NTJGXHU2MzAxXHU5ODc2XHU3RUE3IGF3YWl0XG4gICAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgICBtaW5pZnk6IGZhbHNlLCAvLyBcdTRFMERcdTUzOEJcdTdGMjlcdTRFRTNcdTc4MDFcdUZGMENcdTY1QjlcdTRGQkZcdThDMDNcdThCRDVcbiAgICAgIGNzc0NvZGVTcGxpdDogZmFsc2UsXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIG1pbmlmeUludGVybmFsRXhwb3J0czogZmFsc2UsXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdzdGF0aWMvanMvW25hbWVdLltoYXNoXS5qcycsXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdzdGF0aWMvanMvW25hbWVdLltoYXNoXS5qcycsXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdzdGF0aWMvW2V4dF0vW25hbWVdLltoYXNoXS5bZXh0XScsXG4gICAgICAgICAgbWFudWFsQ2h1bmtzKGlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InOyAvL1x1NEVFM1x1NzgwMVx1NUJCMFx1NTI3Mlx1NEUzQVx1N0IyQ1x1NEUwOVx1NjVCOVx1NTMwNVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGJhc2U6IFwiL3N0YW5kYXJkL1wiLFxuICAgIGRlZmluZToge1xuICAgICAgJ3Byb2Nlc3MuZW52JzogcHJvY2Vzcy5lbnZcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJylcbiAgICAgIH1cbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogODg4MixcbiAgICAgIGhvc3Q6IHRydWUsXG4gICAgICBwcm94eToge1xuICAgICAgICBcIi9hcGlcIjoge1xuICAgICAgICAgIHRhcmdldDogZW52LlZJVEVfQkFTRV9VUkwsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHNlY3VyZTogZmFsc2UsIC8vIFx1ODlFM1x1NTFCM1x1NEVFM1x1NzQwNmh0dHBzXHU1MzRGXHU4QkFFXHU2MkE1XHU5NTE5XHU5NUVFXHU5ODk4XG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGg6IHN0cmluZykgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgXCJcIiksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcHJldmlldzoge1xuICAgICAgcG9ydDogODg4MixcbiAgICAgIGhvc3Q6IHRydWUsXG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgLy8gXHU1MTY4XHU1QzQwXHU2ODM3XHU1RjBGXHU1RjE1XHU1MTY1XG4gICAgICAgIHNjc3M6e1xuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgQGltcG9ydCBcIkAvYXNzZXRzL3N0eWxlcy9nbG9iYWwubGVzc1wiO2AsXG4gICAg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
