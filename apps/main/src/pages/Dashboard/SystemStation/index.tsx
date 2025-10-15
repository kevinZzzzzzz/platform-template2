import { Card } from 'antd';
import React, { useState, useEffect } from 'react';
import BloodApplication from './BloodApplication';
import BloodBadReaction from './BloodBadReaction';
import BookingBloodStatistic from './BookingBloodStatistic';
import styles from './index.module.less'
import InventoryAnalysis from './InventoryAnalysis';

function SystemDashboardPage(props: any) {
    
  return (
    <div className={styles.systemDashboard}>
      <div className={styles.systemDashboard_block}>
        <Card title={
          <p className={styles.systemDashboard_cardTitle}>库存动态分析<span>(显示当天)</span></p>
        }>
          <InventoryAnalysis />
        </Card>
      </div>
      <div className={styles.systemDashboard_block}>
        <Card title={
          <p className={styles.systemDashboard_cardTitle}>血液预订分析<span>(显示最近7天)</span></p>
        }>
          <BookingBloodStatistic />
        </Card>
      </div>
      <div className={styles.systemDashboard_blockLine}>
        <div className={styles.systemDashboard_block}>
          <Card title={
            <p className={styles.systemDashboard_cardTitle}>输血申请单分析<span>(显示最近30天)</span></p>
          }>
            <BloodApplication />
          </Card>
        </div>
        <div className={styles.systemDashboard_block}>
          <Card title={
            <p className={styles.systemDashboard_cardTitle}>输血不良反应分析<span>(显示最近30天)</span></p>
          }>
            <BloodBadReaction />
          </Card>
        </div>
      </div>
    </div>
  )
}
export default SystemDashboardPage