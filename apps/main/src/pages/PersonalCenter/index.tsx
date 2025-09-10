import { Card } from "antd";
import React, { useState, useEffect, useMemo } from "react";
import styles from "./index.module.less";
import BaseInfoComp from "./components/BaseInfo";
import ChangePasswordComp from "./components/ChangePassword";
import MyPrintComp from "./components/MyPrint";

const componentMap = {
	"1": <BaseInfoComp />,
	"2": <ChangePasswordComp />,
	"3": <MyPrintComp />
};
const tabList = [
	{ key: "1", label: "基本信息" },
	{ key: "2", label: "修改密码" },
	{ key: "3", label: "我的打印机" }
];
function PersonalCenterPage(props: any) {
	const [activeTabKey, setActiveTabKey] = useState<string>("1");

	const onTab1Change = (key: string) => {
		setActiveTabKey(key);
	};
	const componentRef = useMemo(() => {
		return componentMap[activeTabKey];
	}, [activeTabKey]);
	return (
		<div className={styles.personalCenter}>
			<Card style={{ width: "100%" }} title="个人设置" tabList={tabList} activeTabKey={activeTabKey} onTabChange={onTab1Change}>
				{componentRef}
			</Card>
		</div>
	);
}
export default PersonalCenterPage;
