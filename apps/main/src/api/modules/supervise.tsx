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

/**
 * 血站系统日志
 */
export const getStaApiCallLog = params => {
	return http._get<any>(`supv/superv/api/callLog/page`, params);
};

/**
 * 系统日志-手动日志持久化-血站端调用
 */
export const getSupvlinkwsApiCallLog = (params: any) => {
	return http._post<any>(`/supv/superv/api/log/persistence`, params, {
		headers: { showMessage: true }
	});
};
/**
 * 系统日志-手动日志持久化-血站端调用，hoslinkws的日志持久化接口
 */
export const getHoslinkwsApiCallLog = (params?: any) => {
	return http._post<any>(`/hoslinkws/api/log/persistence`, params, {
		headers: { showMessage: true }
	});
};

/**
 * 医院账号上报日志
 */
export const getAccountLog = (params: any) => {
	return http._get<any>(`uaa/api/log/queryPage`, params, {
		headers: { showMessage: true }
	});
};

/**
 * 医院上报日志
 */
export const getReportLog = (params: any) => {
	return http._get<any>(`supv/superv/api/operateLog`, params, {
		headers: { showMessage: true }
	});
};

/**
 * 监管平台>>联网异常信息汇总表
 */
export const getExceptionLog = (params: any) => {
	return http._get<any>(`supv/superv/exception`, params, {
		headers: { showMessage: true }
	});
};