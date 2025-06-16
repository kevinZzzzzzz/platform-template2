import React, {ReactNode, Suspense} from 'react';
// 使用旧版 ReactDOM 渲染方式，避免 React 18/19 类型问题
import ReactDOM from "react-dom";
import App from './App';
import { store, persistor } from "@/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import './index.less'

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );

ReactDOM.render(
	// <React.StrictMode>
  // @ts-ignore
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<App />
		</PersistGate>
	</Provider>,
	// </React.StrictMode>,
	document.getElementById("root")
);
