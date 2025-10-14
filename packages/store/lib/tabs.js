import { c as createSlice } from './redux-toolkit.esm-ca140e18.js';

// ? 全局不动配置项 只做导出不做修改
// * 首页地址（默认）
var HOME_URL = "/home";

var _a;
var tabsState = {
    // tabsActive 其实没啥用，使用 pathname 就可以了😂
    tabsActive: HOME_URL,
    tabsList: [{ key: HOME_URL, label: "首页", path: HOME_URL }]
};
var tabsSlice = createSlice({
    name: "tabs",
    initialState: tabsState,
    reducers: {
        // @ts-ignore
        setTabsList: function (state, _a) {
            var payload = _a.payload;
            state.tabsList = payload;
        },
        setTabsActive: function (state, _a) {
            var payload = _a.payload;
            state.tabsActive = payload;
        },
        setResetTabs: function (state) {
            state.tabsActive = HOME_URL;
            state.tabsList = [{ key: HOME_URL, label: "首页", path: HOME_URL }];
        }
    }
});
var setTabsList = (_a = tabsSlice.actions, _a.setTabsList), setTabsActive = _a.setTabsActive, setResetTabs = _a.setResetTabs;
var tabs = tabsSlice.reducer;

export { tabs as default, setResetTabs, setTabsActive, setTabsList };
