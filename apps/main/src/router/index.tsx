import { lazy } from "react";
import { RouteObject } from "@/routers/interface";
import { Navigate } from "react-router-dom";
import React from "react";
import { useRoutes } from "react-router-dom";

// * 导入所有router
const metaRouters = import.meta.glob("./modules/*.tsx", { eager: true });
// * 处理路由
export const routerArray: RouteObject[] = [];
Object.keys(metaRouters).forEach(item => {
	Object.keys(metaRouters[item]).forEach((key: any) => {
		routerArray.push(...metaRouters[item][key]);
	});
});
// const HomePage: RouteObject = {
//   key: 0,
//   name: 'Home',
//   path: '/home',
//   element: lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home/index')),
//   children: []
// }
// const NotFoundPage: RouteObject = {
//   key: 1,
//   name: 'NotFound',
//   path: '/404',
//   element: lazy(() => import(/* webpackChunkName: "404" */ '@/pages/404/index')),
//   children: []
// }

const AllRouters: RouteObject[] = [
	{
		path: "/",
		element: <Navigate to="/home" />
	},
	...routerArray,
  // HomePage,
  // NotFoundPage,
]
console.log(AllRouters, 'AllRouters');

const Router = () => {
	const routes = useRoutes(AllRouters);
	return routes;
};

export default Router;
