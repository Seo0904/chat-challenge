"use client"
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
// import { toast } from "@/components/hooks/use-toast"
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
import Header from "@/components/Header";
import FriendCheck from "@/components/FriendCheck"

const formSchema = z.object({
    friendId: z
    .string()
    .min(1, { message: "1以上のIDを入力してください"})
});



const FriendRegister = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            friendId: undefined
            ,
        },
    });

    const {data: session, status}  = useSession();
    const user = session?.user

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const userId = user?.id;
        const res = await fetch("api/friend/request",{
            method: "POST",
            body: JSON.stringify({userId, friendId: values.friendId}),
            headers: {"Content-Type": "application/json"}
        });
        const data = await res.json()
        console.log(data)
    }
    

    return(
        <>
        <Header />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField 
            control={form.control}
            name="friendId"
            render={({field}) => (
                <FormItem>
                    <FormLabel className="text-xl">Friend ID</FormLabel>
                    <FormControl>
                        <Input placeholder="フレンドになりたいユーザのユーザIDを入力してください" type="text" {...field}/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}/>
                <Button>フレンド申請</Button>
            </form>

        </Form>
        <FriendCheck />
        
        </>
    )
}

export default FriendRegister;