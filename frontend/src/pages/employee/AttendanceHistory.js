import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import { fetchHistory } from '../../store/slices/attendanceSlice';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isSameMonth } from 'date-fns';

const AttendanceHistory = () => {
  const dispatch = useDispatch();
  const { history, loading } = useSelector((state) => state.attendance);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [view, setView] = useState('calendar'); // 'calendar' or 'table'
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    dispatch(fetchHistory(month, year));
  }, [dispatch, month, year]);

  // Get attendance record for a specific date
  const getAttendanceForDate = (date) => {
    return history.find(record => {
      const recordDate = new Date(record.date);
      return isSameDay(recordDate, date);
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#28a745'; // Green
      case 'absent':
        return '#dc3545'; // Red
      case 'late':
        return '#ffc107'; // Yellow
      case 'half-day':
        return '#fd7e14'; // Orange
      default:
        return '#e9ecef'; // Gray for no data
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const currentDate = new Date(year, month - 1, 1);
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add empty cells for days before month starts
    const firstDayOfWeek = monthStart.getDay();
    const emptyDays = Array(firstDayOfWeek).fill(null);
    
    return [...emptyDays, ...days];
  };

  const handleDateClick = (date) => {
    if (!date) return;
    const record = getAttendanceForDate(date);
    setSelectedDate(date);
    setSelectedRecord(record);
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const filterStyle = {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const inputStyle = {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  const buttonStyle = {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: '#fff',
    border: '1px solid #007bff',
  };

  const calendarGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    marginTop: '20px',
  };

  const dayHeaderStyle = {
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  };

  const dayCellStyle = {
    padding: '10px',
    textAlign: 'center',
    borderRadius: '4px',
    cursor: 'pointer',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #e9ecef',
  };

  const emptyDayStyle = {
    ...dayCellStyle,
    backgroundColor: '#f8f9fa',
    cursor: 'default',
    border: 'none',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const thStyle = {
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #dee2e6',
  };

  const statusBadgeStyle = (status) => ({
    padding: '4px 8px',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '12px',
    backgroundColor: getStatusColor(status),
  });

  const legendStyle = {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
    flexWrap: 'wrap',
  };

  const legendItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const legendColorStyle = (color) => ({
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    backgroundColor: color,
  });

  return (
    <Layout role="employee">
      <h1>My Attendance History</h1>
      
      <div style={cardStyle}>
        <div style={filterStyle}>
          <label>Month:</label>
          <input
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            style={inputStyle}
          />
          <label>Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            style={inputStyle}
          />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setView('calendar')}
              style={view === 'calendar' ? activeButtonStyle : buttonStyle}
            >
              Calendar View
            </button>
            <button
              onClick={() => setView('table')}
              style={view === 'table' ? activeButtonStyle : buttonStyle}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : view === 'calendar' ? (
        <div style={cardStyle}>
          <h2 style={{ marginBottom: '20px' }}>
            {monthNames[month - 1]} {year}
          </h2>
          
          <div style={calendarGridStyle}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={dayHeaderStyle}>{day}</div>
            ))}
            
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} style={emptyDayStyle}></div>;
              }
              
              const record = getAttendanceForDate(date);
              const isToday = isSameDay(date, new Date());
              const isCurrentMonth = isSameMonth(date, new Date(year, month - 1, 1));
              
              return (
                <div
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  style={{
                    ...dayCellStyle,
                    backgroundColor: record ? getStatusColor(record.status) : '#fff',
                    color: record ? '#fff' : isCurrentMonth ? '#333' : '#999',
                    fontWeight: isToday ? 'bold' : 'normal',
                    border: isToday ? '2px solid #007bff' : '1px solid #e9ecef',
                  }}
                >
                  {format(date, 'd')}
                </div>
              );
            })}
          </div>

          <div style={legendStyle}>
            <div style={legendItemStyle}>
              <div style={legendColorStyle('#28a745')}></div>
              <span>Present</span>
            </div>
            <div style={legendItemStyle}>
              <div style={legendColorStyle('#dc3545')}></div>
              <span>Absent</span>
            </div>
            <div style={legendItemStyle}>
              <div style={legendColorStyle('#ffc107')}></div>
              <span>Late</span>
            </div>
            <div style={legendItemStyle}>
              <div style={legendColorStyle('#fd7e14')}></div>
              <span>Half Day</span>
            </div>
            <div style={legendItemStyle}>
              <div style={legendColorStyle('#e9ecef')}></div>
              <span>No Data</span>
            </div>
          </div>

          {selectedRecord && selectedDate && (
            <div style={{ ...cardStyle, marginTop: '20px', backgroundColor: '#f8f9fa' }}>
              <h3>Details for {format(selectedDate, 'MMMM d, yyyy')}</h3>
              <div style={{ marginTop: '15px' }}>
                <p><strong>Status:</strong> 
                  <span style={statusBadgeStyle(selectedRecord.status)}>
                    {selectedRecord.status.toUpperCase()}
                  </span>
                </p>
                <p><strong>Check In:</strong> {
                  selectedRecord.checkInTime 
                    ? new Date(selectedRecord.checkInTime).toLocaleString() 
                    : 'Not checked in'
                }</p>
                <p><strong>Check Out:</strong> {
                  selectedRecord.checkOutTime 
                    ? new Date(selectedRecord.checkOutTime).toLocaleString() 
                    : 'Not checked out'
                }</p>
                <p><strong>Total Hours:</strong> {selectedRecord.totalHours || 0} hours</p>
              </div>
              <button
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedRecord(null);
                }}
                style={{
                  marginTop: '15px',
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          )}

          {selectedDate && !selectedRecord && (
            <div style={{ ...cardStyle, marginTop: '20px', backgroundColor: '#f8f9fa' }}>
              <h3>Details for {format(selectedDate, 'MMMM d, yyyy')}</h3>
              <p>No attendance record found for this date.</p>
              <button
                onClick={() => setSelectedDate(null)}
                style={{
                  marginTop: '15px',
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={cardStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Check In</th>
                <th style={thStyle}>Check Out</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Hours</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((record) => (
                  <tr key={record._id}>
                    <td style={tdStyle}>{new Date(record.date).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      {record.checkInTime ? new Date(record.checkInTime).toLocaleString() : '-'}
                    </td>
                    <td style={tdStyle}>
                      {record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : '-'}
                    </td>
                    <td style={tdStyle}>
                      <span style={statusBadgeStyle(record.status)}>
                        {record.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyle}>{record.totalHours || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ ...tdStyle, textAlign: 'center' }}>
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default AttendanceHistory;
