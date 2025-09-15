import React, { useState, useEffect } from 'react';
import styles from './index.module.less';
import DepartComp from '@/components/Depart';
function AuthorityUsersPage(props: any) {
    
  return (
    <div className={styles.authorityUsers}>
      <DepartComp />
      <div className={styles.authorityUsers_content}>
        123
      </div>
    </div>
  )
}
export default AuthorityUsersPage