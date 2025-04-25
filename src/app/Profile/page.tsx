"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@radix-ui/react-separator";

import Header from "@/components/Header";

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>now Loading...</div>;

  if (!session) {
    redirect("/Login");
  }

  const user = session.user;

  return (
    <>
      <Header />
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>プロフィール</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex gap-4">
          <Avatar>
            {user?.image ? (
              <img src={user.image} alt="avater" className="rounded-full " />
            ) : (
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">名前: {user?.name}</p>
            <p>email: {user?.email}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
