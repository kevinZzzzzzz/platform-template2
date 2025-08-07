import React, { useEffect, useState, useRef } from "react";
import { base_uri } from "@/api/config/servicePort";
import { exePrintMachine } from "@/config/config";
import { RootState } from "@/store";
import { getV } from "@/utils/util";
import { useSelector } from "react-redux";
import useDeptUsers from "./useDeptUsers";
import useDict from "./useDict";
import * as moment from 'moment';
import { dateFormatPost } from "hoslink-xxx";

interface PrintData {
	printTitle?: string;
	printTitleUrl?: string;
	template: string;
	printMachine: string;
	data: any;
	isMatch: Boolean;
}
/**
 * @description: 打印
 * @return {
 *  print
 * } 
 */
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
  let timer = null;
  const printModule = appData['printModule'];
  const printUri = import.meta.env.VITE_PRINT_URL || window.location.origin;

	const print = async (printData: PrintData) => {
		const hospitalItem = depts0.filter(d => d.deptId === parentId);
		const hospital = hospitalItem.length ? hospitalItem[0]["name"] : "";

    let fileNames = []
    const transferData = await transfer(printData);

    const dataT = {
      ...printData,
      data: JSON.stringify({
        ...printData.template.includes('blood-transfusion') ? transferData : JSON.parse(printData.data),
        dict: {
          preTest: dictMapper['preTest'],
          fileNames
        },
        ...{ hospital: hospital },
        printMachine: printData.printMachine,
        printTitle: printData.printTitle || null,
        printTitleUrl: printData.printTitleUrl || null,
        printDate: moment().format(dateFormatPost),
        isMatch: printData.isMatch || null,
        // 病案号转换
        patientNumber: appData.transformText['patientNumber'],
        custom: appData.custom['id'],
        // imageUrl: GETSERVICE()
      }),
      printMachine: exePrintMachine[printData.printMachine]
    }
    toPrint(dataT, printData);
	};
  // * 转换字段
  const transfer = async (printData: PrintData) => {
    let data: any = JSON.parse(printData.data);
    const medicalRecord = data.medicalRecord && {
      ...data.medicalRecord,
      sex: getV(
        dictMapper,
        'sex',
        data.medicalRecord.sex,
        'name',
      ),
      aboBloodGroup: getV(
        dictMapper,
        'bloodgroup',
        data.medicalRecord.aboBloodGroup,
        'name',
      ),
      rhBloodGroup: getV(
        dictMapper,
        'rhbloodgroup',
        data.medicalRecord.rhBloodGroup,
        'name',
      ),
      ascription: data.medicalRecord.ascription ? '外地' : '本地',
    } || {};
    const preTest = data.preTest && {
      ...data.preTest,
      hbsag: getV(
        dictMapper,
        'signrhbloodgroup',
        data.preTest.hbsag,
        'name',
      ),
      antiHbs: getV(
        dictMapper,
        'signrhbloodgroup',
        data.preTest.antiHbs,
        'name',
      ),
      hbeag: getV(
        dictMapper,
        'signrhbloodgroup',
        data.preTest.hbeag,
        'name',
      ),
      antiHbe: getV(
        dictMapper,
        'signrhbloodgroup',
        data.preTest.antiHbe,
        'name',
      ),
      antiHbc: getV(
        dictMapper,
        'signrhbloodgroup',
        data.preTest.antiHbc,
        'name',
      ),
      antiHcv: getV(
        dictMapper,
        'signrhbloodgroup',
        data.preTest.antiHcv,
        'name',
      ),
      antiHiv: getV(
        dictMapper,
        'signrhbloodgroup',
        data.preTest.antiHiv,
        'name',
      ),
      syphilis: getV(
        dictMapper,
        'signrhbloodgroup',
        data.preTest.syphilis,
        'name',
      ),
      rpr: getV(
        dictMapper,
        'signrhbloodgroup',
        data.preTest.rpr,
        'name',
      ),
    } || {};

    const bagNames = ['bloodDetails', 'selfBloodBagList', 'bagDetails'];
    const bag = bagNames.map(item => ({ data: data[item], name: item })).find(item => item.data) || { data: [], name: 'bloodDetails' };

    const bagDetails = bag.data.map((d: any) => ({
      ...d,
      subtype: getV(
        dictMapper,
        'subtype',
        d.subtypeId,
        'name',
      ),
      rhBloodGroup: getV(
        dictMapper,
        'rhbloodgroup',
        d.rhBloodGroup,
        'name',
      ),
      subType: getV(
        dictMapper,
        'subtype',
        d.subtypeId,
        'name',
      ),
      capacity: getV(dictMapper, 'breed', d.bloodId, 'capacity'),
      bloodId: getV(
        dictMapper,
        'breed',
        d.bloodId,
        'name',
      ),
      finalResult: getV(dictMapper, 'matchresult', d.finalResult, 'name'),
      unit: getV(dictMapper, 'subtype', d.subtypeId, 'unitNew') || getV(dictMapper, 'breed', d.bloodId, 'unitNew')
    })) || [];
    const recheck = data.recheck && {
      ...data.recheck,
      recheckAmount: data.recheck && data.recheck.recheckAmount || null,
      dailyAmount: data.recheck && data.recheck.dailyAmount || null,
      superDoctorDate: getV(data.recheck, 'records', '0', 'recheckDate'),
      directorDoctorDate: getV(data.recheck, 'records', '1', 'recheckDate'),
      serviceDoctorDate: getV(data.recheck, 'records', '2', 'recheckDate'),
    } || {};

    const bloodGroupReview = data.bloodGroupReview && {
      ...data.bloodGroupReview,
      aboReviewResult: getV(
        dictMapper,
        'bloodgroup',
        data.bloodGroupReview.aboReviewResult,
        'name',
      ),
      rhReviewResult: getV(
        dictMapper,
        'rhbloodgroup',
        data.bloodGroupReview.rhReviewResult,
        'name',
      ),
      antiTestResult: getV(
        dictMapper,
        'irregularantis',
        data.bloodGroupReview.antiTestResult,
        'name',
      ),
    } || {};

    if (printData.template.includes('blood-transfusion')) {
      bag.name = 'bagDetails';
    }
    data = {
      ...data,
      medicalRecord,
      preTest,
      [bag.name]: bagDetails,
      bloodGroupReview,
      recheck,
      // 兼容旧版本打印
      ...medicalRecord,
      ...preTest,
      ...bloodGroupReview,
      ...recheck,
      records: [
        { rechecker: data.superDoctor,
          recheckDate: getV(data.recheck, 'records', '0', 'recheckDate') == '--' ? null : getV(data.recheck, 'records', '0', 'recheckDate')
        },
        { rechecker: data.directorDoctor,
          recheckDate: getV(data.recheck, 'records', '1', 'recheckDate') == '--' ? null : getV(data.recheck, 'records', '1', 'recheckDate')
        },
        { rechecker: data.serviceDoctor,
          recheckDate: getV(data.recheck, 'records', '2', 'recheckDate') == '--' ? null : getV(data.recheck, 'records', '2', 'recheckDate')
        },
      ],
      transPurpose: data.transPurpose === '[]' && ' ' || data.transPurpose && data.transPurpose[0] === '[' && JSON.parse(data.transPurpose).join(';') || data.transPurpose,
    };
    return new Promise((resolve) => {
      resolve(data)
    });
  }
  // * 执行打印
  const toPrint = (dataT: any, printData: any) => {
    const isInner = printModule !== 'out';

    // 打印之前清空iframe
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      const iframes = document.querySelectorAll('iframe');
      for (let i = 0; i < iframes.length; i++) {
        document.body.removeChild(iframes[i]);
      }
    }, 1000 * 60 * 5);

    const strFrameName = 'print-' + (new Date()).getTime();
    let url = '';
    if (import.meta.env.PROD) {
      localStorage.setItem(printData.template, dataT.data);
      url = `${printUri}/${base_uri}/views/print/${printData.template}.html`;
    } else {
      url = `${printUri}/${base_uri}/views/print/${printData.template
        }.html?data=${encodeURI(dataT.data)}`;
    }
    if (isInner) {
      const iframe: any = document.createElement('iframe');
      iframe.src = url;
      iframe.style = 'width:0;height:0';
      iframe.id = strFrameName;
      document.body.appendChild(iframe);
    } else if (printModule === 'out') {
      window.open(url);
    }
  }
	return {
		print
	};
}

export default usePrint;
