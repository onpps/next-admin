// app/member/page.tsx
'use client';

import { Suspense } from 'react';
import UsersPageContent from './UsersPageContent';

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsersPageContent />
    </Suspense>
  );
}
