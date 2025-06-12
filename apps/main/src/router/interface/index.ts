import { RouteObject as ReactRouterRouteObject } from "react-router-dom";

export interface MetaProps {
	keepAlive?: boolean;
	requiresAuth?: boolean;
	title: string;
	key?: string;
}

export type RouteObject = ReactRouterRouteObject & {
	children?: RouteObject[];
	meta?: MetaProps;
	isLink?: string;
};
