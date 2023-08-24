import { css } from '@emotion/react';

export const globalCss = css`
  :root {
    --max-width: 1100px;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --foreground-rgb: 255, 255, 255;
      --background-start-rgb: 0, 0, 0;
      --background-end-rgb: 0, 0, 0;
    }
    html {
      color-scheme: dark;
    }
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
`;
