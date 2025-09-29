import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import styles from "./index.module.less";
import DepartComp from "@/components/Depart";
import { Button, Space, Table } from "antd";
import { getRoleListApi, getUserListApi } from "@/api/modules/user";
import useDeptUsers from "@/hooks/useDeptUsers";

function AuthorityRolePage(props: any) {
	const { transDepts0ById, depts0, depts } = useDeptUsers();
	const departRef = useRef(null);
	const [tableLoading, setTableLoading] = useState(false);
	const [dataSet, setDataSet] = useState([]);
	const [deptList, setDeptList] = useState<any>([]);
	const [dictArea, setDictArea] = useState<any>([]);
	const usersRef = useRef([]);
	const [roles, setRoles] = useState([]);

	const dataColumns = [
		{
			title: "序号",
			width: 100,
			dataIndex: "index",
			render: (text, record, index) => index + 1
		},
		{
			title: "所属省份",
			dataIndex: "province",
			render: (text, record, index) => {
				return (record.area && record.area.province) || "-";
			}
		},
		{
			title: "所属地域",
			dataIndex: "areaName",
			render: (text, record, index) => {
				return (record.area && record.area.areaName) || "-";
			}
		},
		{
			title: "一级部门",
			dataIndex: "parentId",
			render: (text, record, index) => {
				return (record.dept && record.dept.parentId && transDepts0ById(record.dept.parentId)) || "-";
			}
		},
		{
			title: "二级部门",
			dataIndex: "name",
			render: (text, record, index) => {
				return (record.dept && record.dept.name) || "-";
			}
		},
		{
			title: "用户名",
			dataIndex: "username",
			render: (text, record, index) => {
				return text || "-";
			}
		},
		{
			title: "姓名",
			dataIndex: "nickName",
			render: (text, record, index) => {
				return text || "-";
			}
		},
		{
			title: "角色",
			dataIndex: "name",
			render: (text, record, index) => {
				return (record.role && record.role.roleName) || "-";
			}
		},
		{
			title: "状态",
			dataIndex: "status",
			render: (text, record, index) => {
				return text === "NORMAL" ? "正常" : "锁定" || "-";
			}
		},
		{
			title: "最近登录",
			width: 120,
			dataIndex: "lastLoginDate",
			render: (text, record, index) => {
				return text || "-";
			}
		},
		{
			title: "操作",
			dataIndex: "",
			key: "edit",
			render: (text, record, index) => <a onClick={() => handleEdit(record)}>编辑</a>
		}
	];
	useEffect(() => {
		getUserList(-1);
		getRolesList(-1);
	}, []);
	// 初始化部门数据和地域数据
	const initDept = useCallback((dept, area) => {
		setDeptList(
			dept?.map(d => {
				return {
					...d,
					label: d.name,
					value: d.deptId
				};
			})
		);
		setDictArea(
			area?.map(d => {
				return {
					...d,
					label: d.areaName,
					value: d.id
				};
			})
		);
	}, []);
	/**
	 * 获取用户列表
	 */
	const getUserList = async (dept: number = -1) => {
		const res = await getUserListApi(dept);
		const { users } = res;
		usersRef.current = users || [];
		const usersT = users
			?.map((d, idx) => {
				return {
					...d,
					idx,
					statusSort: Number(d.status === "NORMAL")
				};
			})
			?.sort((a: any, b: any) => b.statusSort - a.statusSort);
		setDataSet(usersT || []);
		setTableLoading(false);
	};
	/**
	 * 获取角色列表
	 */
	const getRolesList = async (dept: number = -1) => {
		const res = await getRoleListApi(dept);
		const { roles } = res;
		setRoles(roles || []);
	};
	/**
	 * 刷新数据
	 */
	const onloadData = () => {
		setTableLoading(true);
		departRef.current.initSelect();
		getUserList(-1);
		getRolesList(-1);
	};
	/**
	 * 处理部门切换，根据部门类型筛选用户数据
	 */
	const changeDataSetByArea = useCallback(value => {
		setTableLoading(true);
		const area = value?.node;
		const selected = value?.selected;
		const matches = area.pos.match(/-/g);
		let dataSetT = [];
		if (selected) {
			switch (matches?.length) {
				case 1:
					dataSetT = usersRef.current
						.filter(user => area.dept.find(dp => dp.deptId === user.dept.parentId))
						?.map((d, idx) => {
							return {
								...d,
								idx,
								statusSort: Number(d.status === "NORMAL")
							};
						})
						?.sort((a: any, b: any) => b.statusSort - a.statusSort);
					break;
				case 2:
					dataSetT = usersRef.current
						.filter(user => user.dept.parentId === area.deptId)
						?.map((d, idx) => {
							return {
								...d,
								idx,
								statusSort: Number(d.status === "NORMAL")
							};
						})
						?.sort((a: any, b: any) => b.statusSort - a.statusSort);
					break;
				case 3:
					dataSetT = usersRef.current
						.filter(user => user.deptId === area.deptId)
						?.map((d, idx) => {
							return {
								...d,
								idx,
								statusSort: Number(d.status === "NORMAL")
							};
						})
						?.sort((a: any, b: any) => b.statusSort - a.statusSort);
					break;
				default:
					break;
			}
		} else {
			dataSetT = usersRef.current
				?.map((d, idx) => {
					return {
						...d,
						idx,
						statusSort: Number(d.status === "NORMAL")
					};
				})
				?.sort((a: any, b: any) => b.statusSort - a.statusSort);
		}
		setDataSet(dataSetT || []);
		setTableLoading(false);
	}, []);
	return (
		<div className={styles.AuthorityRole}>
			<DepartComp ref={departRef} initDept={initDept} clickChange={changeDataSetByArea} />
			<div className={styles.AuthorityRole_content}>
				<div className={styles.AuthorityRole_content_btn}>
					<Space>
						<Button
							type="primary"
							onClick={() => {
								onloadData();
							}}
						>
							刷新
						</Button>
						<Button
							type="primary"
							onClick={() => {
								openUserModel();
							}}
						>
							添加用户
						</Button>
					</Space>
				</div>
				<Table
					loading={tableLoading}
					scroll={{ y: 500 }}
					bordered
					rowKey={record => record.idx}
					dataSource={dataSet}
					columns={dataColumns}
					rowClassName="editable-row"
					pagination={{ align: "center", pageSize: 10, total: dataSet.length, showTotal: (total, range) => `共 ${total} 条` }}
				/>
			</div>
		</div>
	);
}
export default AuthorityRolePage;
