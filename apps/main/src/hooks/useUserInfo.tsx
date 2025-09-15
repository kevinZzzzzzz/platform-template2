import { RootState, useDispatch } from "@/store";
import { setLoginInfo } from "@repo/store/lib//auth";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken } from "@repo/store/lib/auth";

function useUserInfo() {
  // @ts-ignore
	const { loginInfo, userpwd, publicKey } = useSelector((state: RootState) => state.auth);
  const [userInfo, setUserInfo] = useState<any>({});
  const userpwdRef = useRef<any>(userpwd)
  const publicKeyRef = useRef<any>(publicKey)
	const navigate = useNavigate();
	const dispatch = useDispatch();
  useEffect(() => {
    if (loginInfo) {
      setUserInfo(loginInfo);
    }
  }, [loginInfo])
  // 更新用户信息
  const updateUserInfo = (params: any) => {
    setUserInfo(params);
    dispatch(setLoginInfo(params))
  }
  // 退出登录
  const logoutFun = () => {
    setUserInfo({});
    dispatch(setToken(""));
    localStorage.removeItem("token")
    navigate("/login");
  }

  return {
    userpwdRef: userpwdRef.current,
    publicKeyRef: publicKeyRef.current,
    userInfo,
    updateUserInfo,
    logoutFun
  }
}

export default useUserInfo;
