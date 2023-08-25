import { IbtnInfo, IfilterBtns, filterType } from '@components/ComicsContainer';
import { css } from '@emotion/react';

const buttonCss = (isSelected: boolean) => css`
  color: ${isSelected ? 'white' : 'black'};
`;

const FilterBox = ({ filterBtnsInfo, selectFilter }: IfilterBtns) => {
  return (
    <div>
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

export default FilterBox;
