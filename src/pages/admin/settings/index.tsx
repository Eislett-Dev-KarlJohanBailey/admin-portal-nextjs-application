
import { useState } from "react"
import dynamic from "next/dynamic"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Bell, Shield, Globe } from "lucide-react"

// Import AppearanceSettings with SSR disabled
const AppearanceSettings = dynamic(
  () => import("@/components/settings/AppearanceSettings").then(mod => mod.AppearanceSettings),
  { ssr: false }
)

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("appearance")

  return (
    <AdminLayout>
      <div className="space-y-6 px-2 sm:px-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <Tabs defaultValue="appearance" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="overflow-x-auto pb-2 -mx-2 px-2">
            <TabsList className="w-full grid grid-cols-4 gap-1 sm:gap-2">
              <TabsTrigger value="appearance" className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4">
                <Palette className="h-4 w-4" />
                <span className="hidden xs:inline text-xs sm:text-sm">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4">
                <Bell className="h-4 w-4" />
                <span className="hidden xs:inline text-xs sm:text-sm">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4">
                <Shield className="h-4 w-4" />
                <span className="hidden xs:inline text-xs sm:text-sm">Security</span>
              </TabsTrigger>
              <TabsTrigger value="localization" className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4">
                <Globe className="h-4 w-4" />
                <span className="hidden xs:inline text-xs sm:text-sm">Localization</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="appearance" className="space-y-4">
            <AppearanceSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Notification settings will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your security preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Security settings will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="localization">
            <Card>
              <CardHeader>
                <CardTitle>Localization</CardTitle>
                <CardDescription>
                  Manage language and regional settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Localization settings will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
