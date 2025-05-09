"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";


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
    <Card className="flex flex-col items-center p-4">
      <CardHeader>
        <CardTitle className="text-3xl">プロフィール</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex justify-center items-center">
          <Avatar className="w-32 h-32">
            {user?.image ? (
              <img
                src={user.image}
                alt="avatar"
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
        </div>
        <div className="text-center">
          <p className="font-semibold text-3xl">名前: {user?.name}</p>
          <p className="text-2xl">email: {user?.email}</p>
          <p className="text-2xl">user ID: {user?.id}</p>
        </div>
      </CardContent>
    </Card>
  </>
  );
}
