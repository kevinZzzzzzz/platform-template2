import { lazy } from "react";
// @ts-ignore
import { RouteObject } from "@/routers/interface";
import { Navigate } from "react-router-dom";
import React from "react";
import { useRoutes } from "react-router-dom";
import mainRouter from "./modules/main";
import lazyLoad from "@/router/utils/lazyLoad";
// 默认加载的路由
// const defaultLoadingRouter = [`./target/${import.meta.env.VITE_CUSTOM}.tsx`]
// * 导入所有router 
let metaRouters = import.meta.glob("./target/*.tsx", { eager: true });
// * 处理路由
export const routerArray: RouteObject[] = [...mainRouter];
Object.keys(metaRouters).forEach(item => {
  routerArray.push(...metaRouters[item].default);
});


const Router = (props) => {
  const AllRouters: RouteObject[] = [
	{
		path: "/",
		element: <Navigate to="/home" />
	},
  ...routerArray,
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
	const routes = useRoutes(AllRouters);
  return routes;
};

export default Router;
