import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chat画面",
    description: "簡易的なチャットアプリ",
  };
  
  export default function SubLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div>{children}</div>
    );
  }