export interface Music {
  videoId: string; 
  streamUrl: string;
  title: string;
  author: string;
  thumbUrl: string;
  word: string;
  description: string;
  date: string;
  regDate: string;
  useYn: string | null;
}

export interface MusicItem {
  mno: string;
  id: string;
  videoId: string; 
  streamUrl: string;
  title: string;
  author: string;
  imageFile: string;
  playYn: string;
  cancelYn: string;
  word: string;
  sort: string;
  regDate: string;
}
  
export interface PageRequestDTO {
  page: number;
  size: number;
}

export interface MusicListResponse {
  dtoList: Music[];
  pageNumList: number[];
  pageRequestDTO: PageRequestDTO;
  prev: boolean;
  next: boolean;
  totalCount: number;
  prevPage: number;
  nextPage: number;
  totalPage: number;
  current: number;
}

export interface PlayListResponse {
  dtoList: MusicItem[];
  pageNumList: number[];
  pageRequestDTO: PageRequestDTO;
  prev: boolean;
  next: boolean;
  totalCount: number;
  prevPage: number;
  nextPage: number;
  totalPage: number;
  current: number;
}