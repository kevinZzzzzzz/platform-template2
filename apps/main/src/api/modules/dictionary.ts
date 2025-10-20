import http from "@/api";

/**
 * @name 字典管理模块
 */

/**
 * 血液预订回复
 */
export const getSuggestion = params => {
	return http._get<any>(`supv/superv/api/dict/suggestion`, params, {
		headers: { showMessage: true }
	});
};
