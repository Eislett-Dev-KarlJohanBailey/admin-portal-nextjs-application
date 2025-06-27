

import { AuthReqParams } from "@/models/Auth/authReqParams";
import { AuthUserDetails } from "@/models/Auth/authUserDetails";
import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthSliceState {
  token: string | undefined
  refreshToken: string | undefined
  userDetails: AuthUserDetails | undefined
  loginReqParams: AuthReqParams
}

const initialState = {
  token: undefined,
  refreshToken: undefined,
  userDetails: undefined ,

  loginReqParams : {
    email : '' ,
    password : ''
  }
}

export const AuthSlice = createSlice({
  name: 'AuthSlice',
  initialState,
  reducers: {
    resetAuthSlice: (state: AuthSliceState) => initialState,

    setAuthToken: (state: AuthSliceState, action: PayloadAction<string | undefined>) => {
      state.token = action.payload
    },

    setAuthRefreshToken: (state: AuthSliceState, action: PayloadAction<string | undefined>) => {
      state.refreshToken = action.payload
    },

    setAuthUserDetails: (state: AuthSliceState, action: PayloadAction<AuthUserDetails | undefined>) => {
      state.userDetails = action.payload
    },

    setAuthReqParams : (state : AuthSliceState, action : PayloadAction<Partial<AuthReqParams>>)=>{
      state.loginReqParams = { ...state.loginReqParams , ...action.payload }
    }

  }
})

// export reducer to be added in src/store/store.ts
export default AuthSlice.reducer;

// export actions to be called in components
export const {
  resetAuthSlice,
  setAuthRefreshToken, setAuthToken , setAuthUserDetails ,
  setAuthReqParams
} = AuthSlice.actions;

export const getAuthToken = (state: RootState): string | undefined => state.AuthSlice.token;
export const getAuthRefreshToken = (state: RootState): string | undefined => state.AuthSlice.refreshToken;
export const getAuthUserDetails = (state: RootState): AuthUserDetails | undefined => state.AuthSlice.userDetails;
export const getAuthReqParams = (state: RootState): AuthReqParams => state.AuthSlice.loginReqParams;


