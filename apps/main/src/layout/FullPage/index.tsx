import React, { useState, useEffect } from 'react';
import styles from './index.module.less'
import { Outlet } from "react-router-dom";

function FullPage(props: any) {
  const {children} = props
    
  return (
    <div className={styles.fullPage}>
      {children}
    </div>
  )
}
export default FullPage