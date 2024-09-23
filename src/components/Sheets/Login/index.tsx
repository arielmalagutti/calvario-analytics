import { useAuth } from "@/hooks/index";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

export type LoginFormType = {
  email: string;
  password: string;
};

export function LoginSheet() {
  const form = useForm<LoginFormType>();

  const { signIn } = useAuth();
  const { toast } = useToast();

  async function handleLogin(user: UserDTO) {
    try {
      await signIn(user);
    } catch (error) {
      const errorMessage = "Credenciais de login inválidas";

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

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="grid gap-4 py-4"
        >
          <SheetContent className="flex flex-col gap-6">
            <SheetHeader>
              <SheetTitle>Login</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="exemplo@gmail.com" />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Insira sua senha" />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" onClick={form.handleSubmit(handleLogin)}>
                  Autenticar
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </form>
      </Form>
    </Sheet>
  );
}
