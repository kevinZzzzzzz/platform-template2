import { getHospitalReturnList } from "@/api/modules/bloodManager";
import { getUseBloodStock } from "@/api/modules/supervise";
import useDeptUsers from "@/hooks/useDeptUsers";
import useDict from "@/hooks/useDict";
import { tableRepeat, tableMapperRow} from "@/utils/util";
import { Button, Card, Checkbox, Col, DatePicker, Form, Input, Radio, Row, Select, Table } from "antd";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";

function HospitalReturnList(props: any) {
	const { transformByMapper } = useDict();
	const { transDepts0ById} = useDeptUsers();
	const [total, setTotal] = useState(0);
	const [pageNum, setPageNum] = useState(1);
	const [dataList, setDataList] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
		startTime: dayjs(new Date()).subtract(1, "month").format(dateFormatSearch),
		endTime: dayjs(new Date()).format(dateFormatSearch),
    hospitalId: '',
    status: '',
    applyId: '',
	});
	useEffect(() => {
		getLogList({
			...searchObj.current,
		});
	}, []);
	const getLogList = params => {
		setLoading(true);
    getHospitalReturnList(params).then((res: any) => {
      const {list = []} = res || {};
      const listT = list?.sort((a, b) => {
        return new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime();
      })
      setDataList(listT?.map((d, idx) => ({
        ...d,
        idx: idx + 1,
      })));
    }).finally(() => {
      setLoading(false);
    })
	};
	const searchPage = useCallback((values: any) => {
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
			title: "退血医院",
			dataIndex: "hospitalId",
			key: "hospitalId",
      render: (text, record, index) => {
        return transDepts0ById(text);
      }
		},
		{
			title: "退血时间",
			dataIndex: "applyDate",
			key: "applyDate",
		},
		{
			title: "退血单号",
			dataIndex: "id",
			key: "id"
		},
		{
			title: "交接单号",
			dataIndex: "syncId",
			key: "syncId"
		},
		{
			title: "退血人",
			dataIndex: "applyBy",
			key: "applyBy"
		},
		{
			title: "袋数",
			dataIndex: "bloodBags",
			key: "bloodBags",
      render: (text, record, index) => {
        return text.length || 0
      }
		},
		{
			title: "备注",
			dataIndex: "remark",
			key: "remark"
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status"
		},
		{
			title: "操作",
			dataIndex: "",
			key: "edit",
			render: (text, record, index) => <a onClick={() => handleView(record)}>查看</a>
		}
	];
	return (
		<div className={styles.hospitalReturnList}>
			<Card title={<FormSearch searchPage={searchPage} />} style={{ width: "100%", height: "100%" }}>
				<Table
					columns={columns}
					rowKey={record => record.idx}
					dataSource={dataList}
					scroll={{ y: 54 * 8 }}
					loading={loading}
					pagination={false}
				/>
			</Card>
		</div>
	);
}
export default HospitalReturnList;

const FormSearch = memo((props: any) => {
	const { searchPage } = props;
	const { deptsHos } = useDeptUsers();
	const { dictArrRef } = useDict();
	const [searchForm] = Form.useForm();
	const [hospitalsList, setHospitalsList] = useState([]);
  
	const initValues = {
		startTime: dayjs(new Date()).subtract(1, "month"),
		endTime: dayjs(new Date()),
    hospitalId: '',
    status: '',
    applyId: '',
	};
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
		const params = {
			...values,
			startTime: dayjs(values.startTime).format(dateFormatSearch),
			endTime: dayjs(values.endTime).format(dateFormatSearch)
		};
    searchPage(params)
	};
	return (
		<Form form={searchForm} initialValues={initValues} style={{ margin: "10px 0" }}>
			<Row gutter={16}>
				<Col span={8}>
					<Form.Item label="退血日期" style={{ marginBottom: 0 }}>
						<Row gutter={10}>
							<Col span={12}>
								<Form.Item name="startTime">
									<DatePicker allowClear style={{ width: "100%" }} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name="endTime">
									<DatePicker allowClear style={{ width: "100%" }} />
								</Form.Item>
							</Col>
						</Row>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item label="退血医院" name="hospitalId">
						<Select allowClear showSearch options={hospitalsList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
        <Col span={6}>
					<Form.Item label="退血单号" name="applyId">
            <Input allowClear placeholder="请输入退血单号" style={{ width: "100%" }} />
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
