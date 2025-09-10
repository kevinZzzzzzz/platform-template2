import { Button, Form, FormProps, Input } from "antd";
import React, { useState, useEffect, memo } from "react";
import styles from './index.module.less'

type FieldType = {
	old_password?: string;
	new_password?: string;
	confirm_new_password?: string;
};
function ChangePasswordComp(props: any) {
	const [form] = Form.useForm();

	const onFinish: FormProps<FieldType>["onFinish"] = values => {
		console.log("Success:", values);
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = errorInfo => {
		console.log("Failed:", errorInfo);
	};
	return (
		<div className={styles.changePassword}>
			<Form
        form={form}
				name="basic"
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 600 }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<Form.Item<FieldType> label="原始密码" name="old_password" rules={[{ required: true, message: "密码不能为空!" }]}>
          <Input.Password />
				</Form.Item>

				<Form.Item<FieldType> label="新密码" name="new_password" rules={[{ required: true, message: "密码必须是8-16位的数字、字母、字符组合(不能是纯数字)!" }]}>
					<Input.Password />
				</Form.Item>

				<Form.Item<FieldType>
					label="确认新密码"
					name="confirm_new_password"
					rules={[{ required: true, message: "密码不能为空!" }]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item label={null}>
					<Button type="primary" htmlType="submit">
						确认
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
export default memo(ChangePasswordComp);
