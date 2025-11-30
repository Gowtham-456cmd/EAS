import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const CardContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid ${theme.colors.gray[200]};
  
  &:hover {
    box-shadow: ${theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.gray[200]};
  background-color: ${theme.colors.gray[50]};
  
  h2, h3, h4 {
    margin: 0;
    color: ${theme.colors.gray[800]};
  }
`;

const CardBody = styled.div`
  padding: ${theme.spacing[6]};
  
  & > *:last-child {
    margin-bottom: 0;
  }
`;

const CardFooter = styled.div`
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.gray[200]};
  background-color: ${theme.colors.gray[50]};
  display: flex;
  justify-content: ${props => props.justify || 'flex-end'};
  gap: ${theme.spacing[2]};
`;

const Card = ({ children, className = '' }) => {
  return (
    <CardContainer className={className}>
      {children}
    </CardContainer>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
