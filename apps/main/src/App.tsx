import React from 'react';
import {HashRouter, Navigate , Route, Routes, useLocation} from 'react-router-dom'
import ReactDOM from 'react-dom';
import {AllRouters as routes} from "./router/index";
import DefaultLayout from './layout/Default';
import api from "@/api";
import Router from "@/router/index";

declare global {
  interface Window {
    $api: any,
  }
}
/* 
  设置全局变量
*/
window.$api = {...api}

function App() {
  return (
    <HashRouter>
      <Router />
    </HashRouter>
  )
}
export default App