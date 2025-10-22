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

// * 获取所有科室列表
export const getDeptListAllApi = (parentId) => {
	return http._get<any>(`uaa/api/admin/depts/${parentId}`);
}
// * 获取医院科室列表
export const getDeptListByHospitalApi = (hospitalId) => {
	return http._get<any>(`uaa/api/depts/${hospitalId}`, null);
}
// * 获取用户列表
export const getUserListApi = (deptId?: number, hospitalId?: number, isAll?: boolean) => {
  if (hospitalId) {
    return http._get<any>(`uaa/api/users?hospitalId=${hospitalId}&isAll=${isAll}`);
  }
  if (deptId) {
    return http._get<any>(`uaa/api/users?dept=${deptId}`);
  } else {
    return http._get<any>(`uaa/api/users`);
  }
}

// * 获取角色列表
export const getRoleListApi = (deptId?: any) => {
  if (deptId) {
    return http._get<any>(`uaa/api/roles?dept=${deptId}`);
  } else {
    return http._get<any>(`uaa/api/roles`);
  }
};

// * 添加用户
export const addUserApi = (params: any) => {
  return http._post<any>(`uaa/api/user`, params, {
    headers: { showMessage: true }
  });
}

// * 批量添加用户
export const addUserBatchApi = (params: any) => {
  return http._post<any>(`uaa/api/users`, params, {
    headers: { showMessage: true }
  });
}


// * 获取区域信息
export const getAreaApi = (params) => {
	return http._get<any>(`uaa/api/area/selectArea`, params);
}

// * 新增区域
export const addAreaApi = (params: any) => {
	return http._post<any>(`uaa/api/area/addArea`, params, {
		headers: { showMessage: true }
	});
}

// * 修改区域
export const updateAreaApi = (params: any) => {
	return http._post<any>(`uaa/api/area/updateArea`, params, {
		headers: { showMessage: true }
	});
}

// * 新增科室
export const saveDeptApi = (params: any) => {
	return http._post<any>(`uaa/api/dept`, params, {
		headers: { showMessage: true, showLoading: true }
	});
}

// * 更新科室
export const updateDeptApi = (params: any) => {
	return http._put<any>(`uaa/api/dept`, params, {
		headers: { showMessage: true, showLoading: true }
	});
}

/**
 * @name 角色模块
 */
// * 添加角色
export const addRoleApi = (params: any) => {
	return http._post<any>(`uaa/api/role`, params, {
		headers: { showMessage: true, showLoading: true }
	});
}

// * 更新角色
export const editRoleApi = (params: any) => {
	return http._put<any>(`uaa/api/role`, params, {
		headers: { showMessage: true, showLoading: true }
	});
}