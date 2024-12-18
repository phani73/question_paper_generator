// Layout.js
import React from 'react';
import Loader from './Loader';

const Layout = ({ children }) => {
  return (
    <div>
      <Loader />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
