"use client"
import { store } from "@/store/store";
import { FunctionComponent, ReactNode } from "react";
import { Provider } from "react-redux";

interface ReduxStoreProviderProps {
  children : ReactNode
}
 
const ReduxStoreProvider: FunctionComponent<ReduxStoreProviderProps> = ({children}) => {
  return ( 
    <Provider store={store}>
      {children}
    </Provider>
   );
}
 
export default ReduxStoreProvider;