import { Layout } from "antd";
import AvatarIcon from "./components/AvatarIcon";
import CollapseIcon from "./components/CollapseIcon";
import BreadcrumbNav from "./components/BreadcrumbNav";
import AssemblySize from "./components/AssemblySize";
import Language from "./components/Language";
import Theme from "./components/Theme";
import Fullscreen from "./components/Fullscreen";
import "./index.less";
import React from "react";
import MessageComp from "./components/Message";

const LayoutHeader = () => {
	const { Header } = Layout;

	return (
		<Header>
			<div className="header-lf">
				<CollapseIcon />
				{/* <BreadcrumbNav /> */}
			</div>
			<div className="header-ri">
				{/* <AssemblySize />
				<Language /> */}
				{/* <Theme /> 
				<Fullscreen />*/}
        <MessageComp />
				<AvatarIcon />
			</div>
		</Header>
	);
};

export default LayoutHeader;
