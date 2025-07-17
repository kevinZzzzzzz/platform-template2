## 技术选型
- 框架 react18（V18.2.0） 
- 状态管理 @reduxjs/toolkit 
- 组件库 ant.design 
- 路由 react-router-dom 
- 打包构建工具 vite/rullup 
- node版本>= 20.12.0 
- 多项目管理方案 turborepo  
- 模块联邦 @originjs/vite-plugin-federation （v1.3.6） 
## 项目地址
demo地址： https://git.sharing8.cn/zhangyingjie/platform-template.git
相关文档： https://sharing8.yuque.com/lt3glz/seyttu/ff3hfql6tetyo9ol
## 目录介绍
```
platform-template
├──apps                          			  # 应用包
│   ├──chongqing												# 重庆分支
│   ├──main														  # 标准版系统
│   │   ├──eslint.config.js						  # eslint配置
│   │   ├──index.html
│   │   ├──package.json 								# 项目依赖配置文件
│   │   ├──prettier.config.js					  # Prettier配置文件
│   │   ├──public											  # 静态资源目录
│   │   ├──src
│   │   │   ├──App.tsx									# 项目根组件
│   │   │   ├──api											# API接口管理
│   │   │   ├──assets
│   │   │   ├──components							  # 公共组件
│   │   │   ├──config									  # 项目变量配置
│   │   │   ├──enums										# 枚举定义
│   │   │   ├──layout									  # 布局组件
│   │   │   ├──main.tsx								  # 项目入口文件
│   │   │   ├──pages										# 页面视图
│   │   │   ├──router									  # 路由配置
│   │   │   ├──store										# 状态管理
│   │   │   ├──typings									# 类型定义
│   │   │   └──utils										# 工具函数
│   │   ├──tsconfig.json								# TypeScript 配置文件
│   │   └──vite.config.ts							  # Vite 配置文件
├──package.json
├──packages														  # 工具包
│   ├──eslint-config
│   └──store
├──pnpm-lock.yaml
├──pnpm-workspace.yaml
└──turbo.json													  # turbo 配置文件

```
## 联邦配置
首先，先确定功能的host(应用者)跟remote(提供者)。
比如主系统开发整体布局Layout组件共给子项目使用，那么在这个组件的定义上主系统就是remote，其他系统都是host。
举个例子：
1. 先在主系统上把Layout组件 暴露出去
```
// main包的vite.config.ts
export default defineConfig((mode: ConfigEnv): any => {
  // ...
  return {
     plugins: [
      react(),
      federation({
        name: "remote_main",
        filename: "remoteEntry.js",
        remotes: handleRemotes(),
        exposes: { // 暴露的组件
          './MainLayout': './src/layout/Default/index.tsx'
        },
         // 共享的依赖
        shared: ['react', 'react-dom', '@reduxjs/toolkit', 'react-redux', 'react-router-dom'] // 共享的依赖
      }),
    ],
    // ...
  }
})
```
2. 然后主系统起个preview服务，供给子系统引入
```
// apps/main
pnpm preview
```
注：初期开发，可以本地服务联调，后期主系统功能完善稳定后可以直接打包到服务器上。
3. 在子项目中与主系统暴露出来的Layout组件建立远程联系
```
// chongqing包的vite.config.ts
export default defineConfig((mode: ConfigEnv): any => {
  // ...
  return {
     plugins: [
      react(),
      federation({
        name: "remote_chongqing",
        filename: "remoteChongqingEntry.js",
        remotes:  {// 远程资源路径
          'remote_main': 'http://localhost:8888/assets/remoteEntry.js'
        },
        exposes: {}, // 暴露的组件
        // 共享的依赖
        shared: ['react', 'react-dom', '@reduxjs/toolkit', 'react-redux', 'react-router-dom'] // 共享的依赖
      }),
    ],
    // ...
  }
})
```
4. 在子项目中使用
```
// chongqing包的router/index.tsx
// ...
let MainLayout: {
	(props: {
		routerArray: RouteObject[],
		children: React.ReactNode
	})
} = () => {
	return <><Outlet/></>
}
try {
	// 引入远程资源  赋给MainLayout
	MainLayout = (await import("remote_main/MainLayout")).default
} catch (error) {
	console.log('error',error)
}

// ...

const AllRouters: RouteObject[] = [
  // ...
	{
		path: "/chongqing",
  	// 直接使用MainLayout组件
		element: <MainLayout routerArray={routerArray} children={''} />,
		meta: {
			requiresAuth: true,
			title: "",
		},
		children: chongqingRouter.map(d => {
			return {
				...d,
				path: d.path,
			}
		})
	}
]
```
## 环境变量
```
// .env.development
VITE_AS_FEDERATE_MODULE='' // 是否作为模块依赖注
VITE_CUSTOM='' // 引入分支模块 如 chongqing
VITE_CHONGQING_REMOTE_URL='' // 远程模块地址
```

## 项目运行
### 安装依赖
可以在项目根目录下一次性将apps/和packages/中的项目进行安装
也可以去到对应项目下的终端单独安装
```
// 安装依赖
pnpm i
```

### 工具库打包
对需要编译的工具库进行打包，例如/packages/store
```
// packages/store
pnpm build
```

### 本地运行
● 标准版系统
```
// apps/main
pnpm dev
```
● 运行重庆分支
```
// apps/chongqing
pnpm dev
```
  如果需要引用布局组件，可以另起一个终端服务
```
// apps/main
pnpm preview
```
初期可以本地起服务，后期可以走打包走线上服务

### 项目部署
- 标准版
需要将环境变量中的VITE_CUSTOM 置空
```
// apps/main/.env.production
VITE_AS_FEDERATE_MODULE='' // 是否作为模块依赖注
VITE_CUSTOM='' // 引入分支模块
VITE_CHONGQING_REMOTE_URL='/chongqing/assets/remoteChongqingEntry.js' // 远程模块地址
```
```
// apps/main
pnpm build
```
- 打包重庆分支
需要将环境变量中的VITE_CUSTOM 指向chongqing
```
// apps/main/.env.production
VITE_AS_FEDERATE_MODULE='' // 是否作为模块依赖注
VITE_CUSTOM='chongqing' // 引入分支模块
VITE_CHONGQING_REMOTE_URL='/chongqing/assets/remoteChongqingEntry.js' // 远程模块地址
```
```
// apps/main 和 apps/chongqing
pnpm build
```