import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, HashRouter } from "react-router-dom";
import Router from "@/router/index";
import api from "@/api";
import { ConfigProvider } from "antd";
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';

declare global {
	interface Window {
		$api: any;
	}
}

window.$api = { ...api };

function App() {
	return (
		<HashRouter>
			<ConfigProvider
        locale={locale} theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}>
				<Router />
			</ConfigProvider>
		</HashRouter>
	);
}

export default App;
