import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";


export async function POST (req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id){
        return NextResponse.json({error: "Unauthorized"}, {status: 400})
    }

    const { id } = await req.json();



    const request = await prisma.friend.findUnique({
        where: {
            id
        }
    })

    if (!request){
        return NextResponse.json({error: "申請がありません"})

    }
    const update = await prisma.friend.update({
        where:{
            id: request.id
        },
        data:{
            status: "rejected"
        }
    })

    return NextResponse.json(update)
} 