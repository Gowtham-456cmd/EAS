import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: inline-block;
  width: ${({ size }) => size || '20px'};
  height: ${({ size }) => size || '20px'};
  border: 2px solid ${({ color }) => color || theme.colors.gray[200]};
  border-top: 2px solid ${({ color }) => color || theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ padding }) => padding || theme.spacing[8]};
  width: 100%;
  text-align: center;
  
  p {
    margin-top: ${theme.spacing[2]};
    color: ${theme.colors.gray[600]};
    font-size: ${theme.fontSize.sm};
  }
`;

const LoadingSpinner = ({
  size,
  color,
  message,
  fullPage = false,
  padding,
  className,
}) => {
  if (fullPage) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1000,
        }}
        className={className}
      >
        <LoadingContainer padding={padding}>
          <SpinnerContainer size={size} color={color} />
          {message && <p>{message}</p>}
        </LoadingContainer>
      </div>
    );
  }

  return (
    <LoadingContainer padding={padding} className={className}>
      <SpinnerContainer size={size} color={color} />
      {message && <p>{message}</p>}
    </LoadingContainer>
  );
};

export default LoadingSpinner;
