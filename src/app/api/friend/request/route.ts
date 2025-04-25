import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth";


export async function POST(req:NextRequest) {
    const {userId, friendId} = await req.json()

    if (userId === friendId){
        return NextResponse.json({error: "自分自身を登録できません"},{status:400})
    }

    try{
        const existing = await prisma.friend.findFirst({
            where:{userId, friendId}
        })

        if (existing){
            return NextResponse.json({message:"既にフレンド登録済みです．"})
        }

        const newFriend = await prisma.friend.create({
            data: {
                user: {connect: {id: userId}},
                friend: {connect: {id:friendId}},
                status: "pending"
                
            },
        })

        return NextResponse.json(newFriend)
    }catch{
        return NextResponse.json({error: "エラー発生"}, {status: 500})
    }
    
}

export async function GET(req: NextRequest) {
    // ログイン中のユーザー情報を取得（たとえばNextAuthから）
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
  
    const userId = session.user.id;
  
  
    const pendingRequests = await prisma.friend.findMany({
      where: {
        friendId: String(userId),
        status: "pending", 
      },
      include: {
        user: true, 
      },
    });
  
    return Response.json(pendingRequests);
  }
  