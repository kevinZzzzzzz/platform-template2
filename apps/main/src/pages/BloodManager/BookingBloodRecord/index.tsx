import { getBookingBloodRecord } from "@/api/modules/bloodManager";
import useDeptUsers from "@/hooks/useDeptUsers";
import useDict from "@/hooks/useDict";
import { tableRepeat, tableMapperRow } from "@/utils/util";
import { Button, Card, Checkbox, Col, DatePicker, Form, Input, message, Radio, Row, Select, Table, Tag } from "antd";
import dayjs from "dayjs";
import { dateFormatSel } from "hoslink-xxx";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";
const StatusColors = {
  "VERIFIED":"#FFA500",
  "CANCEL": "#CD0000",
  "APPLYING": "#2db7f5",
  "OUTSTORE": "green",
  "PREPARED": "#7CCD7C",
  "CONFIRMED": '#00BFFF',
  "COMPLETED": '#FFD700',
  "APPLYCANCEL": '#BFBFBF',
  "PENDING": '#1E90FF',
}
function BookingBloodRecord(props: any) {
	const { transformByMapper } = useDict();
	const { transDepts0ById } = useDeptUsers();
	const [total, setTotal] = useState(0);
	const [pageNum, setPageNum] = useState(1);
	const [dataList, setDataList] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
		startUseDate: "",
		endUseDate: "",
		startOrderDate: dayjs(new Date()).subtract(7, "day").format(dateFormatSel),
		endOrderDate: dayjs(new Date()).format(dateFormatSel),
		deptId: "",
		subtypeId: "",
		bloodGroup: "",
		rhBloodGroup: "",
		orderStatus: "",
		orderType: "",
		orderNo: "",
		pageNum,
		pageSize: 10
	});
	useEffect(() => {
		getLogList({
			...searchObj.current
		});
	}, [pageNum]);
	const getLogList = params => {
		setLoading(true);
		getBookingBloodRecord(params)
			.then((res: any) => {
				const { total = 0, list = [] } = res?.mainList || {};
				setDataList(
					list
						?.sort((a, b) => {
							return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
						})
						?.map((d, idx) => ({ ...d, idx: idx + 1 })) || []
				);
				setTotal(total || 0);
			})
			.finally(() => {
				setLoading(false);
			});
	};
	const searchPage = useCallback((values: any) => {
		setPageNum(1);
		searchObj.current = {
			...searchObj.current,
			...values
		};
		getLogList({
			...searchObj.current
		});
	}, []);
	const columns = [
		{
			title: "序号",
			dataIndex: "idx",
			width: 60,
			key: "idx"
		},
		{
			title: "下单时间",
			dataIndex: "orderDate",
			key: "orderDate"
		},
		{
			title: "预订医院",
			dataIndex: "hospitalName",
			key: "hospitalName"
		},
		{
			title: "预订单号",
			dataIndex: "orderNo",
			key: "orderNo"
		},
		{
			title: "预计用血日期",
			dataIndex: "useDate",
			key: "useDate",
			render: (text, record, index) => dayjs(text).format('YYYY-MM-DD')
		},
		{
			title: "预订类型",
			dataIndex: "orderType",
			key: "orderType",
      render: (text) => {
        return (
          <Tag color={text === 'EMERGENCY' ? '#f50' : "#87d068"}>
            {transformByMapper(text, ["orderType", 'name']) || '--'}
          </Tag>
        )
      }
		},
		{
			title: "下单人",
			dataIndex: "applicant",
			key: "applicant"
		},
		{
			title: "备注",
			dataIndex: "description",
			key: "description"
		},
		{
			title: "状态",
			dataIndex: "orderStatus",
			key: "orderStatus",
      render: (text) => {
        return (
          <Tag color={StatusColors[text]}>
            {transformByMapper(text, ["orderStatus", 'name']) || '--'}
          </Tag>
        )
      }
		},
		{
			title: "操作",
			dataIndex: "",
			key: "edit",
			render: (text, record, index) => <a onClick={() => handleEdit(record)}>查看</a>
		}
	];
	return (
		<div className={styles.bookingBloodRecord}>
			<Card title={<FormSearch searchPage={searchPage} />} style={{ width: "100%", height: "100%" }}>
				<Table
					columns={columns}
					rowKey={record => record.idx}
					dataSource={dataList}
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
export default BookingBloodRecord;

const FormSearch = memo((props: any) => {
	const { searchPage } = props;
	const { deptsHos } = useDeptUsers();
	const { dictArrRef } = useDict();
	const [searchForm] = Form.useForm();
	const [hospitalsList, setHospitalsList] = useState([]);
	const [orderTypeList, setOrderTypeList] = useState([]);
	const [bloodgroup, setBloodgroup] = useState([]);
	const [rhBloodgroupList, setRhBloodgroupList] = useState([]);
	const [subtypeList, setSubtypeList] = useState([]);
	const [orderStatusList, setOrderStatusList] = useState([]);
	const [timeType, setTimeType] = useState<0 | 1>(0);
	const initValues = {
		startOrderDate: dayjs(new Date()).subtract(7, "day"),
		endOrderDate: dayjs(new Date()),
		deptId: "",
		bloodGroup: "",
		rhBloodGroup: "",
		subtypeId: "",
		orderStatus: "",
		startUseDate: "",
		endUseDate: "",
		orderType: "",
		orderNo: ""
	};
	useEffect(() => {
		setBloodgroup(
			dictArrRef.current?.["bloodgroupALL"]
				?.filter(d => d.id !== "NOT")
				?.map(item => ({
					label: item.name,
					value: item.id
				})) || []
		);
		setRhBloodgroupList(
			dictArrRef.current?.["rhbloodgroupALL"]
				?.filter(d => d.id !== "UNKNOW")
				?.map(item => ({
					label: item.name,
					value: item.id
				})) || []
		);
		setSubtypeList(
			dictArrRef.current?.["subtypeALL"]?.map(item => ({
				label: item.name,
				value: item.id
			})) || []
		);
		setOrderStatusList(
			dictArrRef.current?.["orderStatusALL"]?.map(item => ({
				label: item.name,
				value: item.id
			})) || []
		);
		setOrderTypeList(
			dictArrRef.current?.["orderTypeALL"]?.map(item => ({
				label: item.name,
				value: item.id
			})) || []
		);
	}, []);
	useEffect(() => {
		if (deptsHos && deptsHos.length > 0) {
			setHospitalsList(
				deptsHos?.map(item => ({
					label: item.name,
					value: item.deptId
				}))
			);
			searchForm.setFieldValue("hospital", deptsHos[0]?.deptId || "");
		}
	}, [deptsHos]);

	const searchLog = async () => {
		await searchForm.validateFields();
		const values = searchForm.getFieldsValue();
		if (values.startOrderDate && values.endOrderDate && dayjs(values.startOrderDate).isAfter(dayjs(values.endOrderDate))) {
			message.error("开始日期不能晚于结束日期");
			return false;
		}

		const params = {
			...values,
			startUseDate: timeType ? dayjs(values.startOrderDate).format(dateFormatSel) : "",
			endUseDate: timeType ? dayjs(values.endOrderDate).format(dateFormatSel) : "",
			startOrderDate: !timeType ? dayjs(values.startOrderDate).format(dateFormatSel) : "",
			endOrderDate: !timeType ? dayjs(values.endOrderDate).format(dateFormatSel) : ""
		};
		searchPage(params);
	};
	return (
		<Form form={searchForm} initialValues={initValues} style={{ margin: "10px 0" }}>
			<Row gutter={16}>
				<Col span={9}>
					<Form.Item label={null} style={{ marginBottom: 0 }}>
						<Row gutter={12}>
							<Col span={8}>
								<Select
									value={timeType}
									options={[
										{
											label: "下单日期",
											value: 0
										},
										{
											label: "预计用血日期",
											value: 1
										}
									]}
									onChange={setTimeType}
								/>
							</Col>
							<Col span={8}>
								<Form.Item name="startOrderDate">
									<DatePicker allowClear style={{ width: "100%" }} />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="endOrderDate">
									<DatePicker allowClear style={{ width: "100%" }} />
								</Form.Item>
							</Col>
						</Row>
					</Form.Item>
				</Col>
				<Col span={5}>
					<Form.Item label="医院" name="deptId">
						<Select allowClear showSearch options={hospitalsList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={5}>
					<Form.Item label="预订类型" name="orderType">
						<Select allowClear showSearch options={orderTypeList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={5}>
					<Form.Item label="状态" name="orderStatus">
						<Select allowClear showSearch options={orderStatusList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={5}>
					<Form.Item label="血液品种" name="subtypeId">
						<Select allowClear showSearch options={subtypeList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={4}>
					<Form.Item label="ABO血型" name="bloodGroup">
						<Select allowClear showSearch options={bloodgroup} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={5}>
					<Form.Item label="Rh血型" name="rhBloodGroup">
						<Select allowClear showSearch options={rhBloodgroupList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={5}>
					<Form.Item label="预订单号" name="orderNo">
						<Input allowClear style={{ width: "100%" }} placeholder="请输入预订单号" />
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
