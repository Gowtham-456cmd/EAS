import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { register } from '../../store/slices/authSlice';
import { theme } from '../../styles/theme';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: ${theme.spacing[6]};
  background: linear-gradient(135deg, ${theme.colors.gray[50]} 0%, ${theme.colors.gray[100]} 100%);
`;

const StyledForm = styled.form`
  width: 100%;
  max-width: 480px;
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

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    employeeId: '',
    department: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (result.payload?.success) {
      const userRole = formData.role;
      navigate(userRole === 'manager' ? '/manager/dashboard' : '/employee/dashboard');
    }
  };

  return (
    <RegisterContainer>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <Card>
          <Card.Body>
            <FormHeader>
              <h2>Create an account</h2>
              <p>Fill in the details to register as an employee or manager</p>
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
                }}>
                  {error}
                </div>
              )}

              <Input
                type="text"
                label="Full Name"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                disabled={loading}
              />

              <Input
                type="password"
                label="Password"
                placeholder="Create a password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                disabled={loading}
              />

              <div style={{ display: 'flex', gap: theme.spacing[4], marginTop: theme.spacing[3] }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: theme.spacing[1],
                    fontWeight: 500,
                    color: theme.colors.gray[700],
                    fontSize: theme.fontSize.sm,
                  }}>
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                      border: `1px solid ${theme.colors.gray[300]}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.fontSize.sm,
                    }}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <Input
                    type="text"
                    label={formData.role === 'manager' ? 'Manager ID (optional)' : 'Employee ID (optional)'}
                    placeholder={formData.role === 'manager'
                      ? 'Leave empty to auto-generate (MGR001, MGR002, ...)' 
                      : 'Leave empty to auto-generate (EMP001, EMP002, ...)'}
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div style={{ marginTop: theme.spacing[3] }}>
                <Input
                  type="text"
                  label="Department"
                  placeholder="Enter department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div style={{ marginTop: theme.spacing[5] }}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </div>

              <FormFooter>
                Already have an account?
                <Link to="/login">Login</Link>
              </FormFooter>
            </StyledForm>
          </Card.Body>
        </Card>
      </div>
    </RegisterContainer>
  );
};

export default Register;

