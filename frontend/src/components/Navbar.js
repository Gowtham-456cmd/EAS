import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { theme } from '../styles/theme';

const Navbar = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navStyle = {
    backgroundColor: theme.colors.white,
    padding: '12px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '20px',
    borderBottom: `1px solid ${theme.colors.gray[200]}`,
  };

  const navContent = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const navLinks = {
    display: 'flex',
    gap: '16px',
    listStyle: 'none',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  };

  const linkStyle = {
    textDecoration: 'none',
    color: theme.colors.gray[700],
    padding: '8px 14px',
    borderRadius: '9999px',
    fontSize: theme.fontSize.sm,
    fontWeight: 500,
    backgroundColor: 'transparent',
  };

  const userBadgeStyle = {
    marginRight: '8px',
    color: theme.colors.gray[600],
    fontSize: theme.fontSize.sm,
  };

  const logoutButtonStyle = {
    ...linkStyle,
    border: `1px solid ${theme.colors.gray[300]}`,
    background: theme.colors.white,
    cursor: 'pointer',
  };

  return (
    <nav style={navStyle}>
      <div style={navContent}>
        <div>
          <h2 style={{ 
            margin: 0, 
            color: theme.colors.primary,
            fontSize: theme.fontSize.lg,
            fontWeight: 700,
            letterSpacing: '0.03em',
          }}>
            EAS
          </h2>
        </div>
        <ul style={navLinks}>
          {role === 'employee' ? (
            <>
              <li><Link to="/employee/dashboard" style={linkStyle}>Dashboard</Link></li>
              <li><Link to="/employee/attendance" style={linkStyle}>Mark Attendance</Link></li>
              <li><Link to="/employee/history" style={linkStyle}>History</Link></li>
              <li><Link to="/employee/profile" style={linkStyle}>Profile</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/manager/dashboard" style={linkStyle}>Dashboard</Link></li>
              <li><Link to="/manager/attendance" style={linkStyle}>All Attendance</Link></li>
              <li><Link to="/manager/calendar" style={linkStyle}>Calendar</Link></li>
              <li><Link to="/manager/reports" style={linkStyle}>Reports</Link></li>
            </>
          )}
          <li>
            <span style={userBadgeStyle}>{user?.name}</span>
            <button onClick={handleLogout} style={logoutButtonStyle}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
