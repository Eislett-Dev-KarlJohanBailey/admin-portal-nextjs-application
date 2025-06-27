
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor, RotateCcw, Paintbrush, Palette, Eye } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { useColorScheme } from "@/hooks/useColorScheme"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function AppearanceSettings() {
  const { settings, updateSettings, resetSettings } = useTheme()
  const [localSettings, setLocalSettings] = useState(settings)
  const [hasChanges, setHasChanges] = useState(false)
  
  // Apply color scheme immediately
  useColorScheme(localSettings.colorScheme)
  
  // Update local settings when context settings change
  useEffect(() => {
    setLocalSettings(settings)
    setHasChanges(false)
  }, [settings])
  
  const handleSave = () => {
    updateSettings(localSettings)
    setHasChanges(false)
    toast({
      title: "Settings saved",
      description: "Your appearance settings have been saved.",
    })
  }
  
  const handleReset = () => {
    resetSettings()
    toast({
      title: "Settings reset",
      description: "Your appearance settings have been reset to defaults.",
    })
  }
  
  const handleChange = <K extends keyof typeof localSettings>(
    key: K,
    value: typeof localSettings[K]
  ) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    setHasChanges(true)
    
    // Apply changes immediately
    updateSettings({ [key]: value })
  }
  
  const colorSchemePreview = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    violet: "bg-violet-500",
    rose: "bg-rose-500",
    orange: "bg-orange-500"
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Appearance</h2>
          <p className="text-sm text-muted-foreground">
            Customize how the admin panel looks and feels.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReset}
          className="flex items-center gap-2 self-start sm:self-center"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="whitespace-nowrap">Reset to Defaults</span>
        </Button>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Theme Mode
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Choose your preferred theme mode.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={localSettings.theme} 
              onValueChange={(value) => handleChange("theme", value as "light" | "dark" | "system")}
              className="grid grid-cols-3 gap-2 sm:gap-4"
            >
              <div>
                <RadioGroupItem 
                  value="light" 
                  id="light" 
                  className="peer sr-only" 
                />
                <Label 
                  htmlFor="light" 
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 sm:p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all"
                >
                  <Sun className="mb-2 sm:mb-3 h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                  <span className="text-sm sm:text-base font-medium">Light</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="dark" 
                  id="dark" 
                  className="peer sr-only" 
                />
                <Label 
                  htmlFor="dark" 
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 sm:p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all"
                >
                  <Moon className="mb-2 sm:mb-3 h-6 w-6 sm:h-8 sm:w-8 text-indigo-500" />
                  <span className="text-sm sm:text-base font-medium">Dark</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="system" 
                  id="system" 
                  className="peer sr-only" 
                />
                <Label 
                  htmlFor="system" 
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 sm:p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all"
                >
                  <Monitor className="mb-2 sm:mb-3 h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
                  <span className="text-sm sm:text-base font-medium">System</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Paintbrush className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Color Scheme
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Select your preferred color palette.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
              {(["blue", "green", "violet", "rose", "orange"] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => handleChange("colorScheme", color)}
                  className={`h-14 sm:h-16 rounded-md flex flex-col items-center justify-center gap-1 border-2 transition-all ${
                    localSettings.colorScheme === color 
                      ? "border-primary ring-2 ring-primary/20" 
                      : "border-muted hover:border-primary/50"
                  }`}
                >
                  <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${colorSchemePreview[color]}`}></span>
                  <span className="text-xs font-medium capitalize">{color}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Accessibility
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Customize your viewing experience.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="font-size" className="text-xs sm:text-sm font-medium">Font Size</Label>
                <Badge variant="outline" className="text-xs">{localSettings.fontSize}px</Badge>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-xs">A</span>
                <Slider 
                  id="font-size"
                  min={12} 
                  max={24} 
                  step={1} 
                  value={[localSettings.fontSize]} 
                  onValueChange={(value) => handleChange("fontSize", value[0])} 
                  className="flex-1"
                />
                <span className="text-base sm:text-lg">A</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="contrast" className="text-xs sm:text-sm font-medium">Contrast</Label>
                <Badge variant="outline" className="text-xs">{localSettings.contrast}%</Badge>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-xs opacity-50">Low</span>
                <Slider 
                  id="contrast"
                  min={75} 
                  max={125} 
                  step={5} 
                  value={[localSettings.contrast]} 
                  onValueChange={(value) => handleChange("contrast", value[0])} 
                  className="flex-1"
                />
                <span className="text-xs font-bold">High</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-2">
              <div className="space-y-0.5">
                <Label htmlFor="reduced-motion" className="text-xs sm:text-sm font-medium">Reduced Motion</Label>
                <p className="text-xs text-muted-foreground">Minimize animations throughout the interface</p>
              </div>
              <Switch 
                id="reduced-motion" 
                checked={localSettings.reducedMotion} 
                onCheckedChange={(checked) => handleChange("reducedMotion", checked)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
