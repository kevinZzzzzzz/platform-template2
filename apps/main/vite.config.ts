import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import react from '@vitejs/plugin-react'
import path from 'path'
import { manualChunksPlugin } from 'vite-plugin-webpackchunkname'
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite'
import federation from "@originjs/vite-plugin-federation";



// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv): any => {
  const env= loadEnv(mode.mode, process.cwd());   // 获取.env文件里定义的环境变量
  const analysPlugins: any[] = mode.mode === 'analys' ? [
    visualizer({
      emitFile: false,
      filename: "stats.html",
      gzipSize: true,
      open: true
    })
  ] : []
  const handleRemotes = () => {
    const remoteMap = {
      'chongqing': env.VITE_CHONGQING_REMOTE_URL,
    }
    const remoteConfig = {}
    if (env.VITE_CUSTOM) {
      remoteConfig[`remote_${env.VITE_CUSTOM}`] = remoteMap[env.VITE_CUSTOM]
    }
    return remoteConfig
  }
  return {
    plugins: [
      react(),
      federation({
        name: "remote_main",
        filename: "remoteEntry.js",
        remotes: handleRemotes(),
        exposes: {
          './MainLayout': './src/layout/Default/index.tsx'
        },
        shared: ['react', 'react-dom', '@reduxjs/toolkit', 'react-redux', 'react-router-dom'] // 共享的依赖
      }),
    ].concat(analysPlugins),
    build: {
      target: 'esnext',
      // emptyOutDir: true,
      // sourcemap: false,
      // // manifest: true, //开启manifest
      // rollupOptions: {
      //   output: {
      //     chunkFileNames: 'static/js/[name].[hash].js',
      //     entryFileNames: 'static/js/[name].[hash].js',
      //     assetFileNames: 'static/[ext]/[name].[hash].[ext]',
      //     manualChunks(id: string) {
      //       if (id.includes('node_modules')) {
      //         return 'vendor'; //代码宰割为第三方包
      //       }
      //     },
      //   }
      // }
    },
    base: "",
    define: {
      'process.env': process.env
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    server: {
      port: 8881,
      host: true,
      proxy: {
        "/api": {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          secure: false, // 解决代理https协议报错问题
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          rewrite: (path: string) => path.replace(/^\/api/, ""),
        },
      },
    },
    preview: {
      port: 8881,
      host: true
    },
    css: {
      preprocessorOptions: {
        // 全局样式引入
        less:{
					javascriptEnabled: true,
          additionalData: `@import "@/assets/styles/global.less";`
        }
      },
    }
  }
});
