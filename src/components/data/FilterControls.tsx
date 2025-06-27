
import { ReactNode, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useRouter } from "next/router"

export interface FilterOption {
  id: string
  label: string
  type: "select" | "checkbox" | "text" | "date" | "number" | "custom"
  options?: {
    label: string
    value: string
  }[]
  value?: any
  onChange?: (value: any) => void
  placeholder?: string
  component?: ReactNode
  queryParam?: string
}

export interface FilterControlsProps {
  filters: FilterOption[]
  onApply?: () => void
  onReset?: () => void
  className?: string
}

export function FilterControls({
  filters,
  onApply,
  onReset,
  className
}: FilterControlsProps) {
  const router = useRouter()
  
  // Initialize filters from URL query params
  useEffect(() => {
    if (!router.isReady) return
    
    filters.forEach(filter => {
      const paramName = filter.queryParam || filter.id
      const queryValue = router.query[paramName]
      
      if (queryValue !== undefined && filter.onChange) {
        if (filter.type === "checkbox" && filter.options) {
          // Handle checkbox groups (array values)
          const values = Array.isArray(queryValue) ? queryValue : [queryValue]
          filter.onChange(values)
        } else if (filter.type === "select") {
          // Handle select (single value)
          filter.onChange(Array.isArray(queryValue) ? queryValue[0] : queryValue)
        } else if (filter.type === "number") {
          // Handle number inputs
          filter.onChange(Number(Array.isArray(queryValue) ? queryValue[0] : queryValue))
        } else {
          // Handle text and date inputs
          filter.onChange(Array.isArray(queryValue) ? queryValue[0] : queryValue)
        }
      }
    })
  }, [router.isReady, router.query, filters])
  
  const handleFilterChange = (filter: FilterOption, value: any) => {
    if (filter.onChange) {
      filter.onChange(value)
    }
    
    // Update URL immediately for individual filter changes
    const paramName = filter.queryParam || filter.id
    const query = { ...router.query }
    
    if (value === undefined || value === null || value === "") {
      delete query[paramName]
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        query[paramName] = value
      } else {
        delete query[paramName]
      }
    } else {
      query[paramName] = String(value)
    }
    
    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true })
  }
  
  const handleApply = () => {
    if (onApply) {
      onApply()
    }
  }
  
  const handleReset = () => {
    // Clear filter-related query params
    const query = { ...router.query }
    
    filters.forEach(filter => {
      const paramName = filter.queryParam || filter.id
      delete query[paramName]
      
      // Reset filter state if onChange is provided
      if (filter.onChange) {
        if (filter.type === "checkbox") {
          filter.onChange([])
        } else {
          filter.onChange("")
        }
      }
    })
    
    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true })
    
    if (onReset) {
      onReset()
    }
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filters.map((filter) => (
          <div key={filter.id} className="space-y-2">
            <Label htmlFor={filter.id} className="text-sm font-medium">
              {filter.label}
            </Label>
            
            {filter.type === "select" && filter.options && (
              <Select 
                value={filter.value?.toString()} 
                onValueChange={(value) => handleFilterChange(filter, value)}
              >
                <SelectTrigger id={filter.id}>
                  <SelectValue placeholder={filter.placeholder || "Select option"} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {filter.type === "checkbox" && filter.options && (
              <div className="space-y-2">
                {filter.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${filter.id}-${option.value}`}
                      checked={Array.isArray(filter.value) && filter.value.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (Array.isArray(filter.value)) {
                          const newValue = checked
                            ? [...filter.value, option.value]
                            : filter.value.filter((v) => v !== option.value)
                          
                          handleFilterChange(filter, newValue)
                        } else {
                          handleFilterChange(filter, checked ? [option.value] : [])
                        }
                      }}
                    />
                    <Label 
                      htmlFor={`${filter.id}-${option.value}`}
                      className="text-sm font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            
            {filter.type === "text" && (
              <Input
                id={filter.id}
                type="text"
                value={filter.value || ""}
                onChange={(e) => handleFilterChange(filter, e.target.value)}
                placeholder={filter.placeholder}
              />
            )}
            
            {filter.type === "date" && (
              <Input
                id={filter.id}
                type="date"
                value={filter.value || ""}
                onChange={(e) => handleFilterChange(filter, e.target.value)}
              />
            )}
            
            {filter.type === "number" && (
              <Input
                id={filter.id}
                type="number"
                value={filter.value || ""}
                onChange={(e) => handleFilterChange(filter, e.target.value ? Number(e.target.value) : "")}
                placeholder={filter.placeholder}
              />
            )}
            
            {filter.type === "custom" && filter.component}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-2">
        {onReset && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleReset}
          >
            Reset
          </Button>
        )}
        
        {onApply && (
          <Button 
            size="sm"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        )}
      </div>
    </div>
  )
}
