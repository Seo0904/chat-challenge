// import Image from "next/image";
// import styles from "./page.module.css";


"use client"

import { useRouter} from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LOGINPOINT = "http://localhost:3000/Login"
const REGISTERPOINT = "http://localhost:3000/Register"



export default function Home() {

  const router = useRouter();


  return (
    <div className="min-h-scrren flex item-center justify-center bg-gray-50">
    <Card className=" w-full max-w-md shadow-lg" >
      <CardHeader>
        <CardTitle className="text-center">Chat appへようこそ!!</CardTitle>
        <CardDescription className="text-center">簡易的なチャットアプリを試してみてください</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button onClick={() => router.push(REGISTERPOINT)}>
          新規登録
        </Button>
        <Button variant="outline" onClick={() => router.push(LOGINPOINT)}>
          ログイン
        </Button>
      </CardContent>
    </Card>
    </div>
  );
}
