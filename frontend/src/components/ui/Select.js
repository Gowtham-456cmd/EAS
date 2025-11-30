import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const SelectWrapper = styled.div`
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

const StyledSelect = styled.select`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 1px solid ${({ error }) => (error ? theme.colors.danger : theme.colors.gray[300])};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.base};
  line-height: 1.5;
  color: ${theme.colors.gray[900]};
  background-color: ${theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
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

const Select = ({
  label,
  id,
  options = [],
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  noMargin = false,
  placeholder = 'Select an option',
  ...props
}) => {
  return (
    <SelectWrapper className={className} noMargin={noMargin}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span style={{ color: theme.colors.danger }}> *</span>}
        </Label>
      )}
      <StyledSelect
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={!!error}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SelectWrapper>
  );
};

export default Select;
