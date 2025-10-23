import http from "@/api";

/**
 * @name 血液管理模块
 */

/**
 * 血液预订统计
 */
export const getBookingBloodStatistics = (params: any) => {
  return http._get<any>(`supv/superv/api/nd/order/record`, params, {
    headers: { showMessage: true, msgType: 'successGetList' }
  });
};

/**
 * 血液预订记录
 */
export const getBookingBloodRecord = (params: any) => {
  return http._get<any>(`supv/superv/api/nd/orders`, params, {
    headers: { showMessage: true, msgType: 'successGetList' }
  });
};
