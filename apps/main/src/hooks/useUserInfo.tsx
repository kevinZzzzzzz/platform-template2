import { RootState, useDispatch } from "@/store";
import { setLoginInfo } from "@repo/store/lib//auth";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

function useUserInfo() {
  // @ts-ignore
	const { loginInfo } = useSelector((state: RootState) => state.auth);
  const [userInfo, setUserInfo] = useState<any>({});
	const dispatch = useDispatch();
  useEffect(() => {
    if (loginInfo) {
      setUserInfo(loginInfo);
    }
  }, [loginInfo])
  // 更新用户信息
  const updateUserInfo = (params: any) => {
    setUserInfo(params);
    dispatch(setLoginInfo(params));
  }

  return {
    userInfo,
    updateUserInfo
  }
}

export default useUserInfo;
