import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import styles from "./index.module.less";
import DepartComp from "@/components/Depart";
import { Button, Drawer, Form, Input, message, Select, Space, Table, Tree } from "antd";
import { addRoleApi, editRoleApi, getRoleListApi, getUserListApi } from "@/api/modules/user";
import useDeptUsers from "@/hooks/useDeptUsers";
import { VIEWNULL } from "@/config/config";
import useAuthority from "@/hooks/useAuthority";
import { modalTypeEnum } from "@/enums";
import useDict from "@/hooks/useDict";
import { arrTransObj, convert } from "@/utils/util";
import { TreeNode } from "antd/es/tree-select";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
function AuthorityRolePage(props: any) {
	const { transDepts0ById, transRoleScopeById, setDepts0, depts0, depts, roleScopesAll } = useDeptUsers();
  const {getAuthorityByType} = useAuthority()
	const departRef = useRef(null);
	const [tableLoading, setTableLoading] = useState(false);
	const [dataSet, setDataSet] = useState([]);
	const [deptList, setDeptList] = useState<any>([]);
	const [dictArea, setDictArea] = useState<any>([]);
	const usersRef = useRef([]);
	const rolesAll = useRef([]);
  const [oneLevel, setOneLevel] = useState(null);
  const treeData = useRef<any>([]);
  const [nodeTree, setNodeTree] = useState<any>([]);
  const [checkedKeys, setCheckedKeys] = useState<any>([]); // 新增状态管理选中项
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerType, setDrawerType] = useState<'add' | 'edit'>('add');
  const [roleList, setRoleList] = useState<any>([]);
  const [roleForm] = Form.useForm();
  const [roleType, setRoleType] = useState<'D' | 'E' | 'F' | 'G' | 'EB' | 'EC' | 'ALL' | 'NoPath'>('E');
  const AsyncMenuId = useRef({})

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
			render: (text, record, index) => <a onClick={() => 
        openUserModel('edit', record)}>编辑</a>
		}
	];
	useEffect(() => {
    onloadData()
	}, []);
  useEffect(() => {
    setRoleList(roleScopesAll.map(item => ({
      ...item,
      label: item.desc,
      value: item.id
    })) || [])
  }, [roleScopesAll])
	// 初始化部门数据和地域数据
	const initDept = useCallback((depts, areas) => {
		setDeptList(
			depts?.map(d => {
				return {
					...d,
					label: d.name,
					value: d.deptId
				};
			})
		);
    setDepts0(depts.filter(dept => dept.parentId === 0))
		setDictArea(
			areas?.map(d => {
				return {
					...d,
					label: d.areaName,
					value: d.id
				};
			})
		);
	}, []);
	/**
	 * 获取角色列表
	 */
	const getRolesList = async (dept: number = -1) => {
		const res = await getRoleListApi(dept);
		const { roles } = res;
    roles.map((d, idx) => {
      d.idx = idx;
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
  
  function openUserModel(type: 'add' | 'edit', record?: any) {

    // 如果是编辑模式，则设置默认选中的 keys
    console.log(record, deptList, 'record-----------')
    if (type === 'edit') {
      usersRef.current = record
      const type = deptList.filter(
        d => d.deptId === record.deptId,
      )[0]?.['deptScope'];
      const menuListT = getAuthorityByType(type);
      AsyncMenuId.current = arrTransObj(menuListT, 'id');
      treeData.current = menuListT ? convert(menuListT) : [];
      setCheckedKeys(record.menuList || []);
      roleForm.setFieldsValue({
        ...record,
        menuList: record.menuList || [],
      });
    } else {
      const menuListT = getAuthorityByType(roleType);
      AsyncMenuId.current = arrTransObj(menuListT, 'id');
      treeData.current = menuListT ? convert(menuListT) : [];
      // 添加模式下清空选中项
      setCheckedKeys([]);
      roleForm.resetFields();
    }
    setNodeTree(treeData.current);
    setDrawerType(type);
    setDrawerVisible(true);
  }

  const handleSubmit = async () => {
		const valid = await roleForm.validateFields();
    if (!valid) {
      return;
    }
    const values = roleForm.getFieldsValue();
    if (values.menuList?.length === 0) {
      message.error('请选择菜单');
      return;
    }
    if (drawerType === 'add') {
      addRoleApi({
        ...values,
        menuList: values.menuList.join(','),
        deptId: oneLevel,
      }).then((res: any) => {
        setDrawerVisible(false);
        onloadData();
      })
    } else {
      editRoleApi({
        ...usersRef.current,
        ...values,
        menuList: values.menuList.join(','),
      }).then((res: any) => {
        setDrawerVisible(false);
        onloadData();
      })
    }
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
          setDataSet(dataSetT || []);
          setOneLevel(null)
					break;
				case 2:
          setOneLevel(area.deptId)
          setRoleType(area.deptScope)
          await getRolesList(area.deptId)
					dataSetT = rolesAll.current.filter(item => item.deptId === area.deptId);
          setDataSet(dataSetT || []);
					break;
				case 3:
          setOneLevel(null)
					break;
				default:
					break;
			}
		} else {
      await getRolesList(-1)
			dataSetT = rolesAll.current
      setDataSet(dataSetT || []);
		}
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
              disabled={oneLevel == null}
							onClick={() => {
								openUserModel('add');
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
      <Drawer
        title={modalTypeEnum[drawerType]}
        closable={{ 'aria-label': 'Close Button' }}
        width={600}
        destroyOnHidden
        onClose={() => setDrawerVisible(false)}
        footer={
          <Button key="submit" type="primary" onClick={() => handleSubmit()}>
            提交
          </Button>}
        open={drawerVisible}
      >
        <Form form={roleForm} {...layout} style={{width: '80%', margin: '0 auto'}}>
          <Form.Item name="roleScope" label="角色类别" rules={[{ required: true, message: '请选择角色类别' }]}>
            <Select options={roleList} placeholder="请选择角色类别"/>
          </Form.Item>
          <Form.Item name="roleName" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="请输入角色名称"/>
          </Form.Item>
          <Form.Item name="remark" label="角色描述" rules={[{ required: true, message: '请输入角色描述' }]}>
            <Input.TextArea rows={4} placeholder="请输入角色描述"/>
          </Form.Item>
          <Form.Item name="menuList" label="权限配置" rules={[{ required: true, message: '请选择权限配置' }]}>
            <Tree
              checkable
              defaultExpandAll
              treeData={nodeTree}
              checkedKeys={checkedKeys}
              onCheck={(keys) => {
                setCheckedKeys(keys as string[]); // 更新本地状态
                roleForm.setFieldsValue({ menuList: keys }); // 同步到表单字段
              }}
            />
          </Form.Item>
        </Form>
      </Drawer>
		</div>
	);
}
export default AuthorityRolePage;

