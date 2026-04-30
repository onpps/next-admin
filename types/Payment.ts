export interface Payment {
  id: number;
  paymentId: string;
  userId: string; 
  productCode: string;
  productPeriod: string;
  amount: number;
  status: string;
  paymentKey: string;
  receiptUrl: string;
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
