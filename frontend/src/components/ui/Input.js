import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const InputWrapper = styled.div`
  margin-bottom: ${({ noMargin }) => (noMargin ? '0' : theme.spacing[4])};
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing[1]};
  font-weight: 500;
  color: ${theme.colors.gray[700]};
  font-size: ${theme.fontSize.sm};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 1px solid ${({ error }) => (error ? theme.colors.danger : theme.colors.gray[300])};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.base};
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  line-height: 1.5;
  color: ${theme.colors.gray[900]};
  background-color: ${theme.colors.white};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 0.2rem ${theme.colors.primary}40;
  }
  
  &::placeholder {
    color: ${theme.colors.gray[500]};
    opacity: 1;
  }
  
  &:disabled {
    background-color: ${theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  display: block;
  margin-top: ${theme.spacing[1]};
  color: ${theme.colors.danger};
  font-size: ${theme.fontSize.sm};
  min-height: 1.25rem;
`;

const Input = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  noMargin = false,
  ...props
}) => {
  return (
    <InputWrapper className={className} noMargin={noMargin}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span style={{ color: theme.colors.danger }}> *</span>}
        </Label>
      )}
      <StyledInput
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={!!error}
        {...props}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};

export default Input;
