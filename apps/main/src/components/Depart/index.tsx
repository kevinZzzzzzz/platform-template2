import React, { useState, useEffect, memo, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import styles from './index.module.less'
import { Input, Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import { getAreaApi, getDeptListAllApi } from '@/api/modules/user';

const { Search } = Input;


const DepartComp = forwardRef((props: any, ref: any) => {
  const { clickChange } = props
  const [area, setArea] = useState<any[]>([])
  const [dept, setDept] = useState<any[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    
  useEffect(() => {
    console.log('DepartComp', ref)
    initTreeMotion()
  }, [])

  // 暴露给父组件的属性
  useImperativeHandle(ref, () => ({
    initTreeMotion,
    initSelect
  }));
  const treeNodes: TreeDataNode[] = useMemo(() => {
    const loop = (data: any[]) => {
      return data.map((item) => {
        const strTitle = item.areaName || item.name;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        return {
          ...item,
          title: index !== -1 ? <p>{beforeStr}<span style={{color: '#f5222d'}}>{searchValue}</span>{afterStr}</p> : strTitle,
          key: (item.id && `area-${item.id}`) || (item.deptId && `dept-${item.deptId}`) || '',
          children: ('id' in item) ?
          loop(item.dept?.filter(dp => !dp.parentId) || []) :
          loop(dept.filter(de => de.parentId === item.deptId)),
        };
      })
    };
    return loop(area)
  }, [area, dept, searchValue])
  
  const initSelect = () => {
    setSelectedKeys([])
  }
  const initTreeMotion = () => {
    setArea([])
    setDept([])
    Promise.all([getAreaApi({ areaId: '' }), getDeptListAllApi(-1)]).then((res: any = [{}, {}]) => {
      const {data: areaList = []} = res[0]
      const {list: deptList = []} = res[1]
      setArea(areaList.filter(data => !data.delFlagArea))
      setDept(deptList)
    })
  }
  const onChangeVal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
  }
  const onSelectClick = (key: any[], event: any) => {
    setSelectedKeys(key)
    clickChange(event)
  }
  return (
    <div className={styles.depart}>
      <div className={styles.depart_search}>
        <Search placeholder="请输入" allowClear onChange={onChangeVal} />
      </div>
      <div className={styles.depart_tree}>
        <Tree
          showLine
          selectedKeys={selectedKeys}
          onSelect={(key, event) => {
            onSelectClick(key, event)
          }}
          treeData={treeNodes}
        />
      </div>
    </div>
  )
})
export default memo(DepartComp)