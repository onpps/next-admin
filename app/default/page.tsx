'use client';

import { Suspense } from 'react';
import DefaultPageContent from './DefaultPageContent';

export default function VideoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DefaultPageContent />
    </Suspense>
  );
}