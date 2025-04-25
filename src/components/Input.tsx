"use client"
import { useState } from "react";

import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';


type InputProps = {
    createMessages: (x: string) => void
}




export default function Input ({createMessages}:InputProps) {
    const [text, setText] = useState("")


    async function sendMessage(senderId:number , receiverId: number, content: string ) {
        const res = await fetch('api/message', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                senderId,
                receiverId,
                content
            })
    
        })
        const data = await res.json()
        return data
    }

    const clickHandler = (text: string) => {
        sendMessage(1, 2, text)
        createMessages(text)
        setText("")
    }

    return(
    <Box display="flex" 
        bgcolor="white"
        height="5%">
        <TextField fullWidth
        placeholder="返信を入力"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
            if(e.key === "Enter"){
                clickHandler(text)
            }
        }}
        variant="outlined"
        size="small"/>
        <IconButton onClick={() => clickHandler(text)} color="primary">
        <SendIcon />
        </IconButton>
    </Box>
    )
}