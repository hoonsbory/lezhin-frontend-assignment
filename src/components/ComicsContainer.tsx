import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { ComicRankApiSuccessResponse, ComicRankItem } from '../pages/datas/interfaces/webtoonDatas';
import { css } from '@emotion/react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { useRouter } from 'next/router';
import FilterBox from '@components/FilterBox';

type genreType = 'romance' | 'drama';
export type filterType = 'scheduled' | 'completed' | 'free' | 'isPrint';
export interface IbtnInfo {
  text: string;
  isSelected: boolean;
}
type filterBtnsInfoType = {
  [key in filterType]: IbtnInfo;
};

export interface IfilterBtns {
  filterBtnsInfo: filterBtnsInfoType;
  selectFilter: (filterType: filterType) => void;
}

const ComicsContainer = () => {
  const router = useRouter();
  const { genre } = router.query;
  const page = useRef(1);
  const ref = useRef<HTMLDivElement | null>(null);
  const [comics, setComics] = useState<ComicRankApiSuccessResponse[]>([]);
  const [filterBtnsInfo, setFileterBtnsInfo] = useState<filterBtnsInfoType>({
    scheduled: {
      isSelected: false,
      text: '연재중',
    },
    completed: {
      isSelected: false,
      text: '완결',
    },
    free: {
      isSelected: false,
      text: '무료회차 3개 ▲',
    },
    isPrint: {
      isSelected: false,
      text: '단행본',
    },
  });
  const filterfunc: { [key in filterType]: (data: ComicRankItem) => void } = {
    completed: data => data.contentsState === 'completed',
    scheduled: data => data.contentsState === 'scheduled',
    free: data => data.freedEpisodeSize >= 3,
    isPrint: data => data.isPrint,
  };
  const selectFilter = (filterType: filterType) => {
    setFileterBtnsInfo(btn => {
      if (filterType === 'completed' && btn.scheduled.isSelected) btn.scheduled.isSelected = false;
      if (filterType === 'scheduled' && btn.completed.isSelected) btn.completed.isSelected = false;
      btn[filterType].isSelected = !btn[filterType].isSelected;

      return { ...btn };
    });
  };
  const { entry, setTarget } = useIntersectionObserver({});
  const fetchComics = async (
    page: number,
    genre: genreType,
  ): Promise<ComicRankApiSuccessResponse> => {
    const res = await axios.get<ComicRankApiSuccessResponse>(`./api/comics/${genre}`, {
      params: {
        page: page,
      },
    });
    return res.data;
  };

  const getCorrectGenre = (genre: string): genreType => {
    if (genre === 'romance' || genre === 'drama') return genre;
    router.push('/ranking?genre=romance', undefined, { shallow: true });
    return 'romance';
  };

  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: 'fetchComics',
    queryFn: ({ pageParam = page.current }) =>
      fetchComics(pageParam, getCorrectGenre(genre as string)),
    getNextPageParam: lastpage => {
      if (lastpage.data.hasNext) return page.current;
      return;
    },
    enabled: router.isReady,
  });

  useEffect(() => {
    if (!data) return;
    const selectedFilters = (Object.keys(filterBtnsInfo) as filterType[]).filter(
      key => filterBtnsInfo[key].isSelected,
    );
    setComics(
      data.pages.map(comic => {
        return {
          data: {
            ...comic.data,
            comicRankList: comic.data.comicRankList.filter(data =>
              selectedFilters.every(key => filterfunc[key](data)),
            ),
          },
        };
      }),
    );
  }, [data, filterBtnsInfo]);

  useEffect(() => {
    if (comics && ref.current) setTarget(ref.current.lastElementChild!);
  }, [comics]);

  useEffect(() => {
    if (entry?.isIntersecting) {
      page.current += 1;
      fetchNextPage();
    }
  }, [entry]);

  return (
    <>
      <FilterBox filterBtnsInfo={filterBtnsInfo} selectFilter={selectFilter} />

      <div ref={ref}>
        {comics.map(
          i =>
            i.data?.comicRankList.map((j, idx) => (
              <div
                key={idx}
                css={css`
                  width: 400px;
                  height: 200px;
                `}
              >
                {j.title}
              </div>
            )),
        )}
      </div>
      {isFetching && <div>로딩중</div>}
    </>
  );
};

export default ComicsContainer;
