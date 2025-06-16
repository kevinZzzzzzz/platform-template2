import React, { Suspense, lazy, useEffect, useState } from 'react';
import {BrowserRouter, HashRouter} from 'react-router-dom'
import Router from "@/router/index";
import api from "@/api";
// import modulesStandard from "@/router/modules/standard";

declare global {
  interface Window {
    $api: any,
  }
}

window.$api = {...api}

// 提前加载自定义模块
// const modulesRouter = await import(`./router/modules/${import.meta.env.VITE_CUSTOM}`)

function App() {

  return (
    <HashRouter>
      <Router/>
    </HashRouter>
  )
}

export default App