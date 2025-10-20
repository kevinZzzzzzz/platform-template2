import { getHosDataQuality } from "@/api/modules/supervise";
import useDeptUsers from "@/hooks/useDeptUsers";
import useDict from "@/hooks/useDict";
import { Button, Card, Col, DatePicker, Form, message, Radio, Row, Select, Table } from "antd";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";

function HospitalDataQuality(props: any) {
	const { transDepts0ById } = useDeptUsers();
	const [total, setTotal] = useState(0);
	const [pageNum, setPageNum] = useState(1);
	const [logList, setLogList] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
		startDate: dayjs(new Date()).subtract(7, "day").format(dateFormatSearch),
		endDate: dayjs(new Date()).format(dateFormatSearch),
		amountType: 0,
		type: ""
	});
	useEffect(() => {
		getLogList({
			...searchObj.current
		});
	}, []);
	const getLogList = params => {
		setLoading(true);
		getHosDataQuality(params)
			.then(res => {
				let { data = [] } = res || {};
				if (params.amountType) {
					data = data.map((item) => ({
						...item,
						intstoreSta: +item.intstoreSta,
						outstoreClinic: +item.outstoreClinic,
						legitimateIDNumber: +item.legitimateIDNumber
					}));
				}
				setTotal(data.length);
				setLogList(data?.map((d, idx) => ({ ...d, idx })) || []);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	};
	const searchPage = useCallback((values: any) => {
		setPageNum(1);
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
			...values
		});
	}, []);

	const columns = [
		{
			title: "医院名称",
			dataIndex: "hospital",
			key: "hospital",
			render: (text, record, index) => {
				return record.hospital && transDepts0ById(record.hospital);
			}
		},
		{
			title: "医院间调入数量",
      render: (text, record, index) => {
        return 0
      }
		},
		{
			title: "医院间调出数量",
      render: (text, record, index) => {
        return 0
      }
		},
		{
			title: "医院系统从血站入库数量",
			width: 200,
			dataIndex: "intstoreSta",
			key: "intstoreSta",
      render: (text, record, index) => {
        return record.intstoreSta || 0
      }
		},
		{
			title: "医院临床使用数量",
			dataIndex: "outstoreClinic",
			key: "outstoreClinic",
      render: (text, record, index) => {
        return record.outstoreClinic || 0
      }
		},
		{
			title: "医院临床使用数中合法身份证的U",
			width: 240,
			dataIndex: "legitimateIDNumber",
			key: "legitimateIDNumber",
      render: (text, record, index) => {
        return record.legitimateIDNumber || 0
      }
		},
		{
			title: "库存明细",
			dataIndex: "bloodBagCount",
			key: "bloodBagCount",
      render: (text, record, index) => {
        return record.bloodBagCount || 0
      }
		},
		{
			title: "库存过期血液",
			dataIndex: "failBloodBagCount",
			key: "failBloodBagCount",
      render: (text, record, index) => {
        return record.failBloodBagCount || 0
      }
		},
		{
			title: "库存填报时间(48小时内)",
			width: 200,
			dataIndex: "lastReportTime",
			key: "lastReportTime"
		}
	];

	return (
		<div className={styles.hospitalDataQuality}>
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
export default HospitalDataQuality;

const FormSearch = memo((props: any) => {
	const { searchPage } = props;
	const { dictArrRef } = useDict();
	const [searchForm] = Form.useForm();
	const [bloodType, setBloodType] = useState([]);
	const initValues = {
		startDate: dayjs(new Date()).subtract(7, "day"),
		endDate: dayjs(new Date()),
		amountType: 0,
		type: ""
	};
	useEffect(() => {
		setBloodType(
			dictArrRef.current?.typeALL?.map(item => ({
				label: item.name,
				value: item.id
			}))
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
					<Form.Item label="血液大类" name="type">
						<Select allowClear options={bloodType} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={3}>
					<Form.Item label={null} name="amountType">
						<Radio.Group
							options={[
								{ value: 0, label: "按量" },
								{ value: 2, label: "按袋" }
							]}
						/>
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
