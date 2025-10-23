import { getUseBloodStockByDept } from "@/api/modules/supervise";
import { getDeptListByHospitalApi } from "@/api/modules/user";
import useDeptUsers from "@/hooks/useDeptUsers";
import useDict from "@/hooks/useDict";
import { tableRepeat, tableMapperRow} from "@/utils/util";
import { Button, Card, Checkbox, Col, DatePicker, Form, Radio, Row, Select, Table } from "antd";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";

function SuperviseHospitalDepartment(props: any) {
	const { dictArrRef } = useDict();
	// const [total, setTotal] = useState(0);
	// const [pageNum, setPageNum] = useState(1);
	const [logList, setLogList] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
		beforeDate: dayjs(new Date()).subtract(7, "day").format(dateFormatSearch),
		afterDate: dayjs(new Date()).format(dateFormatSearch),
		typeId: [],
		hospital: "",
    department: ""
	});
	useEffect(() => {
		// getLogList({
		// 	...searchObj.current,
		// });
	}, []);
	const getLogList = params => {
		setLoading(true);
		getUseBloodStockByDept({
      ...params,
      department: '',
    }).then(res => {
      const {sum = []} = res || {};
      let list = []
      sum?.map(function (d1) {
        d1.destinResult?.map(function (d2) {
          d2.typeTotalResult?.map(function (d3) {
            d3.typeName = dictArrRef.current?.['type']?.filter(dict => dict.id == d3.typeId)?.[0]?.['name'];
            d3.shortName = d1.shortName;
            d3.hospitalId = d1.hospitalId;
            d3.destination = d2.destination;
            list.push(d3);
          })
        })
      })
      list = list.filter(item => item.destination === params.department);
      let dataT = tableRepeat(list, 'hospitalId', 'destination', 'typeName' );
      dataT = tableMapperRow(dataT, 'hospitalId');
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
			title: "医院",
			dataIndex: "shortName",
			key: "shortName",
      onCell: (record) => {
        return {
          rowSpan: record[0]
        }
      },
		},
		{
			title: "科室",
			dataIndex: "destination",
			key: "destination",
		},
		{
			title: "血液类型",
			dataIndex: "typeName",
			key: "typeName",
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
		<div className={styles.superviseHospitalDepartment}>
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
export default SuperviseHospitalDepartment;

const FormSearch = memo((props: any) => {
	const { searchPage } = props;
	const { depts0ALL } = useDeptUsers();
	const { dictArrRef } = useDict();
  const [departmentList, setDepartmentList] = useState([]);
	const [searchForm] = Form.useForm();
	const [hospitalsList, setHospitalsList] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
	const initValues = {
		beforeDate: dayjs(new Date()).subtract(7, "day"),
		afterDate: dayjs(new Date()),
		typeId: [],
		hospital: null,
    department: null
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
		}

	}, [depts0ALL]);

	const searchLog = async () => {
    await searchForm.validateFields();
		const values = searchForm.getFieldsValue();
		const params = {
			...values,
			beforeDate: dayjs(values.beforeDate).format(dateFormatSearch),
			afterDate: dayjs(values.afterDate).format(dateFormatSearch),
      hospital: values.hospital || '',
      department: values.department || '',
		};
    searchPage(params)
	};
  const getDepartmentList = (hospitalId) => {
    if (!hospitalId) {
      setDepartmentList([]);
      return;
    }
    getDeptListByHospitalApi(hospitalId).then(res => {
      const { menus = [] } = res || {};
      setDepartmentList(
        menus?.map(item => ({
          label: item.name,
          // value: item.deptId,
          value: item.name
        }))
      );
    })
  }
	return (
		<Form form={searchForm} initialValues={initValues} style={{ margin: "10px 0" }}>
			<Row gutter={16}>
				<Col span={8}>
					<Form.Item label="时间" style={{ marginBottom: 0 }} required rules={[{ required: true, message: '请选择时间' }]}>
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
					<Form.Item label="医院" name="hospital" required rules={[{ required: true, message: '请选择医院' }]}>
						<Select allowClear placeholder="请选择医院" onChange={getDepartmentList} showSearch options={hospitalsList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item label="科室" name="department" required rules={[{ required: true, message: '请选择科室' }]}>
						<Select allowClear placeholder="请选择科室" showSearch options={departmentList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={4}></Col>
				<Col span={13}>
					<Form.Item label="血液类型" name="typeId" required rules={[{ required: true, message: '请选择血液类型' }]}>
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
