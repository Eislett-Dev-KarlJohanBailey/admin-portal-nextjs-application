import { AuthUserDetails } from "./authUserDetails"

export interface AuthContextProps {
  token : string | undefined
  setToken : (newToken : string | undefined) => void
  userDetails : AuthUserDetails | undefined
  setUserDetails : (userDetails : AuthUserDetails | undefined) => void
 }