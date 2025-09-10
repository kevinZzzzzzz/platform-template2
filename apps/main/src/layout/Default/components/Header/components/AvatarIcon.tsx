import { Avatar, Modal, Menu, Dropdown, message, MenuProps } from "antd";
import { ExclamationCircleOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import { useDispatch } from "@/store";
import { setToken } from "@repo/store/lib/auth";
import PasswordModal from "./PasswordModal";
import InfoModal from "./InfoModal";
import { removeLocalForage } from "@/utils/util";
import useUserInfo from "@/hooks/useUserInfo";
import {useMemo, useState} from "react";
import styles from './index.module.less'

const AvatarIcon = () => {
  const { userInfo } = useUserInfo();
	const dispatch = useDispatch();
	const navigate = useNavigate();
  const { avatarUrl } = userInfo;

  // 监听avatarPath变化
  const avatar = useMemo(() => {
    return import.meta.env.VITE_SERVER_URL + '/' + avatarUrl
  }, [avatarUrl])
  const username = useMemo(() => {
    return userInfo?.nickName + '-' + userInfo?.dept?.name
    // return `${userInfo.nickName}-${userInfo.dept.name}`
  }, [userInfo])

	interface ModalProps {
		showModal: (params: { name: number }) => void;
	}

	// 退出登录
	const logout = () => {
		Modal.confirm({
			title: "温馨提示 🧡",
			icon: <ExclamationCircleOutlined />,
			content: "是否确认退出登录？",
			okText: "确认",
			cancelText: "取消",
			onOk: async () => {
        // await removeLocalForage("persist:station-state")
				dispatch(setToken(""));
        localStorage.removeItem("token")
				message.success("退出登录成功！");
				navigate("/login");
        // dispatch({ type: 'RESET_STATE' })
			}
		});
	};

	// Dropdown Menu
  const items: MenuProps['items'] = [
    {
      key: "1",
      label:<span className="dropdown-item">个人中心</span>,
      onClick: () => {
        navigate("/personal-center")
      },
      icon: <UserOutlined />,
    },
    {
      key: "2",
      disabled: true,
      label: <span className="dropdown-item">设置</span>,
      icon: <SettingOutlined />
    },
    {
      type: "divider"
    },
    {
      key: "3",
      label: <span className="dropdown-item">退出登录</span>,
      icon: <LogoutOutlined />,
      onClick: () => {
        logout()
      }
    }
  ]
	return (
		<>
			<Dropdown menu={{items}} placement="bottom" arrow trigger={["hover"]}>
				<div className='avatar'>
          <Avatar size="large" src={<img src={avatar} />} />
          <p className={styles.username}>{username}</p>
        </div>
			</Dropdown>
		</>
	);
};

export default AvatarIcon;
