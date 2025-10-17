
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
    element: lazyLoad(lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home/index'))),
    meta: {
      requiresAuth: true,
      title: "首页",
      key: "home"
    }
  },
  {
    path: "/personal-center",
    element: lazyLoad(lazy(() => import(/* webpackChunkName: "personalCenter" */ '@/pages/PersonalCenter/index'))),
    meta: {
      requiresAuth: true,
      title: "个人中心",
      key: "personal-center"
    }
  },
  {
    path: "/dashboard",
    meta: {
      requiresAuth: true,
      title: "",
      key: "dashboard"
    },
    children: [
      {
        path: "/dashboard/system-station",
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "systemStation" */ '@/pages/Dashboard/SystemStation/index'))),
        meta: {
          requiresAuth: true,
          title: "系统看板",
          key: "system-station"
        }
      }
    ]
  },
  {
    path: "",
    meta: {
      requiresAuth: true,
      title: "",
      key: "supervise"
    },
    children: [
      {
        path: "/supervise-status",
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "networkStatus" */ '@/pages/Supervise/NetworkStatus/index'))),
        meta: {
          requiresAuth: true,
          title: "医院联网状态",
          key: "network-status"
        }
      },
      {
        path: "/apiCall-log",
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "apiCallLog" */ '@/pages/Supervise/ApiCallLog/index'))),
        meta: {
          requiresAuth: true,
          title: "系统日志",
          key: "api-call-log"
        }
      },
      {
        path: "/log-account",
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "logAccount" */ '@/pages/Supervise/LogAccount/index'))),
        meta: {
          requiresAuth: true,
          title: "帐号操作日志",
          key: "log-account"
        }
      },
      {
        path: "/report-log",
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "reportLog" */ '@/pages/Supervise/ReportLog/index'))),
        meta: {
          requiresAuth: true,
          title: "医院上报日志",
          key: "report-log"
        }
      },
      {
        path: "/supervise-exception",
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "superviseException" */ '@/pages/Supervise/SuperviseException/index'))),
        meta: {
          requiresAuth: true,
          title: "医院异常汇总",
          key: "supervise-exception"
        }
      }
    ]
  },
  {
    path: '/setting-station',
    meta: {
      requiresAuth: true,
      title: "系统设置",
      key: "setting-station"
    },
    element: lazyLoad(lazy(() => import(/* webpackChunkName: "settingStation" */ '@/pages/Setting/index'))),
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
      },
      {
        path: '/authority/role',
        meta: {
          requiresAuth: true,
          title: "角色管理",
          key: "role"
        },
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "role" */ '@/pages/Authority/Role/index'))),
      }
    ]
  }
];

export default mainRouter;
