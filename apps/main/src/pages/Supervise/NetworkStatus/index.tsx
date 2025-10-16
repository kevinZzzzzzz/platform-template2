import { queryStoreDetail } from '@/api/modules/supervise';
import useDeptUsers from '@/hooks/useDeptUsers';
import { DesktopOutlined } from '@ant-design/icons';
import { dateFormatSearch } from 'hoslink-xxx';
import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.less';


function NetworkStatus(props: any) {
  const {depts0} = useDeptUsers()
  const [deptsList, setDeptsList] = useState([])
  const superDepts = useRef([])
  const [errorDept, setErrorDept] = useState(0)
  const day = moment().format(dateFormatSearch)

  
  const getNetworkStatus = () => {
    queryStoreDetail({}).then((res: any) => {
      const {sum = []} = res || {}
      superDepts.current = sum
      const deptsT = depts0?.filter(d => d.deptScope !== 'F' && d.deptScope !== 'G') || []
      deptsT.forEach(d => {
        d.online = false;
        let superDept = superDepts.current.filter(o => o.hospitalId === d.deptId);
        if (superDept.length) {
          if (new Date().getTime() - new Date(superDept[0].lastUploadTime).getTime() < 24 * 60 * 60 * 1000) {
            d.online = true;
          }
        }
      })
      setDeptsList(deptsT)
      setErrorDept(deptsT.filter(d => !d.online).length)
    })
  }

  useEffect(() => {
    if (depts0.length) {
      getNetworkStatus()
    }
  }, [depts0])
  return (
    <div className={styles.networkStatus}>
      <h2>联网医院共{deptsList.length}家，{day} 有 <span>{errorDept}</span> 家医院联网异常</h2>
      <div className={styles.networkStatus_content}>
        {
          deptsList.map(d => (
            <div key={d.deptId} className={styles.networkStatus_content_item }>
              <DesktopOutlined style={{fontSize: 100, color: d.online ? 'green' : '#ccc'}}/>
              <div style={{color: d.online ? '#000' : '#ccc'}} className={styles.networkStatus_item_title}>{d.name}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
export default NetworkStatus