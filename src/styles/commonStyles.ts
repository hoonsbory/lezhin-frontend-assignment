import { css } from '@emotion/react';

export const defaultBtnCss = css`
  outline: none;
  border: none;
  padding: 10px 20px;
  border-radius: 7px;
  cursor: pointer;
  background-color: var(--defaultButtonBgColor);
  transition: background-color 0.2s;
  @media (hover: hover) {
    :hover {
      background-color: var(--defaultButtonHoverBgColor);
    }
  }
`;
