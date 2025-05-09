"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { io } from "socket.io-client";
import MessageBubble from "@/components/MessageBubble";
import UserList from "@/components/UserList";
import Header from "@/components/Header";
import { UserType } from "@/types/user";
import { MessageType } from "@/types/message";

// const socket = io({
//   path: "/api/socket",
// });
// const socket = io({ autoConnect: false });
const serverUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

const socket = io(serverUrl, {
  path: "/api/socket",
});

export default function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [users, setUsers] = useState([]);
  const [selectUser, setSelectUser] = useState({ id: "", name: "unknown" });
  const { data: session } = useSession();
  const scrollRef = useRef<HTMLDivElement>(null);
  console.log(session?.user);

  useEffect(() => {
    const fetchFriends = async () => {
      const res = await fetch("api/friend");
      const data = await res.json();
      setUsers(data);
      console.log(data);
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    const connectSocket = async (roomId: string) => {
      await fetch("/api/socket", { method: "POST" });
      console.log("ソケットの準備");

      if (!socket.connected) {
        socket.connect();
        console.log(socket.id);
        console.log("ソケット待機");
      }
      console.log(`繋いでた${socket.id}`);

      console.log(`roomID: ${roomId}`);
      if (selectUser && session) {
        socket.emit("joinPrivateRoom", { roomId });
      }

      // メッセージ送信

      socket.on("NewPrivateMessage", ({ senderSocketId, message }) => {
        console.log(senderSocketId);
        setMessages((prev) => [...prev, message]);
        console.log(message);
      });

      return roomId;
    };
    const roomId = [session?.user.id, selectUser.id].sort().join("_");

    connectSocket(String(roomId));

    return () => {
      console.log("お掃除");
      socket.off("NewPrivateMessage");
      socket.emit("leavePrivateRoom", { roomId });
    };
  }, [selectUser]);

  useEffect(() => {
    let isUnmounted = false;
    const fetchMessages = async () => {
      const res = await fetch(`/api/message/?receiverId=${selectUser.id}`);
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      if(!isUnmounted){
        setMessages(data);
     }
      console.log(data);
    };

    fetchMessages();
    return () => {
      isUnmounted = true;
    }
    
    
  }, [selectUser]);



  useLayoutEffect(() => {
    if(scrollRef.current){
      scrollRef?.current?.scrollIntoView() 
    }
  }, [messages]
  )

  async function sendMessage(
    senderId: string,
    receiverId: string,
    content: string
  ) {
    const res = await fetch("api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId,
        receiverId,
        content,
      }),
    });
    const data = await res.json();
    console.log("ソケットします");
    const roomId = [session?.user.id, selectUser.id].sort().join("_");
    socket.emit("privateMessage", {
      roomId,
      message: data,
    });
    console.log("ソケットしました");
    // const newMessage = [...messages, data]
    // setMessages(newMessage);
  }

  const changeSelectUser = (user: UserType) => {
    const newUser = { ...user };
    setSelectUser(newUser);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/3 border-r p-4 overflow-hidden ">
          <UserList users={users} changeSelectUser={changeSelectUser} />
        </aside>

        {selectUser.id ? (
          <main className="flex-1 " >
            <Card className=" p-6 flex flex-col h-full overflow-hidden m-4 ">
              <CardHeader>
                <CardTitle>{selectUser.name}とのチャット</CardTitle>
              </CardHeader>

              <Separator />
              <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden mt-2 h-full pb-0">
                <div className="flex-1 min-h-0 ">
                  <ScrollArea className="h-full pr-4">
                    <div className="flex flex-col gap-2">
                      {messages.map((message) => (
                        <MessageBubble
                          key={message.id}
                          text={message.content}
                          senderId={message.senderId}
                        />
                      ))}
                    <div  ref={scrollRef}></div>
                    </div>
                  </ScrollArea >
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const message = formData.get("message") as string;
                    if (message.trim() !== "") {
                      sendMessage(
                        String(session?.user.id),
                        selectUser.id,
                        message
                      );

                      e.currentTarget.reset();
                    }
                  }}
                  className="flex items-center gap-2 mt-4  "
                >
                  <Input
                    name="message"
                    placeholder="メッセージを入力..."
                    className="flex-1"
                  />
                  <Button type="submit">送信</Button>
                </form>
              </CardContent>
            </Card>
          </main>
        ) : (
          <main className="flex-1 flex items-center justify-center bg-muted">
            <h2 className="text-xl text-muted-foreground">誰とトークする？</h2>
          </main>
        )}
      </div>
    </div>
  );
}
