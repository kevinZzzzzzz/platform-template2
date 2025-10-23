import { getBookingBloodStatistics } from "@/api/modules/bloodManager";
import { getUseBloodStock } from "@/api/modules/supervise";
import useDeptUsers from "@/hooks/useDeptUsers";
import useDict from "@/hooks/useDict";
import { tableRepeat, tableMapperRow} from "@/utils/util";
import { Button, Card, Checkbox, Col, DatePicker, Form, Radio, Row, Select, Table } from "antd";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";

function BookingBloodStatistics(props: any) {
	const { transformByMapper } = useDict();
  const {transDepts0ById} = useDeptUsers();
	// const [total, setTotal] = useState(0);
	// const [pageNum, setPageNum] = useState(1);
	const [dataList, setDataList] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
    startUseDate: '',
    endUseDate: '',
		startOrderDate: dayjs(new Date()).subtract(7, "day").format(dateFormatSearch),
		endOrderDate: dayjs(new Date()).format(dateFormatSearch),
    deptId: '',
    bloodGroup: '',
    rhBloodGroup: '',
    bloodSubtypeId: '',
    orderStatus: '',
	});
	useEffect(() => {
		getLogList({
			...searchObj.current,
		});
	}, []);
	const getLogList = params => {
		setLoading(true);
    getBookingBloodStatistics(params).then((res: any) => {
      console.log(res, 'res')
      const { detailVoList = [] } = res || {};
      const temp = {};
      const arr = [];
      detailVoList.forEach((d, i) => {
        if (!temp.hasOwnProperty(d.bloodSubtypeId +'-'+ d.deptId)) {
          temp[d.bloodSubtypeId +'-'+  d.deptId] = {'deptId' : d.deptId, 'subtype': d.bloodSubtypeId};
        }
        if (temp.hasOwnProperty(d.bloodSubtypeId +'-'+ d.deptId)) {
          detailVoList[i].orderDetailVoList.forEach(item => {
            temp[d.bloodSubtypeId + '-' + d.deptId][item.bloodGroup + item.rhBloodGroup] = item.amountall;
          });
        }
      });
      for (const key in temp) {
        arr.push({
          deptId: temp[key]['deptId'] || 0,
          bloodType: temp[key]['subtype'] || 0,
          APos: temp[key]['APOSTIVE'] || 0,
          BPos: temp[key]['BPOSTIVE'] || 0,
          OPos: temp[key]['OPOSTIVE'] || 0,
          ABPos: temp[key]['ABPOSTIVE'] || 0,
          ANeg: temp[key]['ANEGATIVE'] || 0,
          BNeg: temp[key]['BNEGATIVE'] || 0,
          ONeg: temp[key]['ONEGATIVE'] || 0,
          ABNeg: temp[key]['ABNEGATIVE'] || 0,
          amount: (temp[key]['APOSTIVE'] || 0) + (temp[key]['BPOSTIVE'] + temp[key]['OPOSTIVE'] || 0) + (temp[key]['ABPOSTIVE'] || 0) + (temp[key]['ANEGATIVE'] || 0) + (temp[key]['BNEGATIVE'] || 0) + (temp[key]['ONEGATIVE'] || 0) + (temp[key]['ABNEGATIVE'] || 0),
        });
      }
      console.log(arr, temp, 'arr')
      setDataList(tableMapperRow(arr, 'bloodType') || []);
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
			title: "血液品种",
			dataIndex: "bloodType",
			key: "bloodType",
      onCell: (record) => {
        return {
          rowSpan: record[0]
        }
      },
      render: (text, record, index) => {
        return transformByMapper(text, ['subtype', 'name']);
      }
		},
		{
			title: "医院名称",
			dataIndex: "deptId",
			key: "deptId",
      render: (text, record, index) => {
        return transDepts0ById(text);
      }
		},
		{
			title: "A+",
			dataIndex: "APos",
			key: "APos"
		},
		{
			title: "B+",
			dataIndex: "BPos",
			key: "BPos"
		},
		{
			title: "O+",
			dataIndex: "OPos",
			key: "OPos"
		},
		{
			title: "AB+",
			dataIndex: "ABPos",
			key: "ABPos"
		},
		{
			title: "A-",
			dataIndex: "ANeg",
			key: "ANeg"
		},
		{
			title: "B-",
			dataIndex: "BNeg",
			key: "BNeg"
		},
		{
			title: "O-",
			dataIndex: "ONeg",
			key: "ONeg"
		},
		{
			title: "AB-",
			dataIndex: "ABNeg",
			key: "ABNeg"
		},
		{
			title: "总数",
			dataIndex: "amount",
			key: "amount",
      render: (text, record, index) => {
        return text + ' ' + transformByMapper(record.bloodType, ['subtype', 'unitNew']);
      }
		}
	];
	return (
		<div className={styles.bookingBloodStatistics}>
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
export default BookingBloodStatistics;

const FormSearch = memo((props: any) => {
	const { searchPage } = props;
	const { deptsHos } = useDeptUsers();
	const { dictArrRef } = useDict();
	const [searchForm] = Form.useForm();
	const [hospitalsList, setHospitalsList] = useState([]);
  const [bloodgroup, setBloodgroup] = useState([]);
  const [rhBloodgroupList, setRhBloodgroupList] = useState([]);
  const [subtypeList, setSubtypeList] = useState([]);
  const [orderStatusList, setOrderStatusList] = useState([]);
	const initValues = {
		startOrderDate: dayjs(new Date()).subtract(7, "day"),
		endOrderDate: dayjs(new Date()),
    deptId: '',
    bloodGroup: '',
    rhBloodGroup: '',
    bloodSubtypeId: '',
    orderStatus: '',
	};
  useEffect(() => {
    setBloodgroup(dictArrRef.current?.['bloodgroupALL']?.filter(d => d.id !== 'NOT')?.map(item => ({
      label: item.name,
      value: item.id
    })) || [])
    setRhBloodgroupList(dictArrRef.current?.['rhbloodgroupALL']?.filter(d => d.id !== 'UNKNOW')?.map(item => ({
      label: item.name,
      value: item.id
    })) || [])
    setSubtypeList(dictArrRef.current?.['subtypeALL']?.map(item => ({
      label: item.name,
      value: item.id
    })) || [])
    setOrderStatusList(dictArrRef.current?.['orderStatusALL']?.map(item => ({
      label: item.name,
      value: item.id
    })) || [])
  }, [])
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
			startOrderDate: dayjs(values.startOrderDate).format(dateFormatSearch),
			endOrderDate: dayjs(values.endOrderDate).format(dateFormatSearch)
		};
    searchPage(params)
	};
	return (
		<Form form={searchForm} initialValues={initValues} style={{ margin: "10px 0" }}>
			<Row gutter={16}>
				<Col span={6}>
					<Form.Item label="时间" style={{ marginBottom: 0 }}>
						<Row gutter={10}>
							<Col span={12}>
								<Form.Item name="startOrderDate">
									<DatePicker allowClear style={{ width: "100%" }} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name="endOrderDate">
									<DatePicker allowClear style={{ width: "100%" }} />
								</Form.Item>
							</Col>
						</Row>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item label="医院" name="deptId">
						<Select allowClear showSearch options={hospitalsList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item label="ABO血型" name="bloodGroup">
						<Select allowClear showSearch options={bloodgroup} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item label="Rh血型" name="rhBloodGroup">
						<Select allowClear showSearch options={rhBloodgroupList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item label="血液类型" name="bloodSubtypeId">
            <Select allowClear showSearch options={subtypeList} style={{ width: "100%" }} />
					</Form.Item>
        </Col>
        <Col span={6}>
					<Form.Item label="状态" name="orderStatus">
            <Select allowClear showSearch options={orderStatusList} style={{ width: "100%" }} />
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
