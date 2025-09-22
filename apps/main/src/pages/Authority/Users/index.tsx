import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./index.module.less";
import DepartComp from "@/components/Depart";
import { Button, Col, Form, Input, Modal, Row, Select, Table } from "antd";
import { VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";
import { getRoleListApi, getUserListApi } from "@/api/modules/user";
import useDeptUsers from "@/hooks/useDeptUsers";

enum userModalTypeMap {
  add = '新增',
  edit = '编辑',
}
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const statusList = [
  {
    label: '正常',
    value: 'NORMAL',
  },
  {
    label: '禁止',
    value: 'FORBIDDEN',
  }
];
function AuthorityUsersPage(props: any) {
	const { transDepts0ById } = useDeptUsers();
	const departRef = useRef(null);
	const [searchForm] = Form.useForm();
	const [dataSet, setDataSet] = useState([]);
	const usersRef = useRef([]);
	const [roles, setRoles] = useState([]);
  const [addUserModal, setAddUserModal] = useState(null);
  const [userModalType, setUserModalType] = useState('add');
  const [userForm] = Form.useForm();
  const [deptOptions, setDeptOptions] = useState([]);
  const [secondDeptOptions, setSecondDeptOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

	useEffect(() => {
		searchForm.setFieldsValue({
			username: "",
			nickName: ""
		});
		getUserList(-1);
		getRolesList(-1);
	}, []);
	const searchQueueData = () => {
		let dataSetT = [];
    const {username, nickName} = searchForm.getFieldsValue()
    if (!username && !nickName) {
      dataSetT = usersRef.current?.map((d, idx) => {
				return {
					...d,
					idx,
				};
			})?.sort((a: any, b: any) => b.statusSort - a.statusSort);
    } else {
      dataSetT = usersRef.current.filter((d) => {
        return (username && d.username.includes(username)) || (nickName && d.nickName.includes(nickName));
      })?.map((d, idx) => {
				return {
					...d,
					idx,
				};
			})
			?.sort((a: any, b: any) => b.statusSort - a.statusSort);
    }
    setDataSet(dataSetT || []);
  };
	const dataColumns = [
		{
			title: "序号",
			width: 60,
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
  /**
   * 处理编辑用户
   */
  const handleEdit = (record: any) => {
    setUserModalType('edit');
    openUserModel();
    onChangeDept(record.dept?.parentId)
    userForm.setFieldsValue({
      province: record.area?.province,
      areaName: record.area?.areaName,
      parentId: record.dept?.parentId,
      deptId: record.dept?.deptId,
      roleId: record.role?.roleId,
      username: record.username,
      password: record.password || '',
      nickName: record.nickName,
      status: record.status,
    })
  }
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
	 * 处理部门切换，根据部门类型筛选用户数据
	 */
	const changeDataSetByArea = useCallback(value => {
		const area = value?.node;
    const selected = value?.selected
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
      userForm.setFieldsValue({
        province: area.province,
        areaName: area.areaName,
      })
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
      userForm.setFieldsValue({
        province: '',
        areaName: '',
      })
    }
		setDataSet(dataSetT || []);
	}, []);
  /**
	 * 刷新数据
	 */
	const onloadData = () => {
    searchForm.resetFields()
    departRef.current.initSelect()
    getUserList(-1)
    getRolesList(-1)
  }
  /**
	 * 添加用户
	 */
	const openUserModel = () => {
    setAddUserModal(true)
    const deptOptionsT = departRef.current.dept?.filter(d => d.parentId === 0)?.map(d => ({
      label: d.name,
      value: d.deptId,
    })) || []
    setDeptOptions(deptOptionsT)
  }
  /**
   * 一级部门切换，二级部门选项、角色选项更新
   */
  const onChangeDept = (value: number) => {
    const secondDeptArr = departRef.current.dept?.filter(dept => dept.parentId === value)?.map(d => ({
      label: d.name,
      value: d.deptId,
    })) || []
    setSecondDeptOptions(secondDeptArr)
    const roleOptionsT = roles.filter(role => role.deptId === value)?.map(d => ({
      label: d.roleName,
      value: d.roleId,
    })) || []
    setRoleOptions(roleOptionsT)
  }
	return (
		<div className={styles.authorityUsers}>
			<DepartComp ref={departRef} clickChange={changeDataSetByArea} />
			<div className={styles.authorityUsers_content}>
				<Form form={searchForm}>
					<Row gutter={16}>
						<Col span={8}>
							<Form.Item label="用户名" name="username">
								<Input placeholder="请输入用户名"/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item label="姓名" name="nickName">
								<Input placeholder="请输入姓名"/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item>
								<div className={styles.authorityUsers_content_btn}>
									<Button
										type="primary"
										onClick={() => {
											searchQueueData();
										}}
									>
										查询
									</Button>
									<Button type="primary" onClick={() => {
                    onloadData()
                  }}>
										刷新
									</Button>
									<Button type="primary" onClick={() => {
                    openUserModel()
                  }}>添加用户</Button>
								</div>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={8}>
							<Form.Item>
								<div className={styles.authorityUsers_content_btn}>
									<Button icon={<VerticalAlignTopOutlined />}>批量导入账号</Button>
									<Button icon={<VerticalAlignBottomOutlined />}>下载批量导入模板</Button>
								</div>
							</Form.Item>
						</Col>
						<Col span={8}></Col>
						<Col span={8}></Col>
					</Row>
				</Form>

				<Table
					scroll={{ y: 55 * 8.5 }}
					bordered
					rowKey={record => record.idx}
					size={"small"}
					dataSource={dataSet}
					columns={dataColumns}
					rowClassName="editable-row"
					pagination={{ align: "center", pageSize: 10, total: dataSet.length, showTotal: (total, range) => `共 ${total} 条` }}
				/>
			</div>
      <Modal
        title={userModalTypeMap[userModalType]}
        open={addUserModal}
        cancelText='取消'
        okText='保存'
        destroyOnHidden={true}
        // onOk={() => setAddUserModal(false)}
        onCancel={() => setAddUserModal(false)}
        afterClose={() => {
          userForm.setFieldsValue({
            parentId: null,
            deptId: null,
            roleId: null,
            username: '',
            password: '',
            nickName: '',
            status: 'NORMAL',
          })
        }}
      >
        <Form form={userForm} {...layout} style={{width: '80%', margin: '0 auto'}}>
          <Form.Item label="所属省份" name="province">
            {userForm.getFieldValue('province') || '--'}
          </Form.Item>
          <Form.Item label="所属地域" name="areaName">
            {userForm.getFieldValue('areaName') || '--'}
          </Form.Item>
          <Form.Item label="一级部门" name="parentId">
            <Select options={deptOptions} onChange={onChangeDept} placeholder="请选择一级部门"/>
          </Form.Item>
          <Form.Item label="二级部门" name="deptId">
            <Select options={secondDeptOptions} placeholder="请选择二级部门"/>
          </Form.Item>
          <Form.Item label="角色" name="roleId">
            <Select options={roleOptions} placeholder="请选择角色"/>
          </Form.Item>
          <Form.Item label="用户名" name="username">
            <Input placeholder="请输入用户名"/>
          </Form.Item>
          <Form.Item label="密码" name="password">
            <Input.Password placeholder="请输入密码"/>
          </Form.Item>
          <Form.Item label="姓名" name="nickName">
            <Input placeholder="请输入姓名"/>
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select options={statusList} placeholder="请选择状态"/>
          </Form.Item>
        </Form>
      </Modal>
		</div>
	);
}
export default AuthorityUsersPage;
