import { Button, Form, Input, InputNumber, Select, Image, Modal } from "antd";
import React, { useState, useEffect, memo, useMemo, useRef } from "react";
import styles from "./index.module.less";
import useUserInfo from "@/hooks/useUserInfo";
import { getV } from "hoslink-xxx";
import useDeptUsers from "@/hooks/useDeptUsers";
import { updateUserApi } from "@/api/modules/user";

const AvatarMap = {
  1: '/assets/tmp/img/01.jpg',
  2: '/assets/tmp/img/02.jpg',
  3: '/assets/tmp/img/03.jpg',
  4: '/assets/tmp/img/04.jpg',
  5: '/assets/tmp/img/05.jpg',
  6: '/assets/tmp/img/06.jpg',
  7: '/assets/tmp/img/07.jpg',
  8: '/assets/tmp/img/08.jpg',
  9: '/assets/tmp/img/09.jpg',
  10: '/assets/tmp/img/10.jpg',
  11: '/assets/tmp/img/11.jpg',
  12: '/assets/tmp/img/12.jpg',
}
function BaseInfoComp(props: any) {
  const { userInfo, updateUserInfo } = useUserInfo();
  const { transDepts0ById } = useDeptUsers();
  const [form] = Form.useForm();
  const [avatarPath, setAvatarPath] = useState('');
  const [avatarModel, setAvatarModel] = useState(false);
  const [selAvatarIdx, setSelAvatarIdx] = useState(null);

  useEffect(() => {
    console.log(userInfo)
    form.setFieldsValue({
      nickName: userInfo.nickName,
      defaultPage: userInfo.content ? JSON.parse(userInfo.content)?.homepage : '/dashboard/home',
      loop: userInfo.loop,
      avatar: userInfo.avatarUrl,
    })
    setAvatarPath(userInfo.avatarUrl)
  }, [userInfo])

  // 一级机构
  const firstOrg = useMemo(() => {
    const parentId = userInfo?.['dept']?.['parentId']
    return transDepts0ById(parentId)
  }, [userInfo])

  // 监听avatarPath变化
  const avatar = useMemo(() => {
    return import.meta.env.VITE_SERVER_URL + '/' + avatarPath
  }, [avatarPath])

  const roleOption = useMemo(() => {
    // userInfo?.['role']?.['roleName']
    return [{
      label: '主页',
      value: '/dashboard/home',
    }]
  }, [userInfo])

  // 处理选择头像弹窗确认事件
  const handleAvatarModelOk = () => {
    setAvatarPath(AvatarMap[selAvatarIdx]);
    form.setFieldValue('avatar', AvatarMap[selAvatarIdx]);
    setAvatarModel(false);
  }
  // 处理选择头像弹窗取消事件
  const handleAvatarModelCancel = () => {
    setAvatarModel(false);
  }
  // 每次打开头像弹窗前
  const openModelBefore = () => {
    const idx = Object.keys(AvatarMap).find((item) => AvatarMap[item] === avatarPath);
    setSelAvatarIdx(idx || null);
    setAvatarModel(true);
  }
	const updateBaseInfo = async () => {
    const values = await form.validateFields();
    console.log(values);
		console.log(form.getFieldValue('avatar'));
    const params = {
      ...userInfo,
      ...values,
      avatarUrl: form.getFieldValue('avatar'),
    }
    updateUserApi(params).then(res => {
      console.log(res);
      updateUserInfo(params)
    })
	};
	return (
		<div className={styles.baseInfo}>
			<div className={styles.baseInfo_left}>
				<Form form={form} name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} style={{ maxWidth: 600 }} autoComplete="off"> 
					<Form.Item label="用户名">
						<span className={styles.inputText}>{userInfo.username}</span>
					</Form.Item>
					<Form.Item label="一级机构">
						<span className={styles.inputText}>{firstOrg}</span>
					</Form.Item>
					<Form.Item label="二级机构">
						<span className={styles.inputText}>{userInfo?.['dept']?.['name'] || '--'}</span>
					</Form.Item>
					<Form.Item label="账号角色">
						<span className={styles.inputText}>{userInfo?.['role']?.['roleName'] || '--'}</span>
					</Form.Item>
					<Form.Item label="姓名" name="nickName" required rules={[{ min: 2, max: 16, message: '请输入2-16个字符' }]}>
						<Input />
					</Form.Item>
					<Form.Item label="我的主页" name="defaultPage">
            <Select options={roleOption} />
					</Form.Item>
					<Form.Item label="循环播放同时">
						<Form.Item noStyle  name="loop" >
							<InputNumber />
						</Form.Item>
						<span className="ant-form-text" style={{ marginInlineStart: 8 }}>
							秒
						</span>
					</Form.Item>
				</Form>
			</div>
      <div className={styles.baseInfo_right}>
        <Image width={350} src={avatar} preview={false} />
        <Button style={{width: '20%'}} onClick={() => {
          openModelBefore()
        }}>修改头像</Button>
      </div>
      <div className={styles.baseInfo_bottom}>
        <Button type="primary" htmlType="submit" onClick={updateBaseInfo}>
          更新个人信息
        </Button>
      </div>
      <Modal
        width={800}
        title="用户头像"
        cancelText="取消"
        okText="确定"
        open={avatarModel}
        onOk={handleAvatarModelOk}
        onCancel={handleAvatarModelCancel}
      >
        <div className={styles.avatarList}>
          {
            Object.keys(AvatarMap).map((item) => {
              return (
                <div className={styles.avatarList_avatarItem} key={item} onClick={() => {
                  setSelAvatarIdx(item);
                }}>
                  <Image src={import.meta.env.VITE_SERVER_URL + '/' + AvatarMap[item]} preview={false} />
                  {
                    selAvatarIdx === item && <div className={styles.avatarList_avatarItem_avatarItemSelected} />
                  }
                </div>
              )
            })
          }
        </div>
      </Modal>
		</div>
	);
}
export default memo(BaseInfoComp);
