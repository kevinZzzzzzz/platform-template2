import { lazy } from "react";
// @ts-ignore
import { RouteObject } from "@/routers/interface";
import { Navigate } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import lazyLoad from "@/router/utils/lazyLoad";
import DefaultLayout from "@/layout/Default";
import FullPage from "@/layout/FullPage";
import { setSysCompanyName } from "@repo/store/lib/global";

// 默认加载的路由
import mainRouter from "./modules/main";
import LoginPage from "@/pages/Login";
import { store } from "@/store";

// // 动态加载远程路由数据并整合路由
let metaRouters = null

if (import.meta.env.VITE_CUSTOM) {
  if (import.meta.env.MODE === 'development') {
    metaRouters = await import(`./modules/${import.meta.env.VITE_CUSTOM}.tsx`)
  } else {
    const moduleMap = {
      'chongqing': () => import('./modules/chongqing')
      // 其他模块...
    };
    metaRouters = await moduleMap[import.meta.env.VITE_CUSTOM]();
  }
} else {
  store.dispatch(setSysCompanyName(''))
}

// 处理路由
export const routerArray: RouteObject[] = [...mainRouter];
metaRouters && Object.keys(metaRouters).forEach(item => {
  routerArray.push(...metaRouters[item]);
});

// /**
//  * @description: 提供给联邦的项目动态添加路由
//  * @param {RouteObject} arr
//  * @return {*}  
//  */ 
// export const addRouterArray = (arr: RouteObject[]) => {
//   if (!isFederateModule) return;
//   // 根据path判断如果不存在就插入
//   arr.forEach(item => {
//     if (!routerArray.some((router: any) => router.path === item.path)) {
//       routerArray.push(item);
//     }
//   })
// }


const Router = () => {
  const AllRouters: RouteObject[] = [
	{
		path: "/",
		element: <Navigate to="/home" />
	},
  {
    path: "/login",
    element: <FullPage>
      <LoginPage />
    </FullPage>,
  },
  {
		element: <DefaultLayout children={''} routerArray={routerArray} />,
    children: [
      ...routerArray,
    ]
  },
  {
    path: "/404",
    element: lazyLoad(lazy(() => import(/* webpackChunkName: "404" */ '@/pages/404/index'))),
    meta: {
      requiresAuth: true,
      title: "404",
      key: "404"
    }
  },
  {
    path: "*",
    element: <Navigate to="/404" />
  }
]
	const routes = useRoutes(AllRouters);
  return routes;
};

export default Router;
