import React, { useEffect, useState } from 'react';
import { fetchPayments, cancelPayment } from '../../api/paymentApi';
import { PaymentListResponse, Payment } from '../../types/Payment';
import PageComponent from "@/components/PageComponent";
import useCustomMove from '@/utils/useCustomMove';
import { sweetAlert, sweetConfirm, sweetToast } from '@/utils/sweetAlert';
import { useRouter } from 'next/navigation';

interface CancelParam {
  paymentKey: string;
  cancelReason: string;
}

const initState = {
  productCode: "",
  userId: "",
  status: "",
  paymentKey: "",
  paidAt: "",
};

export default function PaymentPageContent() {
    const {page, size, moveToList} = useCustomMove();
    const [searchParams, setSearchParams] = useState(initState);
    
    const router = useRouter();

    const [payments, setPayments] = useState<PaymentListResponse>({
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
    });

    // 공통 onChange 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
      fetchPayments({
        page: 1,  // 검색은 항상 첫 페이지부터
        size,
        ...searchParams
      }).then(setPayments);
    };    

    useEffect(() => {
      fetchPayments({page, size, ...searchParams}).then(setPayments);
    }, [page, size, searchParams]);

    useEffect(() => {
      console.log("paymentData=>" + JSON.stringify(payments));
    }, [payments]);

    const handleCancelPayment = (paymentKey: string) => {

      console.log(`paymentKey => ${paymentKey}`);
    
      sweetConfirm(`${paymentKey} 결제를 취소 하시겠습니까?`, 'question', async () => {
        const param: CancelParam = {
          paymentKey,
          cancelReason: '관리자 요청',
        };
    
        try {
          const data = await cancelPayment(param);
          console.log(`data => ${JSON.stringify(data)}`);
    
          if (data.errorCode === 'notExist' || data.errorCode === 'refundError') {
            sweetAlert(data.errorMessage, '', 'info', '닫기');
            return;
          }
    
          sweetToast('결제가 취소 되었습니다.');
          router.replace('/payment/list');
        } catch (error) {
          console.log("error=>" + JSON.stringify(error));
          alert("오류가 발생했습니다.");
        }
      });
    };
        
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4 text-white">결제 관리</h1>

        {/* 🔍 검색 폼 : 테두리 + 여백 + 정리된 UI */}
        <div className="border border-gray-300 rounded p-4 mb-6 bg-white shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select className="p-2 rounded border border-gray-300" name="productCode" onChange={handleChange}>
              <option value="">상품명</option>
              <option value="BASIC">베이직</option>
              <option value="STANDARD">스탠다드</option>
              <option value="PREMIUM">프리미엄</option>
            </select>

            <input
              type="text"
              placeholder="회원 ID"
              className="p-2 rounded border border-gray-300"
              name="userId"
              onChange={handleChange}
            />

            <select className="p-2 rounded border border-gray-300" name="status" onChange={handleChange}>
              <option value="">상태 선택</option>
              <option value="PAID">결제완료</option>
              <option value="CANCEL">결제취소</option>
              <option value="REFUND">환불완료</option>
            </select>

            <input
              type="text"
              placeholder="결제키"
              className="p-2 rounded border border-gray-300"
              name="paymentKey"
              onChange={handleChange}
            />

            <input
              type="date"
              className="p-2 rounded border border-gray-300"
              name="paidAt"
              onChange={handleChange}
            />

            <button className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600" onClick={handleSearch}>
              🔍 검색
            </button>
          </div>
        </div>

        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 text-center">결제번호</th>
              <th className="p-3 text-center">상품명</th>
              <th className="p-3 text-center">기간(월)</th>
              <th className="p-3 text-center">금액</th>
              <th className="p-3 text-center">회원 ID</th>
              <th className="p-3 text-center">상태</th>
              <th className="p-3 text-center">결제키</th>
              <th className="p-3 text-center">결제일</th>
              <th className="p-3 text-center">종료일</th>
              <th className="p-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {payments.dtoList.map((payment: Payment) => (
              <tr key={payment.id} className="border-t">
                <td className="p-3 text-center">{payment.id}</td>
                <td className="p-3 text-center">{payment.productCode}</td>
                <td className="p-3 text-center">{payment.productPeriod}</td>
                <td className="p-3 text-center">{payment.amount}</td>
                <td className="p-3 text-center">{payment.userId}</td>
                <td className="p-3 text-center">{payment.status}</td>
                <td className="p-3 text-center">{payment.paymentKey}</td>
                <td className="p-3 text-center">{payment.paidAt}</td>
                <td className="p-3 text-center">{payment.startDate} ~ {payment.endDate}</td>
                <th className="p-3 text-center">
                  {payment.paymentKey && payment.status !== 'READY' && (
                  <button className="bg-red-500 text-white rounded p-2 hover:bg-red-600" onClick={()=>handleCancelPayment(payment.paymentKey)}>취소</button>
                  )}
                </th>
              </tr>
            ))}
          </tbody>
        </table>

        <PageComponent serverData={payments} movePage={moveToList}></PageComponent>

        {/* 총 개수 출력: 중앙 정렬 + 회색 글씨 */}
        <div className="text-center text-gray-400 mt-2">
          총 결제 건수: {payments.totalCount} 건
        </div>
      </div>
    );
}
