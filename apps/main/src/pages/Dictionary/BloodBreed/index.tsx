import { getDictBreed } from "@/api/modules/dictionary";
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
function BloodBreed(props: any) {
	const [total, setTotal] = useState(0);
	const [pageNum, setPageNum] = useState(1);
	const [dictBreedList, setDictBreedList] = useState([]);
	const [loading, setLoading] = useState(false);

	const getDictBreedList = () => {
    setLoading(true);
		getDictBreed(null)
			.then(res => {
				const { list = [] } = res || {};
				setDictBreedList(list?.map((item, index) => ({ ...item, idx: index + 1 })) || []);
				setTotal(res.total || 0);
			})
			.finally(() => {
				sleep(1000).then(() => setLoading(false));
			});
	};
	useEffect(() => {
		getDictBreedList();
	}, []);

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id"
		},
		{
			title: "产品名",
			dataIndex: "name",
			key: "name"
		},
		{
			title: "品种名",
			dataIndex: "subtypeName",
			key: "subtypeName"
		},
		{
			title: "容量",
			dataIndex: "capacity",
			key: "capacity"
		},
		{
			title: "单位",
			dataIndex: "unit",
			key: "unit"
		},
		{
			title: "换算单位",
			dataIndex: "conversion",
			key: "conversion"
		},
		{
			title: "状态",
			dataIndex: "available",
			key: "available",
			render: (text, record, index) => {
        const status = text || 0
				return <Tag color={availableTagMap[status].color}>{availableTagMap[status].text}</Tag>
			}
		}
	];
	return (
		<div className={styles['blood-breed']}>
			<Card
				style={{ width: "100%", height: "100%" }}
				title={
					<Row gutter={16}>
						<Col span={6}>
							<h1>血液产品</h1>
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
                  getDictBreedList()
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
					dataSource={dictBreedList}
					scroll={{ y: 64 * 8 }}
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
		</div>
	);
}
export default BloodBreed;
