import http from "@/api";
import { Login } from "../interface";

/**
 * @name 用户模块
 */
// * 用户确认通过登录方式
export const userConfirmByLoginApi = (params: Login.ReqLoginForm) => {
	return http._post<Login.ResLogin>("oauth/login", params);
};
// * 更新用户信息
export const updateUserApi = (params: any) => {
	return http._post<any>(`put/uaa/api/user`, params, {
		headers: { showMessage: true }
	});
};

// * 获取用户信息
export const getUserInfoApi = () => {
	return http._get<any>(`uaa/api/user`);
};
// * 获取区域信息
export const getAreaApi = (params) => {
	return http._get<any>(`uaa/api/area/selectArea`, params);
}

// * 获取所有科室列表
export const getDeptListAllApi = (parentId) => {
	return http._get<any>(`uaa/api/admin/depts/${parentId}`);
}
