import React from 'react';
import {BrowserRouter, Navigate , Route, Routes, useLocation} from 'react-router-dom'
import ReactDOM from 'react-dom';
import {AllRouters as routes} from "./router/index";
import DefaultLayout from './layout/Default';
import api from "@/api";
import Router from "@/router/index";
// const remoteRoutes = await import('remote_standard/routes');
// console.log(remoteRoutes,'remoteRoutes')
import('remote_standard/routes').then((res: any) => {
  console.log(res, 'res') 
})

const standardRouter = await import('remote_standard/standardRouter')
console.log('standardRouter', standardRouter)
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
    <BrowserRouter basename="/">
      <Router />
    </BrowserRouter>
  )
}
export default App