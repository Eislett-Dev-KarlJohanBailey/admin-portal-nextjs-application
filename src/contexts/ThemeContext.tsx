
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"
type ColorScheme = "blue" | "green" | "violet" | "rose" | "orange"

interface ThemeSettings {
  theme: Theme
  fontSize: number
  contrast: number
  reducedMotion: boolean
  colorScheme: ColorScheme
}

interface ThemeContextType {
  settings: ThemeSettings
  updateSettings: (settings: Partial<ThemeSettings>) => void
  resetSettings: () => void
}

const defaultSettings: ThemeSettings = {
  theme: "system",
  fontSize: 16,
  contrast: 100,
  reducedMotion: false,
  colorScheme: "blue"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings)
  const [loaded, setLoaded] = useState(false)

  // Load settings from localStorage on mount (only in browser)
  useEffect(() => {
    if (!isBrowser) return

    const savedSettings = localStorage.getItem("theme-settings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings(parsedSettings)
      } catch (error) {
        console.error("Failed to parse theme settings:", error)
      }
    }
    setLoaded(true)
  }, [])

  // Apply theme when settings change (only in browser)
  useEffect(() => {
    if (!isBrowser || !loaded) return

    // Save to localStorage
    localStorage.setItem("theme-settings", JSON.stringify(settings))

    // Apply theme
    const root = document.documentElement
    const isDark = 
      settings.theme === "dark" || 
      (settings.theme === "system" && 
        window.matchMedia("(prefers-color-scheme: dark)").matches)

    // Apply dark/light mode
    if (isDark) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    // Apply font size
    root.style.fontSize = `${settings.fontSize}px`

    // Apply contrast
    root.style.filter = `contrast(${settings.contrast}%)`

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }

    // Apply color scheme
    root.setAttribute("data-color-scheme", settings.colorScheme)

    // Listen for system theme changes if using system theme
    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          root.classList.add("dark")
        } else {
          root.classList.remove("dark")
        }
      }
      
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [settings, loaded])

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
