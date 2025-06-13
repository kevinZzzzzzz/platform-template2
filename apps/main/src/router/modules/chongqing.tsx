
import DefaultLayout from "@/layout/Default";
import lazyLoad from "@/router/utils/lazyLoad";
import { RouteObject } from "@/router/interface";
import React, { lazy } from "react";

// @ts-ignore
const chongqingRouters = await import('remote_chongqing/chongqingRouter')
console.log('chongqingRouters',chongqingRouters.chongqingRouter)
// 标准版模块
const chongqingRouter: Array<RouteObject> = [
	{
		path: "/chongqing",
		element: <DefaultLayout children={''} />,
		children: chongqingRouters.chongqingRouter.map((item: RouteObject) => {
			return {
				...item,
        path: '/chongqing' + item.path,
			};
		})
	}
];

export default chongqingRouter;
