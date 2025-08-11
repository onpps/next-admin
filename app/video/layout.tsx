// app/video/layout.tsx
export default function VideoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* html/body는 생략해야 함 */}
      {children}
    </>
  );
}
