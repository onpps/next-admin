'use client';

import { Suspense } from 'react';
import VideoPageContent from './VideoPageContent';

export default function VideoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoPageContent />
    </Suspense>
  );
}