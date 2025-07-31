import React from "react";
import { message, Spin } from "antd";
import ReactDOM from "react-dom";

// * 全局loading请求数
let needLoadingRequestCount = 0;

const Loading = ({ tip = "Loading" }: { tip?: string }) => {
	return <Spin tip={tip} size="large" fullscreen />;
};
// * 显示loading
export const showFullScreenLoading = () => {
	if (needLoadingRequestCount === 0) {
		let dom = document.createElement("div");
		dom.setAttribute("id", "loading");
		document.body.appendChild(dom);
    // @ts-ignore
		ReactDOM.render(<Loading />, dom);
	}
	needLoadingRequestCount++;
}

// * 隐藏loading
export const tryHideFullScreenLoading = () => {
	if (needLoadingRequestCount <= 0) return;
	needLoadingRequestCount--;
	if (needLoadingRequestCount === 0) {
		document.body.removeChild(document.getElementById("loading") as HTMLElement);
	}
}