import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function  GET(reqest: NextRequest) {

    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id){
        return NextResponse.json({error: "UnAuthorize"}, {status:  401})
    }

    
    const {searchParams} = new URL(reqest.url)
    const user = session.user
    
    const user2 = searchParams.get("receiverId")

    if (!user || !user2){
        return new Response("Missing sender or receiver !!!!" , {status: 400})
    }

    const messages = await prisma.message.findMany({
        where: {
            OR:[
                {senderId: String(user.id), receiverId: user2},
                {senderId: user2, receiverId: String(user.id)}
            ]
           
        
    },
    orderBy: {createAt: "asc"}
})
    return NextResponse.json(messages)

}

export async function POST(req:NextRequest) {
    const body = await req.json()

    const {senderId, receiverId, content} = body;

    if (!content || !senderId || !receiverId)  {
        return NextResponse.json({error: "必要物が足りません"}, {status: 400})
    }
    try{ const message = await prisma.message.create({
        data: {
            senderId: senderId,
            receiverId: receiverId,
            content,
        },
    
    })

    return NextResponse.json(message)}
    catch{
        return NextResponse.json({error: "エラー発生"}, {status: 500})
    }
   
}