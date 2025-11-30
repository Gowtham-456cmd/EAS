import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, EnvelopeIcon, IdentificationIcon, BuildingOfficeIcon, ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import { theme } from '../../styles/theme';
import Card from '../../components/ui/Card';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const InfoRow = ({ icon: Icon, label, value, isLast = false }) => (
    <div style={{
      display: 'flex',
      padding: theme.spacing[4],
      borderBottom: isLast ? 'none' : `1px solid ${theme.colors.gray[200]}`,
      gap: theme.spacing[4],
      alignItems: 'flex-start'
    }}>
      <div style={{
        backgroundColor: theme.colors.primary + '10',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon style={{ width: '20px', height: '20px', color: theme.colors.primary }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          color: theme.colors.gray[500],
          fontSize: theme.fontSize.sm,
          marginBottom: theme.spacing[1]
        }}>
          {label}
        </div>
        <div style={{
          color: theme.colors.gray[900],
          fontWeight: 500,
          wordBreak: 'break-word'
        }}>
          {value || '-'}
        </div>
      </div>
    </div>
  );

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
        My Profile
      </h1>
      
      <Card style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{
          padding: theme.spacing[6],
          borderBottom: `1px solid ${theme.colors.gray[200]}`,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[4]
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: theme.colors.gray[100],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <UserCircleIcon style={{ 
              width: '100%', 
              height: '100%',
              color: theme.colors.gray[400]
            }} />
          </div>
          <div>
            <h2 style={{
              margin: 0,
              color: theme.colors.gray[900],
              fontSize: theme.fontSize.xl,
              fontWeight: 600,
              marginBottom: theme.spacing[1]
            }}>
              {user?.name || 'User Name'}
            </h2>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: theme.colors.gray[100],
              color: theme.colors.gray[600],
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              borderRadius: theme.borderRadius.full,
              fontSize: theme.fontSize.sm,
              fontWeight: 500
            }}>
              {user?.role === 'manager' ? 'Manager' : 'Employee'}
            </div>
          </div>
        </div>

        <div>
          <InfoRow 
            icon={EnvelopeIcon} 
            label="Email Address" 
            value={user?.email} 
          />
          <InfoRow 
            icon={IdentificationIcon} 
            label={user?.role === 'manager' ? 'Manager ID' : 'Employee ID'} 
            value={user?.employeeId} 
          />
          <InfoRow 
            icon={BuildingOfficeIcon} 
            label="Department" 
            value={user?.department} 
          />
          <InfoRow 
            icon={ShieldCheckIcon} 
            label="Account Type" 
            value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''} 
            isLast
          />
        </div>

      </Card>
    </Layout>
  );
};

export default Profile;

