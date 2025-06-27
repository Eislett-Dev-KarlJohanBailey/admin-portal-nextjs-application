
import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, RefreshCw, Search, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { useRouter } from "next/router"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useDebouncedCallback } from "use-debounce"

export interface DataManagementLayoutProps {
  title: string
  description: string
  children: React.ReactNode
  onAddNew?: () => void
  addNewLabel?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  sortOptions?: { label: string; value: string }[]
  onSortChange?: (value: string) => void
  filterControls?: React.ReactNode
  isLoading?: boolean
  onRefresh?: () => void
  className?: string
  defaultSort?: string
  defaultShowFilters?: boolean
  secondaryActions?: React.ReactNode
}

export function DataManagementLayout({
  title,
  description,
  children,
  onAddNew,
  addNewLabel = "Add New",
  searchPlaceholder = "Search...",
  onSearch,
  sortOptions,
  onSortChange,
  filterControls,
  isLoading = false,
  onRefresh,
  className,
  defaultSort,
  defaultShowFilters = false,
  secondaryActions,
}: DataManagementLayoutProps) {
  const router = useRouter()
  const isMobile = useIsMobile()

  const [internalSearchQuery, setInternalSearchQuery] = useState(router.query.search as string || "")
  // const debouncedSearchQuery = useDebounce(internalSearchQuery, 500)

  const [internalSortValue, setInternalSortValue] = useState(defaultSort || (sortOptions && sortOptions.length > 0 ? sortOptions[0].value : ""))
  const [showFilters, setShowFilters] = useState(defaultShowFilters)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const initialize = useDebouncedCallback(() => {

    const querySearch = router.query.search as string || ""
    if (querySearch !== internalSearchQuery) {
      setInternalSearchQuery(querySearch)
    }

    const querySort = router.query.sort as string || defaultSort || (sortOptions && sortOptions.length > 0 ? sortOptions[0].value : "")
    if (querySort !== internalSortValue) {
      setInternalSortValue(querySort)
    }

    const showFiltersValue = router.query.showFilters === "true"
    setShowFilters(showFiltersValue)

    // Only set sheet open if on mobile and filters should be shown
    if (isMobile && showFiltersValue) {
      setIsSheetOpen(true)
    }

  }, 300);

  useEffect(() => {
    if (router.isReady)
      initialize()
  }, [router.isReady, initialize])

  // useEffect(() => {
  //   if (onSearch) {
  //     onSearch(debouncedSearchQuery)
  //   }
  //   const currentQuery = { ...router.query }
  //   if (debouncedSearchQuery) {
  //     currentQuery.search = debouncedSearchQuery
  //   } else {
  //     delete currentQuery.search
  //   }
  //   if (Object.keys(currentQuery).length > 0 || router.pathname !== router.asPath.split("?")[0]) {
  //     router.push({ pathname: router.pathname, query: currentQuery }, undefined, { shallow: true })
  //   }

  // }, [debouncedSearchQuery, onSearch, router])

  const updateRoutePath = useDebouncedCallback((searchVal: string) => {
    const currentQuery = { ...router.query }
    if (searchVal.length > 0) {
      currentQuery.search = searchVal
    } else {
      delete currentQuery.search
    }
    if (Object.keys(currentQuery).length > 0 || router.pathname !== router.asPath.split("?")[0]) {
      router.push({ pathname: router.pathname, query: currentQuery }, undefined, { shallow: true })
    }
  }, 500);
  
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const searchVal = event.target.value ?? ''
    setInternalSearchQuery(searchVal)
    
    // update url pathname 
    updateRoutePath(searchVal);

    if (onSearch) {
      onSearch(searchVal)
    }

  }, [onSearch, updateRoutePath])

  const handleClearSearch = useCallback(() => {
    setInternalSearchQuery("")
    if (onSearch) {
      onSearch("")
    }
    const { search, ...restQuery } = router.query
    router.push({ pathname: router.pathname, query: restQuery }, undefined, { shallow: true })
  }, [onSearch, router])

  const handleSortChange = useCallback((value: string) => {
    setInternalSortValue(value)
    if (onSortChange) {
      onSortChange(value)
    }
    router.push({ pathname: router.pathname, query: { ...router.query, sort: value } }, undefined, { shallow: true })
  }, [onSortChange, router])

  const toggleFilters = useCallback(() => {
    const newShowFilters = !showFilters
    setShowFilters(newShowFilters)

    // For mobile, also control the sheet state
    if (isMobile) {
      setIsSheetOpen(newShowFilters)
    }

    const currentQuery = { ...router.query }
    if (newShowFilters) {
      currentQuery.showFilters = "true"
    } else {
      delete currentQuery.showFilters
    }

    router.push({ pathname: router.pathname, query: currentQuery }, undefined, { shallow: true })
  }, [isMobile, router, showFilters])

  const handleSheetOpenChange = useCallback((open: boolean) => {
    setIsSheetOpen(open)

    // Only update showFilters and URL if the sheet state actually changed
    if (showFilters !== open) {
      setShowFilters(open)

      const currentQuery = { ...router.query }
      if (open) {
        currentQuery.showFilters = "true"
      } else {
        delete currentQuery.showFilters
      }

      router.push({ pathname: router.pathname, query: currentQuery }, undefined, { shallow: true })
    }
  }, [router, showFilters]);

  // Render the filter controls based on device type
  const renderFilterControls = useMemo(() => {
    if (!filterControls) return null;

    if (isMobile) {
      return (
        <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline" className="ml-2">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-4">
              {filterControls}
            </div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <>
        <Button variant="outline" onClick={toggleFilters} className="ml-2">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>

        {showFilters && (
          <div className="w-full mt-4 p-4 border rounded-md bg-card">
            {filterControls}
          </div>
        )}
      </>
    )
  }, [filterControls, handleSheetOpenChange, isMobile, isSheetOpen, showFilters, toggleFilters])

  return (
    <div className={cn("p-4 sm:p-6 lg:p-8 space-y-6", className)}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          {secondaryActions}
          {onAddNew && (
            <Button onClick={onAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {addNewLabel}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {onSearch && (
            <div className="relative flex-grow md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={internalSearchQuery}
                onChange={handleSearchChange}
                className="pl-10 w-full"
              />
              {internalSearchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {sortOptions && sortOptions.length > 0 && onSortChange && (
              <Select value={internalSortValue} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full md:w-auto min-w-[180px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {filterControls && (
              <>
                {isMobile ? (
                  <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="ml-2">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[300px] sm:w-[400px]">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="py-4 space-y-4">
                        {filterControls}
                      </div>
                    </SheetContent>
                  </Sheet>
                ) : (
                  <Button variant="outline" onClick={toggleFilters} className="ml-2">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </Button>
                )}
              </>
            )}

            {onRefresh && (
              <Button variant="outline" size="icon" onClick={onRefresh} disabled={isLoading} title="Refresh data">
                <RefreshCw className={cn("h-4 w-4", { "animate-spin": isLoading })} />
              </Button>
            )}
          </div>
        </div>

        {!isMobile && showFilters && filterControls && (
          <div className="p-4 border rounded-md bg-card">
            {filterControls}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
          <p className="ml-2 text-muted-foreground">Loading data...</p>
        </div>
      )}
      {!isLoading && children}
    </div>
  )
}
