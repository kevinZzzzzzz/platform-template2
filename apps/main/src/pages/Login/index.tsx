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
// import.meta.env.VITE_CUSTOM === 'chongqing' ? 
//   React.lazy(() => 
//     import('remote_chongqing/AccountPassword').catch(() => ({ default: AccountPassword }))
//   ) : 
//   AccountPassword;
function LoginPage(props: any) {
  const [appInfo, setAppInfo] = useState<any>({});
  useEffect(() => {
    loadRemoteComp().then(res => {
      AccountPasswordComp = res.default || res
      getAppInfo().then(ress => {
        setAppInfo(ress);
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