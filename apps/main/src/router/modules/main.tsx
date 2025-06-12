
import DefaultLayout from "@/layout/Default";
import lazyLoad from "@/router/utils/lazyLoad";
import { RouteObject } from "@/router/interface";
import Home from "@/pages/home/index";
import React, { lazy } from "react";


// 首页模块
const mainRouter: Array<RouteObject> = [
	{
		element: <DefaultLayout />,
		children: [
			{
				path: "/home",
				element: lazyLoad(lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home/index'))),
				meta: {
					requiresAuth: true,
					title: "首页",
					key: "home"
				}
			}
		]
	}
];

export default mainRouter;
