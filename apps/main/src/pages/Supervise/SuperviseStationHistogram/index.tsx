import { getStatisticsStoreDetail } from "@/api/modules/supervise";
import useDeptUsers from "@/hooks/useDeptUsers";
import useDict from "@/hooks/useDict";
import { tableRepeat, tableMapperRow} from "@/utils/util";
import { Button, Card, Col, DatePicker, Form, Radio, Row, Select, Table } from "antd";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";
import * as echarts from "echarts"
enum alisaMap {
  "aPos" = "A+",
  "aNeg" = "A-",
  "bPos" = "B+",
  "bNeg" = "B-",
  "oPos" = "O+",
  "oNeg" = "O-",
  "abPos" = "AB+",
  "abNeg" = "AB-",
}

function SuperviseStationHistogram(props: any) {
  let chart: any = null
  const chartDom = useRef<HTMLDivElement>(null);
	// const { transformByMapper } = useDict();
	// const { transDepts0ById } = useDeptUsers();
	// const [total, setTotal] = useState(0);
	// const [pageNum, setPageNum] = useState(1);
	// const [dataList, setDataList] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
		storeDate: dayjs(new Date()).format(dateFormatSearch),
		typeId: 1,
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
      const dataObj = []
      store?.map(function (d1) {
        d1?.subTypeResult?.map(function (d2) {
          const salesData = {'item':null, 'count': null};
          salesData.item = d2.subTypeName;
          salesData.count = d2.total;
          dataObj.push(salesData);
        })
      })
      renderChart(dataObj)
		}).finally(() => {
			setLoading(false);
		})
	};
  const renderChart = (data) => {
    chart = echarts.init(chartDom.current)
    const option = {
      color: ['#007AFF'],
      yAxis: {
        type: 'value',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: data?.map(d => d.item),
      },
      series: [{
        data: data?.map(d => {
          return d.count
        }),
        type: 'bar',
      }]
    }
    chart?.setOption(option, {
      notMerge: true, // 不合并旧配置
      lazyUpdate: false // 立即更新
    })
  }
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

	return (
		<div className={styles.superviseStationHistogram}>
			<Card title={<FormSearch searchPage={searchPage} />} style={{ width: "100%", height: "100%" }}>
				<div className={styles.superviseStationHistogram_main}>
          <h1>血站库存柱状图</h1>
          <div className={styles.superviseStationHistogram_main_charts} ref={chartDom}></div>
        </div>
			</Card>
		</div>
	);
}
export default SuperviseStationHistogram;

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
	};
  useEffect(() => {
    setTypeOptions(dictArrRef.current?.['type']?.map(item => ({
      label: item.name,
      value: item.id
    })) || [])
  }, [])
	// useEffect(() => {
  //   if (depts0ALL && depts0ALL.length > 0) {
  //     const depts0ALLT = depts0ALL?.filter(d => d.deptId !== '' && d.deptScope !=='F' && d.deptScope !=='G') || []
  //     setHospitalsList(depts0ALLT?.map(item => ({
  //       label: item.name,
  //       value: item.deptId
  //     })))
  //     searchForm.setFieldValue('hospital', depts0ALLT[0]?.deptId || '')
  //     searchLog()
  //   }
	// }, [depts0ALL]);

	const searchLog = async () => {
		await searchForm.validateFields();
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
					<Form.Item label="时间" name="storeDate" style={{ marginBottom: 0 }} required rules={[{ required: true, message: '请选择时间' }]}>
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
				<Col span={12}></Col>
				<Col span={13}>
					<Form.Item label="血液类型" name="typeId" required rules={[{ required: true, message: '请选择血液类型' }]}>
            <Radio.Group
              options={typeOptions}
            />
					</Form.Item>
        </Col>
			</Row>
		</Form>
	);
});
