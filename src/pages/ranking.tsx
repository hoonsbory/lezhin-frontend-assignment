import Head from 'next/head';
import Header from '@components/Header';
import ComicsContainer from '@components/ComicsContainer';
import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';

const mainCss = css`
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
`;

export type genreType = 'romance' | 'drama';

export default function Ranking({ genre }: { genre: genreType }) {
  return (
    <>
      <Head>
        <title>레진 코믹스</title>
        <meta property="og:url" content="https://www.lezhin.com/ko" />
        <meta property="og:site_name" content="레진코믹스" />
        <meta property="og:title" content="레진코믹스 - 솔직한 재미 대폭발" />
        <meta property="og:type" content="book" />
        <meta
          property="og:description"
          content="일상의 즐거움부터 은밀한 재미까지! 당신이 찾던 진짜 웹툰 레진코믹스."
        />
        <meta property="og:locale" content="ko_KR" />
        <meta
          property="og:image"
          content="https://ccdn.lezhin.com/files/assets/img/jaymee-sns-share.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@LezhinComics" />
        <meta name="twitter:url" content="https://www.lezhin.com/ko" />
        <meta name="twitter:title" content="레진코믹스 - 솔직한 재미 대폭발" />
        <meta
          name="twitter:description"
          content="일상의 즐거움부터 은밀한 재미까지! 당신이 찾던 진짜 웹툰 레진코믹스."
        />
        <link rel="icon" sizes="192x192" href="//ccdn.lezhin.com/files/assets/img/favicon.png" />
      </Head>
      <main css={mainCss}>
        <Header genre={genre} />
        <ComicsContainer genre={genre} />
      </main>
    </>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const getCorrectGenre = (genre: string): genreType | undefined => {
    if (genre === 'romance' || genre === 'drama') return genre;
    context.res.writeHead(302, { Location: '/' });
    context.res.end();
  };

  return { props: { genre: getCorrectGenre(context.query.genre as string) } };
}
