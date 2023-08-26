import { css } from '@emotion/react';
import { genreType } from '@pages/ranking';
import { defaultBtnCss } from '@styles/commonStyles';
import Link from 'next/link';

const genreKo = {
  romance: '로맨스',
  drama: '드라마',
};

const headerCss = css`
  display: grid;
  grid-template-columns: 60% 40%;
  align-items: center;
  a {
    margin-right: 5px;
    ${defaultBtnCss}
    color: white;
    background-color: var(--defaultButtonSelectedColor);
    padding: 5px 10px;
    @media (hover: hover) {
      :hover {
        background-color: #eb0026ad;
      }
    }
  }
`;

const Header = ({ genre }: { genre: genreType }) => {
  return (
    <header css={headerCss}>
      <h1>{genreKo[genre]} 장르 랭킹</h1>
      <nav>
        <Link href={'/ranking?genre=romance'}>로맨스</Link>
        <Link href={'/ranking?genre=drama'}>드라마</Link>
      </nav>
    </header>
  );
};

export default Header;
