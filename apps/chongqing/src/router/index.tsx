import { lazy, Suspense } from "react";
import { useRoutes, Navigate, RouteObject as RouterDomRouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Spin } from "antd";

let MainLayout: {
	(props: {
		routerArray: RouteObject[],
		children: React.ReactNode
	})
} = () => {
	return <><Outlet/></>
}
try {
	// @ts-ignore
	MainLayout = (await import("remote_main/MainLayout")).default
} catch (error) {
	console.log('error',error)
}

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
const Router = () => {
	const routes = useRoutes(AllRouters);
	return routes;
};

export default Router