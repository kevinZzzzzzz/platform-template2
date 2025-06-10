import React, {ReactNode, Suspense} from 'react';
// 使用旧版 ReactDOM 渲染方式，避免 React 18/19 类型问题
import ReactDOM from 'react-dom/client';
import App from './App';
import store from "./store";
import { Provider } from "react-redux";
import './index.less'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// 使用类型断言解决 React 18 和 React 19 类型不兼容问题
root.render(
  (<Provider store={store}>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </Provider>) as any
);

