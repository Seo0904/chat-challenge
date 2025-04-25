import { Server } from "socket.io"

import { NextApiRequest, NextApiResponse } from "next";

import type { Socket as NetSocket } from "net";
import type { Server as HttpServer } from "http";
import type { Server as IOServer } from "socket.io";
import type { Socket } from "socket.io";

export const config = {
    api: {
        bodyParser: false
    }
};

interface SocketServer extends HttpServer {
    io?: IOServer;
}

interface SocketServerWithIO extends NetSocket {
    server: SocketServer
}

interface ResponseWithSocket extends NextApiResponse {
    socket: SocketServerWithIO
}

export async function handler(req: NextApiRequest, res: ResponseWithSocket) {


    if(!res.socket?.server.io) {
        console.log("Socket.IO server starting...")

        const io = new Server(res.socket.server, {
            addTrailingSlash: false,
            path: "/api/socket"
        });
        res.socket.server.io = io;

        io.on("connection", (socket) => {
            console.log("Connected", socket.id)

            socket.on("message", (msg) => {
                io.emit("message", msg)
            });
            
            socket.on("disconnect", () => {
                console.log("Disconnected", socket.id)
            })
        })
    };
    return res.end()    
}