import React, { useEffect, useState } from 'react';
import { fetchPayments } from '../../../api/paymentApi';
import { Payment } from '../../../types/Payment';
import { sweetAlert } from '@/utils/sweetAlert';

export default function MyPaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Payment | null>(null);

  /*const handleTaxInvoice = async (paymentId: string) => {
    try {
      const res = await issueTaxInvoice(paymentId);

      if (res.success) {
        sweetToast('세금계산서가 발급되었습니다.');
      } else {
        sweetAlert('실패', res.message || '발급 실패', 'error');
      }
    } catch (err) {
      console.log(err);
      sweetAlert('오류', '세금계산서 발급 중 오류 발생', 'error');
    }
  };*/

  const handleReceipt = async (receiptUrl: string) => {
    try {
      //const res = await getReceiptUrl(paymentKey);

      // 새창으로 열기
      window.open(receiptUrl, '_blank');
    } catch (err) {
      console.log(err);
      sweetAlert('오류', '영수증 조회 실패', 'error');
    }
  };

  useEffect(() => {
    fetchPayments({ page: 1, size: 100 }).then((res) => {

      console.log("res.dtoList=>" + JSON.stringify(res.dtoList));

      // READY 제외
      const filtered = res.dtoList.filter(p => p.status !== 'READY');

      setPayments(filtered);

      //setPayments(res.dtoList);

      // 가장 최근 결제를 현재 이용 상품으로 설정
      const active = res.dtoList.find(p => p.status === 'PAID');
      setCurrentProduct(active || null);
    });
  }, []);

  return (
     <div>
        <h1 className="text-2xl font-semibold mb-4 text-white">결제내역 조회</h1>
      {/* 현재 이용중 상품 */}
      <div className="bg-white border rounded mb-6">
        <h2 className="font-semibold p-4 border-b">현재 이용중인 상품</h2>

        <table className="w-full text-sm">
          <tbody>
            <tr className="border-t">
              <td className="w-40 p-3 bg-gray-50">상품명</td>
              <td className="p-3">{currentProduct?.productCode || '-'}</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 bg-gray-50">결제일자</td>
              <td className="p-3">{currentProduct?.paidAt || '-'}</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 bg-gray-50">이용기간</td>
              <td className="p-3">
                {currentProduct ? `${currentProduct.startDate} ~ ${currentProduct.endDate}` : '-'}
              </td>
            </tr>
            {/* <tr className="border-t">
              <td className="p-3 bg-gray-50">정기결제</td>
              <td className="p-3">{currentProduct ? 'Y' : '-'}</td>
            </tr> */}
            <tr className="border-t">
              <td className="p-3 bg-gray-50">결제금액</td>
              <td className="p-3">{currentProduct?.amount ? currentProduct.amount.toLocaleString() : '-'}</td>
            </tr>
            <tr className="border-t">
              <td className="p-3 bg-gray-50">결제방법</td>
              <td className="p-3">카드</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 결제 내역 */}
      <div className="bg-white border rounded">
        <h2 className="font-semibold p-4 border-b">결제 내역</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="p-3">No</th>
              <th className="p-3">결제일</th>
              <th className="p-3">결제내역</th>
              <th className="p-3">이용기간</th>
              <th className="p-3">결제수단</th>
              <th className="p-3">금액</th>
              {/*<th className="p-3">세금계산서</th>*/}
              <th className="p-3">영수증</th>
            </tr>
          </thead>

          <tbody>
            {payments.length > 0 ? (
              payments.map((p, idx) => (
                <tr key={p.id} className="border-t text-center">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{p.paidAt}</td>
                  <td className="p-3">{p.productCode}</td>
                  <td className="p-3">
                    {p.startDate} ~ {p.endDate}
                  </td>
                  <td className="p-3">카드</td>
                  <td className="p-3">{p.amount.toLocaleString()}</td>
                  {/*<td className="p-3">
                      <button
                        className="text-blue-500 underline"
                        onClick={() => handleTaxInvoice(p.paymentId)}
                      >
                        발급
                      </button>
                  </td>*/}

                  <td className="p-3">
                    <button
                      className="text-blue-500 underline"
                      onClick={() => handleReceipt(p.receiptUrl)}
                    >
                      보기
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-400">
                  결제 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
