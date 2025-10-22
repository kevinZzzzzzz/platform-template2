import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Spin } from "antd";
import { findAllBreadcrumb, getOpenKeys, handleRouter, searchRouteByAttr } from "@/utils/util";
import { setMenuList as reduxSetMenuList } from "@repo/store/lib/menu";
import { setBreadcrumbList } from "@repo/store/lib/breadcrumb";
import { setAuthRouter } from "@repo/store/lib/auth";
import { getMenuList } from "@/api/modules/login";
import { RootState, useDispatch, useSelector } from "@/store";
import type { MenuProps } from "antd";
import * as Icons from "@ant-design/icons";
import Logo from "./components/Logo";
import "./index.less";

const LayoutMenu = () => {
	const dispatch = useDispatch();
	// @ts-ignore
	const { isCollapse, menuList: reduxMenuList } = useSelector((state: RootState) => state.menu);
	// @ts-ignore
	const { loginInfo } = useSelector((state: RootState) => state.auth);
	const { pathname } = useLocation();
	const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);
	const [openKeys, setOpenKeys] = useState<string[]>([]);
	const menuRoleList = useMemo(() => {
		return loginInfo.role.menuList?.split(",") || [];
	}, []);

	// 刷新页面菜单保持高亮
	useEffect(() => {
    const route = searchRouteByAttr('path', pathname, reduxMenuList);
		setSelectedKeys([route.key]);
		isCollapse ? null : setOpenKeys(getOpenKeys(route.key));
	}, [pathname, isCollapse]);

	// 设置当前展开的 subMenu
	const onOpenChange = (openKeys: string[]) => {
		if (openKeys.length === 0 || openKeys.length === 1) return setOpenKeys(openKeys);
		const latestOpenKey = openKeys[openKeys.length - 1];
		if (latestOpenKey.includes(openKeys[0])) return setOpenKeys(openKeys);
		setOpenKeys([latestOpenKey]);
	};

	// 定义 menu 类型
	type MenuItem = Required<MenuProps>["items"][number];
	const getItem = (
		id: string | number,
		label: React.ReactNode,
    path: string,
		key?: React.Key | null,
		icon?: React.ReactNode,
		children?: MenuItem[],
		type?: "group",
	): MenuItem => {
		return {
			id,
      path,
			key,
			icon,
			children,
			label,
			type,
		} as MenuItem;
	};

	// 动态渲染 Icon 图标
	const customIcons: { [key: string]: any } = Icons;
	const addIcon = (name: string) => {
		return name ? React.createElement(customIcons[name]) : null;
	};

	// 处理后台返回菜单 key 值为 antd 菜单需要的 key 值
	const deepLoopFloat = (menuList: any[], newArr: MenuItem[] = []) => {
		menuList.forEach((item: any) => {
			// 下面判断代码解释 *** !item?.children?.length   ==>   (!item.children || item.children.length === 0)
			if (!menuRoleList.includes(item.id)) return;
			if (!item?.children?.length)
				return newArr.push(getItem(item.id, item.title, item.path, item.key, addIcon(item.icon!), undefined, item.type));
			newArr.push(getItem(item.id, item.title, item.path, item.key, addIcon(item.icon!), deepLoopFloat(item.children), item.type));
		});
		return newArr;
	};

	// 获取菜单列表并处理成 antd menu 需要的格式
	const [menuList, setMenuList] = useState<MenuItem[]>([]);
	const [loading, setLoading] = useState(false);
	const getMenuData = async () => {
		setLoading(true);
		try {
			const { data } = await getMenuList();
			if (!data) return;
			setMenuList(deepLoopFloat(data));
			// 存储处理过后的所有面包屑导航栏到 redux 中
			dispatch(setBreadcrumbList(findAllBreadcrumb(data)));
			// 把路由菜单处理成一维数组，存储到 redux 中，做菜单权限判断
			const dynamicRouter = handleRouter(data);
			dispatch(setAuthRouter(dynamicRouter));
			dispatch(reduxSetMenuList(data));
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		getMenuData();
	}, []);

	// 点击当前菜单跳转页面
	const navigate = useNavigate();
	const clickMenu: MenuProps["onClick"] = ({ key }: { key: string }) => {
		const route = searchRouteByAttr("key", key, reduxMenuList);
		if (route.isLink) window.open(route.isLink, "_blank");
		navigate(route.path);
	};

	return (
		<div className="menu">
			<Spin spinning={loading} tip="Loading...">
				<Logo isCollapse={isCollapse}></Logo>
				<Menu
					mode="inline"
					triggerSubMenuAction="click"
					openKeys={openKeys}
					selectedKeys={selectedKeys}
					items={menuList}
					onClick={clickMenu}
					onOpenChange={onOpenChange}
				></Menu>
			</Spin>
		</div>
	);
};

export default LayoutMenu;
