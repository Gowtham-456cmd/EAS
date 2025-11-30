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

  return (
    <Layout role="manager">
      <h1>Manager Dashboard</h1>
      
      {dashboardData && (
        <>
          <div style={cardStyle}>
            <h3>Overview</h3>
            <p>Total Employees: {dashboardData.totalEmployees}</p>
            <p>Present Today: {dashboardData.todayStats?.present}</p>
            <p>Absent Today: {dashboardData.todayStats?.absent}</p>
            <p>Late Today: {dashboardData.todayStats?.late}</p>
          </div>

          <div style={cardStyle}>
            <h3>Department-wise Attendance</h3>
            {dashboardData.departmentWise?.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Department</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Total</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Present</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.departmentWise.map((dept, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{dept.department}</td>
                      <td style={{ padding: '10px' }}>{dept.total}</td>
                      <td style={{ padding: '10px' }}>{dept.present}</td>
                      <td style={{ padding: '10px' }}>{dept.absent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No department data available</p>
            )}
          </div>

          <div style={cardStyle}>
            <h3>Absent Employees Today</h3>
            {dashboardData.absentEmployees?.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Employee ID</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.absentEmployees.map((emp, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{emp.name}</td>
                      <td style={{ padding: '10px' }}>{emp.employeeId}</td>
                      <td style={{ padding: '10px' }}>{emp.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

