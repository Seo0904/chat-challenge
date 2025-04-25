
import {Card, CardHeader} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";


import { UserType } from "@/types/user";
type UserLiseProps = {
    users: UserType[]
    changeSelectUser: (x:UserType) => void
}

const UserList = ({users, changeSelectUser}: UserLiseProps) => {



  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <h2 className="text-lg font-semibold">フレンド一覧</h2>
      </CardHeader>
      <ScrollArea className="flex-1 px-2 pb-2">
        <div className="flex flex-col justify-start gap-2">
        
        {Array.isArray(users)?
        users.map((user: UserType) => (
          
          <Button 
          key={user.id}
          variant="ghost"
          className="justify-start "
          onClick={() => changeSelectUser(user)}>
            <span className="text-lg  ">{user.name}</span>
          </Button>
        )):
        <div className="pl-5">フレンドを追加しよう!</div>}
        </div>
      </ScrollArea>
  
    </Card>
  );
};

export default UserList;
