import logo from "@/assets/images/logo.png";
import companyLogo from "@/assets/images/companyLogo.png";
// import React from "react";
import { RootState, useDispatch, useSelector } from "@/store";

const Logo = ({ isCollapse }: { isCollapse: boolean }) => {
	const { sysCompanyName } = useSelector((state: RootState) => state.global);
	return (
		<div className="logo-box">
			{!isCollapse ? (
				<>
					<img src={companyLogo} alt="logo" className="logo-img" />
					<h2 className="logo-text">{sysCompanyName}</h2>
				</>
			) : (
				<img src={logo} alt="logo" className="logo-img logoSpin" />
			)}
		</div>
	);
};

export default Logo;
