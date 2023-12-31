import { css } from '@emotion/react';
import { ComicRankItem } from '../interfaces/comicsInterface';
import Image from 'next/image';
import React from 'react';

const comicBoxCss = css`
  list-style: none;
  display: grid;
  grid-template-columns: var(--thumbnailSize) calc(100% - var(--thumbnailSize));
  column-gap: 10px;
  margin-bottom: 15px;
`;

const imageWrapperCss = css`
  display: block;
  width: var(--thumbnailSize);
  height: var(--thumbnailSize);
  position: relative;
`;

const textWrapperCss = css`
  display: grid;
  grid-template-columns: 17% 83%;
  padding-top: 10px;
`;

const rankingWrapperCss = css`
  strong {
    font-size: 25px;
  }
`;

const infoWrapperCss = css`
  h3 {
    margin-bottom: 10px;
  }
  p {
    color: var(--defaultGray);
    margin-bottom: 5px;
  }
`;

const dayKo = {
  MON: '월요일',
  TUE: '화요일',
  WED: '수요일',
  THU: '목요일',
  FRI: '금요일',
  SAT: '토요일',
  SUN: '일요일',
};

//렌더링할 아티스트 종류
const exposeArtist = ['writer', 'painter', 'scripter'];

const ComicBox = ({
  thumbnailSrc,
  currentRank,
  previousRank,
  artists,
  title,
  schedule,
  freedEpisodeSize,
  contentsState,
  id,
}: ComicRankItem) => {
  //순위 등락 계산
  const getChangedRank = (): string => {
    const result = previousRank - currentRank;
    if (result < 0) return `▼ ${result}`;
    else if (result > 0) return `▲ ${result}`;
    else return '-';
  };

  //렌더링할 아티스트 가져오기
  const getExposeArtist = () =>
    artists
      .filter(artist => exposeArtist.includes(artist.role))
      .map(artist => artist.name)
      .join(', ');

  //요일 정보 가져오기
  const getScheduleInfo = () =>
    contentsState === 'completed'
      ? '완결'
      : `매주 ${schedule.periods.map(day => dayKo[day]).join(', ')} 연재`;

  const exposedArtistsNames = getExposeArtist();
  const changedRanksString = getChangedRank();
  const scheduleInfo = getScheduleInfo();
  return (
    <li css={comicBoxCss}>
      <div css={imageWrapperCss}>
        <Image alt="웹툰 썸네일" src={thumbnailSrc} fill={true} sizes="100%" />
      </div>
      <div css={textWrapperCss}>
        <div css={rankingWrapperCss}>
          <strong>{currentRank}</strong>
          <p>{changedRanksString}</p>
        </div>
        <div css={infoWrapperCss}>
          <h3 data-testid={String(id)}>{title}</h3>
          <p>{exposedArtistsNames}</p>
          <p>{freedEpisodeSize}화 무료</p>
          <p>{scheduleInfo}</p>
        </div>
      </div>
    </li>
  );
};

export default React.memo(ComicBox);
