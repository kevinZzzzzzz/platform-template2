import { AuthState } from "@/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const authState: AuthState = {
	authButtons: {},
	authRouter: [],
	loginInfo: {},
	userpwd: '',
	publicKey: '',
	token: '',
	appData: {}
};

const authSlice = createSlice({
	name: "auth",
	initialState: authState,
	reducers: {
		setToken(state, { payload }: PayloadAction<string>) {
			state.token = payload;
		},
		setAuthButtons(state: AuthState, { payload }: PayloadAction<{ [propName: string]: any }>) {
			state.authButtons = payload;
		},
		setUserPwd(state: AuthState, { payload }: PayloadAction<string>) {
			state.userpwd = payload;
		},
		setPublicKey(state: AuthState, { payload }: PayloadAction<string>) {
			state.publicKey = payload;
		},
		setAuthRouter(state: AuthState, { payload }: PayloadAction<string[]>) {
			state.authRouter = payload;
		},
		setLoginInfo(state: AuthState, { payload }: PayloadAction<{ [propName: string]: any }>) {
			state.loginInfo = payload;
		},
		setAppData(state: AuthState, { payload }: PayloadAction<{ [propName: string]: any }>) {
			state.appData = payload;
		}
	}
});

export const { setToken, setLoginInfo, setAuthButtons, setAuthRouter, setAppData, setUserPwd, setPublicKey } = authSlice.actions;
export default authSlice.reducer;
