import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DistState } from "../interface";

const dictState: DistState = {
	dictArr: {},
  dictMap: {}
}

const dictSlice = createSlice({
	name: "dict",
	initialState: dictState,
	reducers: {
		setDictMap(state, { payload }: PayloadAction<{ [propName: string]: any }>) {
			state.dictMap = payload;
		},
    setDictArr(state, { payload }: PayloadAction<{ [propName: string]: any[] }>) {
      state.dictArr = payload;
    }
	}
});
export default dictSlice.reducer;
export const { setDictMap, setDictArr } = dictSlice.actions;