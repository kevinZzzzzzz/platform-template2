import http from "@/api";

/**
 * @name 监管平台模块
 */

/**
 * 医院医院联网状态
 */
export const queryStoreDetail = params => {
	return http._get<any>(`supv/superv/store`, params);
};