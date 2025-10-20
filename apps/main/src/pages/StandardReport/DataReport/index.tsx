import { reportInTime } from "@/api/modules/supervise";
import useDeptUsers from "@/hooks/useDeptUsers";
import { Button, Card, Col, DatePicker, Form, Row, Select, Table } from "antd";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import React, { useState, useEffect } from "react";
import styles from "./index.module.less";

function DataReport(props: any) {
	const { depts0ALL } = useDeptUsers();
	const [searchForm] = Form.useForm();
	const [logList, setLogList] = useState([
		{
			uri: "sapp/api/app",
			name: "申请单上报"
		},
		{
			uri: "sapp/api/instock",
			name: "入库上报"
		},
		{
			uri: "sapp/api/store",
			name: "库存明细上报"
		},
		{
			uri: "sapp/api/outstock",
			name: "出库上报"
		},
		{
			uri: "sapp/api/rea",
			name: "不良反应上报"
		},
		{
			uri: "sapp/api/scrap",
			name: "报废上报"
		},
		{
			uri: "sapp/api/evaluate",
			name: "输血后评价上报"
		},
		{
			uri: "sapp/api/recover",
			name: "血袋回收上报"
		},
		{
			uri: "sapp/api/bloodTracing",
			name: "同步血袋溯源信息上报"
		}
	]);
	const [hospitalsList, setHospitalsList] = useState([]);
	const initValues = {
		startDate: dayjs(new Date()).subtract(1, "day"),
		endDate: dayjs(new Date()),
		hospitalId: ""
	};
	useEffect(() => {
		setHospitalsList(
			depts0ALL
				?.map(item => ({
					...item,
					label: item.name,
					value: item.deptId
				}))
				.filter(e => {
					return e.deptId == "" || e.deptScope === "E";
				}) || []
		);
	}, [depts0ALL]);
	const [loading, setLoading] = useState(false);
	const report = (uri: string) => {
		setLoading(true);
		reportInTime(uri, {
			hospitalId: searchForm.getFieldValue("hospitalId"),
			startDate: dayjs(searchForm.getFieldValue("startDate")).format(dateFormatSearch),
			endDate: dayjs(searchForm.getFieldValue("endDate")).format(dateFormatSearch)
		}).finally(() => {
			setLoading(false);
		});
	};

	const columns = [
		{
			title: "序号",
			dataIndex: "index",
			key: "index",
			render: (text, record, index) => {
				return index + 1;
			}
		},
		{
			title: "接口",
			dataIndex: "name",
			key: "name"
		},
		{
			title: "接口路径",
			dataIndex: "uri",
			key: "uri"
		},
		{
			title: "操作",
			dataIndex: "feature",
			key: "feature",
			render: (text, record) => {
				return (
					<Button type="primary" size="small" onClick={() => report(record.uri)}>
						上报
					</Button>
				);
			}
		}
	];
	return (
		<div className={styles.dataReport}>
			<Card
				title={
					<Form form={searchForm} initialValues={initValues} style={{ margin: "10px 0" }}>
						<Row gutter={16}>
							<Col span={8}>
								<Form.Item label="时间" style={{ marginBottom: 0 }}>
									<Row gutter={10}>
										<Col span={12}>
											<Form.Item name="startDate">
												<DatePicker allowClear style={{ width: "100%" }} />
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item name="endDate">
												<DatePicker allowClear style={{ width: "100%" }} />
											</Form.Item>
										</Col>
									</Row>
								</Form.Item>
							</Col>
							<Col span={4}>
								<Form.Item label="医院" name="hospitalId">
									<Select allowClear options={hospitalsList} style={{ width: "100%" }} />
								</Form.Item>
							</Col>
						</Row>
					</Form>
				}
				style={{ width: "100%", height: "100%" }}
			>
				<Table
					columns={columns}
					rowKey={record => record.id}
					dataSource={logList}
					scroll={{ y: 65 * 8 }}
					loading={loading}
					pagination={false}
				/>
			</Card>
		</div>
	);
}
export default DataReport;
