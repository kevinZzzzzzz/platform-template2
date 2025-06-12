import React, { useRef } from "react";
import { Avatar, Modal, Menu, Dropdown, message, MenuProps } from "antd";
import { ExclamationCircleOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import { useDispatch } from "@/store";
import { setToken } from "@/store/modules/global";
import PasswordModal from "./PasswordModal";
import InfoModal from "./InfoModal";
import avatar from "@/assets/images/avatar.png";

const AvatarIcon = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	interface ModalProps {
		showModal: (params: { name: number }) => void;
	}
	const passRef = useRef<ModalProps>(null);
	const infoRef = useRef<ModalProps>(null);

	// 退出登录
	const logout = () => {
		Modal.confirm({
			title: "温馨提示 🧡",
			icon: <ExclamationCircleOutlined />,
			content: "是否确认退出登录？",
			okText: "确认",
			cancelText: "取消",
			onOk: () => {
				dispatch(setToken(""));
				message.success("退出登录成功！");
				navigate("/login");
			}
		});
	};

	// Dropdown Menu
  const items: MenuProps['items'] = [
    {
      key: "1",
      label:<span className="dropdown-item">个人中心</span>,
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
      label: <span onClick={logout} className="dropdown-item">退出登录</span>,
      icon: <LogoutOutlined />
    }
  ]
	return (
		<>
			<Dropdown menu={{items}} placement="bottom" arrow trigger={["hover"]}>
				<Avatar size="large" src={avatar} />
			</Dropdown>
			{/* <InfoModal innerRef={infoRef}></InfoModal>
			<PasswordModal innerRef={passRef}></PasswordModal> */}
		</>
	);
};

export default AvatarIcon;
