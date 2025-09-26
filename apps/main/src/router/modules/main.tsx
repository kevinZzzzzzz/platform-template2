
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
  },
  {
    path: '/authority',
    meta: {
      requiresAuth: true,
      title: "权限管理",
      key: "authority"
    },
    children: [
      {
        path: '/authority/users',
        meta: {
          requiresAuth: true,
          title: "用户管理",
          key: "users"
        },
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "users" */ '@/pages/Authority/Users/index'))),
      },
      {
        path: '/authority/area',
        meta: {
          requiresAuth: true,
          title: "地域管理",
          key: "area"
        },
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "area" */ '@/pages/Authority/Area/index'))),
      },
      {
        path: '/authority/department',
        meta: {
          requiresAuth: true,
          title: "机构管理",
          key: "department"
        },
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "department" */ '@/pages/Authority/Department/index'))),
      }
    ]
  }
];

export default mainRouter;
