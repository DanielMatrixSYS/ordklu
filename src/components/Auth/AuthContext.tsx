import { User } from "firebase/auth";
import { createContext } from "react";

export type UserProfile = {
  solved: number;
};

export type AuthContextProps = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextProps | null>(null);
