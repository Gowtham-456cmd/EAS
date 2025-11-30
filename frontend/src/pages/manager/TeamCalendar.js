import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import { MANAGER_ATTENDANCE_ENDPOINTS, buildEndpoint } from '../../utils/apiEndpoints';

const TeamCalendar = () => {
  const [attendance, setAttendance] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const fetchCalendarData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(buildEndpoint(MANAGER_ATTENDANCE_ENDPOINTS.ALL_ATTENDANCE, { month, year }));
      setAttendance(response.data);
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  // Group attendance by date
  const groupedByDate = attendance.reduce((acc, record) => {
    const date = new Date(record.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {});

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
  };

  const inputStyle = {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  const dateCardStyle = {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '4px',
  };

  return (
    <Layout role="manager">
      <h1>Team Calendar View</h1>
      
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
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={cardStyle}>
          {Object.keys(groupedByDate).length > 0 ? (
            Object.entries(groupedByDate).map(([date, records]) => (
              <div key={date} style={dateCardStyle}>
                <h3>{date}</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Employee</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Check In</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Check Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record._id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px' }}>{record.userId?.name || '-'}</td>
                        <td style={{ padding: '8px' }}>{record.status}</td>
                        <td style={{ padding: '8px' }}>
                          {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                        </td>
                        <td style={{ padding: '8px' }}>
                          {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>No attendance records found for this month</p>
          )}
        </div>
      )}
    </Layout>
  );
};

export default TeamCalendar;

