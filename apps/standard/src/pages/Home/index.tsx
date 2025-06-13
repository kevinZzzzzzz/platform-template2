import React, { useState, useEffect } from 'react';

function HomePage(props: any) {
    
  useEffect(() => {
    console.log(window.localStorage.a);
  }, [])
  return (
    <>
      <h1>standard2 Home Page {window.localStorage.a}</h1>
    </>
  )
}
export default HomePage