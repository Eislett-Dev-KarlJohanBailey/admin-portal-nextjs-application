"use client"

import { AuthContextProps } from "@/models/Auth/authContext";
import { createContext, useContext } from "react";

export const AuthContext = createContext<AuthContextProps|undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};