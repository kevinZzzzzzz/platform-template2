import { c as createSlice } from './redux-toolkit.esm-ca140e18.js';

var _a;
var authState = {
    authButtons: {},
    authRouter: [],
    loginInfo: {},
    userpwd: '',
    publicKey: '',
    token: '',
    appData: {}
};
var authSlice = createSlice({
    name: "auth",
    initialState: authState,
    reducers: {
        setToken: function (state, _a) {
            var payload = _a.payload;
            state.token = payload;
        },
        setAuthButtons: function (state, _a) {
            var payload = _a.payload;
            state.authButtons = payload;
        },
        setUserPwd: function (state, _a) {
            var payload = _a.payload;
            state.userpwd = payload;
        },
        setPublicKey: function (state, _a) {
            var payload = _a.payload;
            state.publicKey = payload;
        },
        setAuthRouter: function (state, _a) {
            var payload = _a.payload;
            state.authRouter = payload;
        },
        setLoginInfo: function (state, _a) {
            var payload = _a.payload;
            state.loginInfo = payload;
        },
        setAppData: function (state, _a) {
            var payload = _a.payload;
            state.appData = payload;
        }
    }
});
var setToken = (_a = authSlice.actions, _a.setToken), setLoginInfo = _a.setLoginInfo, setAuthButtons = _a.setAuthButtons, setAuthRouter = _a.setAuthRouter, setAppData = _a.setAppData, setUserPwd = _a.setUserPwd, setPublicKey = _a.setPublicKey;
var auth = authSlice.reducer;

export { auth as default, setAppData, setAuthButtons, setAuthRouter, setLoginInfo, setPublicKey, setToken, setUserPwd };
