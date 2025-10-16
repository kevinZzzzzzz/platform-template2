import { getAppInfo, getDeptList, getDeptListAll, getDeptScopes, getDictList, getFrontConfig, getMessage, getRoleScopes, getStaDeptUsersList, loginApi, updateFrontConfig } from '@/api/modules/login';
import React, { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import AccountPassword from './components/AccountPassword';
import styles from './index.module.less';
import { Base64, cloneObj, compareVer, encrypt, hextoString, mergeObj } from '@/utils/util';
import { RootState, useSelector, useDispatch } from "@/store";
import { setToken, setLoginInfo, setAppData, setUserPwd, setPublicKey } from "@repo/store/lib/auth";
import { setResetTabs } from "@repo/store/lib/tabs";
import { STATIONDICTLIST } from '@/config/config';
import { setDictList } from '@/store/modules/dict';
import { setDeptList, setDeptListAll, setDeptScopes, setDeptUserList, setHosStaUserList, setRoleScopes } from '@/store/modules/deptUser';
import { setMessage } from '@/store/modules/message';

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
  const [publicTKey, setPublicTKey] = useState('') // 公钥
	const dispatch = useDispatch();
  // @ts-ignore
	const { appData, loginInfo } = useSelector((state: RootState) => state.auth);

  const loginFun = useCallback((data: any, succLogin: () => void, failLogin: () => void) => {
    const { username, password } = data
    dispatch(setUserPwd(password))
    loginApi({
      username,
      password
    }).then(res => {
      if (res.user && res.user.role && res.user.role.menuList) {
        res.user.role.menuList = hextoString(Base64(res.user.role.menuList));
      }
      succLogin()
      dispatch(setResetTabs())
      dispatch(setToken(res.token))
      window.localStorage.setItem('token', res.token)
      dispatch(setLoginInfo(res.user))
      handleConfig(res.user.dept.parentId)
      handleDict()
      handleDeptUser(res)
      handleMessage()
    }).catch(err => {
      failLogin()
    })
  }, [])

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
      }
      //  else {
      //   dispatch(setAppData(serverConfig));
      // }
    }
  }
  // * 处理消息
  const handleMessage = async () => {
    const {list: messageList} = await getMessage({
      beenRead: 0,
    })
    dispatch(setMessage(messageList))
  }
  // * 处理部门单位及用户字典
  const handleDeptUser = async (res) => {
    const {users: deptUserList} = await getStaDeptUsersList({
      deptId: res.user.deptId
    })
    const {users: hosStaUserList} = await getStaDeptUsersList({
      deptParentId: res.user.dept.parentId
    })
    dispatch(setDeptUserList(deptUserList))
    dispatch(setHosStaUserList(hosStaUserList))

    const {menus: deptList} = await getDeptList()
    const {menus: deptListAll} = await getDeptListAll()
    dispatch(setDeptList(deptList))
    dispatch(setDeptListAll(deptListAll))
    // 获取科室类别列表
    const {list: deptScopes} = await getDeptScopes()
    dispatch(setDeptScopes(deptScopes))
    // 获取角色类别列表
    const {list: roleScopes} = await getRoleScopes()
    dispatch(setRoleScopes(roleScopes))
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
      stationId: deptId,
      config: JSON.stringify(config)
    })
    dispatch(setAppData(config));
  }
  useEffect(() => {
    loadRemoteComp().then(res => {
      AccountPasswordComp = res.default || res
      import('./publicKey.json').then((res: any) => {
        setPublicTKey(res.default.key)
        dispatch(setPublicKey(res.default.key))
      })
      getAppInfo().then(data => {
        setAppInfo(data);
        document.title = data.app.name
        dispatch(setAppData(data))
      });
    })
  }, [])
  return (
    <div className={styles.loginPage}>
      <Suspense fallback={<div>Loading</div>}>
        <AccountPasswordComp appInfo={appInfo} publicKey={publicTKey} loginFun={loginFun} />
      </Suspense>
    </div>
  )
}
export default LoginPage