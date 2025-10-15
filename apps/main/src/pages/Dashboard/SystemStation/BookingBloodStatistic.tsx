import { getBookingBloodStatistics } from '@/api/modules/dashboard';
import useDict from '@/hooks/useDict';
import { getV } from '@/utils/util';
import { Table } from 'antd';
import Column from 'antd/es/table/Column';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import { dateFormatSearch, tableMapperRow } from 'hoslink-xxx';
import moment from 'moment';
import React, { useState, useEffect, memo } from 'react';
import styles from './index.module.less'

function BookingBloodStatistic(props: any) {
	const { transformByMapper, dictMapper } = useDict();
  const [orderAnalyze, setOrderAnalyze] = useState<any>([])

  const getBookData = () => {
    if (!dictMapper) return false;
    getBookingBloodStatistics({
      startUseDate: '',
      endUseDate: '',
      deptId: '',
      bloodGroup: '',
      rhBloodGroup: '',
      startOrderDate: moment().add(-7, 'days').format(dateFormatSearch),
      endOrderDate: moment().format(dateFormatSearch),
      bloodSubtypeId: '',
      orderStatus: '',
    }).then((res: any) => {
      const {detailVoList = []} = res || {}
      let orderAnalyzeT = []
      const temp = {};
      detailVoList.forEach((d, i) => {
        if (!temp.hasOwnProperty(d.bloodSubtypeId + '-' + d.deptId)) {
          temp[d.bloodSubtypeId + '-' + d.deptId] = {
            deptId: d.deptId,
            subtype: d.bloodSubtypeId,
            type: getV(dictMapper, 'subtype', d.bloodSubtypeId, 'type')
          };
        }
        if (temp.hasOwnProperty(d.bloodSubtypeId + '-' + d.deptId)) {
          detailVoList[i].orderDetailVoList.forEach(item => {
            temp[d.bloodSubtypeId + '-' + d.deptId][
              item.bloodGroup + item.rhBloodGroup
            ] =
              item.amountall;
          });
        }
      });
      const arr = [];
      for (const key in temp) {
        arr.push({
          deptId: temp[key]['deptId'],
          bloodType: temp[key]['subtype'],
          type: temp[key]['type'],
          APos: temp[key]['APOSTIVE'] || 0,
          BPos: temp[key]['BPOSTIVE'] || 0,
          OPos: temp[key]['OPOSTIVE'] || 0,
          ABPos: temp[key]['ABPOSTIVE'] || 0,
          ANeg: temp[key]['ANEGATIVE'] || 0,
          BNeg: temp[key]['BNEGATIVE'] || 0,
          ONeg: temp[key]['ONEGATIVE'] || 0,
          ABNeg: temp[key]['ABNEGATIVE'] || 0,
          total:
            (temp[key]['APOSTIVE'] || 0) +
            (temp[key]['BPOSTIVE'] || 0) +
            (temp[key]['OPOSTIVE'] || 0) +
            (temp[key]['ABPOSTIVE'] || 0) +
            (temp[key]['ANEGATIVE'] || 0) +
            (temp[key]['BNEGATIVE'] || 0) +
            (temp[key]['ONEGATIVE'] || 0) +
            (temp[key]['ABNEGATIVE'] || 0),
        });
      }
      orderAnalyzeT = arr.reduce((a, b) => {
        const index = a.findIndex(v => v.bloodType === b.bloodType);
        if (index === -1) {
          a.push(b);
        } else {
          a[index]['ABNeg'] += b['ABNeg'];
          a[index]['ABPos'] += b['ABPos'];
          a[index]['ANeg'] += b['ANeg'];
          a[index]['APos'] += b['APos'];
          a[index]['BNeg'] += b['BNeg'];
          a[index]['BPos'] += b['BPos'];
          a[index]['ONeg'] += b['ONeg'];
          a[index]['OPos'] += b['OPos'];
          a[index]['total'] += b['total'];
        }
        return a;
      }, []);
      orderAnalyzeT = tableMapperRow(orderAnalyzeT, 'type');
      setOrderAnalyze(orderAnalyzeT.map((item, index) => ({ ...item, idx: index })))
    })
  }
  useEffect(() => {
    getBookData()
  }, [dictMapper])
    
  return (
    <div className={styles.bookingBloodStatistic}>
      <Table dataSource={orderAnalyze} pagination={false}
					rowKey={record => record.idx}>
        <Column title="血液种类" dataIndex="type" key="type" render={value => transformByMapper(value, ['type', 'name'])} />
        <Column title="血液品种" dataIndex="bloodType" key="bloodType" render={value => transformByMapper(value, ['subtype', 'name'])}  />
        <ColumnGroup title="医院申请量">
          <Column title="A+" dataIndex="APos" key="APos" />
          <Column title="B+" dataIndex="BPos" key="BPos" />
          <Column title="O+" dataIndex="OPos" key="OPos" />
          <Column title="AB+" dataIndex="ABPos" key="ABPos" />
          <Column title="A-" dataIndex="ANeg" key="ANeg" />
          <Column title="B-" dataIndex="BNeg" key="BNeg" />
          <Column title="O-" dataIndex="ONeg" key="ONeg" />
          <Column title="AB-" dataIndex="ABNeg" key="ABNeg" />
          <Column title="总量" dataIndex="total" key="total" />
        </ColumnGroup>
      </Table>
    </div>
  )
}
export default memo(BookingBloodStatistic)