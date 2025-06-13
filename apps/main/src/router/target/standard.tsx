
import DefaultLayout from "@/layout/Default";
import lazyLoad from "@/router/utils/lazyLoad";
import { RouteObject } from "@/router/interface";
import React, { lazy } from "react";

const standardRouters: any = await import('remote_standard/standardRouter')

// 标准版模块
const standardRouter: Array<RouteObject> = [
	{
		path: "/standard",
		element: <DefaultLayout children={''} />,
		children: standardRouters.standardRouter.map((item: RouteObject) => {
			return {
				...item,
        path: '/standard' + item.path,
				// element: lazyLoad(lazy(() => import(`remote_standard${item.path}`)))
			};
		})
	}
];

export default standardRouter;
