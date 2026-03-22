import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "세무법인 BHL | 상담 예약",
  description: "백근창 세무사 | 세무법인 BHL - 구조를 바꾸면 세금이 바뀝니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
