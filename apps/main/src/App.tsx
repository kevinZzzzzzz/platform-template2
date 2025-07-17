import React, { Suspense, lazy, useEffect, useState } from 'react';
import {BrowserRouter, HashRouter} from 'react-router-dom'
import Router from "@/router/index";
import api from "@/api";

declare global {
  interface Window {
    $api: any,
  }
}

window.$api = {...api}


function App() {

  return (
    <HashRouter>
      <Router/>
    </HashRouter>
  )
}

export default App