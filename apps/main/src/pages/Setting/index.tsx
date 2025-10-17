import useDict from "@/hooks/useDict";
import { RootState } from "@/store";
import { Button, Checkbox, Col, Divider, Flex, Form, Input, Modal, Radio, Row, Select } from "antd";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAppData } from "@repo/store/lib/auth";
import styles from "./index.module.less";
import { getFrontConfig, updateFrontConfig } from "@/api/modules/login";
import useDeptUsers from "@/hooks/useDeptUsers";
const { confirm } = Modal;
const { TextArea } = Input;
const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 10 }
};
function StationSettingPage(props: any) {
	// @ts-ignore
	const { appData, loginInfo } = useSelector((state: RootState) => state.auth);
  const [deptStaList, setDeptStaList] = useState([]);
  const [currentDept, setCurrentDept] = useState(loginInfo.dept.parentId);
	const { dictArrRef } = useDict();
  const {depts0} = useDeptUsers()
	const dispatch = useDispatch();
	const customTemplates = useMemo(() => {
		return appData.app?.custom?.templates?.map(d => {
			return {
				value: d.id,
				label: d.name
			};
		});
	}, []);
	// 是否为监督者权限
	const platformIsSenior = useMemo(() => {
		return loginInfo.scope === "SUPERVISE";
	}, [loginInfo]);
	const searchLimitDayTemplates = useMemo(() => {
		return appData.app?.searchLimitDay?.template?.map(d => {
			return {
				value: d.id,
				label: d.name
			};
		});
	}, []);
	const subtypeList = useMemo(() => {
		return (
			dictArrRef.current?.subtype
				?.filter(d => d.available && !d.developCompany)
				?.map(d => {
					return {
						value: d.id,
						label: d.name
					};
				}) || []
		);
	}, [dictArrRef.current]);
	const customAppData = useMemo(() => {
		return appData.app || {};
	}, [appData]);
	const printersMap = useMemo(() => {
		return appData.printers || {};
	}, [appData]);

	const [settingForm] = Form.useForm();
	const customId = Form.useWatch(["app", "custom", "id"], settingForm);
	const showRFIDBtnValue = Form.useWatch(["app", "showRFIDBtn", "value"], settingForm);
	const [priorityBloodUserApplication, setPriorityBloodUserApplication] = useState([]);

  useEffect(() => {
    if (depts0) {
      setDeptStaList(depts0?.filter(d => d.deptScope === 'F' || d.deptScope === 'G')?.map(d => ({
        value: d.deptId,
        label: d.name
      })))
    }
  }, [depts0])
	useEffect(() => {
		settingForm.setFieldsValue({
			app: customAppData,
			printers: printersMap
		});
		setPriorityBloodUserApplication(customAppData.priorityBloodUserApplicationFormRequire.bloodUserForm || []);
	}, []);

	const printView = () => {
		const template = settingForm.getFieldValue(["printers", "BOOKINGBLOODRECORD", "template"]);
		console.log("template", template);
	};
	const handleChange = (key: string, checked: boolean) => {
		const priorityBloodUserApplicationT = priorityBloodUserApplication.map(item => {
			if (item.key === key) {
				return {
					...item,
					default: checked
				};
			}
			return item;
		});
		settingForm.setFieldValue(["app", "priorityBloodUserApplicationFormRequire", "bloodUserForm"], priorityBloodUserApplicationT);
		setPriorityBloodUserApplication(priorityBloodUserApplicationT);
	};

	const submit = () => {
		const configApp = settingForm.getFieldValue(["app"]);
		const configPrinters = settingForm.getFieldValue(["printers"]);
		const config = {
			...appData,
			app: {
				...appData.app,
				...configApp
			},
			printers: {
				...appData.printers,
				...configPrinters
			}
		};
		confirm({
			title: "提示",
			content: "确定调整本医院的配置?",
			okText: "确定",
			cancelText: "取消",
			onOk() {
				updateFrontConfig({
					stationId: loginInfo.dept.parentId,
					config: JSON.stringify(config)
				});
				dispatch(setAppData(config));
			}
		});
	};
	const initSetting = () => {
		confirm({
			title: "提示",
			content: "确定初始化本医院的配置?",
			okText: "确定",
			cancelText: "取消",
			onOk() {
				settingForm.setFieldsValue({
					app: customAppData,
					printers: printersMap
				});
			}
		});
	};
  const changeConfig = async () => {
    const {list} = await getFrontConfig({
      stationId: currentDept
    })
    const config = JSON.parse(list.config)
		confirm({
			title: "提示",
			content: "是否覆盖当前配置?",
			okText: "确定",
			cancelText: "取消",
			onOk() {
        settingForm.setFieldsValue({
          app: config.app,
          printers: config.printers
        });
			}
		});
    console.log(JSON.parse(list.config), 'currentDept---------')
  }
	return (
		<div className={styles.settingStation}>
			<section className={styles.settingStation_header}>
				<p>系统设置-v{appData?.version}</p>
				<small> 调整当前血站的相关配置</small>
			</section>
			<section className={styles.settingStation_content}>
				{platformIsSenior ? (
					<Form {...layout} style={{ width: "100%", margin: "10px auto" }}>
						<Form.Item label="血站">
							<Row gutter={8}>
								<Col span={12}>
									<Form.Item style={{ marginBottom: 0 }}>
										<Select allowClear value={currentDept} onChange={(v) => setCurrentDept(v)} options={deptStaList} style={{ width: "100%" }} />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Button type="primary" onClick={() => changeConfig()}>查询</Button>
								</Col>
							</Row>
						</Form.Item>
					</Form>
				) : null}
				<Divider plain orientation="left" style={{ fontSize: "16px", color: "#49A9EE" }}>
					通用设置
				</Divider>
				<Form form={settingForm} {...layout} style={{ width: "100%", margin: "0 auto" }}>
					<Form.Item name={["app", "custom", "id"]} label="定制设置" tooltip="开启定制的特殊功能">
						<Select options={customTemplates} style={{ width: "50%" }} />
					</Form.Item>
					<Form.Item
						name={["app", "searchLimitDay", "id"]}
						label="默认查询（）天内的血液预订单"
						tooltip="默认查询（）天内的血液预订单"
					>
						<Select options={searchLimitDayTemplates} style={{ width: "50%" }} />
					</Form.Item>
					<Form.Item name={["app", "printModule"]} label="打印模式 " tooltip="打印模式 ">
						<Radio.Group>
							<Radio value={"123"}>当前窗口打印</Radio>
							<Radio value={"out"}>新窗口打印</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item name={["app", "webSocketConnectionSet"]} label="websocket重连设置 " tooltip="默认为是">
						<Radio.Group>
							<Radio value={true}>是</Radio>
							<Radio value={false}>否</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item name={["app", "broadcast"]} label="消息提示 " tooltip="配置消息提示时播放的声音">
						<Radio.Group>
							<Radio value={0}>语音播报</Radio>
							<Radio value={1}>铃声播报</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item
						name={["app", "unit"]}
						label="库存汇总血量单位折算显示为“单位” "
						tooltip="库存汇总血量单位折算显示为“单位”，折算规则，全血类：200ml = 1U, 血浆类100ml = 1U"
					>
						<Radio.Group>
							<Radio value={true}>是</Radio>
							<Radio value={false}>否</Radio>
						</Radio.Group>
					</Form.Item>
					{customId === 5 ? (
						<>
							<Form.Item
								name={["app", "showRFIDBtn", "value"]}
								label="是否显示“推送至智能冷库”按钮 "
								tooltip="配置在血液预订详情单中，显示“推送至智能冷库”按钮"
							>
								<Radio.Group>
									<Radio value={true}>是</Radio>
									<Radio value={false}>否</Radio>
								</Radio.Group>
							</Form.Item>
							{showRFIDBtnValue ? (
								<Form.Item name={["app", "showRFIDBtn", "postUrl"]} label="推送地址 " tooltip="配置推送至智能冷库的地址">
									<Input placeholder="推送至智能冷库的地址，例如：http://127.0.0.1:8000/api" />
								</Form.Item>
							) : null}
						</>
					) : null}
					<Form.Item name={["app", "hideName"]} label="是否隐藏处理患者姓名 " tooltip="是否隐藏处理患者姓名">
						<Radio.Group>
							<Radio value={true}>是</Radio>
							<Radio value={false}>否</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item label="血液预订单 " tooltip="血液预订单" style={{ marginBottom: 0 }}>
						<Row gutter={8}>
							<Col span={12}>
								<Form.Item name={["printers", "BOOKINGBLOODRECORD", "id"]}>
									<Select
										options={printersMap["BOOKINGBLOODRECORD"]?.templates.map(d => ({
											...d,
											value: d.id,
											label: d.text
										}))}
										onChange={(
											_,
											option: {
												template: string;
											}
										) => {
											settingForm.setFieldValue(["printers", "BOOKINGBLOODRECORD", "template"], option.template);
										}}
										style={{ width: "100%" }}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Button onClick={() => printView()}>打印预览</Button>
							</Col>
						</Row>
					</Form.Item>
					<Form.Item name={["app", "region", "id"]} label="区域配置" tooltip="区域配置">
						<Select
							options={customAppData["region"]?.templates.map(d => ({
								...d,
								value: d.id,
								label: d.name
							}))}
							style={{ width: "50%" }}
						/>
					</Form.Item>
				</Form>
				<Divider plain orientation="left" style={{ fontSize: "16px", color: "#49A9EE" }}>
					优先用血
				</Divider>
				<Form form={settingForm} {...layout} style={{ width: "100%", margin: "0 auto" }}>
					<Form.Item name={["app", "priorityUseBlood"]} label="优先用血血液品种" tooltip="优先用血血液品种">
						<Select mode="multiple" defaultValue={[]} allowClear options={subtypeList} style={{ width: "50%" }} />
					</Form.Item>
					<Form.Item name={["app", "instructionsForInformationEntry"]} label="信息录入说明">
						<TextArea rows={4} placeholder="信息录入说明" style={{ width: "50%" }} />
					</Form.Item>
					<Form.Item label="用血者信息必填项">
						<Row>
							{priorityBloodUserApplication?.map(item => (
								<Col span={6} key={item.key}>
									<Checkbox
										onChange={e => handleChange(item.key, e.target.checked)}
										checked={item.default}
										disabled={item.disable}
									>
										{item.label}
									</Checkbox>
								</Col>
							))}
						</Row>
					</Form.Item>
					<Form.Item label={null}>
						<Flex gap="small" wrap>
							<Button type="primary" onClick={() => submit()}>
								保存并提交
							</Button>
							<Button onClick={() => initSetting()}>初始化设置</Button>
						</Flex>
					</Form.Item>
				</Form>
			</section>
		</div>
	);
}
export default StationSettingPage;
