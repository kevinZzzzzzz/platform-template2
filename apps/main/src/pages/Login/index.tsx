import React, { useState, useEffect } from 'react';
import AccountPassword from './components/AccountPassword';
import styles from './index.module.less'

function LoginPage(props: any) {
    
  return (
    <div className={styles.loginPage}>
      <AccountPassword />
    </div>
  )
}
export default LoginPage