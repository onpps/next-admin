'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function FailPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get('code');
  const message = searchParams.get('message');
  const orderId = searchParams.get('orderId');

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-xl text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-400">
          ❌ 결제 실패
        </h1>

        <p className="mb-6">
          {code || '결제 중 문제가 발생했습니다.'}
        </p>

        <p className="mb-6">
          {message || '결제 중 문제가 발생했습니다.'}
        </p>

         <p className="mb-6">
          {orderId || '결제 중 문제가 발생했습니다.'}
        </p>

        <button
          onClick={() => router.push('/purchase')}
          className="bg-green-500 px-6 py-2 rounded hover:bg-green-600"
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
}