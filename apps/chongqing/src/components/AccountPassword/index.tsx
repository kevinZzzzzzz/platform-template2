import React, { useState, useEffect } from "react";
import styles from "./index.module.less";
import { getAppInfo } from "@/api/modules/login";
import { Tabs, Form, Input, Checkbox, Button, Flex, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

function AccountPassword(props: any) {
	const onFinish = (values: any) => {
		console.log("Received values of form: ", values);
	};
	return (
		<div className={styles.accountPassword}>
			<h1 className={styles.accountPassword_title}>{props.appInfo?.app?.name}</h1>
			<Tabs
				defaultActiveKey="1"
				centered
				size="large"
				items={[
					{
						key: "1",
						label: "账户密码登录"
					}
				]}
			/>
			<Form name="login" initialValues={{ remember: true }} onFinish={onFinish}>
				<Form.Item name="username" rules={[{ required: true, message: "请输入用户名!" }]}>
					<Input size="large" prefix={<UserOutlined />} placeholder="用户名" />
				</Form.Item>
				<Form.Item name="password" rules={[{ required: true, message: "请输入密码!" }]}>
					<Input size="large" prefix={<LockOutlined />} type="password" placeholder="密码" />
				</Form.Item>
				<Form.Item>
					<Flex justify="space-between" align="center">
						<Form.Item name="remember" valuePropName="checked" noStyle>
							<Checkbox>记住密码</Checkbox>
						</Form.Item>
					</Flex>
				</Form.Item>

				<Form.Item>
					<Button block type="primary" htmlType="submit" size="large">
						登录
					</Button>
				</Form.Item>
			</Form>

			<div className={styles.accountPassword_copyright}>
				<span>
					Copyright © {new Date().getFullYear()}
					<Button type="link">{props.appInfo?.app?.company?.name}</Button>
					出品<Divider type="vertical" />
					{props.appInfo?.app?.version}
				</span>
			</div>
		</div>
	);
}
export default AccountPassword;
