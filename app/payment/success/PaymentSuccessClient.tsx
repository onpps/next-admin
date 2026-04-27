"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { confirmPayment } from "@/api/paymentApi";

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {

    const paymentId = searchParams.get('paymentId');
    const paymentKey = searchParams.get('paymentKey');
    const amount = searchParams.get('amount');

    const confirm = async () => {
      try {
        await confirmPayment({
          paymentId,
          paymentKey,
          amount,
        });

        alert("결제가 완료되었습니다!");
        router.replace("/payment/history");

      } catch (error) {
        console.error(error);
        alert("결제 검증 실패");
        router.replace("/payment/fail");
      }
    };

    if (paymentKey && paymentId && amount) {
      confirm();
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">결제 처리중...</h1>
        <p>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}