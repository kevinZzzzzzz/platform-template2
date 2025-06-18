import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { manualChunksPlugin } from 'vite-plugin-webpackchunkname'
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite'
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv): UserConfig => {
  const env = loadEnv(mode.mode, process.cwd());   // 获取.env文件里定义的环境变量
  const root = process.cwd();
  const analysPlugins: any[] = mode.mode === 'analys' ? [
    visualizer({
      emitFile: false,
      filename: "stats.html",
      gzipSize: true,
      open: true
    })
  ] : []
  return {
    root,
    plugins: [
      react(),
      // AutoImport({
      //   imports:["react", "react-router-dom"],
      //   dts: 'src/type/auto-import.d.ts',    // 路径下自动生成文件夹存放全局指令
      //   eslintrc: { // 开启eslint校验
      //     enabled: true,
      //   },
      // }),
      federation({
        name: "remote_standard",
        filename: "remoteStandardEntry.js",
        remotes: {
          'remote_main': env.VITE_REMOTE_MAIN_URL
        },
        exposes: {
          './standardRouter': './src/router/index.tsx'
        },
        shared: ['react', 'react-dom', '@reduxjs/toolkit', 'react-redux', 'react-router-dom'],
      }),
      // manualChunksPlugin()
    ].concat(analysPlugins),
    build: {
      target: 'esnext', // 设置为 esnext 以支持顶级 await
      outDir: 'standard'
      // emptyOutDir: true,
      // sourcemap: false,
      // minify: false, // 不压缩代码，方便调试
      // cssCodeSplit: false,
      // rollupOptions: {
      //   output: {
      //     minifyInternalExports: false,
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
    base: mode.mode === 'development' ? '' : "/standard/",
    define: {
      'process.env': process.env
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    preview: {
      port: 8882,
      host: true,
      cors: true
    },
    server: {
      port: 8882,
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
    css: {
      preprocessorOptions: {
        // 全局样式引入
        less:{
					javascriptEnabled: true,
          additionalData: `@import "@/assets/styles/global.less";`,
        }
      },
    }
  }
})
