import React, { Suspense } from "react";
// import ReactDOM from "react-dom/client";
import ReactDOM from "react-dom";
import "@/assets/iconfont/iconfont.less";
import App from "./App";
import { store, persistor } from "@/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.less";
// const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
// react 17 创建，控制台会报错，暂时不影响使用（菜单折叠时不会出现闪烁）
ReactDOM.render(
	// <React.StrictMode>
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<App />
		</PersistGate>
	</Provider>,
	// </React.StrictMode>,
	document.getElementById("root")
);
