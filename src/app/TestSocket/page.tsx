"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io({ autoConnect: false });

export default function Content() {

  // １回だけ実行
  useEffect(() => {
    // socket.ioサーバを起動するapiを実行
    fetch("/api/socket", { method: "POST" })
      .then(() => {
        // 既に接続済だったら何もしない
        if (socket.connected) {
          return;
        }
        // socket.ioサーバに接続
        socket.connect();
        // socket.ioのイベント登録する場合はここに
        socket.on("connect", () => { console.log("connected!") })
        // socket.ioサーバから送られてきたメッセージを出力
        socket.on("msg", (msg) => { console.log(msg) })
      })

    return () => {
      // 登録したイベントは全てクリーンアップ
      socket.off("connect")
      socket.off("msg")
    }
  }, [])

  return (
    <>
      <h1>socket.io シンプルな接続例</h1>
    </>
  );
}