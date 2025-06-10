import { lazy } from "react";
import { RouteObject } from "@/routers/interface";
import { Navigate } from "react-router-dom";
import React from "react";
import { useRoutes } from "react-router-dom";



// const standardRouter = await import('remote_standard/standardRouter')
// console.log('import.meta.glob("./modules/*.tsx", { eager: true })',await import('remote_standard/standardRouter'))
// * 导入所有router
const metaRouters = import.meta.glob("./modules/*.tsx", { eager: true });
// * 处理路由
export const routerArray: RouteObject[] = [];
Object.keys(metaRouters).forEach(item => {
	Object.keys(metaRouters[item]).forEach((key: any) => {
		routerArray.push(...metaRouters[item][key]);
	});
});
console.log('routerArray',routerArray)
const AllRouters: RouteObject[] = [
	{
		path: "/",
		element: <Navigate to="/home" />
	},
	...routerArray,
]

const Router = () => {
	const routes = useRoutes(AllRouters);
	return routes;
};

export default Router;
