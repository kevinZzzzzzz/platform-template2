import React from 'react';
import AccountPassword from '../components/AccountPassword';

let remoteComp = AccountPassword
try {
  remoteComp = React.lazy(() =>
    // @ts-ignore
    import('remote_chongqing/AccountPassword').catch(() => ({ default: AccountPassword }))
  );
} catch (error) {
  console.log('error', error)
}

export default remoteComp