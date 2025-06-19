import React from 'react';
import {BrowserRouter,HashRouter, Navigate , Route, Routes, useLocation} from 'react-router-dom'
import ReactDOM from 'react-dom';
import Router from "./router/index";
import api from "@/api";
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
    //  basename={import.meta.env.MODE === 'development' ? '' : '/standard'}
    <HashRouter>
      <Router />
    </HashRouter>
  )
}
export default App