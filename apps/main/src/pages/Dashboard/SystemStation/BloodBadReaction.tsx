import React, { useState, useEffect, memo, useRef } from 'react';
import styles from './index.module.less'
import * as echarts from "echarts"
import { dateFormatSearch } from 'hoslink-xxx';
import moment from 'moment';
import { getCountTransReaction } from '@/api/modules/dashboard';

function BloodBadReaction(props: any) {
  let chart: any = null
  const chartDom = useRef<HTMLDivElement>(null);

  const renderChart = (data) => {
    console.log(data)
    if (data.length === 0) return
    chart = echarts.init(chartDom.current);
    const option = {
      yAxis: {
        type: 'value',
      },
      xAxis: {
        type: 'category',
        data: data?.map(d => d.reactionTime), 
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (p) => {
          return data[p[0]['dataIndex']].hospitalName.reduce((prev, current, index) => {
            return prev + current + '：' + data[p[0]['dataIndex']].reactType[index] + '<br/>'
          }, `总数: ${data[p[0]['dataIndex']].ctreaction}<br/>`)
        }
      },
      series: [{
        data: data?.map(d => d.ctreaction),
        type: 'line',
        stack: '总量',
        symbol: 'circle',
        symbolSize: 20,
        itemStyle: {
          normal: {
            color: 'rgba(252,230,48,1)',
            barBorderRadius: 0,
            label: {
              show: true,
              position: 'top',
              formatter: function (p) {
                return p.value > 0 ? p.value : '';
              },
            },
          },
        },
      }]
    }
    chart?.setOption(option, {
      notMerge: true, // 不合并旧配置
      lazyUpdate: false // 立即更新
    })
  }
  useEffect(() => {
    getCountTransReaction({
      startTime: moment()
      .add(-1, 'years')
      .format(dateFormatSearch),
      endTime: moment().format(dateFormatSearch)
    }).then((res: any) => {
      const {list = []} = res
      let data = []
      list.forEach(d => {
        if (!data.hasOwnProperty(d.reactionTime)) {
          data[d.reactionTime] = d;
          data[d.reactionTime].hospitalName = [d.hospitalName];
          data[d.reactionTime].reactType = [`${d.reactType}（${d.ctreaction}）`];
        } else {
          data[d.reactionTime].ctreaction = data[d.reactionTime].ctreaction + d.ctreaction;
          data[d.reactionTime].hospitalName.push(d.hospitalName)
          data[d.reactionTime].reactType.push(`${d.reactType}（${d.ctreaction}）`)
        }
      });
      renderChart(list)
    })
  }, [])
    
  return (
    <div className={styles.bloodBadReaction}>
      <div className={styles.bloodBadReaction_chartBox_charts} ref={chartDom}></div>
    </div>
  )
}
export default memo(BloodBadReaction)