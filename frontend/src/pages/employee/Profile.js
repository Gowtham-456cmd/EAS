import React from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxWidth: '600px',
  };

  const infoRow = {
    padding: '15px 0',
    borderBottom: '1px solid #eee',
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#666',
    marginBottom: '5px',
  };

  return (
    <Layout role="employee">
      <h1>My Profile</h1>
      
      <div style={cardStyle}>
        <div style={infoRow}>
          <div style={labelStyle}>Name</div>
          <div>{user?.name || '-'}</div>
        </div>
        <div style={infoRow}>
          <div style={labelStyle}>Email</div>
          <div>{user?.email || '-'}</div>
        </div>
        <div style={infoRow}>
          <div style={labelStyle}>{user?.role === 'manager' ? 'Manager ID' : 'Employee ID'}</div>
          <div>{user?.employeeId || '-'}</div>
        </div>
        <div style={infoRow}>
          <div style={labelStyle}>Department</div>
          <div>{user?.department || '-'}</div>
        </div>
        <div style={infoRow}>
          <div style={labelStyle}>Role</div>
          <div>{user?.role || '-'}</div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

