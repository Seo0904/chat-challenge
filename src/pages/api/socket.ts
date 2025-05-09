

import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

import type { Socket as NetSocket } from "net";
import type { Server as HttpServer } from "http";
import type { Server as IOServer } from "socket.io";
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

export default function handler(
    req: NextApiRequest,
    res: ResponseWithSocket,
) {

    if (req.method !== "POST") {
        return res.status(405).end();
    }

    if (res.socket.server.io) {
        return res.send("server is already running")
    }

    // socker serverが起動していない状態なので、起動。
    const io = new Server(res.socket.server, { addTrailingSlash: false });
    console.log("ソケットレディ")
    // 各イベントを設定
    io.on("connection", (socket: Socket) => {
        console.log("!!!!!!!!!!!!!サーバ準備!!!!!!!!!!!!!!!")
        socket.on("disconnect", () => console.log("!!!!!!!!!!!!!!!!!!!!!disconnected"))
        socket.on("message", (msg: MessageType) => {
            console.log("サーバーが受信したmsg:", msg)
            io.emit("NewMessage", msg)

        })
    })
    res.socket.server.io = io;

    return res.end();
}