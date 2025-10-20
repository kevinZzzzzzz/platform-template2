import { getSuggestion } from "@/api/modules/dictionary";
import { modalTypeEnum } from "@/enums";
import { PlusSquareOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Card, Col, Drawer, Flex, Form, Input, InputNumber, Row, Switch, Table } from "antd";
import React, { useState, useEffect } from "react";
import styles from "./index.module.less";

const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 18 }
};
function SuggestionPage(props: any) {
	const [total, setTotal] = useState(0);
	const [pageNum, setPageNum] = useState(1);
	const [suggestionList, setSuggestionList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [drawerType, setDrawerType] = useState<"add" | "exit">("add");
	const [drawForm] = Form.useForm();

	const getSuggestionList = () => {
		getSuggestion(null)
			.then(res => {
				const { list = [] } = res || {};
				list.sort((a, b) => a.uiOrder - b.uiOrder);
				setSuggestionList(list || []);
				setTotal(res.total || 0);
			})
			.finally(() => {
				setLoading(false);
			});
	};
	useEffect(() => {
		getSuggestionList();
	}, []);

	const columns = [
		{
			title: "序号",
			dataIndex: "idx",
			key: "idx",
			render: (text, record, index) => {
				return index + 1;
			}
		},
		{
			title: "回复内容",
			dataIndex: "name",
			key: "name"
		},
		{
			title: "排序",
			dataIndex: "uiOrder",
			key: "uiOrder"
		},
		{
			title: "是否启用",
			dataIndex: "available",
			key: "available",
			render: (text, record, index) => {
				return text ? "是" : "否";
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
	const openDraw = (type: "add" | "exit", data?: any) => {
		setDrawerType(type);
		setDrawerVisible(true);
	};
	return (
		<div className={styles.suggestionPage}>
			<Card
				style={{ width: "100%", height: "100%" }}
				title={
					<Row gutter={16}>
						<Col span={6}>
							<h1>血液预订快捷回复</h1>
							<p>配置当前血站的血液预订快捷回复语句。</p>
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
								<Button icon={<UndoOutlined />} onClick={() => getSuggestionList()}>
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
					dataSource={suggestionList}
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
          <Button type="primary" htmlType="submit" form="drawForm">
            确定
          </Button>
        </Flex>
      } width={400} title={modalTypeEnum[drawerType]} onClose={() => setDrawerVisible(false)} open={drawerVisible}>
				<Form
					{...layout}
					form={drawForm}
					initialValues={{
						name: "",
						uiOrder: 1,
						available: true
					}}
					style={{ margin: "10px 0" }}
				>
					<Form.Item label="回复内容" name="name" required rules={[{ required: true, message: "请输入回复内容" }]}>
						<Input style={{ width: "100%" }} placeholder="请输入回复内容" maxLength={50} />
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
export default SuggestionPage;
