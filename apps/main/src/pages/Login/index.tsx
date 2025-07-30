import { getAppInfo } from '@/api/modules/login';
import React, { useState, useEffect, Suspense } from 'react';
import AccountPassword from './components/AccountPassword';
import styles from './index.module.less';

// 根据环境变量决定使用哪个组件
let AccountPasswordComp = AccountPassword
const loadRemoteComp = async () => {
  const moduleMap = {
    'chongqing': () => import('./module/chongqing')
    // 其他模块...
  };
  return moduleMap[import.meta.env.VITE_CUSTOM] ? await moduleMap[import.meta.env.VITE_CUSTOM]() : AccountPassword
}
function LoginPage(_props: any) {
  const [appInfo, setAppInfo] = useState<any>({});
  useEffect(() => {
    loadRemoteComp().then(res => {
      AccountPasswordComp = res.default || res
      getAppInfo().then(data => {
        setAppInfo(data);
      });
    })
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