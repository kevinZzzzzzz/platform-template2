import { c as createSlice } from './redux-toolkit.esm-ca140e18.js';

var _a;
var authState = {
    authButtons: {},
    authRouter: [],
    loginInfo: {},
    token: ''
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
        setAuthRouter: function (state, _a) {
            var payload = _a.payload;
            state.authRouter = payload;
        },
        setLoginInfo: function (state, _a) {
            var payload = _a.payload;
            state.loginInfo = payload;
        }
    }
});
var setToken = (_a = authSlice.actions, _a.setToken), setLoginInfo = _a.setLoginInfo, setAuthButtons = _a.setAuthButtons, setAuthRouter = _a.setAuthRouter;
var auth = authSlice.reducer;

export { auth as default, setAuthButtons, setAuthRouter, setLoginInfo, setToken };
