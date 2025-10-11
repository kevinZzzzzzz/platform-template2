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
	return http._post<Login.ResLogin>("oauth/login", params, {
		headers: { showMessage: true }
	});
};

// * 获取按钮权限
export const getAuthorButtons = () => {
	return http._get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`);
};

// * 获取菜单列表
export const getMenuList = () => {
	// return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`);
	return http.localGet<any>("/menu.json", null);
};
// * 获取菜单权限列表
export const getAuthorityList = () => {
	return http.localGet<any>("/authority.stable.json", null);
};

// * 获取应用信息
export const getAppInfo = () => {
	return http.localGet<any>("/tmp/app-data.json", null);
};
// * 获取前端配置
export const getFrontConfig = (params?: { stationId: string }) => {
	return http._get<any>(`supv/superv/api/frontEnd/config`, params);
};
// * 更新前端配置
export const updateFrontConfig = (params: any) => {
	return http._put<any>(`supv/superv/api/frontEnd/config`, params, {
		headers: { showMessage: true }
	});
};
// 获取字典数据
export const getDictList = (dict: string[]) => {
	return Promise.all(
		dict.map(item => {
			return http._get<any>(`supv/superv/api/dict/${item}`, null, {
				headers: { showMessage: true }
			});
		})
	);
};

// 获取部门用户列表
export const getStaDeptUsersList = params => {
	return http._get<any>(`uaa/api/dept/users`, params);
};
// 获取当前医院或血站下的科室
export const getDeptList = () => {
  return http._get<any>(`uaa/api/getDepts`) 
};
// 获取所有医院和血站列表
export const getDeptListAll = () => {
  return http._get<any>(`uaa/api/getAllDepts`)
}
// 获取科室类别列表
export const getDeptScopes = () => {
  return http._get<any>(`uaa/api/dict/dept/scopes`)
}
// 获取角色类别列表
export const getRoleScopes = () => {
  return http._get<any>(`uaa/api/dict/role/scopes`)
}

/**
 * 查询消息列表
 * @param {{beenRead?: 0 | 1; startDate?: String; endDate?: String}} params
 * @returns {Promise<any>}
 */
  export const getMessage = (params?: {
  beenRead?: 0 | 1; // 已读 | 未读
  startDate?: String; // YYYY-MM-DD
  endDate?: String; // YYYY-MM-DD
}) => {
  return http._get(`uaa/api/messages`, params);
}


// * 血站端 验证业务系统账密的接口
export const testTelAccountApi = (params: any) => {
	return http._post<any>(`supv/superv/api/loginStation`, params, {
		headers: { showMessage: true, showLoading: true }
	});
}