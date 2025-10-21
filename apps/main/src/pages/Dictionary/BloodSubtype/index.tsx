import { getDictSubtype } from "@/api/modules/dictionary";
import { modalTypeEnum } from "@/enums";
import { sleep } from "@/utils/util";
import { CheckOutlined, CloseOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Card, Col, Drawer, Flex, Form, Input, Row, Switch, Table, Tag } from "antd";
import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.less";

const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 18 }
};

const availableTagMap = {
	"0": {
		color: "red",
		icon: <CloseOutlined />,
		text: "否"
	},
	"1": {
		color: "blue",
		icon: <CheckOutlined />,
		text: "是"
	}
};
function BloodSubtype(props: any) {
	const [total, setTotal] = useState(0);
	const [pageNum, setPageNum] = useState(1);
	const [dictSubtypeList, setDictSubtypeList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [drawerType, setDrawerType] = useState<"add" | "edit" | "view">("add");
	const [drawForm] = Form.useForm();
	const editItem = useRef({});

	const getDictSubtypeList = () => {
		setLoading(true);
		getDictSubtype(null)
			.then(res => {
				const { list = [] } = res || {};
				setDictSubtypeList(list?.map((item, index) => ({ ...item, idx: index + 1 })) || []);
				setTotal(res.total || 0);
			})
			.finally(() => {
				sleep(1000).then(() => setLoading(false));
			});
	};
	useEffect(() => {
		getDictSubtypeList();
	}, []);

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			width: 100,
			key: "id"
		},
		{
			title: "中类名",
			dataIndex: "name",
			key: "name"
		},
		{
			title: "单位",
			dataIndex: "unit",
			width: 80,
			key: "unit"
		},
		{
			title: "是否可用",
			width: 100,
			dataIndex: "available",
			key: "available",
			render: (text, record, index) => {
				const status = text || 0;
				return <Tag color={availableTagMap[status].color}>{availableTagMap[status].text}</Tag>;
			}
		},
		{
			title: "血液大类",
			dataIndex: "typeName",
			key: "typeName"
		},
		// {
		// 	title: "第三方系统血液品种编码",
		// 	dataIndex: "subtypeMapId",
		// 	key: "subtypeMapId"
		// },
		// {
		// 	title: "第三方系统血液品种名称",
		// 	dataIndex: "subtypeMapName",
		// 	key: "subtypeMapName"
		// },
		// {
		// 	title: "第三方系统单位换算",
		// 	dataIndex: "subtypeMapUnit",
		// 	key: "subtypeMapUnit"
		// },
		{
			title: "操作",
			dataIndex: "operation",
			key: "operation",
			render: (text, record, index) => {
				return (
					<Button type="primary" size="small" onClick={() => openDraw("view", record)}>
						查看
					</Button>
				);
			}
		}
	];
	const openDraw = (type: "add" | "edit" | "view", data?: any) => {
		setDrawerType(type);
		setDrawerVisible(true);
		if (type === "edit" || type === "view") {
			editItem.current = data;
			drawForm.setFieldsValue(data);
		}
	};
	const closeDrawer = () => {
		editItem.current = {};
		setDrawerVisible(false);
		drawForm.resetFields();
	};
	// const handleSave = async () => {
	//   const value = await drawForm.validateFields()
	//   value.available = Number(value.available)
	//   const apiMap = {
	//     add: addSuggestion,
	//     edit: editSuggestion
	//   }
	//   const params = drawerType === 'add' ? value : {...editItem.current, ...value}
	//   apiMap[drawerType](params).then(() => {
	//     getDictSubtypeList();
	//     closeDrawer();
	//   })
	// }
	return (
		<div className={styles.bloodSubtype}>
			<Card
				style={{ width: "100%", height: "100%" }}
				title={
					<Row gutter={16}>
						<Col span={6}>
							<h1>血液品种</h1>
						</Col>
						<Col span={14}></Col>
						<Col span={4}>
							<Flex
								gap="small"
								style={{
									height: 38
								}}
								justify="center"
								align="center"
							>
								<Button icon={<UndoOutlined />} onClick={() => {
                  setPageNum(1)
                  getDictSubtypeList()
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
					dataSource={dictSubtypeList}
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
			<Drawer
				// footer={
				//   <Flex gap="small" justify="center" align="center">
				//     <Button type="primary" htmlType="submit" form="drawForm" onClick={() => handleSave()}>
				//       确定
				//     </Button>
				//   </Flex>
				// }
				width={400}
				title={modalTypeEnum[drawerType]}
				onClose={() => {
					closeDrawer();
				}}
				open={drawerVisible}
			>
				<Form
					{...layout}
					form={drawForm}
					initialValues={{
						id: "",
						name: "",
						unit: "",
						typeName: "",
						available: true
					}}
					style={{ margin: "10px 0" }}
				>
					<Form.Item label="ID" name="id" required rules={[{ required: true, message: "请输入ID" }]}>
						<Input disabled={drawerType == "view"} />
					</Form.Item>
					<Form.Item label="中类名" name="name" required rules={[{ required: true, message: "请输入中类名" }]}>
						<Input disabled={drawerType == "view"} />
					</Form.Item>
					<Form.Item label="单位" name="unit" required rules={[{ required: true, message: "请输入单位" }]}>
						<Input disabled={drawerType == "view"} />
					</Form.Item>
					<Form.Item label="血液大类" name="typeName" required rules={[{ required: true, message: "请输入血液大类" }]}>
						<Input disabled={drawerType == "view"} />
					</Form.Item>
					<Form.Item label="是否启用" name="available" required>
						<Switch checkedChildren="是" unCheckedChildren="否" disabled={drawerType == "view"} />
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	);
}
export default BloodSubtype;
