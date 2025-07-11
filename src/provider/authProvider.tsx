"use client"
import { ReactNode, useCallback, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import useLocalStorage from "../hooks/use-local-storage";
import { LOCAL_STORAGE_KEYS } from "../constants/localStorageKeys";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getAuthUserDetails, setAuthUserDetails, setAuthToken } from "@/store/auth-slice";
import { AuthUserDetails } from "@/models/Auth/authUserDetails";

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_KEYS.AUTH, undefined);
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector(getAuthUserDetails);

  // update user details in redux
  const setUserDetails = useCallback(async (details: AuthUserDetails | undefined) => {
    dispatch(setAuthUserDetails(details))
  }, [dispatch])

  // when token is obtained, add to reducer ( token current not fetched from redux. ONLY LOCAL STORAGE)
  useEffect(() => {
    dispatch(setAuthToken(token))
    // Mark as initialized after the first render
    setIsInitialized(true)
  }, [dispatch, token])

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing application...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ token, setToken, userDetails, setUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;