import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  padding: ${({ size }) => 
    size === 'sm' ? '0.4rem 0.8rem' : 
    size === 'lg' ? '0.8rem 1.6rem' : 
    '0.6rem 1.2rem'};
  border-radius: ${theme.borderRadius.md};
  font-size: ${({ size }) => 
    size === 'sm' ? theme.fontSize.sm : 
    size === 'lg' ? theme.fontSize.base : 
    theme.fontSize.sm};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid transparent;
  line-height: 1.5;
  
  ${({ variant, disabled }) => {
    if (disabled) {
      return `
        background-color: ${theme.colors.gray[300]};
        color: ${theme.colors.gray[500]};
        cursor: not-allowed;
        opacity: 0.7;
      `;
    }
    
    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          color: white;
          &:hover {
            background-color: ${theme.colors.secondary};
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          border: 1px solid ${theme.colors.primary};
          color: ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.primary}10;
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.danger};
          color: white;
          &:hover {
            background-color: #e60000;
          }
        `;
      case 'success':
        return `
          background-color: ${theme.colors.success};
          color: white;
          &:hover {
            background-color: #3da53d;
          }
        `;
      default:
        return `
          background-color: ${theme.colors.gray[200]};
          color: ${theme.colors.gray[800]};
          &:hover {
            background-color: ${theme.colors.gray[300]};
          }
        `;
    }
  }}
`;

const Button = ({
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
