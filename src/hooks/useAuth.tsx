import { createContext, useContext, useEffect, useState } from "react";
import * as z from "zod";

import { UserDTO } from "@/dtos";

import { supabase } from "@/lib/supabase";
import { User as UserType } from "@supabase/supabase-js";

type AuthProviderType = {
  user: UserType;
  signIn: (user: UserDTO) => Promise<void>;
};

const loginSchema = z.object({
  name: z
    .string({ message: "Invalid username" })
    .includes(import.meta.env.VITE_USERNAME),
  password: z
    .string({ message: "Invalid password" })
    .includes(import.meta.env.VITE_PASSWORD),
});

const AuthContext = createContext<AuthProviderType>({} as AuthProviderType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({} as UserType);

  async function getUser() {
    const { data: userData, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);

    setUser(userData.user);
  }

  async function signIn(user: UserDTO) {
    const login = loginSchema.safeParse(user);
    if (login.error) throw new Error("Wrong credentials.");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (error) throw new Error(error.message);
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const user = useContext(AuthContext);
  return user;
};
