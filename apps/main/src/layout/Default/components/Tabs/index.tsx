import { Tabs, message } from "antd";
import { HomeFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import { setTabsList, setTabsActive } from "@repo/store/lib/tabs";
import { RootState, useDispatch, useSelector } from "@/store";
// import { routerArray } from "@/router";
import { searchRoute } from "@/utils/util";
// import MoreButton from "./components/MoreButton";
import "./index.less";
import { isFederateModule } from "@/utils/is";

const LayoutTabs = (props) => {
	const dispatch = useDispatch();
  // @ts-ignore
	const { tabsList } = useSelector((state: RootState) => state.tabs);
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const [activeValue, setActiveValue] = useState<string>(pathname);


	useEffect(() => {
		addTabs();
	}, [pathname]);

	// click tabs
	const clickTabs = (path: string) => {
		navigate(path);
	};

	// add tabs
	const addTabs = () => {
		const route = searchRoute(pathname, props.routerArray);
		let newTabsList = [];
    if (isFederateModule) {
      newTabsList = props.routerArray.map(d => {
        return {
          key: d.path,
          label: d.meta!.title || '',
          path: d.path
        }
      })
    } else {
      newTabsList = JSON.parse(JSON.stringify(tabsList));
    }
		if (route.path && tabsList.every((item: any) => item.path !== route.path)) {
			newTabsList.push({ key: route.path, label: route.meta!.title || '', path: route.path });
		}
		dispatch(setTabsList(newTabsList));
		setActiveValue(pathname);
	};

	// delete tabs
	const delTabs = (tabPath: string) => {
		if (tabPath === HOME_URL) return;
		if (pathname === tabPath) {
			tabsList.forEach((item: any, index: number) => {
				if (item.path !== pathname) return;
				const nextTab = tabsList[index + 1] || tabsList[index - 1];
				if (!nextTab) return;
				navigate(nextTab.path);
			});
		}
		message.success("你删除了Tabs标签 😆😆😆");
		dispatch(setTabsList(tabsList.filter((item: any) => item.path !== tabPath)));
	};

	return (
		<div className="tabs">
			<Tabs
				activeKey={activeValue}
				onChange={clickTabs}
				hideAdd
				type="editable-card"
				onEdit={path => {
					delTabs(path as string);
				}}
        items={tabsList.map((d, idx) => {
          return {
            ...d,
            label: (
              <div
                key={idx}
              >
                {d.label}
              </div>
            ),
          };
        })}
			/>
			{/* <MoreButton delTabs={delTabs}></MoreButton> */}
		</div>
	);
};

export default LayoutTabs;
