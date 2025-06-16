import React from 'react';

function NotFoundPage (props: any) {
  useEffect(() => {
    setTimeout(() => {
      
      window.location.href = '/'
    }, 10);
  }, [])
  return (
    <>
      <h1>Not Found</h1>
    </>
  )
}

export default NotFoundPage