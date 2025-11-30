import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ClockIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import { checkIn, checkOut, fetchTodayStatus } from '../../store/slices/attendanceSlice';
import { theme } from '../../styles/theme';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const MarkAttendance = () => {
  const dispatch = useDispatch();
  const { todayStatus, loading, error } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchTodayStatus());
  }, [dispatch]);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckIn = async () => {
    setIsLoading(true);
    const result = await dispatch(checkIn());
    setIsLoading(false);
    if (result.payload?.success) {
      // Show success message or notification
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    const result = await dispatch(checkOut());
    setIsLoading(false);
    if (result.payload?.success) {
      // Show success message or notification
    }
  };

  const getStatusColor = () => {
    if (todayStatus?.status === 'late') return theme.colors.warning;
    if (todayStatus?.status === 'present') return theme.colors.success;
    return theme.colors.gray[500];
  };

  return (
    <Layout role="employee">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: theme.spacing[6],
        cursor: 'pointer',
        color: theme.colors.primary,
        width: 'fit-content'
      }} onClick={() => navigate(-1)}>
        <ArrowLeftIcon style={{ width: 20, height: 20, marginRight: theme.spacing[2] }} />
        <span>Back to Dashboard</span>
      </div>

      <h1 style={{ 
        color: theme.colors.gray[900],
        fontSize: theme.fontSize['2xl'],
        fontWeight: 600,
        marginBottom: theme.spacing[6]
      }}>
        Mark Attendance
      </h1>

      {error && (
        <div style={{
          backgroundColor: `${theme.colors.danger}10`,
          color: theme.colors.danger,
          padding: theme.spacing[3],
          borderRadius: theme.borderRadius.md,
          marginBottom: theme.spacing[4],
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[2]
        }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      
      <Card style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Card.Body>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: theme.spacing[4],
            paddingBottom: theme.spacing[4],
            borderBottom: `1px solid ${theme.colors.gray[200]}`
          }}>
            <h2 style={{
              margin: 0,
              color: theme.colors.gray[800],
              fontSize: theme.fontSize.xl,
              fontWeight: 600
            }}>
              Today's Attendance
            </h2>
            <div style={{
              padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
              borderRadius: theme.borderRadius.full,
              backgroundColor: `${getStatusColor()}20`,
              color: getStatusColor(),
              fontSize: theme.fontSize.sm,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[1]
            }}>
              <ClockIcon style={{ width: 16, height: 16 }} />
              {todayStatus?.status ? todayStatus.status.charAt(0).toUpperCase() + todayStatus.status.slice(1) : 'Not Checked In'}
            </div>
          </div>

          <div style={{ 
            display: 'grid',
            gap: theme.spacing[4],
            marginBottom: theme.spacing[6]
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: theme.spacing[4]
            }}>
              {todayStatus?.checkInTime && (
                <div>
                  <div style={{
                    color: theme.colors.gray[600],
                    fontSize: theme.fontSize.sm,
                    marginBottom: theme.spacing[1]
                  }}>
                    Check In
                  </div>
                  <div style={{
                    fontWeight: 500,
                    color: theme.colors.gray[900],
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[2]
                  }}>
                    <ClockIcon style={{ width: 18, height: 18, color: theme.colors.gray[500] }} />
                    {new Date(todayStatus.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}

              {todayStatus?.checkOutTime ? (
                <div>
                  <div style={{
                    color: theme.colors.gray[600],
                    fontSize: theme.fontSize.sm,
                    marginBottom: theme.spacing[1]
                  }}>
                    Check Out
                  </div>
                  <div style={{
                    fontWeight: 500,
                    color: theme.colors.gray[900],
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[2]
                  }}>
                    <ClockIcon style={{ width: 18, height: 18, color: theme.colors.gray[500] }} />
                    {new Date(todayStatus.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ) : todayStatus?.checkedIn && (
                <div>
                  <div style={{
                    color: theme.colors.gray[600],
                    fontSize: theme.fontSize.sm,
                    marginBottom: theme.spacing[1]
                  }}>
                    Working Hours
                  </div>
                  <div style={{
                    fontWeight: 500,
                    color: theme.colors.gray[900]
                  }}>
                    In progress...
                  </div>
                </div>
              )}
            </div>

            {todayStatus?.totalHours && (
              <div style={{
                backgroundColor: theme.colors.gray[50],
                padding: theme.spacing[3],
                borderRadius: theme.borderRadius.md,
                textAlign: 'center'
              }}>
                <div style={{
                  color: theme.colors.gray[600],
                  fontSize: theme.fontSize.sm,
                  marginBottom: theme.spacing[1]
                }}>
                  Total Hours Today
                </div>
                <div style={{
                  fontSize: theme.fontSize['2xl'],
                  fontWeight: 600,
                  color: theme.colors.primary
                }}>
                  {todayStatus.totalHours} hours
                </div>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing[3]
          }}>
            {!todayStatus?.checkedIn ? (
              <Button 
                variant="primary"
                size="lg"
                onClick={handleCheckIn}
                disabled={loading || isLoading}
                fullWidth
                style={{
                  padding: theme.spacing[3],
                  fontSize: theme.fontSize.lg
                }}
              >
                {isLoading ? 'Processing...' : 'Check In Now'}
              </Button>
            ) : !todayStatus?.checkedOut ? (
              <Button 
                variant="danger"
                size="lg"
                onClick={handleCheckOut}
                disabled={loading || isLoading}
                fullWidth
                style={{
                  padding: theme.spacing[3],
                  fontSize: theme.fontSize.lg
                }}
              >
                {isLoading ? 'Processing...' : 'Check Out Now'}
              </Button>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: theme.spacing[4],
                backgroundColor: `${theme.colors.success}10`,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.success,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: theme.spacing[2]
              }}>
                <CheckCircleIcon style={{ width: 32, height: 32 }} />
                <div style={{ fontWeight: 500 }}>Attendance completed for today</div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default MarkAttendance;

