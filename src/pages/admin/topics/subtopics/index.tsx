
import { useEffect, useState, useCallback, useContext } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { DataManagementLayout } from "@/components/layout/DataManagementLayout"
import { DataTable } from "@/components/data/DataTable"
import { DataFormDrawer } from "@/components/data/DataFormDrawer"
import { DeleteConfirmationDialog } from "@/components/data/DeleteConfirmationDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { useAuth } from "@/contexts/AuthContext"
import { handleFetchSubTopics } from "@/services/subtopics/subTopicsRequest"
import { handleFetchTopic } from "@/services/topics/topicsRequest"
import { SubTopicDetails } from "@/models/subTopic/subTopicDetails"
import { TopicDetails } from "@/services/topics/topicsRequest"
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "@/constants/tablePageSizes"

// Subtopic form type
interface SubtopicFormData {
  id?: string
  name: string
  description: string
  topicId: string
  createdAt?: string
}

export default function SubtopicsPage() {
  const router = useRouter()
  const authContext = useContext(useAuth())
  const token = authContext?.token

  // State for subtopics data
  const [subtopics, setSubtopics] = useState<SubTopicDetails[]>([])
  const [topics, setTopics] = useState<Map<string, TopicDetails>>(new Map())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
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
  
  // Form drawer state
  const [formDrawerOpen, setFormDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentSubtopic, setCurrentSubtopic] = useState<SubtopicFormData>({
    name: "",
    description: "",
    topicId: ""
  })
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [subtopicToDelete, setSubtopicToDelete] = useState<string | null>(null)

  // Fetch subtopics from API
  const fetchSubtopics = useCallback(async () => {
    if (!token) return

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

  // Fetch topic details for a given topic ID
  const fetchTopicDetails = useCallback(async (topicId: string) => {
    if (!token || topics.has(topicId)) return

    try {
      const result = await handleFetchTopic(token, topicId)
      if (result.data) {
        setTopics(prev => new Map(prev).set(topicId, result.data))
      }
    } catch (err) {
      console.error('Error fetching topic details:', err)
    }
  }, [token, topics])

  // Fetch topic details for all subtopics
  const fetchTopicDetailsForSubtopics = useCallback(async () => {
    const uniqueTopicIds = [...new Set(subtopics.map(subtopic => subtopic.topicId))]
    await Promise.all(uniqueTopicIds.map(topicId => fetchTopicDetails(topicId)))
  }, [subtopics, fetchTopicDetails])

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
  }, [router.isReady, router.query])

  // Fetch subtopics when dependencies change
  useEffect(() => {
    fetchSubtopics()
  }, [fetchSubtopics])

  // Fetch topic details when subtopics change
  useEffect(() => {
    fetchTopicDetailsForSubtopics()
  }, [fetchTopicDetailsForSubtopics])

  const handleFormChange = (field: keyof SubtopicFormData, value: string) => {
    setCurrentSubtopic(prev => ({ ...prev, [field]: value }))
  }
  
  const handleAddNew = () => {
    setCurrentSubtopic({
      name: "",
      description: "",
      topicId: router.query.topic as string || ""
    })
    setIsEditMode(false)
    setFormDrawerOpen(true)
  }
  
  const handleEdit = (id: string) => {
    const subtopicToEdit = subtopics.find(subtopic => subtopic.id === id)
    if (subtopicToEdit) {
      setCurrentSubtopic(subtopicToEdit)
      setIsEditMode(true)
      setFormDrawerOpen(true)
    }
  }
  
  const handleFormSubmit = () => {
    setIsSubmitting(true)
    if (!currentSubtopic.name || !currentSubtopic.topicId) {
      setIsSubmitting(false)
      return
    }
    
    // TODO: Implement actual API calls for create/update
    setTimeout(() => {
      setIsSubmitting(false)
      setFormDrawerOpen(false)
      fetchSubtopics() // Refresh data
    }, 1000)
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
    setTopicFilter(value)
    setCurrentPage(1)
    const query = { ...router.query, topic: value || undefined, page: "1" }
    if (!value) delete query.topic
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
    const topic = topics.get(topicId)
    return topic?.name || "N/A"
  }

  // Get all available topics for the filter dropdown
  const getAvailableTopics = () => {
    const topicIds = [...new Set(subtopics.map(subtopic => subtopic.topicId))]
    return topicIds.map(topicId => ({
      id: topicId,
      name: getTopicName(topicId)
    })).filter(topic => topic.name !== "N/A")
  }
  
  const filterOptions = [
    {
      id: "topic",
      label: "Topic",
      type: "select" as const,
      value: topicFilter,
      onChange: handleTopicFilterChange,
      placeholder: "Select topic",
      options: [
        { label: "All Topics", value: "" },
        ...getAvailableTopics().map(topic => ({ label: topic.name, value: topic.id }))
      ]
    }
  ]
  
  const columns = [
    { id: "id", header: "ID", cell: (subtopic: SubTopicDetails) => <span className="text-muted-foreground text-sm">{subtopic.id}</span>, sortable: true },
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
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewSubtopic(subtopic.id!)}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(subtopic.id!)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteClick(subtopic.id!)} className="text-destructive focus:text-destructive"><Trash className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
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
    { label: "ID (Ascending)", value: "id_asc" },
    { label: "ID (Descending)", value: "id_desc" },
    { label: "Newest First", value: "createdAt_desc" },
    { label: "Oldest First", value: "createdAt_asc" }
  ]

  const handleSortChange = (value: string) => {
    const [column, direction] = value.split("_")
    handleSort(column, direction as "asc" | "desc")
  }

  const getCurrentSortValue = () => `${sortColumn}_${sortDirection}`
  
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
            <p className="text-red-800">{error}</p>
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
      
      <DataFormDrawer
        title={isEditMode ? "Edit Subtopic" : "Add New Subtopic"}
        description={isEditMode ? "Update subtopic details" : "Create a new subtopic"}
        open={formDrawerOpen}
        onOpenChange={setFormDrawerOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitLabel={isEditMode ? "Save Changes" : "Create Subtopic"}
        size="md"
      >
        <div className="space-y-6">
          {isEditMode && currentSubtopic.id && (
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input id="id" value={currentSubtopic.id} readOnly disabled className="bg-muted" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Subtopic Name</Label>
            <Input id="name" value={currentSubtopic.name} onChange={(e) => handleFormChange("name", e.target.value)} placeholder="Enter subtopic name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Select value={currentSubtopic.topicId} onValueChange={(value) => handleFormChange("topicId", value)}>
              <SelectTrigger id="topic"><SelectValue placeholder="Select topic" /></SelectTrigger>
              <SelectContent>
                {getAvailableTopics().map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>{topic.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={currentSubtopic.description} onChange={(e) => handleFormChange("description", e.target.value)} placeholder="Enter subtopic description" rows={4} />
          </div>
          {isEditMode && currentSubtopic.createdAt && (
            <div className="space-y-2">
              <Label htmlFor="createdAt">Created At</Label>
              <Input id="createdAt" value={new Date(currentSubtopic.createdAt).toLocaleDateString()} readOnly disabled className="bg-muted" />
            </div>
          )}
        </div>
      </DataFormDrawer>
      
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
