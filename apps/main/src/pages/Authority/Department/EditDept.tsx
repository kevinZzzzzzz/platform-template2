import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, Switch } from "antd";
import React, { useState, useEffect, memo } from "react";

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
	style: {
		width: "80%"
	}
};
const deptScopes = [
	{ value: "E", label: "医院" },
	{ value: "F", label: "血站" },
	// { value: 'G', label: '监管平台' },
	{ value: 0, label: "科室" }
];
const scopes = [
	{ value: "A", label: "医院输血科业务部门" },
	{ value: "B", label: "医院医务科业务部门" },
	{ value: "C", label: "其他业务部门" }
];
function EditDept(props: any) {
	const { editType, staHosList, changeEditObjectType, editData, handleSaveFun } = props;
	const [editDeptForm] = Form.useForm();

	useEffect(() => {
		if (editType === "add") {
			editDeptForm.setFieldsValue({
				name: "",
				deptScope: 0,
				parentId: editData.parentId || null,
				scope: null,
				delFlag: false,
				orderNum: null
			});
		} else {
			editDeptForm.setFieldsValue({
				...editData,
				deptScope: 0,
				scope: editData.deptScope || null,
				delFlag: !!editData.delFlag
			});
		}
	}, [editType, editData]);

	const submitFun = async () => {
		const valid = await editDeptForm.validateFields();
		if (!valid) {
			return;
		}
		const values = editDeptForm.getFieldsValue();
		handleSaveFun(values, () => {
      editDeptForm.resetFields();
    });
	};

	return (
		<Form form={editDeptForm} {...layout} onFinish={submitFun}>
			<Form.Item name="name" label="机构名称" rules={[{ required: true, message: "请输入机构名称" }]}>
				<Input placeholder="输血科室名称，如: 输血科" allowClear />
			</Form.Item>
			<Form.Item name="deptScope" label="机构类型" rules={[{ required: true, message: "请选择机构类型" }]}>
				<Select options={deptScopes} allowClear placeholder="请选择机构类型" onChange={v => changeEditObjectType(v)} />
			</Form.Item>
			<Form.Item name="parentId" label="所属机构" rules={[{ required: true, message: "请选择所属机构" }]}>
				<Select options={staHosList} allowClear placeholder="请选择所属机构" />
			</Form.Item>
			<Form.Item name="scope" label="科室类型" rules={[{ required: true, message: "请选择科室类型" }]}>
				<Select options={scopes} allowClear placeholder="请选择科室类型" />
			</Form.Item>
			<Form.Item name="delFlag" label="是否启用">
				<Switch defaultChecked />
			</Form.Item>
			<Form.Item name="orderNum" label="排序" rules={[{ required: true, message: "请输入排序" }]}>
				<InputNumber />
			</Form.Item>
			<Form.Item label={null}>
				<Button type="primary" htmlType="submit">
					保存
				</Button>
			</Form.Item>
		</Form>
	);
}
export default memo(EditDept);
