import { Login } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import qs from "qs";

import http from "@/api";
import Menu from "@/layout/Default/components/Menu";

/**
 * @name 登录模块
 */
// * 用户登录接口
export const loginApi = (params: Login.ReqLoginForm) => {
	return http._post<Login.ResLogin>('oauth/login', params);
};

// * 获取按钮权限
export const getAuthorButtons = () => {
	return http._get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`);
};

// * 获取菜单列表
export const getMenuList = () => {
	// return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`);
	return http.localGet<any>('/menu.json');
};

// * 获取应用信息
export const getAppInfo = () => {
	return http.localGet<any>('/tmp/app-data.json', null, {
    headers: { noMessage: true } 
  });
};
// * 获取前端配置
export const getFrontConfig = (params?: {
  stationId: string;
}) => {
  return http._get<any>(`supv/superv/api/frontEnd/config`, params, {
    headers: { noMessage: true } 
  });
}
// * 更新前端配置
export const updateFrontConfig = (params: any) => {
  return http._put<any>(`supv/superv/api/frontEnd/config`, params);
}

export const getDictList = (dict: string[]) => {
  return Promise.all(dict.map(item => {
    return http._get<any>(`supv/superv/api/dict/${item}`, null, {
      headers: { noMessage: true } 
    });
  }))
}
