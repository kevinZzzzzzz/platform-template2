import { RootState } from '@/store';
import { Divider } from 'antd';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './index.module.less'

function StationSettingPage(props: any) {
  // @ts-ignore
	const { appData } = useSelector((state: RootState) => state.auth);
    console.log(appData)
  return (
    <div className={styles.settingStation}>
      <section className={styles.settingStation_header}>
        <p>
          系统设置-v{appData?.version}
        </p>
        <small> 调整当前血站的相关配置</small>
      </section>
      <section className={styles.settingStation_content}>
        <Divider plain orientation="left" style={{fontSize: '16px', color: '#49A9EE'}}>通用设置</Divider>
      </section>
    </div>
  )
}
export default StationSettingPage