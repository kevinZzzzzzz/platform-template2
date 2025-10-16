import { STATIONDICTLIST, VIEWNULL } from '@/config/config';
import { RootState } from '@/store';
import { handleSetDict } from '@/utils/dict';
import { getV } from '@/utils/util';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

/**
 * @description: 处理字典数据
 * @returns {
 *  dictArr: 字典数据数组
 *  dictMapper: 字典数据映射
 * }
 */
function useDict() {
  const { dictList } = useSelector((state: RootState) => state.dict);
  // @ts-ignore
	const { appData, loginInfo } = useSelector((state: RootState) => state.auth);
  const [dictArr, setDictArr] = useState<any>(null);
  const [dictMapper, setDictMapper] = useState<any>(null);
  const dictArrRef = useRef(null)
  const dictMapperRef = useRef(null)

  const transformByMapper = (value: string, type?: Array<string> | string): string => {
    if (!value) {
      return '';
    }
    if (Array.isArray(type)) {
      if (dictMapper[type[0]] && dictMapper[type[0]].hasOwnProperty(value)) {
        return getV(dictMapper, type[0], value, type[1]);
      } else {
        return VIEWNULL;
      }
    } else if (type) {
      if (dictMapper.hasOwnProperty(type)) {
        return getV(dictMapper, type, value, 'name');
      } else {
        return value + VIEWNULL;
      }
    } else {
      return value.trim();
    }
  }

  useEffect(() => {
    const {dictArrT, dictMapperT} = handleSetDict(dictList, STATIONDICTLIST, appData, loginInfo)
    setDictArr(dictArrT)
    dictArrRef.current = dictArrT
    setDictMapper(dictMapperT)
    dictMapperRef.current = dictMapperT
  }, [])

  return {
    dictArr,
    dictMapper,
    dictArrRef,
    dictMapperRef,
    transformByMapper
  }
}

export default useDict;