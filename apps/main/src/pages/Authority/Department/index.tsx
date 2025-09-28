import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import styles from "./index.module.less";
import DepartComp from "@/components/Depart";
import { modalTypeEnum } from "@/enums";
import EditDept from "./EditDept";
import EditStation from "./EditStation";
import { getAreaApi } from "@/api/modules/user";
import EditHospital from "./EditHospital";
import EditAdmin from "./EditAdmin";

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
    setEditType('add');
    if (editData?.areaName) {
      setEditObjectType("hospital");
    } else {
      setEditObjectType("dept");
    }
  }, [])
	const RenderEditComponent = useMemo(() => {
    const stations = deptList?.filter(depts => depts.deptScope === "F" || depts.deptScope === "G");
    const hospitals = deptList?.filter(depts => depts.deptScope === "E");
		if (editObjectType === "dept") {
			const staHosList = [...stations, ...hospitals];
			return (
				<EditDept staHosList={staHosList} editType={editType} editData={editData} changeEditObjectType={changeEditObjectType} />
			);
		}
		if (editObjectType === "station") {
			return (
				<EditStation dictArea={dictArea} editType={editType} editData={editData} changeEditObjectType={changeEditObjectType} />
			);
		}
		if (editObjectType === "hospital") {
			const stations = deptList?.filter(depts => depts.deptScope === "F" || depts.deptScope === "G");
      console.log(stations, 'stations0000000000');
			return (
				<EditHospital
					dictArea={dictArea}
					stationList={stations}
					editData={editData}
					editType={editType}
					changeEditObjectType={changeEditObjectType}
				/>
			);
		}
		if (editObjectType === "admin") {
			return <EditAdmin editData={editData} dictArea={dictArea} editType={editType} />;
		}
	}, [editObjectType, deptList, dictArea, editType, editData]);

	return (
		<div className={styles.authorityDepartment}>
			<DepartComp ref={departRef} initDept={initDept} clickChange={changeDataSetByArea} needBtn btnText="添加机构/科室" btnDeptFun={() => {
        handleDeptAddFun()
      }} />
			<div className={styles.authorityDepartment_content}>
				<div className={styles.authorityDepartment_content_header}>{modalTypeEnum[editType]}</div>
				<div className={styles.authorityDepartment_content_main}>{RenderEditComponent}</div>
			</div>
		</div>
	);
}
export default AuthorityDepartmentPage;
