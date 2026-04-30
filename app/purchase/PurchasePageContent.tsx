import React, { useState } from 'react';
import { getCookie } from "@/utils/cookieUtil";
import { clientKey } from '@/utils/config';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { createPayment } from '@/api/paymentApi';
import { sweetAlert } from '@/utils/sweetAlert';

interface MemberInfo {
  id: string;
  storeId: string;
}

interface Product {
  code: string;
  name: string;
  price: number;
  descriptions: string[];
}

interface Period {
  label: string;
  value: number;
  discount: number;
}

// 🔧 상품 타입 적용
const products: Product[] = [
  /*{
    code: 'BASIC',
    name: '베이직',
    price: 30000,
    descriptions: ['계정 3개 사용가능'],
  },*/
  {
    code: 'STANDARD',
    name: '스탠다드',
    price: 50000,
    descriptions: ['계정 5개 사용가능'],
  },
  {
    code: 'PREMIUM',
    name: '프리미엄',
    price: 100000,
    descriptions: ['계정 10개 사용가능', '우선 고객지원'],
  },
];

const periods: Period[] = [
  { label: '1개월', value: 1, discount: 0 },
  { label: '2개월', value: 2, discount: 0 },
  { label: '3개월', value: 3, discount: 0 },
  { label: '6개월 (5% 할인)', value: 6, discount: 0.05 },
  { label: '1년 (10% 할인)', value: 12, discount: 0.1 },
];

export default function SubscriptionPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(periods[0]);

  const [expandedProduct, setExpandedProduct] = useState<string | null>(products[0].code);

  const cookieMember = getCookie("member") as MemberInfo | undefined;

  const calculatePrice = () => {
    const base = selectedProduct.price * selectedPeriod.value;
    const discount = base * selectedPeriod.discount;
    return base - discount;
  };

  // ✅ any 제거
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setExpandedProduct(product.code);
  };

  // ✅ any 제거
  const requestPayment = async (plan: Product) => {

    if (!selectedProduct || !selectedPeriod) {
      return alert("상품과 기간을 모두 선택해주세요!");
    }

    const paymentId = `membership_${Date.now()}`;
    const finalAmount = calculatePrice();

    const paymentParam = {
      paymentId: paymentId,
      productCode: selectedProduct.code,
      productPeriod: selectedPeriod.value,
      userId: cookieMember?.id,
      amount: finalAmount
    };

    try {
      const response = await createPayment(paymentParam);

      console.log("response=>" + JSON.stringify(response));

      if (response.status === 401) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
        return;
      }

      if (response.status === 403) {
        alert("다른 사용자의 정보입니다. 접근이 거부되었습니다.");
        return;
      }

      if (response.status === 'READY') {
        const tossPayments = await loadTossPayments(clientKey);

        await tossPayments.requestPayment('카드', {
          amount: response.amount,
          orderId: response.paymentId,
          orderName: plan.name,
          customerName: cookieMember?.id,
          successUrl: `${window.location.origin}/payment/success?paymentId=${response.paymentId}`,
          failUrl: `${window.location.origin}/payment/fail`
        });
      }

    } catch (error: unknown) { // ✅ any → unknown
      console.error("주문 생성 중 오류 발생:", error);

      if (error instanceof Error) {
        sweetAlert(
          '작업중 오류가 발생하였습니다.',
          error.message,
          'error',
          '닫기'
        );
        return;
      }

      // axios 같은 경우 대비
      const err = error as {
        response?: {
          status?: number;
          data?: string;
        };
        message?: string;
      };

      const serverMessage = err?.response?.data;

      if (err?.response?.status === 401) {
        alert(serverMessage || "로그인이 필요합니다.");
        window.location.href = "/login";
        return;
      }

      if (err?.response?.status === 403) {
        alert(serverMessage || "접근이 거부되었습니다.");
        return;
      }

      sweetAlert(
        '작업중 오류가 발생하였습니다.',
        serverMessage || err.message || '알 수 없는 오류',
        'error',
        '닫기'
      );
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🎵 상품종류 선택</h1>

      <div className="flex flex-col gap-4 mb-10">
        {products.map((p) => {
          const isSelected = selectedProduct.code === p.code;
          const isOpen = expandedProduct === p.code;

          return (
            <div
              key={p.code}
              className={`border rounded-xl transition ${
                isSelected
                  ? 'bg-green-200 text-black border-green-400'
                  : 'bg-black border-gray-600'
              }`}
            >
              <div
                onClick={() => handleSelectProduct(p)}
                className="p-5 cursor-pointer flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{p.name}</h2>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {p.price.toLocaleString()}원 / 월
                  </p>
                </div>
              </div>

              {isOpen && (
                <div className="px-5 pb-4 text-sm border-t border-gray-300">
                  {p.descriptions.map((desc, idx) => (
                    <p key={idx} className="mt-2">
                      • {desc}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <h1 className="text-2xl font-bold mb-4">📅 결제기간 선택</h1>

      <div className="flex flex-wrap gap-3 mb-10">
        {periods.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPeriod(p)}
            className={`px-4 py-2 rounded-lg border transition text-sm ${
              selectedPeriod.value === p.value
                ? 'bg-green-400 text-black border-green-500'
                : 'bg-gray-200 text-black'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-200 text-black rounded-xl p-5 mb-8">
        <p className="mb-1">선택한 상품: {selectedProduct.name}</p>
        <p className="mb-1">결제 기간: {selectedPeriod.label}</p>
        <p className="font-semibold text-lg mt-2">
          총 결제 금액: {calculatePrice().toLocaleString()}원
        </p>
      </div>

      <button
        className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded-xl text-lg"
        onClick={() => requestPayment(selectedProduct)}
      >
        신청 및 결제하기
      </button>
    </div>
  );
}