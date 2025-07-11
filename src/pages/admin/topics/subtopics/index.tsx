
import { useEffect, useState, useCallback, useContext } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { DataManagementLayout } from "@/components/layout/DataManagementLayout"
import { DataTable } from "@/components/data/DataTable"
import { DeleteConfirmationDialog } from "@/components/data/DeleteConfirmationDialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/router"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { AuthContext as AuthContextProvider } from "@/contexts/AuthContext"
import { handleFetchSubTopics } from "@/services/subtopics/subTopicsRequest"
import { handleFetchTopic, handleFetchAllTopics } from "@/services/topics/topicsRequest"
import { SubTopicDetails } from "@/models/subTopic/subTopicDetails"
import { TopicDetails } from "@/services/topics/topicsRequest"
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/constants/tablePageSizes"
import { toast } from "@/hooks/use-toast"



export default function SubtopicsPage() {
  const router = useRouter()
  const authContext = useContext(AuthContextProvider)
  const token = authContext?.token

  // State for subtopics data
  const [subtopics, setSubtopics] = useState<SubTopicDetails[]>([])
  const [topics, setTopics] = useState<TopicDetails[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authTimeout, setAuthTimeout] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_NUMBER)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [totalPages, setTotalPages] = useState(1)
  const [totalAmount, setTotalAmount] = useState(0)
  
  // URL-synced state
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [topicFilter, setTopicFilter] = useState<string>("")
  

  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [subtopicToDelete, setSubtopicToDelete] = useState<string | null>(null)

  // Fetch subtopics from API
  const fetchSubtopics = useCallback(async () => {
    if (!token) {
      console.log('No token available, skipping fetch')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await handleFetchSubTopics(token, currentPage, pageSize, topicFilter || undefined)
      
      if (result.error) {
        setError(result.error)
        return
      }

      if (result.data) {
        setSubtopics(result.data)
        setTotalAmount(result.amount || 0)
        if (result.pagination) {
          setTotalPages(result.pagination.total_pages)
        }
      }
    } catch (err) {
      setError('Failed to fetch subtopics')
      console.error('Error fetching subtopics:', err)
    } finally {
      setIsLoading(false)
    }
  }, [token, currentPage, pageSize, topicFilter])

  // Fetch all topics for the dropdown and topic name resolution
  const fetchAllTopics = useCallback(async () => {
    if (!token) {
      console.log('No token available, skipping topics fetch')
      return
    }

    try {
      const result = await handleFetchAllTopics(token, 1, 100)
      if (result.data) {
        setTopics(result.data)
      }
    } catch (err) {
      console.error('Error fetching topics:', err)
    }
  }, [token])

  // Initialize state from URL on first load
  useEffect(() => {
    if (!router.isReady) return
    
    const sortColumnFromUrl = router.query.sortColumn as string
    const sortDirectionFromUrl = router.query.sortDirection as "asc" | "desc"
    if (sortColumnFromUrl) setSortColumn(sortColumnFromUrl)
    if (sortDirectionFromUrl && ["asc", "desc"].includes(sortDirectionFromUrl)) setSortDirection(sortDirectionFromUrl)
    
    const pageFromUrl = router.query.page ? parseInt(router.query.page as string, 10) : DEFAULT_PAGE_NUMBER
    if (!isNaN(pageFromUrl)) setCurrentPage(pageFromUrl)
    
    const searchFromUrl = router.query.search as string
    if (searchFromUrl) setSearchQuery(searchFromUrl)
    
    const topicFilterFromUrl = router.query.topic as string
    if (topicFilterFromUrl) setTopicFilter(topicFilterFromUrl)
    // If no topic filter in URL, set to "all" for UI consistency
    if (!topicFilterFromUrl && topicFilter === "") {
      setTopicFilter("")
    }
  }, [router.isReady, router.query])

  // Debug token availability and handle timeout
  useEffect(() => {
    console.log('Token availability changed:', !!token)
    
    // Set a timeout for authentication loading
    const timeout = setTimeout(() => {
      if (!token) {
        console.log('Authentication timeout - no token available after 5 seconds')
        setAuthTimeout(true)
      }
    }, 5000)
    
    return () => clearTimeout(timeout)
  }, [token])

  // Track if we've attempted to load data
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false)

  // Fetch subtopics when dependencies change
  useEffect(() => {
    if (token) {
      console.log('Fetching subtopics with token available')
      setHasAttemptedLoad(true)
      fetchSubtopics()
    }
  }, [fetchSubtopics, token])

  // Fetch topics when component mounts
  useEffect(() => {
    if (token) {
      console.log('Fetching topics with token available')
      fetchAllTopics()
    }
  }, [fetchAllTopics, token])


  
  const handleAddNew = () => {
    // TODO: Implement add new subtopic page
    toast({
      title: 'Coming Soon',
      description: 'Add new subtopic functionality will be implemented soon.',
    })
  }
  
  const handleEdit = (id: string) => {
    router.push(`/admin/topics/subtopics/edit/${id}`)
  }
  

  
  const handleDeleteClick = (id: string) => {
    setSubtopicToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  const handleDeleteConfirm = () => {
    if (!subtopicToDelete) return
    setIsDeleting(true)
    
    // TODO: Implement actual API call for delete
    setTimeout(() => {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setSubtopicToDelete(null)
      fetchSubtopics() // Refresh data
    }, 1000)
  }
  
  const handleViewSubtopic = (id: string) => {
    router.push(`/admin/topics/subtopics/questions/${id}`)
  }
  
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
    // TODO: Implement server-side search
  }
  
  const handleTopicFilterChange = (value: string) => {
    // Convert "all" to empty string for API calls, but keep "all" for UI state
    const apiValue = value === "all" ? "" : value
    setTopicFilter(apiValue)
    setCurrentPage(1)
    const query = { ...router.query, topic: value === "all" ? undefined : value, page: "1" }
    if (value === "all") delete query.topic
    router.push({ pathname: router.pathname, query })
  }
  
  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column)
    setSortDirection(direction)
    router.push({ pathname: router.pathname, query: { ...router.query, sortColumn: column, sortDirection: direction } })
    // TODO: Implement server-side sorting
  }
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Update URL without shallow routing to ensure proper navigation
    router.push({ pathname: router.pathname, query: { ...router.query, page: page.toString() } })
  }
  
  const handleRefresh = () => {
    fetchSubtopics()
  }
  
  const getTopicName = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId)
    return topic?.name || "N/A"
  }

  // Get all available topics for the filter dropdown
  const getAvailableTopics = () => {
    return topics.map(topic => ({
      id: topic.id,
      name: topic.name
    }))
  }
  
  const filterOptions = [
    {
      id: "topic",
      label: "Topic",
      type: "select" as const,
      value: topicFilter || "all",
      onChange: handleTopicFilterChange,
      placeholder: "Select topic",
      options: [
        { label: "All Topics", value: "all" },
        ...getAvailableTopics().map(topic => ({ label: topic.name, value: topic.id }))
      ]
    }
  ]
  
  const columns = [
    { id: "order", header: "Order", cell: (subtopic: SubTopicDetails) => <span className="text-muted-foreground text-sm">{subtopic.order || "N/A"}</span>, sortable: true },
    { id: "name", header: "Subtopic Name", cell: (subtopic: SubTopicDetails) => <span className="font-medium">{subtopic.name}</span>, sortable: true },
    { id: "topic", header: "Topic", cell: (subtopic: SubTopicDetails) => <span>{getTopicName(subtopic.topicId)}</span>, sortable: true },
    { id: "description", header: "Description", cell: (subtopic: SubTopicDetails) => <span className="truncate block max-w-[300px]">{subtopic.description}</span>, sortable: false },
    { id: "createdAt", header: "Created At", cell: (subtopic: SubTopicDetails) => subtopic.createdAt ? new Date(subtopic.createdAt).toLocaleDateString() : "N/A", sortable: true },
    {
      id: "actions",
      header: "",
      cell: (subtopic: SubTopicDetails) => (
        <div className="flex justify-end">
                      <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewSubtopic(subtopic.id!); }}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(subtopic.id!); }}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteClick(subtopic.id!); }} className="text-destructive focus:text-destructive"><Trash className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ]
  
  const sortOptions = [
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
    { label: "Topic (A-Z)", value: "topic_asc" },
    { label: "Topic (Z-A)", value: "topic_desc" },
    { label: "Order (Ascending)", value: "order_asc" },
    { label: "Order (Descending)", value: "order_desc" },
    { label: "Newest First", value: "createdAt_desc" },
    { label: "Oldest First", value: "createdAt_asc" }
  ]

  const handleSortChange = (value: string) => {
    const [column, direction] = value.split("_")
    handleSort(column, direction as "asc" | "desc")
  }

  const getCurrentSortValue = () => `${sortColumn}_${sortDirection}`
  
  // Show loading state while token is not available
  if (!authContext) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Initializing application...</p>
            <p className="text-sm text-muted-foreground mt-2">Please wait while we set up your environment</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!token) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            {!authTimeout ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading authentication...</p>
                <p className="text-sm text-muted-foreground mt-2">Please wait while we verify your session</p>
                <p className="text-xs text-muted-foreground mt-1">If this takes too long, please try refreshing the page</p>
              </>
            ) : (
              <>
                <div className="text-red-500 mb-4">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-red-600 font-medium">Authentication Error</p>
                <p className="text-sm text-muted-foreground mt-2">Unable to load your authentication session</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4"
                  variant="outline"
                >
                  Refresh Page
                </Button>
              </>
            )}
          </div>
        </div>
      </AdminLayout>
    )
  }

  // Show loading state if we haven't attempted to load data yet
  if (token && !hasAttemptedLoad && !isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Preparing data...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <DataManagementLayout
        title="Subtopics"
        description="Manage all subtopics in the system"
        onAddNew={handleAddNew}
        addNewLabel="Add Subtopic"
        searchPlaceholder="Search subtopics..."
        onSearch={handleSearch}
        sortOptions={sortOptions}
        onSortChange={handleSortChange}
        filterControls={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filterOptions.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <Label htmlFor={filter.id} className="text-sm font-medium">{filter.label}</Label>
                <Select value={filter.value} onValueChange={filter.onChange}>
                  <SelectTrigger id={filter.id}><SelectValue placeholder={filter.placeholder} /></SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        }
        isLoading={isLoading}
        onRefresh={handleRefresh}
        className="px-2 sm:px-4"
        defaultSort={getCurrentSortValue()}
        defaultShowFilters={!!topicFilter}
      >
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start space-x-3">
              <div className="text-red-500 mt-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-red-800 font-medium">Error loading subtopics</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <Button 
                  onClick={handleRefresh} 
                  className="mt-2"
                  size="sm"
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <DataTable
          data={subtopics}
          columns={columns}
          keyExtractor={(item) => item.id!}
          onRowClick={(item) => handleViewSubtopic(item.id!)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: handlePageChange
          }}
          emptyState={
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No subtopics found</p>
              <Button onClick={handleAddNew}>Add your first subtopic</Button>
            </div>
          }
        />
      </DataManagementLayout>
      
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Subtopic"
        description="Are you sure you want to delete this subtopic? This action cannot be undone."
      />
    </AdminLayout>
  )
}
