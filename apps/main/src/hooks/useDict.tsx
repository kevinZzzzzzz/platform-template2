import { STATIONDICTLIST } from '@/config/config';
import { RootState } from '@/store';
import { handleSetDict } from '@/utils/dict';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';


function useDict() {
  const { dictList } = useSelector((state: RootState) => state.dict);
  // @ts-ignore
	const { appData, loginInfo } = useSelector((state: RootState) => state.auth);
  const [dictArr, setDictArr] = useState<any>({});
  const [dictMapper, setDictMapper] = useState<any>({});

  useEffect(() => {
    const {dictArrT, dictMapperT} = handleSetDict(dictList, STATIONDICTLIST, appData, loginInfo)
    setDictArr(dictArrT)
    setDictMapper(dictMapperT)
  }, [])

  return {
    dictArr,
    dictMapper
  }
}

export default useDict;