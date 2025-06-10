
import DefaultLayout from "@/layout/Default";
import lazyLoad from "@/router/utils/lazyLoad";
import { RouteObject } from "@/router/interface";
import React, { lazy } from "react";

// 标准版模块
const standardRouter: Array<RouteObject> = [
	{
		path: "/standard",
		element: <DefaultLayout />,
		// children: [
		// 	{
		// 		path: "/home",
		// 		element: lazyLoad(lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home/index'))),
		// 		meta: {
		// 			requiresAuth: true,
		// 			title: "首页",
		// 			key: "home"
		// 		}
		// 	}
		// ]
	}
];

export default standardRouter;
