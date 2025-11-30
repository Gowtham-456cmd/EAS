import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { fetchTodayStatus } from '../../store/slices/attendanceSlice';
import api from '../../services/api';
import { DASHBOARD_ENDPOINTS } from '../../utils/apiEndpoints';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { todayStatus } = useSelector((state) => state.attendance);
  const [dashboardData, setDashboardData] = React.useState(null);

  useEffect(() => {
    dispatch(fetchTodayStatus());
    fetchDashboardData();
  }, [dispatch]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(DASHBOARD_ENDPOINTS.EMPLOYEE);
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

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '10px',
  };

  return (
    <Layout role="employee">
      <h1>Employee Dashboard</h1>
      
      <div style={cardStyle}>
        <h3>Today's Status</h3>
        <p>Status: {todayStatus?.status || 'Not checked in'}</p>
        <p>Checked In: {todayStatus?.checkedIn ? 'Yes' : 'No'}</p>
        <p>Checked Out: {todayStatus?.checkedOut ? 'Yes' : 'No'}</p>
        {todayStatus?.checkInTime && <p>Check In: {new Date(todayStatus.checkInTime).toLocaleString()}</p>}
        {todayStatus?.checkOutTime && <p>Check Out: {new Date(todayStatus.checkOutTime).toLocaleString()}</p>}
        <button style={buttonStyle} onClick={() => navigate('/employee/attendance')}>
          Mark Attendance
        </button>
      </div>

      {dashboardData && (
        <>
          <div style={cardStyle}>
            <h3>Monthly Summary - {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '15px' }}>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                  {dashboardData.monthlyStats?.present || 0}
                </div>
                <div style={{ color: '#666', marginTop: '5px' }}>Present Days</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                  {dashboardData.monthlyStats?.absent || 0}
                </div>
                <div style={{ color: '#666', marginTop: '5px' }}>Absent Days</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                  {dashboardData.monthlyStats?.late || 0}
                </div>
                <div style={{ color: '#666', marginTop: '5px' }}>Late Days</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                  {dashboardData.monthlyStats?.totalHours?.toFixed(1) || 0}
                </div>
                <div style={{ color: '#666', marginTop: '5px' }}>Total Hours</div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3>Recent Attendance</h3>
            {dashboardData.recentAttendance?.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentAttendance.map((record, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{new Date(record.date).toLocaleDateString()}</td>
                      <td style={{ padding: '10px' }}>{record.status}</td>
                      <td style={{ padding: '10px' }}>{record.totalHours || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No recent attendance records</p>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default EmployeeDashboard;

