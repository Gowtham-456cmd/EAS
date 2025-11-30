import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import { fetchAllAttendance } from '../../store/slices/attendanceSlice';

const AllAttendance = () => {
  const dispatch = useDispatch();
  const { allAttendance, loading } = useSelector((state) => state.attendance);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    dispatch(fetchAllAttendance(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
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

  return (
    <Layout role="manager">
      <h1>All Employees Attendance</h1>
      
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Filters</h3>
        <div style={filterStyle}>
          <label>Month:</label>
          <input
            type="number"
            min="1"
            max="12"
            value={filters.month}
            onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}
            style={inputStyle}
          />
          <label>Year:</label>
          <input
            type="number"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
            style={inputStyle}
          />
          <label>Employee ID:</label>
          <input
            type="text"
            placeholder="EMP001"
            value={filters.employeeId || ''}
            onChange={(e) => handleFilterChange('employeeId', e.target.value)}
            style={inputStyle}
          />
          <label>Status:</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={inputStyle}
          >
            <option value="">All</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="half-day">Half Day</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Employee</th>
              <th style={thStyle}>Employee ID</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Check In</th>
              <th style={thStyle}>Check Out</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Hours</th>
            </tr>
          </thead>
          <tbody>
            {allAttendance.length > 0 ? (
              allAttendance.map((record) => (
                <tr key={record._id}>
                  <td style={tdStyle}>{new Date(record.date).toLocaleDateString()}</td>
                  <td style={tdStyle}>{record.userId?.name || '-'}</td>
                  <td style={tdStyle}>{record.userId?.employeeId || '-'}</td>
                  <td style={tdStyle}>{record.userId?.department || '-'}</td>
                  <td style={tdStyle}>
                    {record.checkInTime ? new Date(record.checkInTime).toLocaleString() : '-'}
                  </td>
                  <td style={tdStyle}>
                    {record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : '-'}
                  </td>
                  <td style={tdStyle}>{record.status}</td>
                  <td style={tdStyle}>{record.totalHours || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ ...tdStyle, textAlign: 'center' }}>
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default AllAttendance;

