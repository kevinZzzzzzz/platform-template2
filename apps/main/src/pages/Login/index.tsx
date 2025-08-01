import { getAppInfo, loginApi } from '@/api/modules/login';
import React, { useState, useEffect, Suspense, useRef } from 'react';
import AccountPassword from './components/AccountPassword';
import styles from './index.module.less';
import { Base64, encrypt, hextoString } from '@/utils/util';
import { store } from "@/store";
import { setToken, setLoginInfo } from "@repo/store/lib/auth";

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
  const [publicKey, setPublicKey] = useState('') // 公钥

  const loginFun = async (data: any, succLogin: () => void, failLogin: () => void) => {
    const { username, password } = data
    loginApi({
      username,
      password
    }).then(res => {
      if (res.user && res.user.role && res.user.role.menuList) {
        res.user.role.menuList = hextoString(Base64(res.user.role.menuList));
      }
      succLogin()
      store.dispatch(setToken(res.token))
      store.dispatch(setLoginInfo(res.user))
    }).catch(err => {
      failLogin()
    })
  }
  useEffect(() => {
    loadRemoteComp().then(res => {
      AccountPasswordComp = res.default || res
      import('./publicKey.json').then((res: any) => {
        setPublicKey(res.default.key)
      })
      getAppInfo().then(data => {
        setAppInfo(data);
      });
    })
  }, [])
  return (
    <div className={styles.loginPage}>
      <Suspense fallback={<div>Loading</div>}>
        <AccountPasswordComp appInfo={appInfo} publicKey={publicKey} loginFun={loginFun} />
      </Suspense>
    </div>
  )
}
export default LoginPage