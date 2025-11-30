import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Layout = ({ children, role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navStyle = {
    backgroundColor: '#fff',
    padding: '15px 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
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
    gap: '20px',
    listStyle: 'none',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    padding: '8px 15px',
    borderRadius: '4px',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  };

  return (
    <div>
      <nav style={navStyle}>
        <div style={navContent}>
          <div>
            <h2 style={{ margin: 0, color: '#333' }}>EAS</h2>
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
              <span style={{ marginRight: '10px', color: '#666' }}>{user?.name}</span>
              <button onClick={handleLogout} style={{ ...linkStyle, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div style={containerStyle}>
        {children}
      </div>
    </div>
  );
};

export default Layout;

