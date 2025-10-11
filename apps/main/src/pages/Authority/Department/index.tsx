import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import styles from "./index.module.less";
import DepartComp from "@/components/Depart";
import { modalTypeEnum } from "@/enums";
import EditDept from "./EditDept";
import EditStation from "./EditStation";
import EditHospital from "./EditHospital";
import EditAdmin from "./EditAdmin";
import { saveDeptApi, updateDeptApi } from "@/api/modules/user";

type EditObjectType = "dept" | "station" | "hospital" | "admin";

const deptScopesMap = {
	E: "hospital",
	F: "station",
	G: "admin",
	0: "dept",
	"": "dept"
};
function AuthorityDepartmentPage(props: any) {
	const departRef = useRef(null);
	const [editType, setEditType] = useState("add");
	const [editObjectType, setEditObjectType] = useState<EditObjectType>("dept");
	const [deptList, setDeptList] = useState<any>([]);
	const [dictArea, setDictArea] = useState<any>([]);
	const [editData, setEditData] = useState<any>({});
	/**
	 * 处理部门切换，根据部门类型筛选用户数据
	 */
	const changeDataSetByArea = useCallback(value => {
		const node = value?.node;
		const selected = value?.selected;
		const matches = node.pos.match(/-/g);
		switch (matches?.length) {
			case 2:
				setEditType("edit");
				setEditData(node);
				setEditObjectType(deptScopesMap[node.deptScope] || "dept");
				break;
			case 3:
				setEditType("edit");
				setEditData(node);
				setEditObjectType(deptScopesMap[node.deptScope] || "dept");
				break;
			default:
				setEditData(node);
				break;
		}
	}, []);

	// 初始化部门数据和地域数据
	const initDept = useCallback((dept, area) => {
		setDeptList(
			dept?.map(d => {
				return {
					...d,
					label: d.name,
					value: d.deptId
				};
			})
		);
		setDictArea(
			area?.map(d => {
				return {
					...d,
					label: d.areaName,
					value: d.id
				};
			})
		);
	}, []);
	const changeEditObjectType = useCallback((value: EditObjectType) => {
		setEditObjectType(deptScopesMap[value] || "dept");
	}, []);
	const handleDeptAddFun = useCallback(() => {
		setEditType("add");
		if (editData?.areaName) {
			setEditObjectType("hospital");
		} else {
			setEditObjectType("dept");
		}
	}, []);

  // 处理保存函数
	const handleSaveFun = useCallback(async (values, callback) => {
		switch (values.deptScope) {
			case "E": // 医院标准版
				values["parentId"] = 0;
				break;
			case "D": // 医院平台版
				values["parentId"] = 0;
				break;
			case "F": // 血站
				values["parentId"] = 0;
				values["stationId"] = 0;
				break;
			case "G": // 监管平台
				values["parentId"] = 0;
				values["stationId"] = 0;
				break;
			default:
				break;
		}
		if (editType === "add") {
			await saveDeptApi({
				...values,
				parentId: values.parentId || 0,
				delFlag: values.delFlag ? 0 : 1,
				deptScope: values.deptScope || values.scope
			}).then((res: any) => {
        departRef.current.initTreeMotion()
        callback();
      });
		} else {
			await updateDeptApi({
				...values,
				parentId: values.parentId || 0,
				delFlag: values.delFlag ? 0 : 1,
				deptScope: values.deptScope || values.scope
			}).then((res: any) => {
        departRef.current.initTreeMotion()
        callback();
      });
		}
  }, []);
	const RenderEditComponent = useMemo(() => {
		const stations = deptList?.filter(depts => depts.deptScope === "F" || depts.deptScope === "G");
		const hospitals = deptList?.filter(depts => depts.deptScope === "E");
		if (editObjectType === "dept") {
			const staHosList = [...stations, ...hospitals];
			return (
				<EditDept
					staHosList={staHosList}
					editType={editType}
					editData={editData}
					changeEditObjectType={changeEditObjectType}
					handleSaveFun={handleSaveFun}
				/>
			);
		}
		if (editObjectType === "station") {
			return (
				<EditStation
					dictArea={dictArea}
					editType={editType}
					editData={editData}
					changeEditObjectType={changeEditObjectType}
					handleSaveFun={handleSaveFun}
				/>
			);
		}
		if (editObjectType === "hospital") {
			const stations = deptList?.filter(depts => depts.deptScope === "F" || depts.deptScope === "G");
			return (
				<EditHospital
					dictArea={dictArea}
					stationList={stations}
					editData={editData}
					editType={editType}
					changeEditObjectType={changeEditObjectType}
					handleSaveFun={handleSaveFun}
				/>
			);
		}
		if (editObjectType === "admin") {
			return <EditAdmin editData={editData} dictArea={dictArea} editType={editType} handleSaveFun={handleSaveFun} />;
		}
	}, [editObjectType, deptList, dictArea, editType, editData]);

	return (
		<div className={styles.authorityDepartment}>
			<DepartComp
				ref={departRef}
				initDept={initDept}
				clickChange={changeDataSetByArea}
				needBtn
				btnText="添加机构/科室"
				btnDeptFun={() => {
					handleDeptAddFun();
				}}
			/>
			<div className={styles.authorityDepartment_content}>
				<div className={styles.authorityDepartment_content_header}>{modalTypeEnum[editType]}</div>
				<div className={styles.authorityDepartment_content_main}>{RenderEditComponent}</div>
			</div>
		</div>
	);
}
export default AuthorityDepartmentPage;
