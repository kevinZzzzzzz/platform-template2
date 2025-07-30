import { getAppInfo } from '@/api/modules/login';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import AccountPassword from './components/AccountPassword';
import styles from './index.module.less'

let AccountPasswordComp = AccountPassword
const remoteMap = {
  // @ts-ignore
  'chongqing': lazy(() => import('remote_chongqing/AccountPassword'))
}
if (import.meta.env.VITE_CUSTOM && remoteMap[import.meta.env.VITE_CUSTOM]) {
  try {
    AccountPasswordComp = remoteMap[import.meta.env.VITE_CUSTOM]
  } catch (error) {
    AccountPasswordComp = AccountPassword
  }
}
function LoginPage(props: any) {
  const [appInfo, setAppInfo] = useState<any>({});
  useEffect(() => {
    getAppInfo().then(res => {
      setAppInfo(res);
    });
  }, [])
  return (
    <div className={styles.loginPage}>
      <Suspense fallback={<div>Loading</div>}>
        <AccountPasswordComp appInfo={appInfo} />
      </Suspense>
    </div>
  )
}
export default LoginPage