import { getUseStock } from "@/api/modules/supervise";
import useDeptUsers from "@/hooks/useDeptUsers";
import useDict from "@/hooks/useDict";
import { tableRepeat } from "@/utils/util";
import { MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Flex, Form, Input, message, Radio, Row, Select, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { dateFormatSearch, tableMapperRow } from "hoslink-xxx";
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

function SuperviseSummary(props: any) {
	const [total, setTotal] = useState(0);
	const [pageNum, setPageNum] = useState(1);
	const [logList, setLogList] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
		storeDate: dayjs(new Date()).format(dateFormatSearch),
		typeId: 1,
		hospital: "",
	});
	useEffect(() => {
		getLogList({
			...searchObj.current,
		});
	}, [pageNum]);
	const getLogList = params => {
		setLoading(true);
		getUseStock(params).then(res => {
			let { subTypeList = [] } = res?.list || {};
			// setTotal(total);
      let dataT = tableRepeat(subTypeList, 'typeId', 'hospital')
      dataT = tableMapperRow(dataT, 'typeId');
			setLogList(dataT || []);
			setLoading(false);
		});
	};
	const searchPage = useCallback((values: any) => {
    setPageNum(1)
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
			title: "调用日期",
			dataIndex: "callDate",
			key: "callDate"
		}
	];
	return (
		<div className={styles.superviseSummary}>
			<Card title={<FormSearch searchPage={searchPage} />} style={{ width: "100%", height: "100%" }}>
				<Table
					columns={columns}
					rowKey={record => record.id}
					dataSource={logList}
					scroll={{ y: 54 * 8 }}
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
export default SuperviseSummary;

const FormSearch = memo((props: any) => {
	const { searchPage } = props;
	const { depts0ALL } = useDeptUsers();
	const { dictArrRef } = useDict();
	const [searchForm] = Form.useForm();
	const [hospitalsList, setHospitalsList] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
	const initValues = {
		storeDate: dayjs(new Date()),
		typeId: 1,
		hospital: "",
	};
  useEffect(() => {
    setTypeOptions(dictArrRef.current?.['type']?.map(item => ({
      label: item.name,
      value: item.id
    })) || [])
  }, [])
	useEffect(() => {
		setHospitalsList(
			depts0ALL?.filter(d => d.deptId == '' || (d.deptScope !=='F' && d.deptScope !=='G'))?.map(item => ({
				label: item.name,
				value: item.deptId
			})) || []
		);
	}, [depts0ALL]);

	const searchLog = () => {
		const values = searchForm.getFieldsValue();
		const params = {
			...values,
			storeDate: dayjs(values.storeDate).format(dateFormatSearch),
		};
		searchPage(params);
	};
	return (
		<Form form={searchForm} initialValues={initValues} style={{ margin: "10px 0" }}>
			<Row gutter={16}>
				<Col span={6}>
					<Form.Item label="时间" name="storeDate" style={{ marginBottom: 0 }}>
            <DatePicker allowClear style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item label="医院" name="hospital">
						<Select allowClear options={hospitalsList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={12}></Col>
				<Col span={12}>
					<Form.Item label="血液类型" name="typeId">
            <Radio.Group
              options={typeOptions}
            />
					</Form.Item>
        </Col>
				<Col span={4}>
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
