import { getAppInfo, getDictList, getFrontConfig, loginApi, updateFrontConfig } from '@/api/modules/login';
import React, { useState, useEffect, Suspense, useRef } from 'react';
import AccountPassword from './components/AccountPassword';
import styles from './index.module.less';
import { Base64, cloneObj, compareVer, encrypt, hextoString, mergeObj } from '@/utils/util';
import { RootState, store, useSelector } from "@/store";
import { setToken, setLoginInfo, setAppData } from "@repo/store/lib/auth";
import { STATIONDICTLIST } from '@/config/config';
import { handleSetDict } from '@/utils/dict';
import { setDictArr, setDictMap } from '@/store/modules/dict';

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
	const { appData, loginInfo } = useSelector((state: RootState) => state.auth);

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
      window.localStorage.setItem('token', res.token)
      store.dispatch(setLoginInfo(res.user))
      handleConfig(res.user.dept.parentId)
      handleDict()
    }).catch(err => {
      failLogin()
    })
  }
  // * 初始化本地配置， 登录初始化本地配置
  const handleConfig = async (deptId: string) => {
    let currentConfig: any = cloneObj(appData);
    let {list} = await getFrontConfig();
    if (list) {
      const serverConfig = (list.config && JSON.parse(list.config)) || {};
      const serverV =  serverConfig.version || '';
      const currentV = currentConfig.version || '';
      if (compareVer(currentV, serverV)) { // 当前版本号大于等于服务器版本号
        const mergeResult = mergeObj(serverConfig, currentConfig);
        // 更新当前配置
        updateConfig(deptId, mergeResult)
      } else {
        store.dispatch(setAppData(serverConfig));
      }
    }
  }
  // * 初始化字典
  const handleDict = async () => {
    const dictAll = []
    STATIONDICTLIST.forEach(p => {
      if (p === 'preTest') {
        dictAll.push(`${p}?queryScope=all`)
      } else if (p === 'bloodmap') {
        dictAll.push(`${p}?city=ch`)
      } else if (p === 'exp') {
        dictAll.push(`${p}/bloods`)
      } else {
        dictAll.push(p)
      }
    });
    const res = await getDictList(dictAll)
    const {dictArr, dictMapper} = handleSetDict(res, STATIONDICTLIST, appData, loginInfo)
    store.dispatch(setDictMap(dictMapper))
    store.dispatch(setDictArr(dictArr))
  }
  // * 更新当前配置
  const updateConfig = (deptId: string, config: any) => {
    updateFrontConfig({
      hospitalId: deptId,
      config: JSON.stringify(config)
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
        store.dispatch(setAppData(data))
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