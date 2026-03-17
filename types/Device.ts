export interface Device {
  id: string;
  storeId: string;
  tableNo: string;
  deviceName: string;
  pairCode: string;
  paired: boolean;
  numberOfSongLimit: number;
  numberOfSongRequests: number;
  useYn: string;
  regDate: string;
}
  
export interface PageRequestDTO {
  page: number;
  size: number;
}

export interface MemberListResponse {
  dtoList: Device[];
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
