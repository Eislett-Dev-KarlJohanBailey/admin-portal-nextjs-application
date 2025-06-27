
import { useEffect } from "react"

// This hook applies CSS variables for the selected color scheme
export function useColorScheme(colorScheme: string) {
  useEffect(() => {
    const applyColorScheme = () => {
      const root = document.documentElement
      
      // Reset all color scheme variables
      root.style.removeProperty("--primary")
      root.style.removeProperty("--primary-foreground")
      root.style.removeProperty("--accent")
      root.style.removeProperty("--accent-foreground")
      
      // Apply new color scheme
      switch (colorScheme) {
        case "blue":
          root.style.setProperty("--primary", "hsl(221.2 83.2% 53.3%)")
          root.style.setProperty("--primary-foreground", "hsl(210 40% 98%)")
          root.style.setProperty("--accent", "hsl(217.2 32.6% 17.5%)")
          root.style.setProperty("--accent-foreground", "hsl(210 40% 98%)")
          break
        case "green":
          root.style.setProperty("--primary", "hsl(142.1 76.2% 36.3%)")
          root.style.setProperty("--primary-foreground", "hsl(355.7 100% 97.3%)")
          root.style.setProperty("--accent", "hsl(143.8 61.2% 20.2%)")
          root.style.setProperty("--accent-foreground", "hsl(210 40% 98%)")
          break
        case "violet":
          root.style.setProperty("--primary", "hsl(262.1 83.3% 57.8%)")
          root.style.setProperty("--primary-foreground", "hsl(210 40% 98%)")
          root.style.setProperty("--accent", "hsl(263.4 70% 50.4%)")
          root.style.setProperty("--accent-foreground", "hsl(210 40% 98%)")
          break
        case "rose":
          root.style.setProperty("--primary", "hsl(346.8 77.2% 49.8%)")
          root.style.setProperty("--primary-foreground", "hsl(355.7 100% 97.3%)")
          root.style.setProperty("--accent", "hsl(349.7 89.2% 34.1%)")
          root.style.setProperty("--accent-foreground", "hsl(210 40% 98%)")
          break
        case "orange":
          root.style.setProperty("--primary", "hsl(24.6 95% 53.1%)")
          root.style.setProperty("--primary-foreground", "hsl(355.7 100% 97.3%)")
          root.style.setProperty("--accent", "hsl(20.5 90.2% 48.2%)")
          root.style.setProperty("--accent-foreground", "hsl(210 40% 98%)")
          break
        default:
          // Default to blue
          root.style.setProperty("--primary", "hsl(221.2 83.2% 53.3%)")
          root.style.setProperty("--primary-foreground", "hsl(210 40% 98%)")
          root.style.setProperty("--accent", "hsl(217.2 32.6% 17.5%)")
          root.style.setProperty("--accent-foreground", "hsl(210 40% 98%)")
      }
    }
    
    applyColorScheme()
  }, [colorScheme])
}
