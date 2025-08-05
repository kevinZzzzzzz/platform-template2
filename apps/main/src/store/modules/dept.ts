import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { DeptState } from "../interface";

const deptState = {
  deptUserList: [], // 部门用户列表
  hosStaUserList: [] // 整个机构下的部门用户列表
}

const deptSlice = createSlice({
  name: "dept",
  initialState: deptState,
  reducers: {
    setDeptUserList(state, action: PayloadAction<any>) {
      state.deptUserList = action.payload;
    },
    setHosStaUserList(state, action: PayloadAction<any>) {
      state.hosStaUserList = action.payload;
    }
  }
})

export const { setDeptUserList, setHosStaUserList } = deptSlice.actions;
export default deptSlice.reducer;