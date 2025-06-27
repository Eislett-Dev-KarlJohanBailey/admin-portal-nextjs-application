
import "@/styles/globals.css"
import "katex/dist/katex.min.css"
import type { AppProps } from "next/app"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { Toaster } from "@/components/ui/toaster"
import ReduxStoreProvider from "@/provider/reduxStoreProvider"
import AuthProvider from "@/provider/authProvider"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ReduxStoreProvider>
        <AuthProvider >
          <Component {...pageProps} />
          <Toaster />
        </AuthProvider>
      </ReduxStoreProvider>
    </ThemeProvider>
  )
}
