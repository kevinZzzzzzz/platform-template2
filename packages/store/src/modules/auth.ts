import { AuthState } from "@/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const authState: AuthState = {
	authButtons: {},
	authRouter: [],
	loginInfo: {},
	token: ''
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
		setAuthRouter(state: AuthState, { payload }: PayloadAction<string[]>) {
			state.authRouter = payload;
		},
		setLoginInfo(state: AuthState, { payload }: PayloadAction<{ [propName: string]: any }>) {
			state.loginInfo = payload;
		}
	}
});

export const { setToken, setLoginInfo, setAuthButtons, setAuthRouter } = authSlice.actions;
export default authSlice.reducer;
