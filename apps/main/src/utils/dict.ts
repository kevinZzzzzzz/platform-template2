import { RootState } from "@/store";
import { AppData, getCustom } from "hoslink-xxx";
import { useSelector } from "react-redux";

const StatusColors = {
	WAIT: "#f50",
	CONFIRM: "#2db7f5",
	REVIEWED: "#87d068",
	CANCEL: "#878787",
	SCRAP: "#BFBFBF",
	END: "#CD0000",
	MATCHING: "#FFD700",
	MATCHED: "#FFA500",
	PARTSEND: "#00BFFF",
	SEND: "#1E90FF",
	STORAGE: "#7CCD7C"
};
let dictArr: any = {};
let dictMapper: any = {};
const DefaultValue = {
	reviewmethods: "",
	matchmethods: "",
	transpurposes: "",
	signrhbloodgroup: "",
	irregularantis: "",
	matchchecks: "",
	person: "",
	personId: "",
	bloodgroup: "",
	rhbloodgroup: "",
	applytypes: "",
	deptName: "",
	deptId: "",
	ageunit: "",
	ageType: "YEAR",
	sex: "MALE"
};
export const handleSetDict = (dictTemp: any[], dictAll, appData, loginInfo) => {
  // if (!dictTemp || !dictTemp.length) {
  //   return
  // }
  let dict = JSON.parse(JSON.stringify(dictTemp))
  dictArr = []
  dictMapper = {}
	const extra = {
		appraiseEffect: [
			{ id: 1, name: "输注疗效好" },
			{ id: 2, name: "输注疗效较好" },
			{ id: 3, name: "输注无效" }
		],
		appraiseResult: [
			{ id: 1, name: "合理" },
			{ id: 2, name: "不合理" }
		]
	};
	dictAll = [...dictAll, ...Object.keys(extra)];
	dict = [...dict, ...Object.keys(extra).map(item => ({ list: extra[item] }))];

	dict.forEach((d, i) => {
		const filterAvailable = dict[i]["list"].filter((e: any) => e.available !== 0).sort((a, b) => a.uiOrder - b.uiOrder);
		const sortData = dict[i]["list"].sort((a, b) => a.uiOrder - b.uiOrder);
		if (dictAll[i] === "subtype" || dictAll[i] === "breed") {
			dictArr[dictAll[i]] = filterAvailable.map(e => {
				if (appData["unitNew"] && (e.type === 1 || e.typeId === 1)) {
					e.unitNew = "治疗量";
				} else {
					e.unitNew = e.unit;
				}
				return e;
			});
		} else if (dictAll[i] === "orderStatus") {
			dictArr[dictAll[i]] =
      loginInfo.custom === 2
					? filterAvailable.filter(item => item.name !== "已发血")
					: filterAvailable.filter(item => !["已备血", "已确认", "已完成"].includes(item.name));
		} else {
			dictArr[dictAll[i]] = filterAvailable;
		}
		dictArr[dictAll[i] + "ALL"] = [{ name: "全部", id: "" }].concat(dictArr[dictAll[i]]);
		dictArr[dictAll[i] + "A"] = sortData;

		if (dictAll[i] === "bloodgroup" || dictAll[i] === "rhbloodgroup") {
			dictArr[dictAll[i] + "NOT"] = filterAvailable.filter(item => item.id !== "NOT");
		}
		if (dictAll[i] === "rhbloodgroup") {
			dictArr[dictAll[i] + "NOT"] = filterAvailable.filter(item => item.id !== "UNKNOW");
		}
		if (dictAll[i] === "rhTypingResult") {
			dictArr[dictAll[i] + "NOT"] = filterAvailable.filter(item => item.id !== "BEENSEND");
		}
	});
	// 组织字典-----> dictMapper
	for (const key in dictArr) {
		if (key === "applicationstatus") {
			dictArr[key].forEach(d => {
				d.color = StatusColors[d["id"]];
			});
		}
		dictMapper[key] = {};

		for (const k in dictArr[key]) {
			if (key === "reviewmethods" || "matchmethods" || "rhbloodgroup" || "bloodgroup" || "irregularantis") {
				// DefaultValue[key] = dictArr[key][k]['name'];
				// 取字典的默认值 下拉列表第一个
				DefaultValue[key] = dictArr[key][0] ? dictArr[key][0]["name"] : "";
			}
			if (key === "transpurposes") {
				DefaultValue[key] = dictArr[key][0] ? JSON.stringify([dictArr[key][0]["name"]]) : "";
			}
			if (key === "matchresult") {
				// 取字典的默认值 下拉列表第一个
				DefaultValue[key] = dictArr[key][0] ? dictArr[key][0]["id"] : "";
			}

			if (key === "exp") {
				dictMapper[key][dictArr[key][k]["bloodId"] + dictArr[key][k]["rhBloodGroup"]] = dictArr[key + "A"][k];
			} else if (key === "bloodmap") {
				dictMapper[key][dictArr[key][k]["blood"]] = dictArr[key + "A"][k];
			} else {
				dictMapper[key][dictArr[key][k]["id"]] = dictArr[key][k];
			}
		}
	}
	// console.log("this.dictArr-->", dictArr);
	// console.log("this.dictMapper-->", dictMapper);
	// console.log("this.DefaultValue-->", DefaultValue);
  dict = null
	return {
		dictArrT: dictArr,
		dictMapperT: dictMapper,
		DefaultValue
	};
};
