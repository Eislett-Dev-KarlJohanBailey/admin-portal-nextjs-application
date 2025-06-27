
import { useEffect, useState, useCallback } from "react"
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

// Subtopic data type
interface Subtopic {
  id: string
  name: string
  description: string
  topicId: string
  createdAt: string
}

// Subtopic form type
interface SubtopicFormData {
  id?: string
  name: string
  description: string
  topicId: string
  createdAt?: string
}

// Mock data for demonstration
const MOCK_TOPICS = [
  { 
    id: "1", 
    name: "Limits and Continuity", 
    description: "Introduction to the concept of limits and continuity in calculus",
    courseId: "1",
    createdAt: "2025-01-15"
  },
  { 
    id: "2", 
    name: "Newton's Laws of Motion", 
    description: "Fundamental principles governing the motion of objects",
    courseId: "2",
    createdAt: "2025-02-10"
  },
  { 
    id: "3", 
    name: "Hamlet Analysis", 
    description: "In-depth analysis of Shakespeare's Hamlet",
    courseId: "3",
    createdAt: "2025-03-05"
  },
  { 
    id: "4", 
    name: "D-Day Invasion", 
    description: "Study of the Allied invasion of Normandy",
    courseId: "4",
    createdAt: "2025-01-20"
  },
  { 
    id: "5", 
    name: "Binary Trees", 
    description: "Implementation and applications of binary trees",
    courseId: "5",
    createdAt: "2025-02-25"
  }
]

const MOCK_SUBTOPICS: Subtopic[] = [
  { 
    id: "1", 
    name: "Epsilon-Delta Definition", 
    description: "Formal definition of limits using epsilon-delta notation",
    topicId: "1",
    createdAt: "2025-01-16"
  },
  { 
    id: "2", 
    name: "Limit Laws", 
    description: "Properties and rules for calculating limits",
    topicId: "1",
    createdAt: "2025-01-17"
  },
  { 
    id: "3", 
    name: "First Law of Motion", 
    description: "An object at rest stays at rest, and an object in motion stays in motion",
    topicId: "2",
    createdAt: "2025-02-11"
  },
  { 
    id: "4", 
    name: "Second Law of Motion", 
    description: "Force equals mass times acceleration (F = ma)",
    topicId: "2",
    createdAt: "2025-02-12"
  },
  { 
    id: "5", 
    name: "Character Analysis", 
    description: "In-depth study of Hamlet's character and motivations",
    topicId: "3",
    createdAt: "2025-03-06"
  },
  { 
    id: "6", 
    name: "Themes and Motifs", 
    description: "Recurring themes and literary devices in Hamlet",
    topicId: "3",
    createdAt: "2025-03-07"
  },
  { 
    id: "7", 
    name: "Planning and Preparation", 
    description: "Allied planning and preparation for the D-Day invasion",
    topicId: "4",
    createdAt: "2025-01-21"
  },
  { 
    id: "8", 
    name: "Execution and Aftermath", 
    description: "The execution of the D-Day invasion and its aftermath",
    topicId: "4",
    createdAt: "2025-01-22"
  },
  { 
    id: "9", 
    name: "Tree Traversal", 
    description: "Methods for visiting all nodes in a binary tree",
    topicId: "5",
    createdAt: "2025-02-26"
  },
  { 
    id: "10", 
    name: "Balanced Trees", 
    description: "Techniques for maintaining balanced binary trees",
    topicId: "5",
    createdAt: "2025-02-27"
  }
]


