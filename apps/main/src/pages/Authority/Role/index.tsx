import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import styles from "./index.module.less";
import DepartComp from "@/components/Depart";
import { Button, Space, Table } from "antd";
import { getRoleListApi, getUserListApi } from "@/api/modules/user";
import useDeptUsers from "@/hooks/useDeptUsers";
import { VIEWNULL } from "@/config/config";

function AuthorityRolePage(props: any) {
	const { transDepts0ById, transRoleScopeById, depts0, depts } = useDeptUsers();
	const departRef = useRef(null);
	const [tableLoading, setTableLoading] = useState(false);
	const [dataSet, setDataSet] = useState([]);
	const [deptList, setDeptList] = useState<any>([]);
	const [dictArea, setDictArea] = useState<any>([]);
	const usersRef = useRef([]);
	const rolesAll = useRef([]);
  const [oneLevel, setOneLevel] = useState(null);

	const dataColumns = [
		{
			title: "序号",
			width: 100,
			dataIndex: "index",
			render: (text, record, index) => index + 1
		},
		{
			title: "机构名称",
			dataIndex: "deptId",
			render: (text, record, index) => {
				return (record.deptId && transDepts0ById(record.deptId));
			}
		},
		{
			title: "角色类别",
			dataIndex: "roleScope",
			render: (text, record, index) => {
				return (record.roleScope && transRoleScopeById(record.roleScope));
			}
		},
		{
			title: "角色名称",
			dataIndex: "roleName",
			render: (text, record, index) => {
				return (record.roleName) || VIEWNULL;
			}
		},
		{
			title: "角色描述",
			dataIndex: "remark",
			render: (text, record, index) => {
				return (record.remark) || VIEWNULL;
			}
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
			render: (text, record, index) => {
				return text || VIEWNULL;
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
    console.log(depts0, 'depts0----------');
    onloadData()
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
    roles.map(d => {
      d.menuList = d.menuList.split(',');
      return d;
    });
		rolesAll.current = roles || [];
		setTableLoading(false);
    if (dept === -1) {
      setOneLevel(null);
    }
	};
	/**
	 * 刷新数据
	 */
	const onloadData = async () => {
		setTableLoading(true);
		departRef.current.initSelect();
		// getUserList(-1);
		await getRolesList(-1);
		setDataSet(rolesAll.current || []);
	};
	/**
	 * 处理部门切换，根据部门类型筛选用户数据
	 */
	const changeDataSetByArea = useCallback(async value => {
		setTableLoading(true);
		const area = value?.node;
		const selected = value?.selected;
		const matches = area.pos.match(/-/g);
		let dataSetT = [];
		if (selected) {
			switch (matches?.length) {
				case 1:
          await getRolesList(-1)
					dataSetT = rolesAll.current.filter(item => area.dept.find(dp => dp.deptId === item.deptId));
					break;
				case 2:
          setOneLevel(area.deptId)
          await getRolesList(area.deptId)
					dataSetT = rolesAll.current
					break;
				case 3:
          // setOneLevel(area.deptId)
          // await getRolesList(area.deptId)
					// dataSetT = rolesAll.current
					break;
				default:
					break;
			}
		} else {
      await getRolesList(-1)
			dataSetT = rolesAll.current
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
