
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
    path: "/supervise",
    meta: {
      requiresAuth: true,
      title: "",
      key: "supervise"
    },
    children: [
      {
        path: "/supervise/supervise-status",
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "networkStatus" */ '@/pages/Supervise/NetworkStatus/index'))),
        meta: {
          requiresAuth: true,
          title: "医院联网状态",
          key: "network-status"
        }
      },
      {
        path: "/supervise/apiCall-log",
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "apiCallLog" */ '@/pages/Supervise/ApiCallLog/index'))),
        meta: {
          requiresAuth: true,
          title: "系统日志",
          key: "api-call-log"
        }
      },
      {
        path: "/supervise/log-account",
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "logAccount" */ '@/pages/Supervise/LogAccount/index'))),
        meta: {
          requiresAuth: true,
          title: "帐号操作日志",
          key: "log-account"
        }
      },
      {
        path: "/supervise/report-log",
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "reportLog" */ '@/pages/Supervise/ReportLog/index'))),
        meta: {
          requiresAuth: true,
          title: "医院上报日志",
          key: "report-log"
        }
      },
      {
        path: "/supervise/supervise-exception",
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "superviseException" */ '@/pages/Supervise/SuperviseException/index'))),
        meta: {
          requiresAuth: true,
          title: "医院异常汇总",
          key: "supervise-exception"
        }
      },
      {
        path: "/supervise/hospital-data-quality",
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "hospitalDataQuality" */ '@/pages/Supervise/HospitalDataQuality/index'))),
        meta: {
          requiresAuth: true,
          title: "医院数据质量",
          key: "hospital-data-quality"
        }
      },
      {
        path: "/supervise/supervise-summary",
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "superviseSummary" */ '@/pages/Supervise/SuperviseSummary/index'))),
        meta: {
          requiresAuth: true,
          title: "医院库存汇总表",
          key: "supervise-summary"
        }
      },
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
    path: '/error-log',
    meta: {
      requiresAuth: true,
      title: "错误日志",
      key: "error-log"
    },
    element: lazyLoad(lazy(() => import(/* webpackChunkName: "errorLog" */ '@/pages/ErrorLog/index'))),
  },
  {
    path: '/dictionary',
    meta: {
      requiresAuth: true,
      title: "字典配置",
      key: "dictionary"
    },
    children: [
      {
        path: '/dictionary/suggestion',
        meta: {
          requiresAuth: true,
          title: "预定回复",
          key: "suggestion"
        },
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "suggestion" */ '@/pages/Dictionary/Suggestion/index'))),
    
      },
      {
        path: '/dictionary/blood-lock-reason',
        meta: {
          requiresAuth: true,
          title: "锁定原因",
          key: "blood-lock-reason"
        },
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "bloodLockReason" */ '@/pages/Dictionary/BloodLockReason/index'))),
      },
      {
        path: '/dictionary/blood-subtype-dictionary',
        meta: {
          requiresAuth: true,
          title: "血液字典",
          key: "blood-subtype-dictionary"
        },
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "bloodSubtypeDictionary" */ '@/pages/Dictionary/BloodSubtypeDictionary/index'))),
      },
      {
        path: '/dictionary/blood-subtype',
        meta: {
          requiresAuth: true,
          title: "血液品种",
          key: "blood-subtype"
        },
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "bloodSubtype" */ '@/pages/Dictionary/BloodSubtype/index'))),
      },
      {
        path: '/dictionary/blood-breed',
        meta: {
          requiresAuth: true,
          title: "血液产品",
          key: "blood-breed"
        },
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "bloodBreed" */ '@/pages/Dictionary/BloodBreed/index'))),
      },
    ]
  },
  {
    path: '/standardReport',
    meta: {
      requiresAuth: true,
      title: "标准数据上报",
      key: "standard-report"
    },
    children: [
      {
        path: '/standardReport/data-report',
        meta: {
          requiresAuth: true,
          title: "数据上报",
          key: "data-report"
        },
        element: lazyLoad(lazy(() => import(/* webpackChunkName: "dataReport" */ '@/pages/StandardReport/DataReport/index'))),
    
      }
    ]
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
