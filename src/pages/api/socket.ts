import { NextApiRequest, NextApiResponse } from "next";

import type { Socket as NetSocket } from "net";
import type { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import type { Socket } from "socket.io";
import { MessageType } from "@/types/message";

interface SocketServer extends HttpServer {
  io?: IOServer;
}

interface SocketServerWithIO extends NetSocket {
  server: SocketServer;
}

interface ResponseWithSocket extends NextApiResponse {
  socket: SocketServerWithIO;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: ResponseWithSocket) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  if (res.socket.server.io) {
    return res.send("server is already running");
  }

  const path = "/api/socket";
  const httpServer: HttpServer = res.socket.server;
  const io = new IOServer(httpServer, { path: path });
  // socker serverが起動していない状態なので、起動。
  // const io = new Server(res.socket.server, { addTrailingSlash: false });
  debugger
  console.log("ソケットレディ");
  // 各イベントを設定
  io.on("connection", (socket: Socket) => {
    console.log("!!!!!!!!!!!!!サーバ準備!!!!!!!!!!!!!!!");
    socket.on("disconnect", () =>
      console.log("!!!!!!!!!!!!!!!!!!!!!disconnected")
    );

  socket.on("joinPrivateRoom", ({ roomId }: { roomId: string }) => {
    socket.join(roomId);
    console.log(`${socket.id} が 1対1用ルーム ${roomId} に参加`);
  });
  socket.on("leavePrivateRoom", ({ roomId }) => {
    socket.leave(roomId);
    console.log(`${socket.id} が 1対1用ルーム ${roomId} から退会`);
  });

  socket.on("privateMessage", ({ roomId, message }: { roomId: string; message: MessageType }) => {
    console.log(`Room ${roomId} にメッセージ: ${message.content}`);
    io.to(roomId).emit("NewPrivateMessage", {
      senderId: socket.id,
      message,
    });
  });
  });
  res.socket.server.io = io;

  return res.end();
}
