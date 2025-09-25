import { addAreaApi, getAreaApi, updateAreaApi } from "@/api/modules/user";
import { provinceAreaList } from "@/config/config";
import { modalTypeEnum } from "@/enums";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Select, Table } from "antd";
import React, { useState, useEffect, useMemo } from "react";
import styles from "./index.module.less";

// 区域类型
type AreaType = {
	province: string;
	areaName: string;
	delFlagArea: number;
};

const statusList = [
	{ label: "启用", value: 0 },
	{ label: "禁用", value: 1 }
];
const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
};
function AuthorityAreaPage(props: any) {
	const [tableLoading, setTableLoading] = useState(false);
	const [dataSet, setDataSet] = useState([]);
	const [areaModalType, setAreaModalType] = useState("add");
	const [editAreaModal, setEditAreaModal] = useState(null);
	const [areaForm] = Form.useForm();
	const [provinceOptions, setProvinceOptions] = useState([]);
	const [editData, setEditData] = useState({});
	const areaFormProvince = Form.useWatch("province", areaForm);

	const dataColumns = [
		{
			title: "序号",
			width: 100,
			dataIndex: "index",
			render: (text, record, index) => index + 1
		},
		{
			title: "所属省份",
			dataIndex: "province",
			render: (text, record, index) => {
				return record.province || "-";
			}
		},
		{
			title: "所属地域",
			dataIndex: "areaName",
			render: (text, record, index) => {
				return record.areaName || "-";
			}
		},
		{
			title: "状态",
			dataIndex: "delFlagArea",
			render: (text, record, index) => {
				return text ? "禁用" : "启用";
			}
		},
		{
			title: "操作",
			width: 100,
			dataIndex: "",
			key: "edit",
			render: (text, record, index) => <a onClick={() => handleEdit(record)}>编辑</a>
		}
	];
  // 所属地域列表
	const areaOptions = useMemo(() => {
		return (
			provinceAreaList
				.find(item => item.name === areaFormProvince)
				?.citys?.map(item => ({ label: item.name, value: item.name })) || []
		);
	}, [areaFormProvince]);

  // 所属地域列表
	const getAreaList = async () => {
		setTableLoading(true);
		const { data } = await getAreaApi({ areaId: "" });
		setTableLoading(false);
		data &&
			setDataSet(
				data.map((d, idx) => ({
					...d,
					idx
				}))
			);
	};
  // 区域表单提交
	const handleAreaFormSubmit = async () => {
		const valid = await areaForm.validateFields();
    if (!valid) {
      return;
    }
    const values = areaForm.getFieldsValue();
    if (areaModalType === "add") {
      // 新增
      await addAreaApi(values);
    } else {
      // 修改
      await updateAreaApi({...editData, ...values});
    }
		setEditAreaModal(false);
    // 刷新列表
    getAreaList();
	};
  // 编辑区域
	const handleEdit = (record) => {
		setAreaModalType("edit");
		setEditAreaModal(true);
    setEditData(record);
		// 填充表单
		areaForm.setFieldsValue({
			province: record.province,
			areaName: record.areaName,
			delFlagArea: record.delFlagArea
		});
	};
	useEffect(() => {
		// 省份列表
		setProvinceOptions(provinceAreaList.map(item => ({ label: item.name, value: item.name })));
		getAreaList();
	}, []);
	return (
		<div className={styles.AuthorityArea}>
			<div className={styles.AuthorityArea_top}>
				<Button
					size="middle"
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => {
						setAreaModalType("add");
						setEditAreaModal(true);
						// 清空表单
						areaForm.setFieldsValue({
							province: null,
							areaName: null,
							delFlagArea: null
						});
					}}
				>
					添加
				</Button>
			</div>
			<Table
				loading={tableLoading}
				bordered
				rowKey={record => record.idx}
				dataSource={dataSet}
				columns={dataColumns}
				rowClassName="editable-row"
				pagination={{ align: "center", pageSize: 10, total: dataSet.length, showTotal: (total, range) => `共 ${total} 条` }}
			/>

			<Modal
				title={modalTypeEnum[areaModalType]}
				open={editAreaModal}
				cancelText="取消"
				okText="保存"
				destroyOnHidden={true}
				onOk={() => {
					handleAreaFormSubmit();
				}}
				onCancel={() => setEditAreaModal(false)}
				afterClose={() => {
					areaForm.setFieldsValue({
						province: null,
						areaName: null,
						delFlagArea: null
					});
				}}
			>
				<Form<AreaType> form={areaForm} {...layout} style={{ width: "80%", margin: "0 auto" }}>
					<Form.Item label="所属省份" name="province" rules={[{ required: true, message: "请选择省份" }]}>
						<Select options={provinceOptions} placeholder="请选择省份" />
					</Form.Item>
					<Form.Item label="所属地域" name="areaName" rules={[{ required: true, message: "请输入所属地域" }]}>
						<Select options={areaOptions} placeholder="请输入所属地域" />
					</Form.Item>
					<Form.Item label="状态" name="delFlagArea" rules={[{ required: true, message: "请选择状态" }]}>
						<Select options={statusList} placeholder="请选择状态" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
export default AuthorityAreaPage;
