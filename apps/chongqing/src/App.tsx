import React from 'react';
import {BrowserRouter, Navigate , Route, Routes, useLocation} from 'react-router-dom'
import ReactDOM from 'react-dom';
import {Router} from "./router/index";
import DefaultLayout from './layout/Default';
import api from "@/api";
console.log(Router,'Router')
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
    <BrowserRouter basename="/chongqing">
      <Router />
    </BrowserRouter>
  )
}
export default App