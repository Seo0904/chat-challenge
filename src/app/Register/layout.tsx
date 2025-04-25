import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "User登録画面",
    description: "簡易的なチャットアプリ",
  };
  
  export default function SubLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="h-full flex md:items-center justify-center">{children}</div>
    );
  }