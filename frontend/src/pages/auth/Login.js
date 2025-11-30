import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { LockClosedIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: ${theme.spacing[6]};
  background: linear-gradient(135deg, ${theme.colors.gray[50]} 0%, ${theme.colors.gray[100]} 100%);
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[8]};
  
  h1 {
    color: ${theme.colors.primary};
    font-size: ${theme.fontSize['3xl']};
    font-weight: 700;
    margin-bottom: ${theme.spacing[2]};
  }
  
  p {
    color: ${theme.colors.gray[600]};
    font-size: ${theme.fontSize.lg};
  }
`;

const StyledForm = styled.form`
  width: 100%;
  max-width: 420px;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[6]};
  
  h2 {
    color: ${theme.colors.gray[800]};
    margin-bottom: ${theme.spacing[2]};
  }
  
  p {
    color: ${theme.colors.gray[600]};
    font-size: ${theme.fontSize.sm};
  }
`;

const FormFooter = styled.div`
  text-align: center;
  margin-top: ${theme.spacing[4]};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.gray[600]};
  
  a {
    color: ${theme.colors.primary};
    font-weight: 500;
    margin-left: ${theme.spacing[1]};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${theme.colors.primary}10;
  color: ${theme.colors.primary};
  margin: 0 auto ${theme.spacing[4]};
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    await dispatch(login({ email, password }));
  };

  return (
    <LoginContainer>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <Logo>
          <h1>EAS</h1>
          <p>Employee Attendance System</p>
        </Logo>
        
        <Card>
          <Card.Body>
            <FormHeader>
              <IconWrapper>
                <LockClosedIcon />
              </IconWrapper>
              <h2>Welcome back</h2>
              <p>Enter your credentials to access your account</p>
            </FormHeader>
            
            <StyledForm onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  backgroundColor: `${theme.colors.danger}10`,
                  color: theme.colors.danger,
                  padding: theme.spacing[3],
                  borderRadius: theme.borderRadius.md,
                  marginBottom: theme.spacing[4],
                  fontSize: theme.fontSize.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2]
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {error}
                </div>
              )}
              
              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
              
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
              />
              
              <div style={{ marginTop: theme.spacing[6] }}>
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg"
                  fullWidth
                  disabled={loading || !email || !password}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
              
              <FormFooter>
                Don't have an account? <Link to="/register">Sign up</Link>
              </FormFooter>
            </StyledForm>
          </Card.Body>
        </Card>
        
        <div style={{
          marginTop: theme.spacing[6],
          textAlign: 'center',
          fontSize: theme.fontSize.sm,
          color: theme.colors.gray[600]
        }}>
          © {new Date().getFullYear()} Employee Attendance System. All rights reserved.
        </div>
      </div>
    </LoginContainer>
  );
};

export default Login;

