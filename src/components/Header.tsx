"use client";
import { redirect, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") return <p>now loadding...</p>;

  if (!session) {
    redirect("/Login");
  }
  const user = session?.user;

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md flex justify-between h-18">
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        Chat App
      </h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="rounded-full p-0 w-10 h-10">
            <Avatar>
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback>{user?.name?.charAt(0) ?? "?"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push("/Profile")}>
            プロフィール
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push("/Chat");
            }}
          >
            <span>チャット</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push("/FriendRegister");
            }}
          >
            <span>フレンド登録</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              signOut();
              router.push("/Profile");
            }}
          >
            <span className="text-red-500">サインアウト</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
