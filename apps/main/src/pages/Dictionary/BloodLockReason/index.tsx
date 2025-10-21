import { addLockReasonStation, editLockReasonStation, getBloodLockReason } from "@/api/modules/dictionary";
import { modalTypeEnum } from "@/enums";
import useUserInfo from "@/hooks/useUserInfo";
import { sleep } from "@/utils/util";
import { CheckOutlined, CloseOutlined, PlusSquareOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Card, Col, Drawer, Flex, Form, Input, InputNumber, Row, Switch, Table, Tag } from "antd";
import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.less";
const { TextArea } = Input;

const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 18 }
};
const availableTagMap = {
  0: {
    color: 'red',
    icon: <CloseOutlined />,
    text: '禁用'
  },
  1: {
    color: 'blue',
    icon: <CheckOutlined />,
    text: '启用'
  }
}
function BloodLockReason(props: any) {
  const { userInfo } = useUserInfo();
	const [total, setTotal] = useState(0);
	const [pageNum, setPageNum] = useState(1);
	const [bloodLockReasonList, setBloodLockReasonList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [drawerType, setDrawerType] = useState<"add" | "edit">("add");
	const [drawForm] = Form.useForm();
  const editItem = useRef({})

	const getBloodLockReasonList = () => {
    setLoading(true);
		getBloodLockReason(null)
			.then(res => {
				const { list = [] } = res || {};
				list.sort((a, b) => a.uiOrder - b.uiOrder);
				setBloodLockReasonList(list?.map((item, index) => ({ ...item, idx: index + 1 })) || []);
				setTotal(res.total || 0);
			})
			.finally(() => {
				sleep(1000).then(() => setLoading(false));
			});
	};
	useEffect(() => {
		getBloodLockReasonList();
	}, []);

	const columns = [
		{
			title: "序号",
			dataIndex: "idx",
			key: "idx"
		},
		{
			title: "锁定原因",
			dataIndex: "name",
			key: "name"
		},
		{
			title: "排序",
			dataIndex: "uiOrder",
			key: "uiOrder"
		},
		{
			title: "状态",
			dataIndex: "available",
			key: "available",
			render: (text, record, index) => {
        const status = text || 0
				return <Tag color={availableTagMap[status].color}>{availableTagMap[status].text}</Tag>
			}
		},
		{
			title: "操作",
			dataIndex: "operation",
			key: "operation",
			render: (text, record, index) => {
				return (
					<Button type="primary" size="small" onClick={() => openDraw("edit", record)}>
						编辑
					</Button>
				);
			}
		}
	];
	const openDraw = (type: "add" | "edit", data?: any) => {
		setDrawerType(type);
		setDrawerVisible(true);
    if (type === 'edit') {
      editItem.current = data
      drawForm.setFieldsValue(data);
    }
	};
  const closeDrawer = () => {
    editItem.current = {}
    setDrawerVisible(false);
    drawForm.resetFields();
  }
  const handleSave = async () => {
    const value = await drawForm.validateFields()
    value.available = Number(value.available)
    const apiMap = {
      add: addLockReasonStation,
      edit: editLockReasonStation
    }
    const params = drawerType === 'add' ? {
      pronunciation: '',
      hospitalId: userInfo?.['dept']?.['parentId'],
      ...value
    } : {...editItem.current, ...value}
    apiMap[drawerType](params).then(() => {
      getBloodLockReasonList();
      closeDrawer();
    })
  }
	return (
		<div className={styles.bloodLockReason}>
			<Card
				style={{ width: "100%", height: "100%" }}
				title={
					<Row gutter={16}>
						<Col span={6}>
							<h1>血液锁定</h1>
							<p>血液锁定原因。</p>
						</Col>
						<Col span={14}></Col>
						<Col span={4}>
							<Flex
								gap="small"
								style={{
									height: 58
								}}
								justify="center"
								align="center"
							>
								<Button type="primary" icon={<PlusSquareOutlined />} onClick={() => openDraw("add")}>
									添加
								</Button>
								<Button icon={<UndoOutlined />} onClick={() => {
                  setPageNum(1)
                  getBloodLockReasonList()
                }}>
									刷新
								</Button>
							</Flex>
						</Col>
					</Row>
				}
			>
				<Table
					columns={columns}
					rowKey={record => record.idx}
					dataSource={bloodLockReasonList}
					scroll={{ y: 60 * 8 }}
					loading={loading}
					pagination={{
						total,
						current: pageNum,
						showSizeChanger: false,
						pageSize: 10,
						onChange: setPageNum
					}}
				/>
			</Card>
			<Drawer footer={
        <Flex gap="small" justify="center" align="center">
          <Button type="primary" htmlType="submit" form="drawForm" onClick={() => handleSave()}>
            确定
          </Button>
        </Flex>
      } width={480} title={modalTypeEnum[drawerType]} onClose={() => {
        closeDrawer();
      }} open={drawerVisible}>
				<Form
					{...layout}
					form={drawForm}
					initialValues={{
            id: '',
						name: "",
						uiOrder: 1,
						available: true
					}}
					style={{ margin: "10px 0" }}
				>
					<Form.Item label="血液锁定原因" name="name" required rules={[{ required: true, message: "请输入血液锁定原因" }]}>
						<TextArea showCount style={{ width: "100%" }} placeholder="请输入血液锁定原因" maxLength={50} />
					</Form.Item>
          
					<Form.Item label="排序" name="uiOrder" required rules={[{ required: true, message: "请输入排序" }]}>
						<InputNumber min={1} defaultValue={1}/>
					</Form.Item>
					<Form.Item label="是否启用" name="available">
						<Switch />
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	);
}
export default BloodLockReason;
