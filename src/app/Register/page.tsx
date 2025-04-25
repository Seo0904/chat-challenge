"use client"
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
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
import {signIn} from "next-auth/react"

const formSchema = z.object({
    name: z.string().min(2, "2文字以上で入力してください").max(50),
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z.string().min(6, "パスワードは6文字以上必要です.")
})

export default function Register () {

    // const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    const registerHandler = async(values: z.infer<typeof formSchema>) => {
        console.log(values)
    
        const res = await fetch('/api/user', {
            method: "POST",
            body: JSON.stringify(values),
            headers: {"Content-Type": "application/json"}
        })

        if (!res.ok) {
            const erroText = await res.text()
            console.error("APIerror", erroText)
            throw new Error("API呼び出しミス")
        }

        const data = await res.json();
        alert(`User created ${data.name}`)

        form.reset()

    }


    return (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(registerHandler)} className="space-y-8">
                        <FormField 
                        control={form.control}
                        name="name"
                        render = {({field}) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Taro" {...field}/>
                                </FormControl>
                                <FormDescription>
                                公開プロフィール名になります．
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField 
                        control={form.control}
                        name="email"
                        render = {({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="taro@email.com" {...field}/>
                                </FormControl>
                                <FormDescription>
                                    メールアドレスを入力してください．
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField 
                        control={form.control}
                        name="password"
                        render = {({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="taropass" {...field}/>
                                </FormControl>
                                <FormDescription>
                                    パスワードを入力してください
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}/>

                        <Button type="submit">Register</Button>
                    </form>
                    <span>または</span>
            <Button className="text-blue-600" variant="link" onClick={() => signIn("google", {callbackUrl: "/Chat"})}>Googleでログイン</Button>
                </Form>
    
        // </form>
       
    )
}