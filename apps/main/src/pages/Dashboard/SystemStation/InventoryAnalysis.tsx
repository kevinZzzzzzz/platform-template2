import { Flex, Radio, Spin } from "antd";
import React, { useState, useEffect, memo, useRef } from "react";
import styles from "./index.module.less";
import * as echarts from "echarts"
import { getHosStore } from "@/api/modules/dashboard";
import moment from "moment";
import { dateFormatSearch } from "hoslink-xxx";
import { tableRepeat } from "@/utils/util";

const BLOODTYPECOLORS = [
  '#3691eb',
  '#69c7ff',
  '#1bdda4',
  '#7fbd46',
  '#eedf38',
  '#fb7e48',
  '#fc5555',
  '#7854b0',
  '#ff9a9e',
  '#fad0c4',
  '#a18cd1',
  '#fbc2eb',
  '#84fab0',
  '#8fd3f4',
  '#4facfe',
  '#00f2fe',
  '#30cfd0',
  '#fddb92',
  '#37ecba',
  '#72afd3',
  '#74ebd5',
  '#9face6',
  '#d9afd9',
  '#97d9e1',
  '#7028e4',
  '#e5b2ca',
  '#88d3ce',
  '#6e45e2',
  '#92fe9d',
  '#00c9ff',
  '#f83600',
  '#f9d423',
  '#b721ff',
  '#21d4fd',
];

