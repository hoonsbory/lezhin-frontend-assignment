import { css } from '@emotion/react';
import { defaultBtnCss } from '@styles/commonStyles';
import { IbtnInfo, IfilterBtns, filterType } from '../interfaces/filterInterface';
import React from 'react';

const buttonCss = (isSelected: boolean) => css`
  ${defaultBtnCss}
  background-color: var(--${isSelected ? 'defaultButtonSelectedColor' : 'defaultButtonBgColor'});
  color: ${isSelected ? '#fff' : '#101010'};
  @media (hover: hover) {
    :hover {
      background-color: var(
        --${isSelected ? 'defaultButtonSelectedColor' : 'defaultButtonHoverBgColor'}
      );
    }
  }
`;

const filterBoxCss = css`
  display: grid;
  grid-template-columns: 90px 90px 160px 90px;
  grid-column-gap: 10px;
  margin-bottom: 20px;
`;

const FilterBox = ({ filterBtnsInfo, selectFilter }: IfilterBtns) => {
  return (
    <div css={filterBoxCss}>
      {(Object.entries(filterBtnsInfo) as [filterType, IbtnInfo][]).map(([key, value]) => (
        <button
          css={buttonCss(value.isSelected)}
          key={key}
          name={key}
          onClick={() => selectFilter(key)}
        >
          {value.text}
        </button>
      ))}
    </div>
  );
};

export default React.memo(FilterBox);
