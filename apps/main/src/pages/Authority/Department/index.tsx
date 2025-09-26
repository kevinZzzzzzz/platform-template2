import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import styles from './index.module.less';
import DepartComp from "@/components/Depart";
import { modalTypeEnum } from '@/enums';
import EditDept from './EditDept';
import EditStation from './editStation';

type EditObjectType = 'dept' | 'station' | 'hospital' | 'admin'

function AuthorityDepartmentPage(props: any) {
	const departRef = useRef(null);
  const [editType, setEditType] = useState('add');
  const [editObjectType, setEditObjectType] = useState<EditObjectType>('dept')
  const [deptList, setDeptList] = useState<any>([])
  /**
	 * 处理部门切换，根据部门类型筛选用户数据
	 */
	const changeDataSetByArea = useCallback(value => {
		const area = value?.node;
    const selected = value?.selected
		const matches = area.pos.match(/-/g);
    console.log('changeDataSetByArea', value)
  }, [])

  // 初始化部门数据
  const initDept = useCallback((list) => {
    setDeptList(list)
  }, [])
  const RenderEditComponent = useMemo(() => {
    if (editObjectType === 'dept') {
      const stations = deptList?.filter(depts => depts.deptScope === 'F' || depts.deptScope === 'G');
      const hospitals = deptList?.filter(depts => depts.deptScope === 'E');
      const staHosList = [...stations, ...hospitals]?.map((d) => {
        return {
          label: d.name,
          value: d.deptId,
        }
      });
      return <EditDept staHosList={staHosList} editType={editType} />
    }
    if (editObjectType === 'station') {
      return <EditStation editType={editType} />
    }
  }, [editObjectType, deptList])
    
  return (
    <div className={styles.authorityDepartment}>
      <DepartComp ref={departRef} initDept={initDept} clickChange={changeDataSetByArea} needBtn btnText="添加机构/科室" />
			<div className={styles.authorityDepartment_content}>
        <div className={styles.authorityDepartment_content_header}>
          {modalTypeEnum[editType]}
        </div>
        <div className={styles.authorityDepartment_content_main}>
          {RenderEditComponent}
        </div>
      </div>
    </div>
  )
}
export default AuthorityDepartmentPage