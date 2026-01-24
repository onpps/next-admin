export interface PlayList {
  mno: number;
  id: number; 
  title: string;
  author: string;
  playYn: string;
  cancelYn : string;
}


export interface DashboardListResponse {
  playList: PlayList[];
}

 