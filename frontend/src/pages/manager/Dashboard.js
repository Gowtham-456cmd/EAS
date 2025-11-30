import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import { DASHBOARD_ENDPOINTS } from '../../utils/apiEndpoints';

const ManagerDashboard = () => {
  const [dashboardData, setDashboardData] = React.useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(DASHBOARD_ENDPOINTS.MANAGER);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const tableWrapperStyle = {
    width: '100%',
    overflowX: 'auto',
    marginTop: '10px',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  };

  const thStyle = {
    padding: '8px 10px',
    textAlign: 'left',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd',
    fontWeight: 600,
  };

  const tdStyle = {
    padding: '8px 10px',
    borderBottom: '1px solid #eee',
  };

  return (
    <Layout role="manager">
      <h1>Manager Dashboard</h1>
      
      {dashboardData && (
        <>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Overview</h3>
            <p style={{ margin: '4px 0' }}>Total Employees: <strong>{dashboardData.totalEmployees}</strong></p>
            <p style={{ margin: '4px 0' }}>Present Today: <strong>{dashboardData.todayStats?.present}</strong></p>
            <p style={{ margin: '4px 0' }}>Absent Today: <strong>{dashboardData.todayStats?.absent}</strong></p>
            <p style={{ margin: '4px 0' }}>Late Today: <strong>{dashboardData.todayStats?.late}</strong></p>
          </div>

          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, marginBottom: '8px' }}>Department-wise Attendance</h3>
            {dashboardData.departmentWise?.length > 0 ? (
              <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Department</th>
                      <th style={thStyle}>Total</th>
                      <th style={thStyle}>Present</th>
                      <th style={thStyle}>Absent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.departmentWise.map((dept, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={tdStyle}>{dept.department}</td>
                        <td style={tdStyle}>{dept.total}</td>
                        <td style={tdStyle}>{dept.present}</td>
                        <td style={tdStyle}>{dept.absent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No department data available</p>
            )}
          </div>

          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, marginBottom: '8px' }}>Absent Employees Today</h3>
            {dashboardData.absentEmployees?.length > 0 ? (
              <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Employee ID</th>
                      <th style={thStyle}>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.absentEmployees.map((emp, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={tdStyle}>{emp.name}</td>
                        <td style={tdStyle}>{emp.employeeId}</td>
                        <td style={tdStyle}>{emp.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>All employees are present today</p>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default ManagerDashboard;

