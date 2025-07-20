export interface Payment {
  id: number;
  userId: string; 
  productCode: string;
  productPeriod: string;
  amount: number;
  status: string;
  paymentKey: string;
  paidAt: string;
  createdAt: string;
  startDate: string;
  endDate: string;
}
  
export interface PageRequestDTO {
  page: number;
  size: number;
}

export interface PaymentListResponse {
  dtoList: Payment[];
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
