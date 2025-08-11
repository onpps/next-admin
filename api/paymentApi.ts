import jwtAxios from "../utils/jwtUtil";
import { PaymentListResponse } from "../types/Payment";

export const API_SERVER_HOST = process.env.NEXT_PUBLIC_API_SERVER_HOST;

const host = `${API_SERVER_HOST}/api/payment`

interface PageParam {
  page: number;
  size: number;
  productCode?: string;
  userId?: string;
  status?: string;
  paymentKey?: string;
  paidAt?: string;
}

interface CancelPaymentParam {
  paymentKey: string;
  cancelReason: string;
}

interface CancelPaymentResponse {
  errorCode?: string;
  errorMessage?: string;
  [key: string]: any;  // 응답이 확실하지 않다면 임시로 any 사용
}

//결제 리스트
export async function fetchPayments(params: PageParam): Promise<PaymentListResponse> {
  try {

    console.log("params=>" + JSON.stringify(params));

    const response = await jwtAxios.post(`${host}/list`, params);

    // 서버가 JSON 형식의 배열을 반환한다고 가정
    //const data: Payment[] = response.data;

    return response.data as PaymentListResponse;

  } catch (error) {
    console.error("결제 내역을 불러오는 중 오류 발생:", error);
    return {
      dtoList: [],
      pageNumList: [],
      pageRequestDTO: { page: 1, size: 10 },
      prev: false,
      next: false,
      totalCount: 0,
      prevPage: 0,
      nextPage: 0,
      totalPage: 0,
      current: 0
    };
  }
}

//결제 취소
export const cancelPayment = async (param: CancelPaymentParam): Promise<CancelPaymentResponse> => {
  try {
    const res = await jwtAxios.post<CancelPaymentResponse>(`${host}/cancel`, param);
    return res.data;
  } catch (error) {
    console.error('cancelPayment error:', error);
    throw error;
  }
};