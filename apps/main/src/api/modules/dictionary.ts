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
/**
 * 血液预订回复新增
 */
 export const addSuggestion = params => {
	return http._post<any>(`supv/superv/api/dict/suggestion`, params, {
		headers: { showMessage: true }
	});
};
/**
 * 血液预订回复编辑
 */
 export const editSuggestion = params => {
	return http._put<any>(`supv/superv/api/dict/suggestion`, params, {
		headers: { showMessage: true }
	});
};


/**
  * 血液锁定字典
  */
 export const getBloodLockReason = params => {
	return http._get<any>(`supv/superv/api/dict/lockreson`, params, {
		headers: { showMessage: true }
	});
};
/**
 * 血液锁定字典新增
 */
 export const addLockReasonStation = params => {
	return http._post<any>(`supv/superv/api/dict/lockreson`, params, {
		headers: { showMessage: true }
	});
};
/**
 * 血液锁定字典编辑
 */
 export const editLockReasonStation = params => {
	return http._put<any>(`supv/superv/api/dict/lockreson`, params, {
		headers: { showMessage: true }
	});
};


/**
 * 血站端血液字典
 */
export const getSubtypeStation = params=> {
  return http._get<any>(`supv/superv/api/dict/subtype`, params, {
    headers: { showMessage: true }
  });
}
/**
 * 血液字典新增
 */
export const addSubtypeStation = params => {
	return http._post<any>(`supv/superv/dictbloodsubtype`, params, {
		headers: { showMessage: true }
	});
};
/**
 * 血液字典编辑
 */
export const editSubtypeStation = params => {
	return http._put<any>(`supv/superv/dictbloodsubtype`, params, {
		headers: { showMessage: true }
	});
};
/**
 * 血液字典刷新
 */
export const refreshSubtypeStation = params => {
	return http._get<any>(`supv/superv/updateBloodTypeDict`, params, {
		headers: { showMessage: true }
	});
};

/**
 * 血液品种字典
 */
export const getDictSubtype = params => {
	return http._get<any>(`supv/superv/api/dict/subtype/list`, params, {
		headers: { showMessage: true }
	});
}

/**
 * 血液产品字典
 */
 export const getDictBreed = params => {
	return http._get<any>(`supv/superv/api/dict/breed/list`, params, {
		headers: { showMessage: true }
	});
}