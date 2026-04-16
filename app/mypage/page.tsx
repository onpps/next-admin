// app/member/page.tsx
'use client';

import { Suspense } from 'react';
import MemberModifyPage from './MemberModifyPage';

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MemberModifyPage />
    </Suspense>
  );
}
