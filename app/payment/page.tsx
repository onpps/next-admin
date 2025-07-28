'use client';

import { Suspense } from 'react';
import PaymentPageContent from './PaymentPageContent';

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
