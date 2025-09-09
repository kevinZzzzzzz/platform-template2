import { VIEWNULL } from "@/config/config";
import { RootState } from "@/store";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

/**
 * @description: 处理所有单位及用户相关
 * @returns {
 *  usersAll: 所有用户
 *  users: 当前科室所有用户
 *  usersA: 输血科所有用户
 *  usersB: 临床科室用户，（除输血科、医务科、低权限用户外的所有用户）
 *  usersYW: 医务科所有用户
 *  depts: 当前医院或血站下的科室
 *  deptsALL: 所有科室
 *  depts0: 所有科室（包含科室类别）
 *  deptsHos: 当前医院下的科室
 *  depts0ALL: 所有科室（包含科室类别）
 *  noBloodDepts: 非输血科科室
 *  deptScopesAll: 科室类别
 *  roleScopesAll: 角色类别
 * }
 */
function useDeptUsers() {
	const { deptUserList, hosStaUserList, deptList, deptListAll, deptScopes, roleScopes } = useSelector(
		(state: RootState) => state.deptUser
	);
	// @ts-ignore
	const { loginInfo } = useSelector((state: RootState) => state.auth);
	const stationId = loginInfo.dept.stationId;
	const deptScope = loginInfo.dept.deptScope;
	const scope = loginInfo.scope;
	const deptIds = loginInfo.role.deptIds || "";
	const deptIdsList = deptIds?.split(",");

	const [usersAll, setUsersAll] = useState([]); // 获取医院所有用户
	const [users, setUsers] = useState([]); // 获取当前科室所有用户
	const [usersA, setUsersA] = useState([]); // 获取输血科所有用户
	const [usersB, setUsersB] = useState([]); // 获取临床科室用户，（除输血科、医务科、低权限用户外的所有用户）
	const [usersYW, setUsersYW] = useState([]); // 获取医务科所有用户

	const [depts, setDepts] = useState([]); //  获取当前医院或血站下的科室
	const [deptsALL, setDeptsALL] = useState([]);
	const [depts0, setDepts0] = useState([]);
	const [deptsHos, setDeptsHos] = useState([]);
	// const deptsFromSta = useRef([])
	const [depts0ALL, setDepts0ALL] = useState([]);

	const [noBloodDepts, setNoBloodDepts] = useState([]); // 非输血科科室
	const [deptScopesAll, setDeptScopesAll] = useState([]); // 科室类别
	const [roleScopesAll, setRoleScopesAll] = useState([]); // 角色类别

	const handleUserData = () => {
		const hosStaUserListT = JSON.parse(JSON.stringify(hosStaUserList));
		const deptUserListT = JSON.parse(JSON.stringify(deptUserList));
		setUsersAll(
			deptScope === "B"
				? hosStaUserListT
						.filter(d => d.status === "NORMAL")
						.map((e: any) => {
							e.name = e.nickName + "-" + e.username + "-" + e.dept.name;
							return e;
						})
				: hosStaUserListT
						.filter(d => d.status === "NORMAL" && d.dept.deptScope !== "B")
						.map((e: any) => {
							e.name = e.nickName + "-" + e.username + "-" + e.dept.name;
							return e;
						})
		);
		setUsers(
			deptScope === "B"
				? deptUserListT
						.filter(d => d.status === "NORMAL")
						.map((e: any) => {
							e.name = e.nickName + "-" + e.username + "-" + e.dept.name;
							return e;
						})
				: deptUserListT
						.filter(d => d.status === "NORMAL" && d.dept.deptScope !== "B")
						.map((e: any) => {
							e.name = e.nickName + "-" + e.username + "-" + e.dept.name;
							return e;
						})
		);
		setUsersA(
			deptUserListT
				.filter(d => d.status === "NORMAL" && d.dept.deptScope === "A")
				.map((e: any) => {
					e.name = e.nickName + "-" + e.username + "-" + e.dept.name;
					return e;
				})
		);
		setUsersB(
			hosStaUserListT
				.filter(d => d.status === "NORMAL" && d.dept.deptScope !== "B" && d.dept.deptScope !== "A")
				.map((e: any) => {
					e.name = e.nickName + "-" + e.username + "-" + e.dept.name;
					return e;
				})
		);
		setUsersYW(
			hosStaUserListT
				.filter(d => d.status === "NORMAL" && d.dept.deptScope === "B")
				.map((e: any) => {
					e.name = e.nickName + "-" + e.username + "-" + e.dept.name;
					return e;
				})
		);
	};
	const handleDeptData = () => {
		const deptListT = JSON.parse(JSON.stringify(deptList));
		let deptListAllT = JSON.parse(JSON.stringify(deptListAll));
		if (scope !== "SUPERVISE" && deptIds) {
			deptListAllT = deptListAllT.filter(
				item => deptIdsList.includes(item.deptId.toString()) || (item.deptScope !== "E" && item.deptScope !== "D")
			);
		}
		setDepts([...deptListT]);
		setDeptsALL([{ deptId: "", name: "全部" }].concat([...deptListT]));
		setNoBloodDepts(deptListT.filter(item => item.name !== "输血科"));
		setDepts0(deptListAllT);
		setDepts0ALL([{ deptId: "", name: "全部" }].concat([...deptListAllT]));
		setDeptsHos([
			{ deptId: "", name: "全部" },
			...deptListAllT.filter(item => (item.deptScope === "E" || item.deptScope === "D") && item.stationId === stationId)
		]);
		setDeptScopesAll(deptScopes);
		setRoleScopesAll(roleScopes);
	};

  const transDepts0ById = (id: any): any => {
    if (id) {
      const hospitalName = depts0.find(d => {
        return d.deptId == id;
      });
      if (hospitalName) {
        return hospitalName.name;
      } else {
        return VIEWNULL;
      }
    } else {
      return VIEWNULL;
    }
  }
	useEffect(() => {
		handleUserData();
		handleDeptData();
	}, [deptUserList, hosStaUserList, deptList, deptListAll]);
	return {
		usersAll,
		users,
		usersA,
		usersB,
		usersYW,
		depts,
		deptsALL,
		depts0,
		depts0ALL,
		deptsHos,
		deptScopesAll,
		roleScopesAll,
		noBloodDepts,
		// deptsFromSta: deptsFromSta.current,
    transDepts0ById
	};
}

export default useDeptUsers;
