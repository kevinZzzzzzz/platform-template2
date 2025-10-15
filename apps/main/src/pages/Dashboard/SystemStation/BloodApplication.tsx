import { getApplicationAnalyse } from '@/api/modules/dashboard';
import useDeptUsers from '@/hooks/useDeptUsers';
import * as echarts from "echarts"
import { dateFormatSearch } from 'hoslink-xxx';
import moment from 'moment';
import React, { useState, useEffect, memo, useRef } from 'react';
import styles from './index.module.less'

function BloodApplication(props: any) {
  const {transDepts0ById} = useDeptUsers()
  let chart: any = null
  const chartDom = useRef<HTMLDivElement>(null);
  
  const renderChart = (data) => {
    if (data.length === 0) return
    chart = echarts.init(chartDom.current);
    const option = {
      legend: {
        data: data?.map(d => d.hospitalName)
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} 单'
        }
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: data?.map(d => d.hospitalName),
      },
      series: data?.map(d => {
        return {
          data: [d.allTheApp],
          type: 'bar',
          tooltip: {
            valueFormatter: function (value) {
              return value;
            }
          },
          name: d.hospitalName,
        }
      })
    }
    chart?.setOption(option, {
      notMerge: true, // 不合并旧配置
      lazyUpdate: false // 立即更新
    })
  }

  useEffect(() => {
    getApplicationAnalyse({
      startTime: moment()
      .add(-30, 'days')
      .format(dateFormatSearch),
      endTime: moment().format(dateFormatSearch)
    }).then((res: any) => {
      const {list = []} = res
      let data = []
      data = list?.map(d => {
        return {
          ...d,
          hospitalName: transDepts0ById(d.hospitalId),
        }
      })
      renderChart(data)
    })
  })

  return (
    <div className={styles.bloodApplication}>
      <div className={styles.bloodApplication_chartBox_charts} ref={chartDom}></div>
    </div>
  )
}
export default memo(BloodApplication)

function transformByMapper(hospitalId: any, arg1: string[]) {
  throw new Error('Function not implemented.');
}
