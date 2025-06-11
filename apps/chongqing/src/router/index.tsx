import { lazy, Suspense } from "react";
import { useRoutes, Navigate, RouteObject as RouterDomRouteObject } from "react-router-dom";
import { Spin } from "antd";

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
    path: "/home",
    element: lazyLoad(lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home/index'))),
    meta: {
      requiresAuth: true,
      title: "重庆版-首页1",
      key: "home"
    }
  },
];

const AllRouters: RouteObject[] = [
	{
		path: "/",
		element: <Navigate to="/home" />
	},
  ...chongqingRouter
]

export const Router = () => {
	const routes = useRoutes(AllRouters);
	return routes;
};

export default function RouterConfig() {
  return chongqingRouter;
}