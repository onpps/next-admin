'use client';

import { Suspense } from 'react';
import MusicPageContent from './MusicPageContent';

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MusicPageContent />
    </Suspense>
  );
}
