import { css } from '@emotion/react';

export const globalCss = css`
  :root {
    --thumbnailSize: 130px;
    --defaultBlack: #101010;
    --defaultButtonBgColor: #eff1f4;
    --defaultButtonSelectedColor: #eb0026;
    --defaultButtonHoverBgColor: #dbdee3;
    --defaultGray: #454c55;
    --defaultSkeletonColor: #f3f5f8;
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
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    color: var(--defaultBlack);
  }
  body {
    overflow-y: scroll;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
`;
