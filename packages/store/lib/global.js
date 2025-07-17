import { c as createSlice } from './redux-toolkit.esm-abb17662.js';

var _a;
var globalState = {
    token: "",
    userInfo: "",
    sysCompanyName: '',
    assemblySize: "middle",
    language: "",
    themeConfig: {
        primary: "#1890ff",
        isDark: false,
        weakOrGray: ""
    }
};
var globalSlice = createSlice({
    name: "global",
    initialState: globalState,
    reducers: {
        setToken: function (state, _a) {
            var payload = _a.payload;
            state.token = payload;
        },
        setAssemblySize: function (state, _a) {
            var payload = _a.payload;
            state.assemblySize = payload;
        },
        setLanguage: function (state, _a) {
            var payload = _a.payload;
            state.language = payload;
        },
        setDark: function (state, _a) {
            var payload = _a.payload;
            state.themeConfig.isDark = payload;
        },
        setWeakOrGray: function (state, _a) {
            var payload = _a.payload;
            state.themeConfig.weakOrGray = payload;
        },
        setSysCompanyName: function (state, _a) {
            var payload = _a.payload;
            state.sysCompanyName = payload;
        }
    }
});
var setToken = (_a = globalSlice.actions, _a.setToken), setAssemblySize = _a.setAssemblySize, setLanguage = _a.setLanguage, setDark = _a.setDark, setWeakOrGray = _a.setWeakOrGray, setSysCompanyName = _a.setSysCompanyName;
var global = globalSlice.reducer;

export { global as default, setAssemblySize, setDark, setLanguage, setSysCompanyName, setToken, setWeakOrGray };
