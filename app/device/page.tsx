// app/member/page.tsx
'use client';

import { Suspense } from 'react';
import DevicePageContent from './DevicePageContent';

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DevicePageContent />
    </Suspense>
  );
}
