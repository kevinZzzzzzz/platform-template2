import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DistState } from "../interface";

const dictState: DistState = {
	dictList: [],
}

const dictSlice = createSlice({
	name: "dict",
	initialState: dictState,
	reducers: {
    setDictList(state, { payload }: PayloadAction<any[]>) {
      state.dictList = payload;
    }
	}
});
export default dictSlice.reducer;
export const { setDictList } = dictSlice.actions;
