import { getExceptionLog } from "@/api/modules/supervise";
import useDeptUsers from "@/hooks/useDeptUsers";
import { Button, Card, Col, DatePicker, Form, message, Row, Select, Table } from "antd";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";

function SuperviseException(props: any) {
	const [total, setTotal] = useState(0);
	const [pageNum, setPageNum] = useState(1);
	const [logList, setLogList] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
		beforeDate: dayjs(new Date()).subtract(7, "day").format(dateFormatSearch),
		afterDate: dayjs(new Date()).format(dateFormatSearch),
		hospitalId: "",
	});
	useEffect(() => {
		getLogList({
			...searchObj.current,
		});
	}, []);
	const getLogList = params => {
		setLoading(true);
		getExceptionLog(params).then(res => {
			let { result = [] } = res || {};
			setTotal(result.length);
			setLogList(result?.map((d, idx) => ({ ...d, idx })) || []);
			setLoading(false);
		});
	};
	const searchPage = useCallback((values: any) => {
    setPageNum(1);
		// 开始时间不能大于结束时间
		if (values.beforeDate && values.afterDate && values.beforeDate > values.afterDate) {
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
		});
	}, []);

	const columns = [
		{
			title: "时间",
			dataIndex: "networkTime",
			key: "networkTime"
		},
		{
			title: "医院名称",
			dataIndex: "hospital",
			key: "hospital"
		},
		{
			title: "异常原因",
			dataIndex: "operate",
			key: "operate"
		}
	];
  
	return (
		<div className={styles.superviseException}>
			<Card title={<FormSearch searchPage={searchPage} />} style={{ width: "100%", height: "100%" }}>
				<Table
					columns={columns}
					rowKey={record => record.idx}
					dataSource={logList}
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
		</div>
	);
}
export default SuperviseException;

const FormSearch = memo((props: any) => {
	const { searchPage } = props;
	const { deptsHos } = useDeptUsers();
	const [searchForm] = Form.useForm();
	const [hospitalsList, setHospitalsList] = useState([]);
	const initValues = {
		beforeDate: dayjs(new Date()).subtract(7, "day"),
		afterDate: dayjs(new Date()),
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

	const searchLog = () => {
		const values = searchForm.getFieldsValue();
		const params = {
			...values,
			beforeDate: dayjs(values.beforeDate).format(dateFormatSearch),
			afterDate: dayjs(values.afterDate).format(dateFormatSearch)
		};
		searchPage(params);
	};
	return (
		<Form form={searchForm} initialValues={initValues} style={{ margin: "10px 0" }}>
			<Row gutter={16}>
				<Col span={4}>
					<Form.Item label="医院名称" name="hospitalId">
						<Select allowClear options={hospitalsList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item label="异常时间" style={{ marginBottom: 0 }}>
						<Row gutter={10}>
							<Col span={12}>
								<Form.Item name="beforeDate">
									<DatePicker allowClear style={{ width: "100%" }} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name="afterDate">
									<DatePicker allowClear style={{ width: "100%" }} />
								</Form.Item>
							</Col>
						</Row>
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
