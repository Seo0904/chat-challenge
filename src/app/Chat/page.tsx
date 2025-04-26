"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator";
import {io} from "socket.io-client"
import MessageBubble from "@/components/MessageBubble";
import UserList from "@/components/UserList";
import Header from "@/components/Header";

type MessageType = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
};

export type UserType = {
    id: string;
  name: string;
  isTalk: boolean;
}


// const socket = io({
//   path: "/api/socket",
// });
const socket = io({ autoConnect: false });

export default function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [users, setUsers] = useState([]);
  const [selectUser, setSelectUser] = useState({id: "", name: "unknown"});
  const {data:session} = useSession();
  console.log(session?.user)

  useEffect(() => {
    const fetchFriends = async () => {
      const res = await fetch("api/friend");
      const data = await res.json();
      setUsers(data) 
      console.log(data)
    }
    
    fetchFriends()
  }, [])

  useEffect(() => {
    fetch("/api/socket", { method: "POST" })
      .then(() => {
        // 既に接続済だったら何もしない
        if (socket.connected) {
          return;
        }
        socket.connect();
        // socket.ioのイベント登録する場合はここに
        socket.on("connect", () => { console.log("connected!") })

        socket.on("message", (msg: MessageType) => {
          setMessages(prev => [...prev, msg]);
          console.log(msg)
        });

      }
    );
    
    return () => {
      // 登録したイベントは全てクリーンアップ
      socket.off("connect")
      socket.off("msg")
    }

}, [])

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`api/message/?receiverId=${selectUser.id}`);
      if (!res.ok){
        return 
      }
      const data = await res.json();
      setMessages(data) 
      console.log(data)
    }
    
    fetchMessages()
  }, [selectUser])

  async function sendMessage(senderId:string , receiverId: string, content: string ) {
    const res = await fetch('api/message', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            senderId,
            receiverId,
            content
        })

    })
    const data = await res.json()
    console.log("ソケットします")
    socket.emit("message", data);
    console.log("ソケットしました")
    const newMessage = [...messages, data]
    setMessages(newMessage);
}


  const changeSelectUser = (user:UserType) => {
    const newUser = {...user}    
    setSelectUser(newUser)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/3 border-r p-4">
        
        <UserList users={users} changeSelectUser={changeSelectUser}/>
        </aside>
       
        {selectUser.id?(
          <main className="flex-1 p-6 flex flex-col">
            <Card>
              <CardHeader >
                <CardTitle>{selectUser.name}とのチャット</CardTitle>
              </CardHeader>

              <Separator/>
              <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden mt-2">
                <ScrollArea className="flex-1 pr-4">
                  <div className="flex flex-col gap-2">
                      {messages.filter((message =>{
                
                       return (message.receiverId === selectUser.id)
                     })).map((message) => {
                       return (
                         <MessageBubble
                           key={message.id}
                           text={message.content}
                           senderId={message.senderId}
                         />
                       );
                     })}
                  </div>
                </ScrollArea>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const message = formData.get("message") as string;
                    if (message.trim() !== "") {
                      sendMessage(String(session?.user.id), selectUser.id, message )
                      
                      e.currentTarget.reset();
                    }
                  }}
                  className="flex items-center gap-2 mt-4"
                >
                  <Input name="message" placeholder="メッセージを入力..." className="flex-1" />
                  <Button type="submit">送信</Button>
                </form>
              </CardContent>
            </Card>

          </main>
             
        )
        :<main className="flex-1 flex items-center justify-center bg-muted">

            <h2 className="text-xl text-muted-foreground">誰とトークする？</h2>
        </main>}
        
    </div>
  </div>
  );
}
