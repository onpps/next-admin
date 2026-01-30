// app/member/page.tsx
'use client';

import { Suspense } from 'react';
import LoginHistoryPageContent from './LoginHistoryPageContent';

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginHistoryPageContent />
    </Suspense>
  );
}
