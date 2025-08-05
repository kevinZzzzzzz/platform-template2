import { getAppInfo, getDictList, getFrontConfig, getStaDeptUsersList, loginApi, updateFrontConfig } from '@/api/modules/login';
import React, { useState, useEffect, Suspense, useRef } from 'react';
import AccountPassword from './components/AccountPassword';
import styles from './index.module.less';
import { Base64, cloneObj, compareVer, encrypt, hextoString, mergeObj } from '@/utils/util';
import { RootState, useSelector, useDispatch } from "@/store";
import { setToken, setLoginInfo, setAppData } from "@repo/store/lib/auth";
import { STATIONDICTLIST } from '@/config/config';
import { handleSetDict } from '@/utils/dict';
import { setDictList } from '@/store/modules/dict';
import { setDeptUserList, setHosStaUserList } from '@/store/modules/dept';

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
	const dispatch = useDispatch();
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
      dispatch(setToken(res.token))
      window.localStorage.setItem('token', res.token)
      dispatch(setLoginInfo(res.user))
      handleConfig(res.user.dept.parentId)
      handleDict()
      handleDept(res)
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
        dispatch(setAppData(serverConfig));
      }
    }
  }
  // * 处理部门字典
  const handleDept = async (res) => {
    const {users: deptUserList} = await getStaDeptUsersList({
      deptId: res.user.deptId
    })
    const {users: hosStaUserList} = await getStaDeptUsersList({
      deptParentId: res.user.dept.parentId
    })
    dispatch(setDeptUserList(deptUserList))
    dispatch(setHosStaUserList(hosStaUserList))
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
    dispatch(setDictList(res))
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
        dispatch(setAppData(data))
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