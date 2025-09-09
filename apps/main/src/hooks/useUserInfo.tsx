import { RootState } from "@/store";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

function useUserInfo() {
  // @ts-ignore
	const { loginInfo } = useSelector((state: RootState) => state.auth);
  const [userInfo, setUserInfo] = useState<any>({});
  useEffect(() => {
    if (loginInfo) {
      setUserInfo(loginInfo);
    }
  }, [loginInfo])

  return {
    userInfo
  }
}

export default useUserInfo;
