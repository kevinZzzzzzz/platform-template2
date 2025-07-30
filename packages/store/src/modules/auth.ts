import { AuthState } from "@/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const authState: AuthState = {
	authButtons: {},
	authRouter: [],
	loginInfo: {}
};

const authSlice = createSlice({
	name: "auth",
	initialState: authState,
	reducers: {
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

export const { setAuthButtons, setAuthRouter } = authSlice.actions;
export default authSlice.reducer;
