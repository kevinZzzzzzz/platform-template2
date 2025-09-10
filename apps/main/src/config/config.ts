// ? 全局不动配置项 只做导出不做修改

// * 首页地址（默认）
export const HOME_URL: string = "/home";

// * Tabs（黑名单地址，不需要添加到 tabs 的路由地址，暂时没用）
export const TABS_BLACK_LIST: string[] = ["/403", "/404", "/500", "/layout", "/login", "/dataScreen"];
// * Menus（不需要添加到menus的路由地址）
export const MENU_BLACK_LIST: string[] = ["/403", "/404", "/personal-center"];
// * 高德地图key
export const MAP_KEY: string = "";

export const STATIONDICTLIST = [
  'type', // 血液大类
  'subtype', // 血液中类
  'breed', // 血液小类
  // 'applytypes', // 申请单申请类型
  // 'reviewmethods', // abo血型检验方法字典
  // 'matchmethods', // 配血单配血方法字典
  // 'transpurposes', // 输血申请单输血目的字典
  'rhbloodgroup', // rh血型字典
  'bloodgroup', // abo 血型字典
  // 'sex', // 性别字典
  // // 'ageunit', // 年龄单位字典
  // 'signrhbloodgroup', // 输血指征血型字典
  // 'applicationstatus', // 申请单状态字典
  // 'irregularantis', // 抗体筛选结果字典
  // 'matchchecks', // 配血检查结果字典
  // 'dictmatchbloodsubtype', // 配血检查结果字典
  'orderStatus', // 订单状态字典
  'orderType', // 预定类型字典
  'orderAgreement', // 是否满足字典
  'sysStores', // 出库预警字典
  // 'scrapcauses', // 报废原因字典
  // 'reactions', // 反应症状字典
  // 'billtypes', // 出入库字典
  // 'subtypechecks', // 审核规则
  // 'selfBreeds', // 自体输血血液规格字典
  'logfeature', // 血袋追溯字典
  // 'locks', // 血液锁定字典
  // 'matchresult', // 配血结果字典
  // 'bloodmap', // 绍兴映射表
  'suggestion', // 血液预订回复字典
  'lockreson', // 血塞锁定
  'feature', // 上报操作
  'errorType',
];

export const exePrintMachine = {
  'PRINT A4': 'PRINT A4',
  'PRINT A5': 'PRINT A5'
};

// 空数据显示
export const VIEWNULL = '--';
export const LOGIN_URL = '/login'