import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "報酬支払計算ツール",
  description: "パーソナルトレーニング業務請負報酬計算",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
