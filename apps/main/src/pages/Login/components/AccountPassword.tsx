import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.less";
import { getAppInfo } from "@/api/modules/login";
import { Tabs, Form, Input, Checkbox, Button, Flex, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import http from "@/api";
import { encrypt } from "@/utils/util";
import { useNavigate } from "react-router-dom";
import { HOME_URL } from "@/config/config";

function AccountPassword(props: any) {
  const navigate = useNavigate()
	const [loginForm] = Form.useForm();
  const secreted = useRef(false) // 是否已加密
	const initiaLoginVal = {
		username: "",
		password: "",
		remember: false
	};

  /* 
    记住密码操作
  */
  const rememberPwdFun = (event: any) => {
    const {checked} = event.target
    localStorage.setItem('rememberPwd', checked)
  }
  useEffect(() => {
    const rememberPwd = JSON.parse(localStorage.getItem('rememberPwd'))
    const userPwdMap = localStorage.getItem('userPwdMap') ? JSON.parse(localStorage.getItem('userPwdMap')) : null
    // const username = loginForm.getFieldValue('username')
    if (rememberPwd) {
      loginForm.setFieldValue('remember', rememberPwd)
      if (userPwdMap?.user) {
        loginForm.setFieldValue('username', userPwdMap['user'])
        loginForm.setFieldValue('password', userPwdMap['pwd'])
        secreted.current = true // 已加密
      } else {
        secreted.current = false
      }
    } else {
      secreted.current = false
      loginForm.setFieldValue('remember', false)
      loginForm.setFieldValue('password', '')
      if (userPwdMap?.user) {
        loginForm.setFieldValue('username', userPwdMap['user'])
        localStorage.setItem('userPwdMap', null)
      }
    }
  }, [])
	const onFinish = async (values: any) => {
    const { username, password } = values
    /*
      判断密码是否加过密
    */
    const checkPwdIsEncrypt = (pwd = '') => {
      return pwd.length > 50
    }
    const secretPwd = !checkPwdIsEncrypt(password) ? await encrypt(password, props.publicKey) : password
    loginForm.setFieldValue('password', secretPwd)
    const succLogin = () => {
      const userPwdMap = {
        user: loginForm.getFieldValue('username'),
        pwd: ''
      }
      if (loginForm.getFieldValue('remember')) {
        userPwdMap.pwd = secretPwd
      }
      localStorage.setItem('userPwdMap', JSON.stringify(userPwdMap))
      setTimeout(() => {
        navigate(HOME_URL)
      }, 500);
    }
    const failLogin = () => {
      loginForm.setFieldValue('password', '')
    }
    
    props.loginFun({
      username,
      password: secretPwd
    }, succLogin, failLogin)
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
			<Form name="login" form={loginForm} initialValues={initiaLoginVal} style={{ maxWidth: 360 }} onFinish={onFinish}>
				<Form.Item name="username" rules={[{ required: true, message: "请输入用户名!" }]}>
					<Input size="large" prefix={<UserOutlined />} placeholder="请输入用户名" />
				</Form.Item>
				<Form.Item name="password" rules={[{ required: true, message: "请输入密码!" }]}>
					<Input size="large" prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
				</Form.Item>
				<Form.Item>
					<Flex justify="space-between" align="center">
						<Form.Item name="remember" valuePropName="checked" noStyle>
							<Checkbox onChange={rememberPwdFun}>记住密码</Checkbox>
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
					出品
					<Divider type="vertical" />
					{props.appInfo?.app?.version}
				</span>
			</div>
		</div>
	);
}
export default AccountPassword;
