import React, { useState, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from "@/store";

function HomePage(props: any) {
	const { sysCompanyName } = useSelector((state: RootState) => state.global);
    
  useEffect(() => {
    console.log(window.localStorage.a);
  }, [])
  return (
    <>
      <h1>standard2 Home Page {window.localStorage.a} 44444</h1>
      <h2 className="logo-text">{sysCompanyName}</h2>
    </>
  )
}
export default HomePage