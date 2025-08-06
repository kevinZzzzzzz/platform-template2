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
	const { deptUserList, hosStaUserList, deptList, deptListAll, deptScopes, roleScopes } = useSelector((state: RootState) => state.deptUser);
  // @ts-ignore
	const { loginInfo } = useSelector((state: RootState) => state.auth);
  const stationId = loginInfo.dept.stationId
  const deptScope = loginInfo.dept.deptScope
  const scope = loginInfo.scope
  const deptIds = loginInfo.role.deptIds || ''
  const deptIdsList = deptIds?.split(",")

	const usersAll = useRef([]); // 获取医院所有用户
	const users = useRef([]); // 获取当前科室所有用户
	const usersA = useRef([]); // 获取输血科所有用户
	const usersB = useRef([]); // 获取临床科室用户，（除输血科、医务科、低权限用户外的所有用户）
	const usersYW = useRef([]); // 获取医务科所有用户

	const depts = useRef([]) //  获取当前医院或血站下的科室
  const deptsALL = useRef([])
  const depts0 = useRef([])
  const deptsHos = useRef([])
  // const deptsFromSta = useRef([])
  const depts0ALL = useRef([])

  const noBloodDepts = useRef([]) // 非输血科科室
  const deptScopesAll = useRef([]) // 科室类别
  const roleScopesAll = useRef([]) // 角色类别

	const handleUserData = () => {
    const hosStaUserListT = JSON.parse(JSON.stringify(hosStaUserList))
    const deptUserListT = JSON.parse(JSON.stringify(deptUserList))
		usersAll.current =
			deptScope === "B"
				? hosStaUserListT
						.filter(d => d.status === "NORMAL")
						.map((e:any)=> {
							e.name = e.nickName + "-" + e.username + "-" + e.dept.name;
							return e;
						})
				: hosStaUserListT
						.filter(d => d.status === "NORMAL" && d.dept.deptScope !== "B")
						.map((e:any) => {
							e.name = e.nickName + "-" + e.username + "-" + e.dept.name;
							return e;
						});
		users.current =
			deptScope === "B"
				? deptUserListT
						.filter(d => d.status === "NORMAL")
						.map((e:any) => {
							e.name = e.nickName + "-" + e.username + "-" + e.dept.name;
							return e;
						})
				: deptUserListT
						.filter(d => d.status === "NORMAL" && d.dept.deptScope !== "B")
						.map((e:any) => {
							e.name = e.nickName + "-" + e.username + "-" + e.dept.name;
							return e;
						});
		usersA.current = deptUserListT
			.filter(d => d.status === "NORMAL" && d.dept.deptScope === "A")
			.map((e:any) => {
				e.name = e.nickName + "-" + e.username + "-" + e.dept.name;
				return e;
			});
		usersB.current = hosStaUserListT
			.filter(d => d.status === "NORMAL" && d.dept.deptScope !== "B" && d.dept.deptScope !== "A")
			.map((e:any) => {
				e.name = e.nickName + "-" + e.username + "-" + e.dept.name;
				return e;
			});
		usersYW.current = hosStaUserListT
			.filter(d => d.status === "NORMAL" && d.dept.deptScope === "B")
			.map((e:any) => {
				e.name = e.nickName + "-" + e.username + "-" + e.dept.name;
				return e;
			});
	};
  const handleDeptData = () => {
    const deptListT = JSON.parse(JSON.stringify(deptList))
    let deptListAllT = JSON.parse(JSON.stringify(deptListAll))
    if (scope !== 'SUPERVISE' && deptIds) {
      deptListAllT = deptListAllT.filter(item => deptIdsList.includes(item.deptId.toString()) || (item.deptScope !== 'E' && item.deptScope !== 'D'));
    }
    depts.current = [...deptListT]
    deptsALL.current = [{ deptId: '', name: '全部' }].concat([...deptListT])
    noBloodDepts.current = deptListT.filter(item => item.name !== '输血科')
    depts0.current = deptListAllT
    depts0ALL.current = [{ deptId: '', name: '全部' }].concat([...deptListAllT])
    deptsHos.current = [{ deptId: '', name: '全部' }, ...deptListAllT.filter(item => (item.deptScope === 'E' || item.deptScope === 'D') && item.stationId === stationId )]
    deptScopesAll.current = deptScopes
    roleScopesAll.current = roleScopes
  }
	useEffect(() => {
		handleUserData();
    handleDeptData();
	}, [deptUserList, hosStaUserList, deptList, deptListAll]);
	return {
		usersAll: usersAll.current,
    users: users.current,
    usersA: usersA.current,
    usersB: usersB.current,
    usersYW: usersYW.current,
    depts: depts.current,
    deptsALL: deptsALL.current,
    depts0: depts0.current,
    depts0ALL: depts0ALL.current,
    deptsHos: deptsHos.current,
    deptScopesAll: deptScopesAll.current,
    roleScopesAll: roleScopesAll.current,
    noBloodDepts: noBloodDepts.current,
    // deptsFromSta: deptsFromSta.current,
	};
}

export default useDeptUsers;
