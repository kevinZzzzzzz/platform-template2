import { exePrintMachine } from "@/config/config";
import { RootState } from "@/store";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import useDeptUsers from "./useDeptUsers";
import useDict from "./useDict";

interface PrintData {
	printTitle?: string;
	printTitleUrl?: string;
	template: string;
	printMachine: string;
	data: any;
	isMatch: Boolean;
}
function usePrint() {
	// @ts-ignore
	const { appData, loginInfo } = useSelector((state: RootState) => state.auth);
	const {
		usersAll,
		users,
		usersA,
		usersB,
		usersYW,
		depts,
		deptsALL,
		depts0,
		depts0ALL,
		deptsHos,
		deptScopesAll,
		roleScopesAll,
		noBloodDepts
	} = useDeptUsers();
	const { dictArr, dictMapper } = useDict();

	const parentId = loginInfo.dept.parentId;
	const printers = appData["printers"];
	const timer = null;
  
	const print = async (printData: PrintData) => {
		const hospitalItem = depts0.filter(d => d.deptId === parentId);
		const hospital = hospitalItem.length ? hospitalItem[0]["name"] : "";

    let fileNames = []
    const transferData = await transfer(printData);

    const Data = {
      ...printData,
      data: JSON.stringify({
        // ...printData.template.includes('blood-transfusion') ? transferData : JSON.parse(printData.data),
        dict: {
          preTest: dictMapper['preTest'],
          fileNames
        },
        ...{ hospital: hospital },
        printMachine: printData.printMachine,
        printTitle: printData.printTitle || null,
        printTitleUrl: printData.printTitleUrl || null,
        // printDate: moment().format(dateFormatPost),
        isMatch: printData.isMatch || null,
        // 病案号转换
        // patientNumber: transformText()['patientNumber'],
        // custom: getCustom(),
        // imageUrl: GETSERVICE()
      }),
      printMachine: exePrintMachine[printData.printMachine]
    }
	};
  const transfer = async (printData: PrintData) => {}
  const toPrint = (Data: any, printData: any) => {
    const printModule = appData['printModule'];
    const isInner = printModule !== 'out';

  }
	return {
		print
	};
}

export default usePrint;
