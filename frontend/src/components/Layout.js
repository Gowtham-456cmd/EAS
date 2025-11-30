import React from 'react';
import Navbar from './Navbar';
import { theme } from '../styles/theme';

const Layout = ({ children, role }) => {
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.gray[50] }}>
      <Navbar role={role} />
      <div style={containerStyle}>
        {children}
      </div>
    </div>
  );
};

export default Layout;

