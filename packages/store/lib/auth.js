import { c as createSlice } from './redux-toolkit.esm-abb17662.js';

var _a;
var authState = {
    authButtons: {},
    authRouter: [],
    loginInfo: {}
};
var authSlice = createSlice({
    name: "auth",
    initialState: authState,
    reducers: {
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
var setAuthButtons = (_a = authSlice.actions, _a.setAuthButtons), setAuthRouter = _a.setAuthRouter;
var auth = authSlice.reducer;

export { auth as default, setAuthButtons, setAuthRouter };
