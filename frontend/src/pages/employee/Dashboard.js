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
    padding: '24px 28px',
    borderRadius: '10px',
    marginBottom: '24px',
    boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
  };

  const smallLabelStyle = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '4px',
  };

  const valueTextStyle = {
    fontWeight: '500',
    color: '#222',
  };

  return (
    <Layout role="employee">
      <h1>Employee Dashboard</h1>

      {/* Simple today's status card */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Today's Status</h3>

        {/* Two divisions: left info, right button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px' }}>
          {/* Left side: all status info */}
          <div style={{ flex: 1 }}>
            {/* Status details in a horizontal row */}
            <div style={{ display: 'flex', gap: '30px', justifyContent: 'flex-start', marginBottom: '10px' }}>
              <div>
                <div style={smallLabelStyle}>Status</div>
                <div style={valueTextStyle}>
                  {todayStatus?.status
                    ? todayStatus.status.charAt(0).toUpperCase() + todayStatus.status.slice(1)
                    : 'Not checked in'}
                </div>
              </div>
              <div>
                <div style={smallLabelStyle}>Checked In</div>
                <div style={valueTextStyle}>{todayStatus?.checkedIn ? 'Yes' : 'No'}</div>
              </div>
              <div>
                <div style={smallLabelStyle}>Checked Out</div>
                <div style={valueTextStyle}>{todayStatus?.checkedOut ? 'Yes' : 'No'}</div>
              </div>
            </div>

            {(todayStatus?.checkInTime || todayStatus?.checkedIn) && (
              <div style={{ display: 'flex', gap: '20px', marginTop: '10px', justifyContent: 'flex-start' }}>
                {todayStatus?.checkInTime && (
                  <div>
                    <div style={smallLabelStyle}>Check In Time</div>
                    <div style={valueTextStyle}>
                      {new Date(todayStatus.checkInTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <div style={smallLabelStyle}>
                    {todayStatus?.checkOutTime ? 'Check Out Time' : 'Working Hours'}
                  </div>
                  <div style={valueTextStyle}>
                    {todayStatus?.checkOutTime
                      ? new Date(todayStatus.checkOutTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : todayStatus?.checkedIn
                      ? 'In progress...'
                      : '--:--'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right side: action button only (Check In / Check Out / View) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '120px' }}>
            {(() => {
              const isCheckOutState = todayStatus?.checkedIn && !todayStatus?.checkedOut;
              const label = todayStatus?.checkedIn
                ? todayStatus.checkedOut
                  ? 'View Details'
                  : 'Check Out'
                : 'Check In';

              const baseStyle = {
                border: 'none',
                backgroundColor: '#007bff',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px',
              };

              const circularStyle = {
                width: '80px',
                height: '80px',
                borderRadius: '8px', // square-ish
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 4px',
                fontWeight: '600',
              };

              const normalStyle = {
                padding: '10px 18px',
                borderRadius: '4px',
                fontWeight: '500',
              };

              return (
                <button
                  onClick={() => navigate('/employee/attendance')}
                  style={{
                    ...baseStyle,
                    ...(isCheckOutState ? circularStyle : normalStyle),
                  }}
                >
                  {label}
                </button>
              );
            })()}
          </div>
        </div>
      </div>

      {dashboardData && (
        <div style={cardStyle}>
          <h3>
            Monthly Summary -
            {' '}
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              marginTop: '15px',
            }}
          >
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
      )}
    </Layout>
  );
};

export default EmployeeDashboard;

