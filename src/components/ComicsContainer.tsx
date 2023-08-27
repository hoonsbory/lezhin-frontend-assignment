import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { ComicRankApiSuccessResponse, ComicRankItem } from '../interfaces/comicsInterface';
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
  //무한스크롤을 위해 관찰할 엘리먼트
  const targetRef = useRef<HTMLUListElement | null>(null);
  //실제 렌더링 되는 웹툰 데이터
  const [comics, setComics] = useState<ComicRankApiSuccessResponse[]>([]);

  //필터 버튼 상태
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

  //옵저버 데이터
  const { entry, setTarget } = useIntersectionObserver({ threshold: 0.1 });

  //필터 조건
  const filterfunc: { [key in filterType]: (data: ComicRankItem) => void } = {
    completed: data => data.contentsState === 'completed',
    scheduled: data => data.contentsState === 'scheduled',
    free: data => data.freedEpisodeSize >= 3,
    isPrint: data => data.isPrint,
  };

  //필터 토글 이벤트 - 연재, 완결은 중복될 수 없어서 하나가 클릭되면 다른 하나는 disable
  const selectFilter = (filterType: filterType) => {
    setFileterBtnsInfo(btn => {
      if (filterType === 'completed' && btn.scheduled.isSelected) btn.scheduled.isSelected = false;
      if (filterType === 'scheduled' && btn.completed.isSelected) btn.completed.isSelected = false;
      btn[filterType].isSelected = !btn[filterType].isSelected;

      return { ...btn };
    });
  };

  //리액트 쿼리 옵션
  const queryOptions = {
    queryKey: 'fetchComics',
    queryFn: ({ pageParam = 1 }) => fetchComics(pageParam, genre),
    getNextPageParam: (lastpage: ComicRankApiSuccessResponse) => {
      if (lastpage.data.hasNext) return lastpage.data.page! + 1;
      return;
    },
    onError: ({ response }: { response: AxiosResponse }) => {
      alert(response.data.error);
      location.href = './';
    },
    enabled: genre !== undefined,
  };

  //fetch 데이터
  const {
    data: originalComics,
    fetchNextPage,
    isFetching,
    hasNextPage,
    refetch,
    remove,
  } = useInfiniteQuery(queryOptions);

  //선택된 필터 배열 리턴
  const getSelectedFilter = () => {
    return (Object.keys(filterBtnsInfo) as filterType[]).filter(
      key => filterBtnsInfo[key].isSelected,
    );
  };

  //웹툰 리스트 필터링
  const filterComics = (comics: ComicRankItem[], selectedFilters: filterType[]) =>
    comics.filter(data => selectedFilters.every(key => filterfunc[key](data)));

  //방금 페치된 데이터 필터링 래퍼
  const filterFetchedData = () => {
    const selectedFilters = getSelectedFilter();

    //방금 페치한 웹툰데이터
    const currentComicData = originalComics!.pages[originalComics!.pages.length - 1].data;
    const filteredComics = filterComics(currentComicData.comicRankList, selectedFilters);

    return { data: { ...currentComicData, comicRankList: filteredComics } };
  };

  //데이터가 페치되면 필터링
  useLayoutEffect(() => {
    if (!originalComics) return;

    const filteredComics = filterFetchedData();

    //필터링된 데이터가 1개도 없다면 다음페이지 페치
    if (filteredComics?.data.comicRankList.length === 0 && hasNextPage) fetchNextPage();
    setComics(comics => [...comics, filteredComics]);
  }, [originalComics]);

  //필터가 변경되면 전체 데이터 필터링
  useEffect(() => {
    if (!originalComics) return;
    const selectedFilters = getSelectedFilter();
    const filteredComics = originalComics.pages.map(comic => ({
      data: {
        ...comic.data,
        comicRankList: filterComics(comic.data.comicRankList, selectedFilters),
      },
    }));
    setComics(filteredComics);
  }, [filterBtnsInfo]);

  //장르가 바뀌면 쿼리 초기화
  useEffect(() => {
    if (!comics) return;
    setComics([]);
    remove();
    refetch();
  }, [genre]);

  //웹툰이 렌더링되면 마지막 웹툰 옵저버 등록
  useEffect(() => {
    if (comics && targetRef.current?.lastElementChild)
      setTarget(targetRef.current.lastElementChild!);
  }, [comics]);

  //웹툰이 viewport에 들어오면 다음페이지 페치
  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage();
  }, [entry]);

  return (
    <section>
      <FilterBox filterBtnsInfo={filterBtnsInfo} selectFilter={selectFilter} />

      <ul ref={targetRef}>
        {comics.map(({ data }) =>
          data.comicRankList.map(comic => <ComicBox key={comic.id} {...comic} />),
        )}
      </ul>
      {isFetching &&
        Array(5)
          .fill(0)
          .map((_, idx) => <ComicSkeleton key={idx} />)}
      {originalComics && !hasNextPage && <h2>마지막 페이지입니다</h2>}
    </section>
  );
};

export default ComicsContainer;
