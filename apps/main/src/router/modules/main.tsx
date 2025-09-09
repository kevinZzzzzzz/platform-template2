
// import DefaultLayout from "@/layout/Default";
import lazyLoad from "@/router/utils/lazyLoad";
import { RouteObject } from "@/router/interface";
import React, { lazy } from "react";


// 首页模块
const mainRouter: Array<RouteObject> = [
	// {
	// 	element: <DefaultLayout children={''} />,
	// 	children: [
	// 		{
	// 			path: "/home",
  //       // @ts-ignore
	// 			element: lazyLoad(lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home/index'))),
	// 			meta: {
	// 				requiresAuth: true,
	// 				title: "首页",
	// 				key: "home"
	// 			}
	// 		}
	// 	]
	// }
  {
    path: "/home",
    // @ts-ignore
    element: lazyLoad(lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home/index'))),
    meta: {
      requiresAuth: true,
      title: "首页",
      key: "home"
    }
  },
  {
    path: "/personal-center",
    // @ts-ignore
    element: lazyLoad(lazy(() => import(/* webpackChunkName: "personalCenter" */ '@/pages/PersonalCenter/index'))),
    meta: {
      requiresAuth: true,
      title: "个人中心",
      key: "personal-center"
    }
  }
];

export default mainRouter;
