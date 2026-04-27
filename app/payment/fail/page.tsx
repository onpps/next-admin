import { Suspense } from "react";
import FailPageContent from "./FailPageContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FailPageContent />
    </Suspense>
  );
}