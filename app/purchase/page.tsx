'use client';

import { Suspense } from 'react';
import PurchasePageContent from './PurchasePageContent';

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PurchasePageContent />
    </Suspense>
  );
}
