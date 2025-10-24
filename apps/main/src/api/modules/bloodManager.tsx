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

/**
 * 血液预订---> 点击查看血液预订详情更改预订单状态
 * @param params 
 * @returns 
 */
export const putBloodRecordMessage = (params: any) => {
  return http._put<any>(`uaa/api/message/all`, params)
}

/**
 * 血液预定记录提交
 */
export const putBookingBloodRecord = (params: any) => {
  return http._put<any>(`supv/superv/api/nd/order`, params)
}

/**
 * 血液预定---> 点击查看血液预订详情更改预订单状态
 * @param params 
 * @returns 
 */
export const putUpdateOrder = (params: any) => {
  return http._put<any>(`supv/superv/api/updateOrder`, params)
}
/**
 * 智能冷库对接，【扬州血站端】血液预订详情单回复的同时推送至智能冷库
 */
export const postToRFID = (params: any) => {
  return http._post<any>(``, params)
}

/**
 * 医院退血记录
 */
export const getHospitalReturnList = (params: any) => {
  return http._get<any>(`supv/superv/api/returnBags`, params, {
    headers: { showMessage: true, msgType: 'successGetList' }
  });
}