// 大类排序
const bigSort = {
  '全血类': 1,
  '红细胞类': 2,
  '血小板类': 3,
  '血浆类': 4,
  '血清类': 5
}
function InventoryAnalysis(props: any) {
  let chart: any = null
	const [typeMode, setTypeMode] = useState<"big" | "small">("big");
	const [chartLoading, setChartLoading] = useState<boolean>(false);
  const chartDom = useRef<HTMLDivElement>(null);
  const bigModeData = useRef<any>([]);
  const smallModeData = useRef<any>([]);
  const bigLegend = useRef<any>([]);
  const smallLegend = useRef<any>([]);
  const smallHospitals = useRef<any>([]);
  const bigHospitals = useRef<any>([]);
  const smallBloodDataMap = useRef<any>({})
  const bigBloodDataMap = useRef<any>({})
  const chartOptionBar = useRef<any>(null)
  const bigCateChartOption = useRef<any>(null)

  const getSmallEchartTooltipHtml = ({ params }) => {
    let total = 0
    let html = ''
    params.forEach((e, i) => {
      total += e.value
      html = html + `<div style="display: flex; justify-content: space-between;">
        <div style="display: flex; align-items: center;">
          <div style="background: ${BLOODTYPECOLORS[i]}; border-radius: 50%; width: 10px; height: 10px; margin-right: 4px"></div>
          <div>${e.seriesName}</div>
        </div>
        <div>${e.value}</div>
      </div>`
    })
    return `<div style="min-width: 250px; display: flex; justify-content: space-between;">
      <div style="margin-right: 16px;">${params[0].name}</div>
      <div>总${total}</div>
    </div>`+ html
  }
  
  const getEchartTooltipHtml = ({ params, bloodDataMap }) => {
    let total = 0
    let html = ''
    params.forEach((e, i) => {
      total += e.value
      html = html + `<div style="display: flex; justify-content: space-between;">
        <div style="display: flex; align-items: center;">
          <div style="background: ${BLOODTYPECOLORS[i]}; border-radius: 50%; width: 10px; height: 10px; margin-right: 4px"></div>
          <div>${e.seriesName}</div>
        </div>
        <div>${e.value}</div>
      </div>`
      if (bloodDataMap[e.seriesName] && bloodDataMap[e.seriesName][e.name]) {
        Object.keys(bloodDataMap[e.seriesName][e.name]).forEach(key => {
          if (key !== 'total') {
            html = html + `<div style="display: flex; justify-content: space-between; color: rgba(255,255,255, 0.7)">
            <div style="margin-right: 20px"> - ${key}</div>
              <div>${bloodDataMap[e.seriesName][e.name][key]}</div>
            </div>`
          }
        })
      }
    })
    return `<div style="min-width: 250px; display: flex; justify-content: space-between;">
      <div style="margin-right: 16px;">${params[0].name}</div>
      <div>总${total}</div>
    </div>`+ html
  }

    // 生成echart配置
  const getEchartsOptions = ({
      legend,
      hospitals,
      bloodDataMap
    }, isType = false) => {
      let result: any = {
        color: BLOODTYPECOLORS,
        tooltip: {
          trigger: 'axis',
          renderMode: 'html',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
          },
          position: function (point, params, dom, rect, size) {
            // 固定在顶部
            return [point[0], '0%'];
          },
          formatter: (params) => {
            return getSmallEchartTooltipHtml({
              params: params,
            })
          }
        },
        legend: {
          top: '10',
          data: legend,
        },
        grid: {
          left: '3%',
          right: '100px',
          bottom: '5%',
          top: '30%',
          containLabel: true,
        },
        yAxis: {
          type: 'value',
        },
        xAxis: {
          type: 'category',
          data: hospitals,
          axisLabel: {
            interval: 0,
            rotate: -30,
          },
        },
        series: legend.map((v, i) => ({
          name: v,
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: false,
              position: 'inside',
            },
          },
          data: (function () {
            const arr = [];
            hospitals.forEach(o => {
              if (bloodDataMap[v] && bloodDataMap[v][o]) {
                if (isType) {
                  arr.push(bloodDataMap[v][o].total)
                } else {
                  arr.push(bloodDataMap[v][o])
                }
              } else {
                arr.push(0);
              }
            });
            return arr;
          })(),
        })),
      };
      if (isType) {
        result.tooltip.formatter = (params) => {
          return getEchartTooltipHtml({
            params: params,
            bloodDataMap,
          })
        }
      }
      return result
    }
  useEffect(() => {
    getHosStore({
      storeDate: moment().format(dateFormatSearch),
      hospital: '',
      typeId: '',
      subtypeId: '',
      classId: 0,
      bloodId: ''
    }).then((res) => {
      const {list} = res || {}
      const totalMap = {
        small: {},
        big: {}
      }; // 数量统计
      bigModeData.current = tableRepeat(list?.typeList, 'hospital', 'typeId', 'subtypeId')
      .map(v => {
        v.total =
          v.aNeg +
          v.aPos +
          v.bNeg +
          v.bPos +
          v.oNeg +
          v.oPos +
          v.abNeg +
          v.abPos;
        if (v.total) {
          v.total = parseFloat(v.total.toFixed(2))
        }
        return v;
      }) || [];
      smallModeData.current = tableRepeat(list?.subTypeList, 'hospital', 'typeId', 'subtypeId')
      .map(v => {
        v.total =
          v.aNeg +
          v.aPos +
          v.bNeg +
          v.bPos +
          v.oNeg +
          v.oPos +
          v.abNeg +
          v.abPos
        if (v.total) {
          v.total = parseFloat(v.total.toFixed(2))
        }
        return v;
      }) || [];
      
      smallModeData.current.forEach(v => {
        if (totalMap.small[v.hospitalName]) {
          totalMap.small[v.hospitalName] += v.total
        } else {
          totalMap.small[v.hospitalName] = v.total
        }
        if (smallBloodDataMap.current[v.subtypeName]) {
          smallBloodDataMap.current[v.subtypeName][v.hospitalName] = v.total
        } else {
          smallBloodDataMap.current[v.subtypeName] = {
            [v.hospitalName]: v.total
          }
        }
      });
      bigModeData.current.forEach(v => {
        if (totalMap.big[v.hospitalName]) {
          totalMap.big[v.hospitalName] += v.total
        } else {
          totalMap.big[v.hospitalName] = v.total
        }
        if (bigBloodDataMap.current[v.typeName]) {
          if (bigBloodDataMap.current[v.typeName][v.hospitalName]) {
            bigBloodDataMap.current[v.typeName][v.hospitalName].total = parseFloat((bigBloodDataMap.current[v.typeName][v.hospitalName].total + v.total).toFixed(2))
            bigBloodDataMap.current[v.typeName][v.hospitalName][v.subtypeName] = v.total
          } else {
            bigBloodDataMap.current[v.typeName][v.hospitalName] = {
              total: v.total,
              [v.subtypeName]: v.total
            }
          }
        } else {
          bigBloodDataMap.current[v.typeName] = {
            [v.hospitalName]: {
              total: v.total,
              [v.subtypeName]: v.total
            }
          }
        }
      })
      smallLegend.current = Array.from(new Set(smallModeData.current.map(v => v.subtypeName)))
      bigLegend.current = Array.from(new Set(bigModeData.current.map(v => v.typeName))).sort((a, b) => bigSort[a as string] - bigSort[b as string])
      smallHospitals.current = Array.from(new Set(smallModeData.current.map(e => e.hospitalName))).sort((a: string, b: string) => (totalMap.small[b] - totalMap.small[a]));
      bigHospitals.current = Array.from(new Set(bigModeData.current.map(e => e.hospitalName))).sort((a: string, b: string) => (totalMap.big[b] - totalMap.big[a]));
      chartOptionBar.current = getEchartsOptions({
        legend: smallLegend.current,
        hospitals: smallHospitals.current,
        bloodDataMap: smallBloodDataMap.current
      })
      bigCateChartOption.current = getEchartsOptions({
        legend: bigLegend.current,
        hospitals: bigHospitals.current,
        bloodDataMap: bigBloodDataMap.current
      }, true)
    chart = echarts.init(chartDom.current);
    renderChart(typeMode)
    });
  }, []);
  const renderChart = (typeMode) => {
    const optionMap = {
      big: bigCateChartOption.current,
      small: chartOptionBar.current
    }
    if (optionMap[typeMode]) {
      chart = echarts.init(chartDom.current);
      chart?.setOption(optionMap[typeMode], {
        notMerge: true, // 不合并旧配置
        lazyUpdate: false // 立即更新
      })
    }
    setTimeout(() => {
      chart?.resize();
    }, 0);
  }
  useEffect(() => {
    renderChart(typeMode)
  }, [typeMode]);
	return (
		<div className={styles.inventoryAnalysis}>
			<Radio.Group onChange={(e) => setTypeMode(e.target.value)} defaultValue="big">
				<Radio.Button value="big">血液大类</Radio.Button>
				<Radio.Button value="small">血液小类</Radio.Button>
			</Radio.Group>
			<div className={styles.inventoryAnalysis_chartBox}>
        {
          chartLoading ? 
          <Flex gap="middle" vertical justify="center">
            <Spin spinning={chartLoading}></Spin>
          </Flex> : <div className={styles.inventoryAnalysis_chartBox_charts} ref={chartDom}></div>
        }
			</div>
		</div>
	);
}
export default memo(InventoryAnalysis);
