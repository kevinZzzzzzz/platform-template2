import { BellOutlined } from "@ant-design/icons";
import { Badge } from "antd";

function MessageComp(props: any) {
	return (
		<>
			<Badge count={19} overflowCount={99}>
				<div className="message">
					<BellOutlined />
				</div>
			</Badge>
		</>
	);
}
export default MessageComp;
