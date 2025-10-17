import { getReportLog } from "@/api/modules/supervise";
import useDeptUsers from "@/hooks/useDeptUsers";
import { Button, Card, Col, DatePicker, Form, message, Row, Select, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import useDict from "@/hooks/useDict";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";

function ReportLog(props: any) {
	const { transDepts0ById } = useDeptUsers();
	const [total, setTotal] = useState(0);
	const [pageNum, setPageNum] = useState(1);
	const [logList, setLogList] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
		startDate: dayjs(new Date()).subtract(7, "day").format(dateFormatSearch),
		endDate: dayjs(new Date()).format(dateFormatSearch),
		feature: "",
		hospitalId: "",
		pageSize: 10
	});
	useEffect(() => {
		getLogList({
			...searchObj.current,
			pageNum
		});
	}, [pageNum]);
	const getLogList = params => {
		setLoading(true);
		getReportLog(params).then(res => {
			let { list = [], total = 0 } = res?.result || {};
			setTotal(total);
			setLogList(list || []);
			setLoading(false);
		});
	};
	const searchPage = useCallback((values: any) => {
    setPageNum(1)
		// 开始时间不能大于结束时间
		if (values.startDate && values.endDate && values.startDate > values.endDate) {
			message.error("开始时间不能大于结束时间");
			return;
		}
		searchObj.current = {
			...searchObj.current,
			...values
		};
		getLogList({
			...searchObj.current,
			...values,
			pageNum: 1
		});
	}, []);

	const columns = [
		{
			title: "上报医院",
			dataIndex: "hospitalId",
			key: "hospitalId",
			render: (text, record, index) => {
				return record.hospitalId && transDepts0ById(record.hospitalId);
			}
		},
		{
			title: "上报时间",
			dataIndex: "operateDate",
			key: "operateDate"
		},
		{
			title: "上报类型",
			dataIndex: "type",
			key: "type"
		},
		{
			title: "上报操作",
			dataIndex: "feature",
			key: "feature"
		}
	];
	const expandedRowRender = (data: any) => {
		return (
			<div style={{ margin: 0, padding: "16px 24px", background: "#fafafa" }}>
				<div style={{ marginBottom: 16 }}>
					<TextArea
						value={data.params ? data.params : "空数据"}
						rows={4}
						style={{
							fontSize: "12px",
							background: "#fff"
						}}
						readOnly
					/>
				</div>
			</div>
		);
	};
	return (
		<div className={styles.reportLog}>
			<Card title={<FormSearch searchPage={searchPage} />} style={{ width: "100%", height: "100%" }}>
				<Table
					columns={columns}
					rowKey={record => record.id}
					dataSource={logList}
					scroll={{ y: 54 * 8 }}
					loading={loading}
					expandable={{
						expandedRowRender: record => expandedRowRender(record)
					}}
					pagination={{
						total,
						current: pageNum,
						showSizeChanger: false,
						pageSize: searchObj.current.pageSize,
						onChange: setPageNum
					}}
				/>
			</Card>
		</div>
	);
}
export default ReportLog;

const FormSearch = memo((props: any) => {
	const { searchPage } = props;
	const { dictArrRef } = useDict();
	const { deptsHos } = useDeptUsers();
	const [searchForm] = Form.useForm();
	const [hospitalsList, setHospitalsList] = useState([]);
	const [featureALL, setFeatureALL] = useState([]);
	const initValues = {
		startDate: dayjs(new Date()).subtract(7, "day"),
		endDate: dayjs(new Date()),
		feature: "",
		hospitalId: ""
	};
	useEffect(() => {
		setHospitalsList(
			deptsHos?.map(item => ({
				label: item.name,
				value: item.deptId
			}))
		);
	}, [deptsHos]);
	useEffect(() => {
		setFeatureALL(
			dictArrRef.current?.["featureALL"]?.map(item => ({
				label: item.name,
				value: item.id
			})) || []
		);
	}, []);

	const searchLog = () => {
		const values = searchForm.getFieldsValue();
		const params = {
			...values,
			startDate: dayjs(values.startDate).format(dateFormatSearch),
			endDate: dayjs(values.endDate).format(dateFormatSearch)
		};
		searchPage(params);
	};
	return (
		<Form form={searchForm} initialValues={initValues} style={{ margin: "10px 0" }}>
			<Row gutter={16}>
				<Col span={4}>
					<Form.Item label="上报医院" name="hospitalId">
						<Select allowClear options={hospitalsList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item label="上报时间" style={{ marginBottom: 0 }}>
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
					<Form.Item label="上报操作" name="feature">
						<Select allowClear options={featureALL} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item label={null} style={{ margin: "0 auto" }}>
						<Button type="primary" onClick={() => searchLog()}>
							查询
						</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
});
