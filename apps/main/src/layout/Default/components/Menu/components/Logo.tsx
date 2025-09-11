import logo from "@/assets/images/logo.png";
import companyLogo from "@/assets/images/companyLogo.png";
import React, {useMemo} from "react";
import { RootState, useDispatch, useSelector } from "@/store";
import useDeptUsers from "@/hooks/useDeptUsers";
import { getV } from "@/utils/util";
import styles from './index.module.less'

const Logo = ({ isCollapse }: { isCollapse: boolean }) => {
	// @ts-ignore
	const {loginInfo } = useSelector((state: RootState) => state.auth);
  const {depts0} = useDeptUsers()
	const parentId = loginInfo.dept.parentId;
  const expandedText = useMemo(() => {
    console.log('parentId', parentId, depts0.filter(d => d.deptId === parentId))
    return getV(depts0.filter(d => d.deptId === parentId), 0, 'name')
  }, [loginInfo, depts0])
	return (
		<div className="logo-box">
			{!isCollapse ? (
				<>
					<img src={companyLogo} alt="logo" className="logo-img" />
					<h2 className="logo-text">{expandedText}</h2>
				</>
			) : (
				<img src={logo} alt="logo" className="logo-img logoSpin" />
			)}
		</div>
	);
};

export default Logo;
