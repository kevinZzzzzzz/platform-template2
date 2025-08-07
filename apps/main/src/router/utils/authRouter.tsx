import { useLocation, Navigate } from "react-router-dom";
import { isEmptyObject, searchRoute } from "@/utils/util";

import { HOME_URL } from "@/config/config";
import { RootState, useSelector } from "@/store";
import { message } from "antd";

/**
 * @description 路由守卫组件
 * */
const AuthRouter = (props: { children: JSX.Element }) => {
	const token = localStorage.getItem('token')
  const tokenAble = !!token // 判断token是否存在
	// * Dynamic Router(动态路由，根据后端返回的菜单数据生成的一维数组)
  // @ts-ignore
	const { authRouter, loginInfo } = useSelector((state: RootState) => state.auth);

	const { pathname } = useLocation();
	// * 判断是否有Token
	if (!tokenAble || isEmptyObject(loginInfo)) {
    message.info('登录过期,请重新登陆')
    return <Navigate to="/login" replace />
  };

	// * Static Router(静态路由，必须配置首页地址，否则不能进首页获取菜单、按钮权限等数据)，获取数据的时候会loading，所有配置首页地址也没问题
	const staticRouter = [HOME_URL, "/403"];
	const routerList = authRouter.concat(staticRouter);
	// * 如果访问的地址没有在路由表中重定向到403页面
	if (routerList.indexOf(pathname) == -1) return <Navigate to="/403" />;

	// * 当前账号有权限返回 Router，正常访问页面
	return props.children;
};

export default AuthRouter;
