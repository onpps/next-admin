export interface Member {
  id: string; 
  email: string;
  nickname: string;
  name: string;
  storeName: string;
  zonecode: string;
  address1: string;
  address2: string;
  phone: string;
  social: boolean;
  numberOfSongRequests: number;
  useYn: string | null;
  joinDate: string;
}
  
export interface PageRequestDTO {
  page: number;
  size: number;
}

export interface MemberListResponse {
  dtoList: Member[];
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
