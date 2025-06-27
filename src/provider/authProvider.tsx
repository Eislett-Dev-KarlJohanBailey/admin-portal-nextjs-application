"use client"
import { ReactNode, useCallback, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import useLocalStorage from "../hooks/use-local-storage";
import { LOCAL_STORAGE_KEYS } from "../constants/localStorageKeys";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getAuthUserDetails, setAuthUserDetails, setAuthToken } from "@/store/auth-slice";
import { AuthUserDetails } from "@/models/Auth/authUserDetails";

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_KEYS.AUTH, undefined); //useState<string | undefined>(undefined);
  // const [userDetails, setUserDetails] = useLocalStorage(LOCAL_STORAGE_KEYS.USER_DETAILS, undefined); //useState<string | undefined>(undefined);
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector(getAuthUserDetails);

  // update user details in redux
  const setUserDetails = useCallback(async (details: AuthUserDetails | undefined) => {
    dispatch(setAuthUserDetails(details))
  }, [dispatch])

  // when token is obtained, add to reducer ( token current not fetched from redux. ONLY LOCAL STORAGE)
  useEffect(() => {
    dispatch(setAuthToken(token))
  }, [dispatch, token])


  return (
    <AuthContext.Provider value={{ token, setToken, userDetails, setUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;