import { useState } from "react";

import { useAuth } from "@/hooks/index";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { UserDTO } from "@/dtos";

export function LoginSheet() {
  const { signIn } = useAuth();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(user: UserDTO) {
    try {
      await signIn(user);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Usuário ou senha inválida";

      toast({
        title: "Algo deu errado",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Login</Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Login</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={() => handleLogin({ name: username, password })}
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Username
            </Label>

            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Password
            </Label>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
        </form>

        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              onClick={() => handleLogin({ name: username, password })}
            >
              Authenticate
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
