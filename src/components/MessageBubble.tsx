"use client"

import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

type MessageBubbleProps = {
    text: string,
    senderId: string
}

export default function MessageBubble({text, senderId}: MessageBubbleProps) {
    const {data: session, } = useSession();

    const user = session?.user
    return(
        <div className={cn("flex w-full ", senderId === String(user?.id) ? "justify-end" : "justify-start")}>
            <div 
            className={cn(
                "max-w-xs px-4 py-2 rounded-2xl shadow text-black",
                senderId === String(user?.id) ? "bg-green-500 rounded-tr-none" : "bg-white-100 rounded-bl-none"

            )}>
                <p className='text-sm'>{text}</p>
            </div>

        </div>

    )
    
}