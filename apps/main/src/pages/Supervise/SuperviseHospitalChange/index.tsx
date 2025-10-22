import { getUseStockChange } from "@/api/modules/supervise";
import { getDeptListByHospitalApi } from "@/api/modules/user";
import useDeptUsers from "@/hooks/useDeptUsers";
import useDict from "@/hooks/useDict";
import { tableRepeat, tableMapperRow} from "@/utils/util";
import { Button, Card, Checkbox, Col, DatePicker, Form, Radio, Row, Select, Table } from "antd";
import dayjs from "dayjs";
import { dateFormatSearch } from "hoslink-xxx";
import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./index.module.less";

function SuperviseHospitalChange(props: any) {
	const { dictArrRef } = useDict();
	// const [total, setTotal] = useState(0);
	// const [pageNum, setPageNum] = useState(1);
	const [lineDataMonth, setLineDataMonth] = useState([]);
  const [lineDataQuter, setLineDataQuter] = useState([]);
	const [loading, setLoading] = useState(false);
	const searchObj = useRef({
		year: dayjs(new Date()).format('YYYY'),
		typeId: '',
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
		getUseStockChange({
      ...params,
    }).then(res => {
      const {month = [],quter = [] } = res || {};
      console.log(month, quter, 'sum');
      const lineDataMonthT = [
        { item: '1', count: 0 },
        { item: '2', count: 0 },
        { item: '3', count: 0 },
        { item: '4', count: 0 },
        { item: '5', count: 0 },
        { item: '6', count: 0 },
        { item: '7', count: 0 },
        { item: '8', count: 0 },
        { item: '9', count: 0 },
        { item: '10', count: 0 },
        { item: '11', count: 0 },
        { item: '12', count: 0 },
      ];
      lineDataMonthT.forEach(c => {
        month.forEach(e => {
          if (e.storeDate && e.storeDate.toString() === c.item || e.MONTH && e.MONTH.toString()) {
            c.count = e.total;
          }
        });
      });
      const lineDataQuterT = [
        { item: '1', count: 0 },
        { item: '2', count: 0 },
        { item: '3', count: 0 },
        { item: '4', count: 0 },
      ];
      lineDataQuterT.forEach(c => {
        quter.forEach(e => {
          if (e.quarter.toString() === c.item) {
            c.count = e.total;
          }
        });
      });
      setLineDataMonth(lineDataMonthT);
      setLineDataQuter(lineDataQuterT);
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
        data: data?.map(d => d.name),
      },
      series: [{
        data: data?.map(d => {
          return d.value
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
		<div className={styles.superviseHospitalChange}>
			<Card title={<FormSearch searchPage={searchPage} />} style={{ width: "100%", height: "100%" }}>
      <div className={styles.superviseHistogram_main}>
        {/* <div className={styles.superviseHistogram_main_charts} ref={chartDom1}></div>
        <div className={styles.superviseHistogram_main_charts} ref={chartDom2}></div> */}
      </div>
			</Card>
		</div>
	);
}
export default SuperviseHospitalChange;

const FormSearch = memo((props: any) => {
	const { searchPage } = props;
	const { depts0ALL } = useDeptUsers();
	const { dictArrRef } = useDict();
  const [departmentList, setDepartmentList] = useState([]);
	const [searchForm] = Form.useForm();
	const [hospitalsList, setHospitalsList] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
	const initValues = {
		year: dayjs(new Date()),
		typeId: '',
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

	const searchLog = () => {
		const values = searchForm.getFieldsValue();
		const params = {
			...values,
			year: dayjs(values.year).format('YYYY'),
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
          value: item.deptId
        }))
      );
    })
  }
	return (
		<Form form={searchForm} initialValues={initValues} style={{ margin: "10px 0" }}>
			<Row gutter={16}>
				<Col span={6}>
          {/*   */}
					<Form.Item label="时间" name="year" style={{ marginBottom: 0 }}>
            <DatePicker picker="year" allowClear style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item label="医院" name="hospital">
						<Select allowClear placeholder="请选择医院" onChange={getDepartmentList} showSearch options={hospitalsList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item label="科室" name="department">
						<Select allowClear placeholder="请选择科室" showSearch options={departmentList} style={{ width: "100%" }} />
					</Form.Item>
				</Col>
				<Col span={4}></Col>
				<Col span={12}>
					<Form.Item label="血液类型" name="typeId">
            <Radio.Group
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
