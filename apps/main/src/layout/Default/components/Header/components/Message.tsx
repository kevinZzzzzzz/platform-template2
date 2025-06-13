import { BellOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import React, { useState, useEffect } from "react";

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
