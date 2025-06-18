import { lazy, Suspense } from "react";
import { useRoutes, Navigate, RouteObject as RouterDomRouteObject } from "react-router-dom";
import { Spin } from "antd";
// import DefaultLayout from "@/layout/Default";

// import MainLayout from "remote_main/MainLayout";
// @ts-ignore
const MainLayout = (await import("remote_main/MainLayout")).default
// console.log('MainLayout',MainLayout)

interface MetaProps {
	keepAlive?: boolean;
	requiresAuth?: boolean;
	title: string;
	key?: string;
}

// 扩展 react-router-dom 的 RouteObject 类型
type RouteObject = RouterDomRouteObject & {
	meta?: MetaProps;
	isLink?: string;
}

const lazyLoad = (Comp: React.LazyExoticComponent<any>): React.ReactNode => {
	return (
		<Suspense
			fallback={
				<Spin
					size="large"
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						height: "100%"
					}}
				/>
			}
		>
			<Comp />
		</Suspense>
	);
};

// 重庆版模块路由
export const chongqingRouter: RouteObject[] = [
  {
    path: '/chongqing' + "/home",
    element: lazyLoad(lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home/index'))),
    meta: {
      requiresAuth: true,
      title: "重庆版-首页",
      key: "home"
    }
  },
];

// * 处理路由
export const routerArray: RouteObject[] = [...chongqingRouter];

const AllRouters: RouteObject[] = [
	{
		path: "/",
		element: <Navigate to="/chongqing/home" />
	},
	{
		path: "/chongqing",
		element: <MainLayout routerArray={routerArray} children={''} />,
		meta: {
			requiresAuth: true,
			title: "",
		},
		children: chongqingRouter.map(d => {
			return {
				...d,
				path: d.path,
			}
		})
	}
]

export const Router = () => {
	const routes = useRoutes(AllRouters);
	return routes;
};

export default function RouterConfig() {
  return chongqingRouter;
}