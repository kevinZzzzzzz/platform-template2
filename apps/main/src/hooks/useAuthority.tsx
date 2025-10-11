import { getAuthorityList } from "@/api/modules/login";
import { useEffect, useState } from "react";

function useAuthority() {
  const [authority, setAuthority] = useState<any>([])

  const getAuthorityData = async () => {
    const { data } = await getAuthorityList();
    setAuthority(data)
  }
  useEffect(() => {
    getAuthorityData()
  }, [])

    
  return {
    authority,
  }
}
export default useAuthority