export default function SubtopicsPage() {
  const router = useRouter()
  const [subtopics, setSubtopics] = useState<Subtopic[]>(MOCK_SUBTOPICS)
  const [filteredSubtopics, setFilteredSubtopics] = useState<Subtopic[]>(MOCK_SUBTOPICS)
  const [topics, setTopics] = useState(MOCK_TOPICS) // This should be Topic[] if you define Topic interface
  const [isLoading, setIsLoading] = useState(false)
  
  // URL-synced state
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
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
  
  // Apply all filters, sorting, and pagination
  const applyFilters = useCallback(() => {
    setIsLoading(true)
    
    let result = [...subtopics]
    
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase()
      result = result.filter(subtopic => 
        subtopic.name.toLowerCase().includes(lowerSearch) || 
        subtopic.description.toLowerCase().includes(lowerSearch)
      )
    }
    
    if (topicFilter) {
      result = result.filter(subtopic => subtopic.topicId === topicFilter)
    }
    
    result.sort((a, b) => {
      let comparison = 0
      const valA = a[sortColumn as keyof Subtopic]
      const valB = b[sortColumn as keyof Subtopic]

      if (sortColumn === "topic") {
        const topicA = topics.find(t => t.id === a.topicId)?.name || ""
        const topicB = topics.find(t => t.id === b.topicId)?.name || ""
        comparison = topicA.localeCompare(topicB)
      } else if (typeof valA === "string" && typeof valB === "string") {
        comparison = valA.localeCompare(valB)
      } else if (typeof valA === "number" && typeof valB === "number") {
        comparison = valA - valB
      } else if (sortColumn === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return sortDirection === "asc" ? comparison : -comparison
    })
    
    setFilteredSubtopics(result)
    setIsLoading(false)
  }, [subtopics, searchQuery, topicFilter, sortColumn, sortDirection, topics])

  // Initialize state from URL on first load
  useEffect(() => {
    if (!router.isReady) return
    
    const sortColumnFromUrl = router.query.sortColumn as string
    const sortDirectionFromUrl = router.query.sortDirection as "asc" | "desc"
    if (sortColumnFromUrl) setSortColumn(sortColumnFromUrl)
    if (sortDirectionFromUrl && ["asc", "desc"].includes(sortDirectionFromUrl)) setSortDirection(sortDirectionFromUrl)
    
    const pageFromUrl = router.query.page ? parseInt(router.query.page as string, 10) : 1
    if (!isNaN(pageFromUrl)) setCurrentPage(pageFromUrl)
    
    const searchFromUrl = router.query.search as string
    if (searchFromUrl) setSearchQuery(searchFromUrl)
    
    const topicFilterFromUrl = router.query.topic as string
    if (topicFilterFromUrl) setTopicFilter(topicFilterFromUrl)
    
    applyFilters()
  }, [router.isReady, router.query, applyFilters])
  
  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters()
  }, [subtopics, searchQuery, topicFilter, sortColumn, sortDirection, applyFilters])
  
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
    
    setTimeout(() => {
      if (isEditMode && currentSubtopic.id) {
        const originalSubtopic = subtopics.find(s => s.id === currentSubtopic.id)
        if (originalSubtopic) {
          const updatedSubtopic: Subtopic = {
            id: currentSubtopic.id,
            name: currentSubtopic.name,
            description: currentSubtopic.description,
            topicId: currentSubtopic.topicId,
            createdAt: originalSubtopic.createdAt
          }
          setSubtopics(prev => prev.map(s => (s.id === updatedSubtopic.id ? updatedSubtopic : s)))
        }
      } else {
        const newSubtopic: Subtopic = {
          name: currentSubtopic.name,
          description: currentSubtopic.description,
          topicId: currentSubtopic.topicId,
          id: `${Date.now()}`, // Using timestamp for more unique ID
          createdAt: new Date().toISOString().split("T")[0]
        }
        setSubtopics(prev => [...prev, newSubtopic])
      }
      setIsSubmitting(false)
      setFormDrawerOpen(false)
    }, 1000)
  }
  
  const handleDeleteClick = (id: string) => {
    setSubtopicToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  const handleDeleteConfirm = () => {
    if (!subtopicToDelete) return
    setIsDeleting(true)
    setTimeout(() => {
      setSubtopics(subtopics.filter(subtopic => subtopic.id !== subtopicToDelete))
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setSubtopicToDelete(null)
    }, 1000)
  }
  
  const handleViewSubtopic = (id: string) => {
    router.push(`/admin/topics/subtopics/${id}`)
  }
  
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }
  
  const handleTopicFilterChange = (value: string) => {
    setTopicFilter(value)
    setCurrentPage(1)
    const query = { ...router.query, topic: value || undefined, page: "1" }
    if (!value) delete query.topic
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true })
  }
  
  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column)
    setSortDirection(direction)
    router.push({ pathname: router.pathname, query: { ...router.query, sortColumn: column, sortDirection: direction } }, undefined, { shallow: true })
  }
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    router.push({ pathname: router.pathname, query: { ...router.query, page: page.toString() } }, undefined, { shallow: true })
  }
  
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      applyFilters()
      setIsLoading(false)
    }, 500)
  }
  
  const getPaginatedData = () => {
    const itemsPerPage = 10
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredSubtopics.slice(startIndex, startIndex + itemsPerPage)
  }
  
  const getTopicName = (topicId: string) => topics.find(topic => topic.id === topicId)?.name || "Unknown"
  
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
        ...topics.map(topic => ({ label: topic.name, value: topic.id }))
      ]
    }
  ]
  
  const columns = [
    { id: "id", header: "ID", cell: (subtopic: Subtopic) => <span className="text-muted-foreground text-sm">{subtopic.id}</span>, sortable: true },
    { id: "name", header: "Subtopic Name", cell: (subtopic: Subtopic) => <span className="font-medium">{subtopic.name}</span>, sortable: true },
    { id: "topic", header: "Topic", cell: (subtopic: Subtopic) => <span>{getTopicName(subtopic.topicId)}</span>, sortable: true },
    { id: "description", header: "Description", cell: (subtopic: Subtopic) => <span className="truncate block max-w-[300px]">{subtopic.description}</span>, sortable: false },
    { id: "createdAt", header: "Created At", cell: (subtopic: Subtopic) => new Date(subtopic.createdAt).toLocaleDateString(), sortable: true },
    {
      id: "actions",
      header: "",
      cell: (subtopic: Subtopic) => (
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
              <DropdownMenuItem onClick={() => handleViewSubtopic(subtopic.id)}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(subtopic.id)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteClick(subtopic.id)} className="text-destructive focus:text-destructive"><Trash className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
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
        <DataTable
          data={getPaginatedData()}
          columns={columns}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => handleViewSubtopic(item.id)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            currentPage,
            totalPages: Math.max(1, Math.ceil(filteredSubtopics.length / 10)),
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
                {topics.map((topic) => (
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
