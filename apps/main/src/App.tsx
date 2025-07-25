import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, HashRouter } from "react-router-dom";
import Router from "@/router/index";
import api from "@/api";
import { ConfigProvider } from "antd";

declare global {
	interface Window {
		$api: any;
	}
}

window.$api = { ...api };

function App() {
	return (
		<HashRouter>
			<ConfigProvider theme={{
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
