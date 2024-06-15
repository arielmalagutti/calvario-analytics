import { UserDTO } from "@/dtos";
import { createContext, useContext, useEffect, useState } from "react";
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
    .string({ message: "Invalid username" })
    .includes(import.meta.env.VITE_PASSWORD),
});

const AuthContext = createContext<AuthProviderType>({} as AuthProviderType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({} as UserDTO);

  function validateUser(user: UserDTO) {
    try {
      const validatedLogin = loginSchema.parse(user);
      if (validatedLogin) setUser(validatedLogin);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(user);
  }, [user]);

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
