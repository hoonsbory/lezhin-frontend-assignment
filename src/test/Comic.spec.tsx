/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import ComicsContainer from '@components/ComicsContainer';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import dramaComicDatas from '@pages/datas/drama/dramaComicDatas';
import { ReactNode } from 'react';

type mockIntersectionObserver = [{ isIntersecting: boolean }];
type mockIntersectionObserverCallback = ([{ isIntersecting }]: mockIntersectionObserver) => void;
let observerCallback: mockIntersectionObserverCallback;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const server = setupServer(
  rest.get('/api/comics/drama', (req, res, ctx) => {
    const page = req.url.searchParams.get('page');
    return res(ctx.json(dramaComicDatas[Number(page) - 1]));
  }),
);

beforeAll(() => {
  server.listen();
});
beforeEach(async () => {
  window.IntersectionObserver = jest.fn().mockImplementation(callback => {
    observerCallback = callback;
    return {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
  });
  await act(async () => render(<ComicsContainer genre="drama" />, { wrapper }));
});
afterAll(() => server.close());

const simulateScrollEvent = async (times: number) => {
  for (let i = 0; i < times; i++) {
    await act(async () => observerCallback([{ isIntersecting: true }]));
  }
};

export default wrapper;

describe('메인페이지 테스트', () => {
  test('스크롤이 끝까지 내려가면 다음페이지를 렌더링한다.', async () => {
    const scrollTimes = 4;
    const pageComics = dramaComicDatas[scrollTimes].data.comicRankList;
    expect(global.IntersectionObserver).toHaveBeenCalled();
    await simulateScrollEvent(scrollTimes);
    for (const comic of pageComics) {
      const elem = await screen.findByTestId(comic.id);
      expect(elem.textContent).toBe(comic.title);
    }
  });

  test('페이지가 처음 로딩되면 1페이지를 렌더링한다', async () => {
    const pageComics = dramaComicDatas[0].data.comicRankList;
    for (const comic of pageComics) {
      const elem = await screen.findByTestId(comic.id);
      expect(elem.textContent).toBe(comic.title);
    }
  });

  test('연재중 필터가 클릭되면 완결 웹툰은 렌더링 되지 않는다', async () => {
    const button = screen.getByText('연재중');
    fireEvent.click(button);
    const completedElements = screen.getAllByText(/완결/).filter(i => i.tagName !== 'BUTTON');
    expect(completedElements.length).toBe(0);
  });

  test('완결 필터가 클릭되면 연재중 웹툰은 렌더링 되지 않는다', async () => {
    const button = screen.getAllByText('완결').find(i => i.tagName === 'BUTTON');
    fireEvent.click(button!);
    const completedElements = screen.getAllByText(/연재/).filter(i => i.tagName !== 'BUTTON');
    expect(completedElements.length).toBe(0);
  });

  test('무료회차 3회 필터가 클릭되면 무료회차가 3회 이상인 웹툰만 렌더링된다', async () => {
    const button = screen.getByText(/무료회차/);
    fireEvent.click(button!);
    const completedElements = screen
      .getAllByText(/무료/)
      .filter(i => i.tagName !== 'BUTTON')
      .map(i => i.textContent?.split(' ')[0].split('화')[0]);
    completedElements.forEach(i => expect(Number(i) >= 3).toBeTruthy());
  });

  test('단행본 필터가 클릭되면 단행본인 웹툰만 렌더링된다', async () => {
    const button = screen.getByText(/단행본/);
    const shortComics = dramaComicDatas[0].data.comicRankList.filter(i => i.isPrint);
    fireEvent.click(button!);
    for (const comic of shortComics) {
      const elem = await screen.findByTestId(comic.id);
      expect(elem.textContent).toBe(comic.title);
    }
  });
});
