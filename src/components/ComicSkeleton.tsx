import { css } from '@emotion/react';
import React from 'react';

const skeletonWrapperCss = css`
  display: grid;
  grid-template-columns: var(--thumbnailSize) 30px calc(100% - var(--thumbnailSize) - 30px);
  > div {
    background-color: var(--defaultSkeletonColor);
  }
  > :first-of-type {
    height: var(--thumbnailSize);
  }
  > :nth-of-type(n + 2) {
    margin-top: 10px;
    height: 30px;
  }
  margin-bottom: 15px;
  column-gap: 10px;
`;

const ComicSkeleton = () => {
  return (
    <div css={skeletonWrapperCss}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default ComicSkeleton;
