import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./auth-slice";
import QuestionPageSlice from "@/store/questions.slice";

export const store = configureStore({
  reducer: {
    AuthSlice,
    QuestionPageSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
