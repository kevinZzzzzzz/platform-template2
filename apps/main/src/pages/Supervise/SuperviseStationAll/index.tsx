import { getStatisticsStoreDetail } from "@/api/modules/supervise";
import useDeptUsers from "@/hooks/useDeptUsers";
import useDict from "@/hooks/useDict";
import { tableRepeat, tableMapperRow} from "@/utils/util";
import { Button, Card, Checkbox, Col, DatePicker, Form, Radio, Row, Select, Table } from "antd";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";

function SuperviseStationAll(props: any) {
	const { transformByMapper } = useDict();
	const { transDepts0ById } = useDeptUsers();
	// const [total, setTotal] = useState(0);
	// const [pageNum, setPageNum] = useState(1);
	const [logList, setLogList] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
		startDate: dayjs(new Date()).format(dateFormatSearch),
		typeId: [],
		hospital: "",
	});
	useEffect(() => {
		// getLogList({
		// 	...searchObj.current,
		// });
	}, []);
	const getLogList = params => {
		setLoading(true);
		getStatisticsStoreDetail(params).then(res => {
			let { store = [] } = res || {};
      const list = [];
      store.map(function (d1) {
        d1.subTypeResult.map(function (d2) {
          d2.typeName = d1.typeName;
          d2.typeId = d1.typeId;
          list.push(d2);
        })
      })
      let dataT = tableRepeat(list, 'typeId', 'subTypeId')
      dataT = tableMapperRow(dataT, 'typeId');
      dataT = dataT.map((d, idx) => {
        return {
          ...d,
          idx: idx + 1,
          total: d.aPos + d.aNeg + d.bPos + d.bNeg + d.abPos + d.abNeg + d.oPos + d.oNeg,
        }
      })
			setLogList(dataT || []);
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
			title: "大类",
			dataIndex: "typeName",
			key: "typeName",
      onCell: (record) => {
        return {
          rowSpan: record[0]
        }
      },
		},
		{
			title: "中类",
			dataIndex: "subTypeName",
			key: "subTypeName",
		},
		{
			title: "总数",
			dataIndex: "total",
			key: "total"
		},
		{
			title: "A+",
			dataIndex: "aPos",
			key: "aPos"
		},
		{
			title: "B+",
			dataIndex: "bPos",
			key: "bPos"
		},
		{
			title: "O+",
			dataIndex: "oPos",
			key: "oPos"
		},
		{
			title: "AB+",
			dataIndex: "abPos",
			key: "abPos"
		},
		{
			title: "RH+总",
			dataIndex: "posTotal",
			key: "posTotal"
		},
		{
			title: "A-",
			dataIndex: "aNeg",
			key: "aNeg"
		},
		{
			title: "B-",
			dataIndex: "bNeg",
			key: "bNeg"
		},
		{
			title: "O-",
			dataIndex: "oNeg",
			key: "oNeg"
		},
		{
			title: "AB-",
			dataIndex: "abNeg",
			key: "abNeg"
		},
		{
			title: "RH-总",
			dataIndex: "negTotal",
			key: "negTotal"
		},
	];
	return (
		<div className={styles.superviseStationAll}>
			<Card title={<FormSearch searchPage={searchPage} />} style={{ width: "100%", height: "100%" }}>
				<Table
					columns={columns}
					rowKey={record => record.idx}
					dataSource={logList}
					scroll={{ y: 54 * 8 }}
					loading={loading}
					pagination={false}
				/>
			</Card>
		</div>
	);
}
export default SuperviseStationAll;

const FormSearch = memo((props: any) => {
	const { searchPage } = props;
	const { depts0ALL } = useDeptUsers();
	const { dictArrRef } = useDict();
	const [searchForm] = Form.useForm();
	const [hospitalsList, setHospitalsList] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
	const initValues = {
		startDate: dayjs(new Date()),
		typeId: [],
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

	const searchLog = async () => {
		await searchForm.validateFields();
		const values = searchForm.getFieldsValue();
		const params = {
			...values,
			startDate: dayjs(values.startDate).format(dateFormatSearch),
		};
		searchPage(params);
	};
	return (
		<Form form={searchForm} initialValues={initValues} style={{ margin: "10px 0" }}>
			<Row gutter={16}>
				<Col span={6}>
					<Form.Item label="时间" name="startDate" style={{ marginBottom: 0 }} required rules={[{ required: true, message: '请选择时间' }]}>
            <DatePicker allowClear style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item label={null}>
            <Button type="primary" onClick={() => searchLog()}>
              查询
            </Button>
					</Form.Item>
        </Col>
        <col span={6}></col>
				<Col span={13}>
					<Form.Item label="血液类型" name="typeId" required rules={[{ required: true, message: '请选择血液类型' }]}>
            <Checkbox.Group
              options={typeOptions}
            />
					</Form.Item>
        </Col>
			</Row>
		</Form>
	);
});
