import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[900]};
    line-height: 1.5;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: ${theme.colors.secondary};
      text-decoration: underline;
    }
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: 1rem;
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
    outline: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 0.5em;
  }

  h1 { font-size: ${theme.fontSize['4xl']}; }
  h2 { font-size: ${theme.fontSize['3xl']}; }
  h3 { font-size: ${theme.fontSize['2xl']}; }
  h4 { font-size: ${theme.fontSize.xl}; }
  h5 { font-size: ${theme.fontSize.lg}; }
  h6 { font-size: ${theme.fontSize.base}; }

  p {
    margin-bottom: 1rem;
  }

  ul, ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
`;
