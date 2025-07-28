'use client';

import { Suspense } from 'react';
import UserPageContent from './UserPageContent';

export default function VideoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserPageContent />
    </Suspense>
  );
}