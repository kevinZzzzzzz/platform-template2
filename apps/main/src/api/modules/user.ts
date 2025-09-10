import http from "@/api";

// * 更新用户信息
export const updateUserApi = (params: any) => {
	return http._post<any>(`put/uaa/api/user`, params, {
		headers: { showMessage: true }
	});
};