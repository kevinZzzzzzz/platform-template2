import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { DeptState } from "../interface";

const deptUserState = {
	deptUserList: [], // 部门用户列表
	hosStaUserList: [], // 整个机构下的部门用户列表
	deptList: [], // 获取当前医院或血站下的科室
	deptListAll: [], // 获取所有医院和血站列表
  deptScopes: [], // 科室类别列表
  roleScopes: [], // 角色类别列表
};

const deptUserSlice = createSlice({
	name: "deptUser",
	initialState: deptUserState,
	reducers: {
		setDeptUserList(state, action: PayloadAction<any>) {
			state.deptUserList = action.payload;
		},
		setHosStaUserList(state, action: PayloadAction<any>) {
			state.hosStaUserList = action.payload;
		},
		setDeptList(state, action: PayloadAction<any>) {
			state.deptList = action.payload;
		},
		setDeptListAll(state, action: PayloadAction<any>) {
			state.deptListAll = action.payload;
		},
    setDeptScopes(state, action: PayloadAction<any>) {
      state.deptScopes = action.payload;
    },
    setRoleScopes(state, action: PayloadAction<any>) {
      state.roleScopes = action.payload;
    },

	}
});

export const {
    setDeptUserList,
    setHosStaUserList,
    setDeptList,
    setDeptListAll,
    setDeptScopes,
    setRoleScopes,
} = deptUserSlice.actions;
export default deptUserSlice.reducer;
