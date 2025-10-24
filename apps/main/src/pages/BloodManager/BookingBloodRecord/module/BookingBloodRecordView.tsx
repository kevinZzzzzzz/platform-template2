import { postToRFID, putBookingBloodRecord, putUpdateOrder } from "@/api/modules/bloodManager";
import { rhBloodGroupStyleEnum } from "@/enums";
import useDeptUsers from "@/hooks/useDeptUsers";
import useDict from "@/hooks/useDict";
import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Table, Tag } from "antd";
import dayjs from "dayjs";
import { VIEWNULL } from "hoslink-xxx";
import React, { useState, useEffect, memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.less";



let modal = null
class viewData {
	constructor(record: any) {
		Object.assign(this, record);
	}
}

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 18 }
};
function BookingBloodRecordView(props: any) {
	const { transDepts0ById} = useDeptUsers();
	// @ts-ignore
	const { appData } = useSelector((state: RootState) => state.auth);
	const { transformByMapper, dictArrRef } = useDict();
	const { record = {}, drawerClose } = props;
	const [viewForm] = Form.useForm();
	const initValues: any = new viewData(record);
	const [fullSatisfy, setFullSatisfy] = useState(false);
	const [isSendBleed, setIsSendBleed] = useState(record.orderStatus == "OUTSTORE");
	const [suggestionOptions, setSuggestionOptions] = useState([]);

	const appCustomId = useMemo(() => {
		return appData.app.custom.id || 1;
	}, [appData]);
	const appShowRFIDBtn = useMemo(() => {
		return appData.app.showRFIDBtn.value || false;
	}, [appData]);
	useEffect(() => {
		viewForm.setFieldsValue(record);
		setSuggestionOptions(
			dictArrRef.current?.["suggestion"]?.map(item => ({
				label: item.name,
				value: item.name
			})) || []
		);
	}, []);
	// 改变满足量
	const changeSatisfy = (e: any) => {
		setFullSatisfy(e.target.checked);
    if (e.target.checked) {
      record.bloodOrderDetailList.forEach(d => {
        d.actualAmount = d.requiredAmount;
        d.agreement = 'ABSOLUTE_AGREE';
      });
    } else {
      record.bloodOrderDetailList.forEach(d => {
        d.actualAmount = 0;
        d.agreement = 'NO_AGREE';
      });
    }
	};
  // 修改满足量
  const changeActualAmount = (e: any, idx: any) => {
    const num = parseFloat(e.target.value)
    record.bloodOrderDetailList[idx].actualAmount = num;
    if (!num) {
      record.bloodOrderDetailList[idx].agreement = 'NO_AGREE';
    } else if (num < record.bloodOrderDetailList[idx].requiredAmount && num > 0) {
      record.bloodOrderDetailList[idx].agreement = 'PART_AGREE';
    } else {
      record.bloodOrderDetailList[idx].agreement = 'ABSOLUTE_AGREE';
    }
  }
	const columns = [
		{
			title: "血液品种",
			dataIndex: "bloodSubtypeId",
			key: "bloodSubtypeId",
			render: (text: string) => transformByMapper(text, ["subtype", "name"])
		},
		{
			title: "血液规格",
			dataIndex: "bloodId",
			key: "bloodId",
			render: (text: string) => (text ? transformByMapper(text, ["breed", "name"]) : "按量")
		},
		{
			title: "ABO",
			width: 80,
			dataIndex: "bloodGroup",
			key: "bloodGroup",
			render: (text: string) => transformByMapper(text, ["bloodgroup", "name"])
		},
		{
			title: "Rh(D)",
			width: 80,
			dataIndex: "rhBloodGroup",
			key: "rhBloodGroup",
			render: (text: string) => {
				return <Tag color={rhBloodGroupStyleEnum[text]}>{transformByMapper(text, ["rhbloodgroup", "name"])}</Tag>;
			}
		},
		{
			title: "预订量",
			dataIndex: "requiredAmount",
			key: "requiredAmount"
		},
		{
			title: () => {
				return (
					<>
						<span>满足量</span>( &nbsp;
						<Checkbox disabled={record.orderStatus !== "APPLYING"} checked={fullSatisfy} onChange={e => changeSatisfy(e)}>
							完全满足
						</Checkbox>
						)
					</>
				);
			},
			width: 200,
			dataIndex: "actualAmount",
			key: "actualAmount",
			render: (text, _item, idx) => {
				return record.orderStatus != "APPLYING" ? (
          <Input type="number" value={text} disabled/>
        ) : (
          <Input type="number" onChange={(e) => changeActualAmount(e,  idx)}/>
        );
			}
		},
		{
			title: "单位",
			width: 80,
			dataIndex: "amountType",
			key: "amountType",
			render: (text: string, _item) => {
        return record.amountType == 1 ? '袋' : transformByMapper(record.bloodSubtypeId, ["subtype", "unitNew"])
      }
		},
		{
			title: "是否满足",
			width: 180,
			dataIndex: "agreement",
			key: "agreement",
			render: (text: string) => transformByMapper(text, ["orderAgreement", "name"])
		},
		{
			title: "回复意见",
			dataIndex: "reply",
			width: 240,
			key: "reply",
			render: text => {
				return (
					<Select
						disabled={record.orderStatus !== "APPLYING"}
						value={text}
						placeholder={"请选择回复意见"}
						options={suggestionOptions}
						style={{ width: "100%" }}
					></Select>
				);
			}
		}
	];
  // 提交订单
  const submitOrder = () => {
		Modal.confirm({
			title: "提交确认",
			content: "确认回复该预订单？",
			okText: "确认",
			cancelText: "取消",
			onOk: async () => {
        const bloodOrderDetailListT = record.bloodOrderDetailList
        bloodOrderDetailListT.forEach(d => {
          const bloodId = transformByMapper(d.bloodId, ["breed", "capacity"])
          d.actualAmount = d.amountType ? d.actualAmount * (bloodId !== VIEWNULL ? parseFloat(bloodId) : 1) : parseFloat(d.actualAmount);
          d.actualAmount = d.amountType ? d.requiredAmount * (bloodId !== VIEWNULL ? parseFloat(bloodId) : 1) : parseFloat(d.requiredAmount);
          if (parseFloat(d.actualAmount) === 0) {
            d.agreement = 'NO_AGREE';
          }
        });
        const params = {
          ...record,
          bloodOrderDetailList: bloodOrderDetailListT,
          ...viewForm.getFieldsValue()
        }
        putBookingBloodRecord(params).then((res: any) => {
          drawerClose(true)
        })
			}
		});
  }
  
  // 修改状态
  const putStatus = () => {
    putUpdateOrder({
      orderNo: record.orderNo || '',
      deptId: record.deptId || ''
    }).then((res: any) => {
      drawerClose(true)
    })
  }

  // 提交RFID订单
  const submitRFIDOrder = () => {
    modal = Modal.confirm({
			title: "提交确认",
			content: "确认将该预订单推送至智能冷库？",
			okText: "确认",
			cancelText: "取消",
			onOk: async () => {
        const postData = record.bloodOrderDetailList.map((x: any) => {
          const bloodId = transformByMapper(x.bloodId, ["breed", "capacity"])
          return {
            "BloodnameCN": transformByMapper(x.bloodSubtypeId, ['subtype', 'name']),
            "Bloodcode": x.bloodGroup,
            "BloodType": x.rhBloodGroup === "POSTIVE" ? "阳" : "阴",
            "OrderNum": x.amountType ? x.actualAmount * (bloodId !== VIEWNULL ? parseFloat(bloodId) : 1) : x.actualAmount
          }
        })
        postToRFID({
          "OrderId": record.orderNo,
          'Cid': transDepts0ById(record.deptId, 'deptNo'),
          "Cname": transDepts0ById(record.deptId),
          "Ordertime": record.orderDate,
          "Ordertype": record.orderType === "NORMAL" ? "常规" : "紧急",
          "Status": "完成",
          "Data": postData
        }).then((res: any) => {
          modal.destroy();
          modal = null
        })
			}
		});
  }
	return (
		<div className={styles.bookingBloodRecordView}>
			<Form form={viewForm} {...layout} initialValues={initValues}>
				<Row gutter={16}>
					<Col span={6}>
						<Form.Item shouldUpdate label="订单编号">
							{({ getFieldValue }) => getFieldValue("orderNo")}
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item shouldUpdate label="预订医院">
							{({ getFieldValue }) => getFieldValue("hospitalName")}
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item shouldUpdate label="下单时间">
							{({ getFieldValue }) => getFieldValue("hospitalName")}
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item shouldUpdate label="下单人">
							{({ getFieldValue }) => getFieldValue("applicant")}
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item shouldUpdate label="预订类型">
							{({ getFieldValue }) => {
								const orderType = getFieldValue("orderType");
								return transformByMapper(orderType, ["orderType", "name"]);
							}}
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item shouldUpdate label="状态">
							{({ getFieldValue }) => {
								const orderStatus = getFieldValue("orderStatus");
								return transformByMapper(orderStatus, ["orderStatus", "name"]);
							}}
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item shouldUpdate label="预计用血日期">
							{({ getFieldValue }) => {
								const useDate = getFieldValue("useDate");
								return dayjs(useDate).format("YYYY-MM-DD");
							}}
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item shouldUpdate label="送血方式">
							{({ getFieldValue }) => getFieldValue("deliveryMethod")}
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item shouldUpdate label="备注" labelCol={{ span: 2 }}>
							{({ getFieldValue }) => getFieldValue("description") || "-"}
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<Table
				columns={columns}
				rowKey={record => record.idx}
				dataSource={record.bloodOrderDetailList}
				scroll={{ y: 54 * 5 }}
				pagination={false}
			/>

			<div className={styles.bookingBloodRecordView_footer}>
				{record.auditor ? (
					<p className={styles.bookingBloodRecordView_footer_item}>
						审核人：{record.auditor} {record.auditTime}
					</p>
				) : (
					<></>
				)}
				{record.deliver ? (
					<p className={styles.bookingBloodRecordView_footer_item}>
						发血人：{record.deliver} {record.deliveTime}
					</p>
				) : (
					<></>
				)}
				{["VERIFIED", "OUTSTORE"].includes(record.orderStatus) ? (
					<Checkbox
						className={styles.bookingBloodRecordView_footer_item}
						disabled={record.orderStatus === "OUTSTORE"}
						checked={isSendBleed}
						onChange={e => setIsSendBleed(e.target.checked)}
					>
						已发血
					</Checkbox>
				) : (
					<></>
				)}
				<div className={styles.bookingBloodRecordView_footer_item_btn}>
					{record.orderStatus == "APPLYING" ? <Button type="primary" onClick={() => submitOrder()}>提交</Button> : <></>}
					{record.orderStatus == "VERIFIED" && isSendBleed ? <Button type="primary" onClick={() => putStatus()}>确定</Button> : <></>}
					{appCustomId == 5 && record.orderStatus == "VERIFIED" && appShowRFIDBtn ? (
						<Button type="primary" onClick={() => submitRFIDOrder()}>推送至智能冷库</Button>
					) : (
						<></>
					)}
					<Button type="primary" onClick={() => {
            drawerClose()
          }}>关闭</Button>
				</div>
			</div>
		</div>
	);
}
export default memo(BookingBloodRecordView);
