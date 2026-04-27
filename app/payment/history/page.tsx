'use client';

import { Suspense } from 'react';
import HistoryPageContent from './HistoryPageContent';

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HistoryPageContent />
    </Suspense>
  );
}
