
import { ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

export interface DataFormDrawerProps {
  title: string
  description?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  isSubmitting?: boolean
  submitLabel?: string
  cancelLabel?: string
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

export function DataFormDrawer({
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  children,
  size = "md"
}: DataFormDrawerProps) {
  const isMobile = useIsMobile()
  
  const handleSubmit = () => {
    onSubmit()
  }
  
  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    full: "sm:max-w-full"
  }
  
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b px-4 pb-4">
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
          <div className="px-4 py-6 overflow-y-auto">{children}</div>
          <DrawerFooter className="border-t px-4 pt-4">
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">{cancelLabel}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={`${sizeClasses[size]} p-0 flex flex-col h-full`}
      >
        <SheetHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle>{title}</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        <SheetFooter className="border-t px-6 py-4">
          <div className="flex justify-end gap-2 w-full">
            <SheetClose asChild>
              <Button variant="outline">{cancelLabel}</Button>
            </SheetClose>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
