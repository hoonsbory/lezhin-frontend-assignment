// 연재 요일
type Period = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
// 작가 롤
type ArtistRole = 'writer' | 'painter' | 'scripter' | 'original' | 'publisher' | 'label';
interface Artist {
  name: string; // 작가 필명
  role: ArtistRole; // 작가 롤
  id: string; // 작가 id
  email?: string | null;
}
export interface ComicRankItem {
  id: number; // 작품 id
  alias: string; // 작품 별칭
  title: string; // 작품 타이틀
  artists: Artist[]; // 작가 정보
  schedule: {
    periods: Period[]; // 연재 요일
    anchor: number;
  };
  badges?: string;
  thumbnailSrc: string;
  genres: string[]; // 작품 장르
  freedEpisodeSize: number; // 무료회차 수
  contentsState: 'scheduled' | 'completed'; // 연재, 완결 값
  currentRank: number; // 현재 랭킹
  previousRank: number; // 이전 랭킹
  updatedAt: number; // 업데이트 일자
  isPrint: boolean; // 단행본 여부
}
export interface ComicRankApiSuccessResponse {
  data: {
    page?: number;
    count: number; // 아이템 전체 카운트
    hasNext: boolean; // 다음 page 존재 여부
    comicRankList: ComicRankItem[]; // 아이템 리스트
  };
}
export interface ComicRankApiFailResponse {
  error: string; // 에러 메세지
}

export type genreType = 'romance' | 'drama';
