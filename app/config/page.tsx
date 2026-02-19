'use client';

import { Suspense } from 'react';
import ConfigPageContent from './ConfigPageContent';

export default function VideoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfigPageContent />
    </Suspense>
  );
}