"use client"

import { AuthContextProps } from "@/models/Auth/authContext";
import { Context, createContext } from "react";



export const AuthContext = createContext<AuthContextProps|undefined>(undefined);

export const useAuth = (): Context<AuthContextProps|undefined> => {
  if (!AuthContext)
    throw new Error('useAuth must be used within a AuthProvider');

  return AuthContext;
};