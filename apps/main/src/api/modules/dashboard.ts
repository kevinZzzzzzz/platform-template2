import http from "@/api";

/**
 * @name 系统看板模块
 */

/**
 * 系统看板-医院库存汇总
 */
export const getHosStore = params => {
	return http._get<any>(`supv/superv/hosStore`, params);
};

/**
 * 系统看板-血液预订统计
 */
export const getBookingBloodStatistics = params => {
	return http._get<any>(`supv/superv/api/nd/order/record`, params);
};

/**
 * 系统看板-血液申请单统计
 */
export const getApplicationAnalyse = params => {
	return http._get<any>(`supv/superv/applicationAnalyse`, params);
};

/**
 * 系统看板-不良反应分析接口
 */
export const getCountTransReaction = params => {
	return http._get<any>(`supv/superv/countTransReaction`, params);
};
