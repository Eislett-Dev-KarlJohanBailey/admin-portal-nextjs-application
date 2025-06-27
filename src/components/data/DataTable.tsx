
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import { useRouter } from "next/router"

export interface Column<T> {
  id: string
  header: string | ReactNode
  cell: (item: T) => ReactNode
  sortable?: boolean
  className?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string | number
  onRowClick?: (item: T) => void
  sortColumn?: string
  sortDirection?: "asc" | "desc"
  onSort?: (column: string, direction: "asc" | "desc") => void
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  isLoading?: boolean
  emptyState?: ReactNode
  rowClassName?: (item: T) => string
  className?: string
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
  pagination,
  isLoading = false,
  emptyState,
  rowClassName,
  className
}: DataTableProps<T>) {
  const router = useRouter()
  
  // Initialize pagination from URL
  useEffect(() => {
    if (!router.isReady || !pagination) return
    
    const pageFromUrl = router.query.page ? parseInt(router.query.page as string, 10) : null
    if (pageFromUrl && pageFromUrl !== pagination.currentPage && pageFromUrl <= pagination.totalPages) {
      pagination.onPageChange(pageFromUrl)
    }
  }, [router.isReady, router.query, pagination])
  
  const handleSort = useCallback((columnId: string) => {
    if (!onSort) return
    
    const newDirection = 
      sortColumn === columnId && sortDirection === "asc" ? "desc" : "asc"
    
    // Update URL
    const query = { 
      ...router.query, 
      sortColumn: columnId, 
      sortDirection: newDirection 
    }
    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true })
    
    onSort(columnId, newDirection)
  }, [onSort, router, sortColumn, sortDirection]);
  
  const handlePageChange = useCallback((page: number) => {
    if (!pagination) return
    
    // Update URL
    const query = { ...router.query, page: page.toString() }
    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true })
    
    pagination.onPageChange(page)
  }, [pagination, router])
  
  const renderSortIcon = useCallback((columnId: string) => {
    if (sortColumn !== columnId) {
      return <ChevronsUpDown className="ml-1 h-4 w-4" />
    }
    
    return sortDirection === "asc" 
      ? <ChevronUp className="ml-1 h-4 w-4" />
      : <ChevronDown className="ml-1 h-4 w-4" />
  }, [sortColumn, sortDirection] )
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.id}
                  className={cn(column.className)}
                >
                  {column.sortable && onSort ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                      onClick={() => handleSort(column.id)}
                    >
                      {column.header}
                      {renderSortIcon(column.id)}
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="h-24 text-center"
                >
                  {emptyState || (
                    <div className="text-muted-foreground">
                      No results found.
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow
                  key={keyExtractor(item)}
                  className={cn(
                    onRowClick && "cursor-pointer hover:bg-accent/50",
                    rowClassName && rowClassName(item)
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={`${keyExtractor(item)}-${column.id}`}
                      className={column.className}
                    >
                      {column.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {pagination && pagination.totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  if (pagination.currentPage > 1) {
                    handlePageChange(pagination.currentPage - 1)
                  }
                }}
                className={pagination.currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: pagination.totalPages }).map((_, index) => {
              const page = index + 1
              // Show current page, first, last, and pages around current
              const shouldShow = 
                page === 1 || 
                page === pagination.totalPages || 
                Math.abs(page - pagination.currentPage) <= 1
              
              if (!shouldShow && page === 2 || !shouldShow && page === pagination.totalPages - 1) {
                return (
                  <PaginationItem key={page} className="flex items-center justify-center">
                    <span className="px-1">...</span>
                  </PaginationItem>
                )
              }
              
              if (!shouldShow) return null
              
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(page)
                    }}
                    isActive={page === pagination.currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  if (pagination.currentPage < pagination.totalPages) {
                    handlePageChange(pagination.currentPage + 1)
                  }
                }}
                className={pagination.currentPage >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
