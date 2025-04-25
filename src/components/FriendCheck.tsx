import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
type RequestType = {
  id: string;
  userId: string;
  friendId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

export default function FriendCheck() {
  const [requests, setRequests] = useState<RequestType[]>([]);

  useEffect(() => {
    const friendWaitApproval = async () => {
      const res = await fetch("/api/friend/request", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      setRequests(data);
      return data;
    };
    const data = friendWaitApproval();
    console.log(data);
  }, []);

  const acceptHandler = async (id: string) => {
    await fetch("/api/friend/accept", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };
  const rejectHandler = async (id: string) => {
    await fetch("/api/friend/reject", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Card className="flex flex-col gap-4 p-4">
      <CardHeader>
        <CardTitle className="">フレンド申請</CardTitle>
      </CardHeader>

      <CardContent>
        {requests.length === 0 ? (
          <p>承認まちの申請はありません.</p>
        ) : (
          requests.map((req) => (
            <div key={req.id}
                className="flex items-ceenter justify-between p-4 border rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <Avatar>
                  {req.user.image ? (
                    <img src={req.user.image} alt="ユーザ" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <AvatarFallback>{req.user.name?.[0] ?? "?"}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-semibold">名前: {req.user.name}</p>
                  <p className="text-sm text-muted-foreground">ユーザID: {req.userId}</p>
                </div>
              </div>

              <div>
                <Button variant="default" className="mr-2 " onClick={() => acceptHandler(req.id)}>承認</Button>
                <Button variant="outline" className="text-red-600" onClick={() => rejectHandler(req.id)}>拒否</Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
      
    </Card>
  );
}
