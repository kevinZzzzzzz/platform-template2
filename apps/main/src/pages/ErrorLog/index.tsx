import { getErrorLog, getHoslinkwsApiCallLog, getStaApiCallLog, getSupvlinkwsApiCallLog } from "@/api/modules/supervise";
import useDeptUsers from "@/hooks/useDeptUsers";
import useDict from "@/hooks/useDict";
import { MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Flex, Form, Input, message, Row, Select, Table, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import moment from "moment";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";


function ErrorLog(props: any) {
	const [total, setTotal] = useState(0);
  const { dictMapper } = useDict();
	const [pageNum, setPageNum] = useState(1);
	const [logList, setLogList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const tableRef = useRef<any>(null);
  const errorTypeTabMap = {
    "INTERFACE": 'magenta',
    "WEB": 'green',
    "INTERFACE_HOLDUP": 'cyan',
    "ERROR_LOG": 'red',
    "SUPERV": 'volcano',
    "SAVE_LOG_ERROR": '#f50',
    "SAPPHIRE": '#f54'
}
	const searchObj = useRef({
		startDate: dayjs(new Date()).subtract(7, "day").format(dateFormatSearch),
		endDate: dayjs(new Date()).format(dateFormatSearch),
		type: "",
		id: ""
	});
	useEffect(() => {
		getErrorLogList({
			...searchObj.current
		});
	}, []);
	const getErrorLogList = params => {
		setLoading(true);
		getErrorLog(params).then(res => {
			let { list = [] } = res || {};
			setTotal(list.length);
			setLogList(list?.map((item, index) => ({
				...item,
				idx: index + 1
			})) || []);
		}).finally(() => {
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
		getErrorLogList({
			...searchObj.current,
		});
	}, []);
	const updateLog = useCallback(async () => {
    await getSupvlinkwsApiCallLog({
      isStation: true
    })
    await getHoslinkwsApiCallLog()
	}, []);
	const columns = [
		{
			title: "时间",
      width: 150,
			dataIndex: "errorTime",
			key: "errorTime"
		},
		{
			title: "操作人",
      width: 80,
			dataIndex: "operator",
			key: "operator"
		},
		{
			title: "类型",
      width: 80,
			dataIndex: "type",
			key: "type",
      render: (text) => {
        return (
          <Tag color={errorTypeTabMap?.[text] || null}>
            {dictMapper?.["errorType"]?.[text]?.name || '--'}
          </Tag>
        )
      }
		},
		{
			title: "url",
      width: 300,
			dataIndex: "url",
			key: "url"
		},
		{
			title: "message",
      width: 400,
			dataIndex: "message",
			key: "message"
		}
	];
	const expandedRowRender = (params: any) => {
    const message = `error: ${params.error}\nparam: ${params.param}\nbody: ${params.body}`
		return (
			<div style={{ margin: 0, padding: "16px 24px", background: "#fafafa" }}>
				<div>
					<TextArea
						value={message}
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
		<div className={styles.errorLog}>
			<Card title={<FormSearch searchPage={searchPage} updateLog={updateLog} />} style={{ width: "100%", height: "100%" }}>
				<Table
          ref={tableRef}
					columns={columns}
					rowKey={record => record.idx}
					dataSource={logList}
					scroll={{ y: 60 * 8 }}
					loading={loading}
					expandable={{
            expandedRowKeys,
            onExpand: (expanded, record) => {
              const keys = expanded
                ? [...expandedRowKeys, record.idx]
                : expandedRowKeys.filter(key => key !== record.idx);
              setExpandedRowKeys(keys);
            },
						expandedRowRender: record => expandedRowRender(record)
					}}
					pagination={{
						total,
						current: pageNum,
						showSizeChanger: false,
						pageSize: 10,
						onChange: (page) => {
              // 分页后将展开项清空
              setExpandedRowKeys([])
              setPageNum(page)
            }
					}}
				/>
			</Card>
		</div>
	);
}
export default ErrorLog;

const FormSearch = memo((props: any) => {
	const { searchPage, updateLog } = props;
	const { deptsHos } = useDeptUsers();
  const { dictArrRef } = useDict();
	const [searchForm] = Form.useForm();
	const [hospitalsList, setHospitalsList] = useState([]);
  const [errorType, setErrorType] = useState([]);
	const initValues = {
		startDate: dayjs(new Date()).subtract(7, "day"),
		endDate: dayjs(new Date()),
		type: "",
		id: "",
	};
  const searchType = Form.useWatch('type', searchForm)
  useEffect(() => {
    setErrorType(dictArrRef?.current?.['errorTypeALL']?.map(d => ({
      label: d.name,
      value: d.id
    })))
  }, [])
	useEffect(() => {
		setHospitalsList(
			deptsHos?.map(item => ({
				label: item.name,
				value: item.deptId
			}))
		);
	}, [deptsHos]);

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
						<Select allowClear options={errorType} onChange={(value) => {
              if (value !== 'ERROR_LOG') {
                searchForm.setFieldValue('id', '')
              }
            }} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
        {
          searchType == 'ERROR_LOG' ? (
            <Col span={4}>
              <Form.Item label="机构" name="id">
                <Select allowClear options={hospitalsList} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          ) : null
        }
				<Col span={8}>
					<Form.Item label={null} style={{ margin: "0 auto" }}>
						<Flex gap="small">
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
