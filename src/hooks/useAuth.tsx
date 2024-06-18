import { UserDTO } from "@/dtos";
import { createContext, useContext, useState } from "react";
import * as z from "zod";

type AuthProviderType = {
  user: UserDTO;
  validateUser: (user: UserDTO) => void;
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
  const [user, setUser] = useState({} as UserDTO);

  function validateUser(user: UserDTO) {
    const login = loginSchema.safeParse(user);
    if (!login.data) throw login.error;

    setUser(login.data);
  }

  return (
    <AuthContext.Provider value={{ user, validateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const user = useContext(AuthContext);
  return user;
};
