import { getAccountLog } from "@/api/modules/supervise";
import { Button, Card, Col, DatePicker, Flex, Form, Input, message, Row, Select, Table } from "antd";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";

const operationType = [
  {label: "全部", value: null},
  {label: "用户登录", value: "USER_LOGIN"},
  {label: "用户登出", value: "USER_LOGOUT"},
  {label: "新建用户", value: "USER_SAVE"},
  {label: "锁定用户", value: "USER_LOCK"},
  {label: "机构新增", value: "DEPT_SAVE"},
  {label: "机构锁定", value: "DEPT_LOCK"},
  {label: "角色新增", value: "ROLE_SAVE"},
];

function LogAccount(props: any) {
	const [total, setTotal] = useState(0);
	const [pageNum, setPageNum] = useState(1);
	const [logList, setLogList] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
		startDate: dayjs(new Date()).subtract(7, "day").format(dateFormatSearch),
		endDate: dayjs(new Date()).format(dateFormatSearch),
		feature: null,
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
		getAccountLog(params).then(res => {
			let { pageInfo = {} } = res || {};
			setTotal(pageInfo.total || 0);
      pageInfo.list.forEach(e => {
        if (e.content.startsWith("{") || e.content.endsWith("}")) {
        let newContent = JSON.parse(e.content)
        e.content = `${newContent.username}登录系统`
      }
    })
			setLogList(pageInfo.list || []);
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
			title: "操作类别",
			dataIndex: "feature",
			key: "feature"
		},
		{
			title: "操作内容",
			dataIndex: "content",
			key: "content"
		},
		{
			title: "操作时间",
			dataIndex: "operateDate",
			key: "operateDate"
		},
		{
			title: "操作帐号",
			dataIndex: "operator",
			key: "operator"
		},
	];
	return (
		<div className={styles.logAccount}>
			<Card title={<FormSearch searchPage={searchPage} />} style={{ width: "100%", height: "100%" }}>
				<Table
					columns={columns}
					rowKey={record => record.id}
					dataSource={logList}
					scroll={{ y: 58 * 8 }}
					loading={loading}
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
export default LogAccount;

const FormSearch = memo((props: any) => {
	const { searchPage } = props;
	const [searchForm] = Form.useForm();
	const initValues = {
		startDate: dayjs(new Date()).subtract(7, "day"),
		endDate: dayjs(new Date()),
		feature: null,
	};

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
				<Col span={8}>
					<Form.Item label="操作日期" style={{ marginBottom: 0 }}>
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
					<Form.Item label="操作类别" name="feature">
						<Select allowClear options={operationType} style={{ width: "100%" }} />
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
