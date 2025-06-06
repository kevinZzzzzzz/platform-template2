import { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";
import Home from "@/pages/home/index";
import { Spin } from "antd";

interface RouterInterface {
  key: number,
  name: string,
  path: string,
  element: any,
  children?: any[]
}
interface MetaProps {
	keepAlive?: boolean;
	requiresAuth?: boolean;
	title: string;
	key?: string;
}

interface RouteObject {
	caseSensitive?: boolean;
	children?: RouteObject[];
	element?: any;
	index?: boolean;
	path?: string;
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
const NotFoundPage: RouteObject = {
  meta: {
    requiresAuth: true,
    title: "404",
    key: "404"
  },
  path: '/404',
  element: lazy(() => import(/* webpackChunkName: "404" */ '@/pages/404/index')),
  children: []
}
// 标准版模块路由
const standardRouter: Array<RouteObject> = [
  {
    path: "/home",
    element: lazyLoad(lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home/index'))),
    meta: {
      requiresAuth: true,
      title: "标准版-首页",
      key: "home"
    },
    children: []
  },
];

const AllRouters: RouteObject[] = [
	{
		path: "/",
		element: <Navigate to="/home" />
	},
  ...standardRouter
]

const Router = () => {
	const routes = useRoutes(AllRouters);
	return routes;
};
export default Router;