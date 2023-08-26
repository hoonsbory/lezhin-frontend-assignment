import axios from 'axios';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { ComicRankApiSuccessResponse, ComicRankItem } from '../interfaces/comicsInterface';
import { css } from '@emotion/react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import FilterBox from '@components/FilterBox';
import ComicBox from '@components/ComicBox';
import ComicSkeleton from '@components/ComicSkeleton';
import { genreType } from '@pages/ranking';
import { filterBtnsInfoType, filterType } from '../interfaces/filterInterface';

export const fetchComics = async (
  page: number,
  genre: genreType,
): Promise<ComicRankApiSuccessResponse> => {
  const res = await axios.get<ComicRankApiSuccessResponse>(`./api/comics/${genre}`, {
    params: {
      page: page,
    },
  });
  res.data.data.page = page;

  return res.data;
};

const ComicsContainer = ({ genre }: { genre: genreType }) => {
  const targetRef = useRef<HTMLUListElement | null>(null);
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

  const { entry, setTarget } = useIntersectionObserver({ threshold: 0.1 });
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

  const queryOptions = {
    queryKey: 'fetchComics',
    queryFn: ({ pageParam = 1 }) => fetchComics(pageParam, genre),
    getNextPageParam: (lastpage: ComicRankApiSuccessResponse) => {
      if (lastpage.data.hasNext) return lastpage.data.page! + 1;
      return;
    },
    enabled: genre !== undefined,
  };

  const { data, fetchNextPage, isFetching, hasNextPage, refetch, remove } =
    useInfiniteQuery(queryOptions);

  const filterFetchedData = () => {
    const selectedFilters = (Object.keys(filterBtnsInfo) as filterType[]).filter(
      key => filterBtnsInfo[key].isSelected,
    );
    const currentCmoicData = data!.pages[data!.pages.length - 1].data;
    const filteredComics = currentCmoicData.comicRankList.filter(data =>
      selectedFilters.every(key => filterfunc[key](data)),
    );
    if (filteredComics.length === 0 && hasNextPage) {
      fetchNextPage();
      return;
    }
    setComics(comics => [
      ...comics,
      { data: { ...currentCmoicData, comicRankList: filteredComics } },
    ]);
  };

  useLayoutEffect(() => {
    if (data) filterFetchedData();
  }, [data]);

  useEffect(() => {
    if (!comics) return;
    setComics([]);
    remove();
    refetch();
  }, [genre]);

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
  }, [filterBtnsInfo]);

  useEffect(() => {
    if (comics && targetRef.current) setTarget(targetRef.current.lastElementChild!);
  }, [comics]);

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage();
  }, [entry]);

  return (
    <>
      <FilterBox filterBtnsInfo={filterBtnsInfo} selectFilter={selectFilter} />

      <ul ref={targetRef} css={css``}>
        {comics.map(({ data }) =>
          data.comicRankList.map(comic => <ComicBox key={comic.id} {...comic} />),
        )}
      </ul>
      {isFetching &&
        Array(5)
          .fill(0)
          .map((_, idx) => <ComicSkeleton key={idx} />)}
      {data && !hasNextPage && <h2>마지막 페이지입니다.</h2>}
    </>
  );
};

export default ComicsContainer;
