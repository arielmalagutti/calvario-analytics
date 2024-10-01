import { createContext, useContext, useEffect, useState } from "react";

import { UserDTO } from "@/dtos";

import { supabase } from "@/lib/supabase";
import { User as UserType } from "@supabase/supabase-js";

type AuthProviderType = {
  user: UserType;
  userRole: string;
  signIn: (user: UserDTO) => Promise<void>;
};

const AuthContext = createContext<AuthProviderType>({} as AuthProviderType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({} as UserType);
  const [userRole, setUserRole] = useState<string>("");

  async function getUser() {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) throw new Error(userError.message);
    if (!userData) throw new Error("Usuário não encontrado");

    const { data: userRoleData, error: userRoleError } = await supabase
      .from("user")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (userRoleError) throw new Error(userRoleError.message);

    setUser(userData.user);
    setUserRole(userRoleData.role);
  }

  async function signIn({ email, password }: UserDTO) {
    const { data: userData, error: userError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (userError) throw new Error(userError.message);

    if (!userData) throw new Error("Usuário não encontrado");

    const { data: userRoleData, error: userRoleError } = await supabase
      .from("user")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (userRoleError) throw new Error(userRoleError.message);

    setUser(userData.user);
    setUserRole(userRoleData.role);
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const user = useContext(AuthContext);
  return user;
};
