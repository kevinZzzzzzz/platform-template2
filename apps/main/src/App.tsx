import React, { Suspense, lazy, useEffect, useState } from 'react';
import {BrowserRouter} from 'react-router-dom'
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
    <BrowserRouter basename="/">
      <Router />
      {/* <standardHomePage /> */}
    </BrowserRouter>
  )
}

export default App