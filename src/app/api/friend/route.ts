import {  NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import prisma from "@/lib/prisma";



export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session){
        return NextResponse.json({error: "Unauthorize"}, {status: 401})
    }

    const userId = session.user?.id
    // const friends = searchParams.get("friend");
    if (!userId){
        return NextResponse.json({error: "userIdがありません"}, {status: 400})
    }
    try{
        const friends = await prisma.friend.findMany({
            where:{
                userId: String(userId),
                status: "accept"
            },
            include:{
                friend: true
            },
        })
        return NextResponse.json(friends.map(f => f.friend))
    }catch{
        return NextResponse.json({error: "エラー発生"}, {status:500})
    }
} 

