import { getUseBloodStock } from "@/api/modules/supervise";
import useDeptUsers from "@/hooks/useDeptUsers";
import useDict from "@/hooks/useDict";
import { tableRepeat, tableMapperRow} from "@/utils/util";
import { Button, Card, Checkbox, Col, DatePicker, Form, Radio, Row, Select, Table } from "antd";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";

function SuperviseHospitalAll(props: any) {
	// const [total, setTotal] = useState(0);
	// const [pageNum, setPageNum] = useState(1);
	const [logList, setLogList] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
		beforeDate: dayjs(new Date()).subtract(7, "day").format(dateFormatSearch),
		afterDate: dayjs(new Date()).format(dateFormatSearch),
		typeId: [],
		hospital: ""
	});
	useEffect(() => {
		getLogList({
			...searchObj.current,
		});
	}, []);
	const getLogList = params => {
		setLoading(true);
		getUseBloodStock(params).then(res => {
      const {sum = []} = res || {};
      const list = []
      sum.map(function (d1) {
        d1.useStockSum.map(function (d2) {
          d2.hospitalName = d1.hospitalName;
          list.push(d2);
        })
      })
      let dataT = tableRepeat(list, 'typeName', 'hospitalName')
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
			title: "血液类型",
			dataIndex: "typeName",
			key: "typeName",
      onCell: (record) => {
        return {
          rowSpan: record[0]
        }
      },
		},
		{
			title: "医院",
			dataIndex: "hospitalName",
			key: "hospitalName",
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
		}
	];
	return (
		<div className={styles.superviseHospitalAll}>
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
export default SuperviseHospitalAll;

const FormSearch = memo((props: any) => {
	const { searchPage } = props;
	const { depts0ALL } = useDeptUsers();
	const { dictArrRef } = useDict();
	const [searchForm] = Form.useForm();
	const [hospitalsList, setHospitalsList] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
	const initValues = {
		beforeDate: dayjs(new Date()).subtract(7, "day"),
		afterDate: dayjs(new Date()),
		typeId: [],
		hospital: ""
	};
  useEffect(() => {
    setTypeOptions(dictArrRef.current?.['type']?.map(item => ({
      label: item.name,
      value: item.id
    })) || [])
  }, [])
	useEffect(() => {
    if (depts0ALL && depts0ALL.length > 0) {
			const depts0ALLT = depts0ALL?.filter(d => d.deptId !== "" && d.deptScope !== "F" && d.deptScope !== "G") || [];
			setHospitalsList(
				depts0ALLT?.map(item => ({
					label: item.name,
					value: item.deptId
				}))
			);
			searchForm.setFieldValue("hospital", depts0ALLT[0]?.deptId || "");
		}

	}, [depts0ALL]);

	const searchLog = () => {
		const values = searchForm.getFieldsValue();
		const params = {
			...values,
			beforeDate: dayjs(values.beforeDate).format(dateFormatSearch),
			afterDate: dayjs(values.afterDate).format(dateFormatSearch)
		};
    searchPage(params)
	};
	return (
		<Form form={searchForm} initialValues={initValues} style={{ margin: "10px 0" }}>
			<Row gutter={16}>
				<Col span={8}>
					<Form.Item label="时间" style={{ marginBottom: 0 }}>
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
				<Col span={6}>
					<Form.Item label="医院" name="hospital">
						<Select allowClear showSearch options={hospitalsList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={10}></Col>
				<Col span={12}>
					<Form.Item label="血液类型" name="typeId">
            <Checkbox.Group
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
