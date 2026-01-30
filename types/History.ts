export interface History {
  id: string;
  username: string;
  storeId: string;
  ip: string;
  status: string;
  loginDate: string;
}
  
export interface PageRequestDTO {
  page: number;
  size: number;
}

export interface HistoryListResponse {
  dtoList: History[];
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
