import { getHoslinkwsApiCallLog, getStaApiCallLog, getSupvlinkwsApiCallLog } from "@/api/modules/supervise";
import useDeptUsers from "@/hooks/useDeptUsers";
import { MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Flex, Form, Input, message, Row, Select, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import moment from "moment";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";

const logType = [
	{
		label: "错误日志",
		value: "1"
	},
	{
		label: "调用第三方日志",
		value: "2"
	},
	{
		label: "外部调用日志",
		value: "3"
	}
];

function ApiCallLog(props: any) {
	const [total, setTotal] = useState(0);
	const [pageNum, setPageNum] = useState(1);
	const [logList, setLogList] = useState([]);
	const [expandedRowKeys, setExpandedRowKeys] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
		startDate: dayjs(new Date()).subtract(7, "day").format(dateFormatSearch),
		endDate: dayjs(new Date()).format(dateFormatSearch),
		type: "1",
		hospitalId: "",
		uri: "",
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
		getStaApiCallLog(params).then(res => {
			let { list = [], total = 0 } = res?.result || {};
			setTotal(total);
      list?.forEach((e) => {
        e.param = typeof e.param === 'string' ? e.param.replace(/\\/g, '') : e.param
        e.returnStr = typeof e.returnStr === 'string' ? e.returnStr.replace(/\\/g, '') : e.returnStr
      })
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
	const updateLog = useCallback(async () => {
    await getSupvlinkwsApiCallLog({
      isStation: true
    })
    await getHoslinkwsApiCallLog()
	}, []);

	// 处理行展开/收起
	const handleExpand = (expanded, record) => {
		const keys = expanded ? [...expandedRowKeys, record.id] : expandedRowKeys.filter(id => id !== record.id);
		setExpandedRowKeys(keys);
	};
	const columns = [
		{
			title: "id",
			dataIndex: "id",
			key: "id"
		},
		{
			title: "用户名",
			dataIndex: "username",
			key: "username"
		},
		{
			title: "机构名称",
			dataIndex: "hospitalName",
			key: "hospitalName"
		},
		{
			title: "接口路径",
			dataIndex: "uri",
			key: "uri"
		},
		{
			title: "入参/出参",
			key: "param",
			dataIndex: "param",
			render: (_, record) => {
				const isExpanded = expandedRowKeys.includes(record.id);
				return (
					<div style={{ cursor: "pointer" }} onClick={() => handleExpand(!isExpanded, record)}>
						{isExpanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
					</div>
				);
			}
		},
		{
			title: "调用日期",
			dataIndex: "callDate",
			key: "callDate"
		}
	];
	const expandedRowRender = (params: any) => {
		return (
			<div style={{ margin: 0, padding: "16px 24px", background: "#fafafa" }}>
				<div style={{ marginBottom: 16 }}>
					<div style={{ fontWeight: "bold", marginBottom: 8 }}>入参:</div>
					<TextArea
						value={params.param}
						rows={4}
						style={{
							fontSize: "12px",
							background: "#fff"
						}}
						readOnly
					/>
				</div>
				<div>
					<div style={{ fontWeight: "bold", marginBottom: 8 }}>出参:</div>
					<TextArea
						value={params.returnStr}
						rows={8}
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
		<div className={styles.apiCallLog}>
			<Card title={<FormSearch searchPage={searchPage} updateLog={updateLog} />} style={{ width: "100%", height: "100%" }}>
				<Table
					columns={columns}
					rowKey={record => record.id}
					dataSource={logList}
					scroll={{ y: 54 * 8 }}
					loading={loading}
					expandable={{
						expandIcon: () => null,
						expandedRowKeys,
						onExpand: handleExpand,
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
export default ApiCallLog;

const FormSearch = memo((props: any) => {
	const { searchPage, updateLog } = props;
	const { depts0ALL } = useDeptUsers();
	const [searchForm] = Form.useForm();
	const [hospitalsList, setHospitalsList] = useState([]);
	const initValues = {
		startDate: dayjs(new Date()).subtract(7, "day"),
		endDate: dayjs(new Date()),
		type: "1",
		hospitalId: "",
		uri: ""
	};
	useEffect(() => {
		setHospitalsList(
			depts0ALL?.map(item => ({
				label: item.name,
				value: item.deptId
			}))
		);
	}, [depts0ALL]);

	const searchLog = () => {
		const values = searchForm.getFieldsValue();
		const params = {
			...values,
			startDate: dayjs(values.startDate).format(dateFormatSearch),
			endDate: dayjs(values.endDate).format(dateFormatSearch)
		};
		searchPage(params);
	};
	const updateFun = () => {
		updateLog(searchForm.getFieldsValue());
	};
	return (
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
					<Form.Item label="类型" name="type">
						<Select allowClear options={logType} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={4}>
					<Form.Item label="机构" name="hospitalId">
						<Select allowClear options={hospitalsList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item label="接口" name="uri">
						<Input allowClear style={{ width: "80%" }} />
					</Form.Item>
				</Col>
				<Col span={8}></Col>
				<Col span={8}></Col>
				<Col span={8}>
					<Form.Item label={null} style={{ margin: "0 auto" }}>
						<Flex gap="small" justify="center">
							<Button type="primary" onClick={() => searchLog()}>
								查询
							</Button>
							<Button onClick={() => updateFun()}>更新日志</Button>
						</Flex>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
});
