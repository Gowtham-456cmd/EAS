import React, { useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import { MANAGER_ATTENDANCE_ENDPOINTS, buildEndpoint } from '../../utils/apiEndpoints';

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!startDate || !endDate) {
      alert('Please select start and end dates');
      return;
    }

    setLoading(true);
    try {
      const params = { startDate, endDate };
      if (employeeId) params.employeeId = employeeId;

      const response = await api.get(buildEndpoint(MANAGER_ATTENDANCE_ENDPOINTS.EXPORT_CSV, params), {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-report-${startDate}-to-${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      alert('Report exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxWidth: '500px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  return (
    <Layout role="manager">
      <h1>Export Reports</h1>
      
      <div style={cardStyle}>
        <h3>Generate Attendance Report</h3>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label>Employee ID (Optional):</label>
          <input
            type="text"
            placeholder="EMP001"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            style={inputStyle}
          />
        </div>
        <button onClick={handleExport} disabled={loading} style={buttonStyle}>
          {loading ? 'Exporting...' : 'Export to CSV'}
        </button>
        <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
          The report will be downloaded as a CSV file containing all attendance records for the selected date range.
        </p>
      </div>
    </Layout>
  );
};

export default Reports;

