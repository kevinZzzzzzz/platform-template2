import { RootState } from '@/store';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';


function useDept() {
  const { deptUserList, hosStaUserList } = useSelector((state: RootState) => state.dept);

  return {
    deptUserList,
    hosStaUserList
  }
}

export default useDept;