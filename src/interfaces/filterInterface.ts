export type filterType = 'scheduled' | 'completed' | 'free' | 'isPrint';
export interface IbtnInfo {
  text: string;
  isSelected: boolean;
}
export type filterBtnsInfoType = {
  [key in filterType]: IbtnInfo;
};
export interface IfilterBtns {
  filterBtnsInfo: filterBtnsInfoType;
  selectFilter: (filterType: filterType) => void;
}
