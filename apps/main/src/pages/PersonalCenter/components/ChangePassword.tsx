import { updateUserApi, userConfirmByLoginApi } from "@/api/modules/user";
import useUserInfo from "@/hooks/useUserInfo";
import { encrypt, pwdencryptMD5 } from "@/utils/util";
import { Button, Form, FormProps, Input, message } from "antd";
import React, { useState, useEffect, memo } from "react";
import styles from './index.module.less'

type FieldType = {
	old_password?: string;
	new_password?: string;
	confirm_new_password?: string;
};
function ChangePasswordComp(props: any) {
  const { userInfo, logoutFun, publicKeyRef } = useUserInfo();
	const [form] = Form.useForm();

	const onFinish: FormProps<FieldType>["onFinish"] = values => {
    // 先调登录接口
    userConfirmByLoginApi({
      username: userInfo.username,
      password: encrypt(values.old_password, publicKeyRef),
    }).then(() => {
      message.success('请重新登录！')
      updateUserApi({
        ...userInfo,
        password: pwdencryptMD5(values.new_password),
      }).then(() => {
        logoutFun()
      })
    })

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
				autoComplete="off"
			>
				<Form.Item<FieldType> label="原始密码" name="old_password" rules={[{ required: true }, () => ({
          validator(_, value) {
            if (value === '') {
              return Promise.reject('密码不能为空!')
            } else {
              return Promise.resolve()
            }
          }
        })]}>
          <Input.Password />
				</Form.Item>

				<Form.Item<FieldType>
          dependencies={['old_password']} label="新密码" name="new_password" rules={[{ required: true }, ({getFieldValue}) => ({
            validator(_, value) {
              if (value === '') {
                return Promise.reject('密码不能为空!')
              } else if (value === getFieldValue('old_password')) {
                return Promise.reject('新密码不能与旧密码相同!')
              } else if (!/^(?![0-9]+$)[\w!@#$%^&*()\-+=.?]{8,16}$/.test(value)) {
                return Promise.reject('密码必须是8-16位的数字、字母、字符组合(不能是纯数字)!')
              } else {
                return Promise.resolve()
              }
            }
          })]}>
					<Input.Password />
				</Form.Item>

				<Form.Item<FieldType>
					label="确认新密码"
					name="confirm_new_password"
          dependencies={['new_password']}
					rules={[{ required: true}, ({getFieldValue}) => ({
            validator(_, value) {
              if (value === '') {
                return Promise.reject('密码不能为空!')
              } else if (value !== getFieldValue('new_password')) {
                return Promise.reject('两次输入密码不一致')
              } else {
                return Promise.resolve()
              }
            }
          })]}
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
