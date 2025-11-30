import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import { checkIn, checkOut, fetchTodayStatus } from '../../store/slices/attendanceSlice';

const MarkAttendance = () => {
  const dispatch = useDispatch();
  const { todayStatus, loading, error } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchTodayStatus());
  }, [dispatch]);

  const handleCheckIn = async () => {
    const result = await dispatch(checkIn());
    if (result.payload?.success) {
      alert('Checked in successfully!');
    }
  };

  const handleCheckOut = async () => {
    const result = await dispatch(checkOut());
    if (result.payload?.success) {
      alert('Checked out successfully!');
    }
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '0 auto',
  };

  const buttonStyle = {
    padding: '15px 30px',
    fontSize: '18px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '10px',
    minWidth: '150px',
  };

  const checkInButton = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    color: '#fff',
  };

  const checkOutButton = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: '#fff',
  };

  return (
    <Layout role="employee">
      <h1>Mark Attendance</h1>
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      
      <div style={cardStyle}>
        <h2>Today's Attendance</h2>
        <p><strong>Status:</strong> {todayStatus?.status || 'Not checked in'}</p>
        {todayStatus?.checkInTime && (
          <p><strong>Check In:</strong> {new Date(todayStatus.checkInTime).toLocaleString()}</p>
        )}
        {todayStatus?.checkOutTime && (
          <p><strong>Check Out:</strong> {new Date(todayStatus.checkOutTime).toLocaleString()}</p>
        )}
        {todayStatus?.totalHours && (
          <p><strong>Total Hours:</strong> {todayStatus.totalHours}</p>
        )}

        <div style={{ marginTop: '30px' }}>
          {!todayStatus?.checkedIn ? (
            <button onClick={handleCheckIn} disabled={loading} style={checkInButton}>
              {loading ? 'Processing...' : 'Check In'}
            </button>
          ) : !todayStatus?.checkedOut ? (
            <button onClick={handleCheckOut} disabled={loading} style={checkOutButton}>
              {loading ? 'Processing...' : 'Check Out'}
            </button>
          ) : (
            <p style={{ color: '#28a745' }}>✓ Attendance completed for today</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MarkAttendance;

