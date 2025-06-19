import { GlobalState } from "@/store/interface";
import type { SizeType } from "antd/lib/config-provider/SizeContext";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const globalState = {
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

const globalSlice = createSlice({
	name: "global",
	initialState: globalState,
	reducers: {
		setToken(state, { payload }: PayloadAction<string>) {
			state.token = payload;
		},
		setAssemblySize(state, { payload }: PayloadAction<SizeType>) {
			state.assemblySize = payload;
		},
		setLanguage(state, { payload }: PayloadAction<string>) {
			state.language = payload;
		},
		setDark(state, { payload }: PayloadAction<boolean>) {
			state.themeConfig.isDark = payload;
		},
		setWeakOrGray(state, { payload }: PayloadAction<string>) {
			state.themeConfig.weakOrGray = payload;
		},
    setSysCompanyName(state, { payload }: PayloadAction<string>) {
      state.sysCompanyName = payload;
    }
	}
});

export const { setToken, setAssemblySize, setLanguage, setDark, setWeakOrGray, setSysCompanyName } = globalSlice.actions;
export default globalSlice.reducer;
