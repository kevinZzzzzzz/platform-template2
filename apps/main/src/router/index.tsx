import { lazy } from "react";
import { RouteObject } from "@/routers/interface";
import { Navigate } from "react-router-dom";
import React from "react";
import { useRoutes } from "react-router-dom";
import mainRouter from "./modules/main";
import lazyLoad from "@/router/utils/lazyLoad";
// 默认加载的路由
const defaultLoadingRouter = [`./modules/${import.meta.env.VITE_CUSTOM}.tsx`]
// * 导入所有router 
// let metaRouters = import.meta.glob("./modules/*.tsx", { eager: true });
// * 处理路由
export const routerArray: RouteObject[] = [...mainRouter];
// Object.keys(metaRouters).filter((item) => defaultLoadingRouter.includes(item)).forEach(item => {
//   routerArray.push(...metaRouters[item].default);
// });
// import(/* @vite-ignore */ `./modules/${import.meta.env.VITE_CUSTOM}.tsx`).then((res: any) => {
//   console.log(res, 'res') 
// })
// const module = await import(/* @vite-ignore */ `./modules/${import.meta.env.VITE_CUSTOM}.tsx`)
// console.log(module, 'import.meta')


const Router = (props) => {
  const AllRouters: RouteObject[] = [
	{
		path: "/",
		element: <Navigate to="/home" />
	},
	...mainRouter,
  ...props.modules,
  {
    path: "/404",
    element: lazyLoad(lazy(() => import(/* webpackChunkName: "404" */ '@/pages/404/index'))),
    meta: {
      requiresAuth: true,
      title: "404",
      key: "404"
    }
  },
  {
    path: "*",
    element: <Navigate to="/404" />
  }
]
  routerArray.push(...props.modules)
	const routes = useRoutes(AllRouters);
	return routes;
};

export default Router;
