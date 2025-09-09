import { Button, Form, Input, InputNumber, Select, Image, Modal } from "antd";
import React, { useState, useEffect, memo, useMemo, useRef } from "react";
import styles from "./index.module.less";
import useUserInfo from "@/hooks/useUserInfo";
import { getV } from "hoslink-xxx";
import useDeptUsers from "@/hooks/useDeptUsers";

const AvatarMap = {
  1: '/assets/images/01.jpg',
  2: '/assets/images/02.jpg',
  3: '/assets/images/03.jpg',
  4: '/assets/images/04.jpg',
  5: '/assets/images/05.jpg',
  6: '/assets/images/06.jpg',
  7: '/assets/images/07.jpg',
  8: '/assets/images/08.jpg',
  9: '/assets/images/09.jpg',
  10: '/assets/images/10.jpg',
  11: '/assets/images/11.jpg',
  12: '/assets/images/12.jpg',
}
function BaseInfoComp(props: any) {
  const { userInfo } = useUserInfo();
  const { transDepts0ById } = useDeptUsers();
  const [form] = Form.useForm();
  const [avatarPath, setAvatarPath] = useState('');
  const [avatarModel, setAvatarModel] = useState(false);
  const [selAvatarIdx, setSelAvatarIdx] = useState(null);

  useEffect(() => {
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
    return 'src/' + avatarPath
  }, [avatarPath])

  const roleOption = useMemo(() => {
    // userInfo?.['role']?.['roleName']
    return [{
      label: '主页',
      value: '/dashboard/home',
    }]
  }, [userInfo])
  const handleAvatarModelOk = () => {
    setAvatarPath(AvatarMap[selAvatarIdx]);
    setAvatarModel(false);
  }
  const handleAvatarModelCancel = () => {
    setAvatarModel(false);
  }
  const openModelBefore = () => {
    const idx = Object.keys(AvatarMap).find((item) => AvatarMap[item] === avatarPath);
    setSelAvatarIdx(idx || null);
    setAvatarModel(true);
  }
	const onFinish = (values: any) => {
		console.log(values);
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
						<Form.Item noStyle  name="loop">
							<InputNumber  />
						</Form.Item>
						<span className="ant-form-text" style={{ marginInlineStart: 8 }}>
							秒
						</span>
					</Form.Item>

					{/* <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
				</Form>
			</div>
      <div className={styles.baseInfo_right}>
        <Image width={350} src={avatar} preview={false} />
        <Button style={{width: '20%'}} onClick={() => {
          openModelBefore()
        }}>修改头像</Button>
      </div>
      <div className={styles.baseInfo_bottom}>
        <Button type="primary" htmlType="submit">
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
                  <Image src={'src/' + AvatarMap[item]} preview={false} />
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
