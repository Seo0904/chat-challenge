import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt"



export async function POST(req:NextRequest) {
    const body = await req.json();
    const {name, email, password} = body;

    if ( !name || !email || !password) {
        return NextResponse.json({error: "name, email and password are requiered!!!!"}, {status: 400});
    }

    try{
        const hashpass = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {name, email, password: hashpass}
        })

        return NextResponse.json(newUser);
    } catch{
        return NextResponse.json({error: "User creation failed"}, {status: 500})
    }
}