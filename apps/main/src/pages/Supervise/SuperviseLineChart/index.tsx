import { getDetailDaily } from "@/api/modules/supervise";
import useDeptUsers from "@/hooks/useDeptUsers";
import useDict from "@/hooks/useDict";
import { tableRepeat, tableMapperRow } from "@/utils/util";
import { Button, Card, Col, DatePicker, Form, Radio, Row, Select, Table } from "antd";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";
import * as echarts from "echarts";
enum alisaMap {
	"aPos" = "A+",
	"aNeg" = "A-",
	"bPos" = "B+",
	"bNeg" = "B-",
	"oPos" = "O+",
	"oNeg" = "O-",
	"abPos" = "AB+",
	"abNeg" = "AB-"
}

function SuperviseLineChart(props: any) {
	let chart: any = null;
	const chartDom = useRef<HTMLDivElement>(null);
	// const { transformByMapper } = useDict();
	// const { transDepts0ById } = useDeptUsers();
	// const [total, setTotal] = useState(0);
	// const [pageNum, setPageNum] = useState(1);
	const [dataList, setDataList] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
		beforeDate: dayjs(new Date()).subtract(7, "day").format(dateFormatSearch),
		afterDate: dayjs(new Date()).format(dateFormatSearch),
		typeId: 1,
		hospital: ""
	});
	useEffect(() => {
		// getLogList({
		// 	...searchObj.current,
		// });
	}, []);
	const getLogList = params => {
		setLoading(true);
		getDetailDaily(params)
			.then(res => {
				let { sum = [] } = res || {};
				const dataArr = [];
        if (sum && sum.length) {
          sum?.forEach(item => {
            item?.hospitalResult?.forEach(d => {
              d.storeTotalResult?.forEach(e => {
                dataArr.push({
                  name: e.storeDate,
                  value: e.total || 0
                })
              })
            })
          })
        }
				renderChart(dataArr);
			})
			.finally(() => {
				setLoading(false);
			});
	};
	const renderChart = data => {
		// if (data.length == 0) return;
		chart = echarts.init(chartDom.current);
		const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        }
      },
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'category',
        data: data?.map(d => d.name), 
      },
			series: [
				{
					data: data?.map(d => d.value),
          type: 'line',
          stack: '总量',
          symbol: 'circle',
          symbolSize: 10,
				}
			]
		};
		chart?.setOption(option, {
			notMerge: true, // 不合并旧配置
			lazyUpdate: false // 立即更新
		});
	};
	const searchPage = useCallback((values: any) => {
		searchObj.current = {
			...searchObj.current,
			...values
		};
		getLogList({
			...searchObj.current,
			...values
		});
	}, []);

	return (
		<div className={styles.superviseLineChart}>
			<Card title={<FormSearch searchPage={searchPage} />} style={{ width: "100%", height: "100%" }}>
				<div className={styles.superviseLineChart_main}>
					<h1>医院库存变化</h1>
					<div className={styles.superviseLineChart_main_charts} ref={chartDom}>
					</div>
				</div>
			</Card>
		</div>
	);
}
export default SuperviseLineChart;

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
		typeId: 1,
		hospital: ""
	};
	useEffect(() => {
		setTypeOptions(
			dictArrRef.current?.["type"]?.map(item => ({
				label: item.name,
				value: item.id
			})) || []
		);
	}, []);
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
			searchLog();
		}
	}, [depts0ALL]);

	const searchLog = () => {
		const values = searchForm.getFieldsValue();
		const params = {
			...values,
			beforeDate: dayjs(values.beforeDate).format(dateFormatSearch),
			afterDate: dayjs(values.afterDate).format(dateFormatSearch)
		};
		searchPage(params);
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
						<Radio.Group options={typeOptions} />
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
