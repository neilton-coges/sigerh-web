import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body, #root {
    height: 100%;
    background: #f0f2f5;
  }

  .ant-page-header {
    padding-top: 0;
    padding-left: 0;
    padding-right: 0;
  }

  .ant-page-header-heading {
    align-items: center;
  }

  .ant-page-header-heading-left {
    flex-direction: column;
    align-items: flex-start;
  }
`;
