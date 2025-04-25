"use client"

import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const formSchema = z.object({
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z.string().min(6, "パスワードは6文字以上必要です.")
})

export default function Login () {

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const loginHandler = async(value:z.infer<typeof formSchema>) => {
        const res = await signIn("credentials", {
            redirect: false,
            email: value.email,
            password:value.password,
        })
        if (res?.error) {
            alert("ログイン失敗" + res.error)
        }else {
            alert("ログイン成功")
            router.push("/Chat")

        }

    }



    return(
            
        <Form {...form}>
            <form onSubmit={form.handleSubmit(loginHandler)}>
            <FormField
            control={form.control}
            name="email"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="taro@email" {...field}/>
                    </FormControl>
                    <FormDescription>登録したEmailを入力してください</FormDescription>
                    <FormMessage/> 
                </FormItem>
            )}/>
            <FormField
            control={form.control}
            name="password"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="taropass" {...field}/>
                    </FormControl>
                    <FormDescription>登録したPasswordを入力してください</FormDescription>
                    <FormMessage/> 
                </FormItem>
            )}/>
            <Button type="submit">Login</Button>
            </form>
            <span>または</span>
            <Button onClick={() => signIn("google", {callbackUrl: "/Chat"})}>Googleでログイン</Button>

        </Form>
            // <form onSubmit={loginHandler}>
            // <input type="text"
            // value={email}
            // placeholder="email"
            // onChange={e => setEmail(e.target.value)}/>
            // <input type="password"
            // value={password}
            // placeholder="password"
            // onChange={e => setPassword(e.target.value)} />
            // <button type="submit">log in</button>
            // </form>
        
    )
} 