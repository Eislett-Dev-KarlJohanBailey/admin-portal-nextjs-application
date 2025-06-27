
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
import { Edit, Eye, MoreHorizontal, Trash, BookCopy } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/router"

// Subject data type
interface Subject {
  id: string
  name: string
  description: string
  createdAt: string
}

// Subject form type
interface SubjectFormData {
  id?: string
  name: string
  description: string
  createdAt?: string
}

// Mock data for demonstration
const MOCK_SUBJECTS: Subject[] = [
  { 
    id: "1", 
    name: "Mathematics", 
    description: "The study of numbers, quantity, space, structure, and change.",
    createdAt: "2025-01-01"
  },
  { 
    id: "2", 
    name: "Physics", 
    description: "The natural science that studies matter, its motion and behavior through space and time, and the related entities of energy and force.",
    createdAt: "2025-01-05"
  },
  { 
    id: "3", 
    name: "Literature", 
    description: "The body of written works of a language, period, or culture, considered as having artistic merit.",
    createdAt: "2025-01-10"
  },
  { 
    id: "4", 
    name: "History", 
    description: "The study of past events, particularly in human affairs.",
    createdAt: "2025-01-15"
  },
  { 
    id: "5", 
    name: "Computer Science", 
    description: "The study of computation, automation, and information.",
    createdAt: "2025-01-20"
  }
]


export default function SubjectsPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS)
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>(MOCK_SUBJECTS)
  const [isLoading, setIsLoading] = useState(false)
  
  // URL-synced state
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Form drawer state
  const [formDrawerOpen, setFormDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentSubject, setCurrentSubject] = useState<SubjectFormData>({
    name: "",
    description: ""
  })
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null)
  
  // Apply all filters, sorting, and pagination
  const applyFilters = useCallback(() => {
    setIsLoading(true)
    
    let result = [...subjects]
    
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase()
      result = result.filter(subject => 
        subject.name.toLowerCase().includes(lowerSearch) || 
        subject.description.toLowerCase().includes(lowerSearch)
      )
    }
    
    result.sort((a, b) => {
      let comparison = 0
      const valA = a[sortColumn as keyof Subject]
      const valB = b[sortColumn as keyof Subject]

      if (typeof valA === "string" && typeof valB === "string") {
        comparison = valA.localeCompare(valB)
      } else if (typeof valA === "number" && typeof valB === "number") {
        comparison = valA - valB
      } else if (sortColumn === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return sortDirection === "asc" ? comparison : -comparison
    })
    
    setFilteredSubjects(result)
    setIsLoading(false)
  }, [subjects, searchQuery, sortColumn, sortDirection])

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
    
    applyFilters()
  }, [router.isReady, router.query, applyFilters])
  
  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters()
  }, [subjects, searchQuery, sortColumn, sortDirection, applyFilters])
  
  const handleFormChange = (field: keyof SubjectFormData, value: string) => {
    setCurrentSubject(prev => ({ ...prev, [field]: value }))
  }
  
  const handleAddNew = () => {
    setCurrentSubject({ name: "", description: "" })
    setIsEditMode(false)
    setFormDrawerOpen(true)
  }
  
  const handleEdit = (id: string) => {
    const subjectToEdit = subjects.find(subject => subject.id === id)
    if (subjectToEdit) {
      setCurrentSubject(subjectToEdit)
      setIsEditMode(true)
      setFormDrawerOpen(true)
    }
  }
  
  const handleFormSubmit = () => {
    setIsSubmitting(true)
    if (!currentSubject.name) {
      setIsSubmitting(false)
      return
    }
    
    setTimeout(() => {
      if (isEditMode && currentSubject.id) {
        const originalSubject = subjects.find(s => s.id === currentSubject.id)
        if (originalSubject) {
          const updatedSubject: Subject = {
            id: currentSubject.id,
            name: currentSubject.name,
            description: currentSubject.description,
            createdAt: originalSubject.createdAt
          }
          setSubjects(prev => prev.map(s => (s.id === updatedSubject.id ? updatedSubject : s)))
        }
      } else {
        const newSubject: Subject = {
          name: currentSubject.name,
          description: currentSubject.description,
          id: `${Date.now()}`, // Using timestamp for more unique ID
          createdAt: new Date().toISOString().split("T")[0]
        }
        setSubjects(prev => [...prev, newSubject])
      }
      setIsSubmitting(false)
      setFormDrawerOpen(false)
    }, 1000)
  }
  
  const handleDeleteClick = (id: string) => {
    setSubjectToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  const handleDeleteConfirm = () => {
    if (!subjectToDelete) return
    setIsDeleting(true)
    setTimeout(() => {
      setSubjects(subjects.filter(subject => subject.id !== subjectToDelete))
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setSubjectToDelete(null)
    }, 1000)
  }
  
  const handleViewSubject = (id: string) => {
    router.push(`/admin/subjects/${id}`)
  }

  const handleManageCourses = (id: string) => {
    router.push(`/admin/courses?subject=${id}`)
  }
  
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
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
    return filteredSubjects.slice(startIndex, startIndex + itemsPerPage)
  }
  
  const columns = [
    { id: "id", header: "ID", cell: (subject: Subject) => <span className="text-muted-foreground text-sm">{subject.id}</span>, sortable: true },
    { id: "name", header: "Subject Name", cell: (subject: Subject) => <span className="font-medium">{subject.name}</span>, sortable: true },
    { id: "description", header: "Description", cell: (subject: Subject) => <span className="truncate block max-w-[400px]">{subject.description}</span>, sortable: false },
    { id: "createdAt", header: "Created At", cell: (subject: Subject) => new Date(subject.createdAt).toLocaleDateString(), sortable: true },
    {
      id: "actions",
      header: "",
      cell: (subject: Subject) => (
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
              <DropdownMenuItem onClick={() => handleViewSubject(subject.id)}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(subject.id)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleManageCourses(subject.id)}><BookCopy className="mr-2 h-4 w-4" />Manage Courses</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteClick(subject.id)} className="text-destructive focus:text-destructive"><Trash className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ]
  
  const sortOptions = [
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
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
        title="Subjects"
        description="Manage all subjects in the system"
        onAddNew={handleAddNew}
        addNewLabel="Add Subject"
        searchPlaceholder="Search subjects..."
        onSearch={handleSearch}
        sortOptions={sortOptions}
        onSortChange={handleSortChange}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        className="px-2 sm:px-4"
        defaultSort={getCurrentSortValue()}
      >
        <DataTable
          data={getPaginatedData()}
          columns={columns}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => handleViewSubject(item.id)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            currentPage,
            totalPages: Math.max(1, Math.ceil(filteredSubjects.length / 10)),
            onPageChange: handlePageChange
          }}
          emptyState={
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No subjects found</p>
              <Button onClick={handleAddNew}>Add your first subject</Button>
            </div>
          }
        />
      </DataManagementLayout>
      
      <DataFormDrawer
        title={isEditMode ? "Edit Subject" : "Add New Subject"}
        description={isEditMode ? "Update subject details" : "Create a new subject"}
        open={formDrawerOpen}
        onOpenChange={setFormDrawerOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitLabel={isEditMode ? "Save Changes" : "Create Subject"}
        size="md"
      >
        <div className="space-y-6">
          {isEditMode && currentSubject.id && (
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input id="id" value={currentSubject.id} readOnly disabled className="bg-muted" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input id="name" value={currentSubject.name} onChange={(e) => handleFormChange("name", e.target.value)} placeholder="Enter subject name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={currentSubject.description} onChange={(e) => handleFormChange("description", e.target.value)} placeholder="Enter subject description" rows={4} />
          </div>
          {isEditMode && currentSubject.createdAt && (
            <div className="space-y-2">
              <Label htmlFor="createdAt">Created At</Label>
              <Input id="createdAt" value={new Date(currentSubject.createdAt).toLocaleDateString()} readOnly disabled className="bg-muted" />
            </div>
          )}
        </div>
      </DataFormDrawer>
      
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Subject"
        description="Are you sure you want to delete this subject? This action cannot be undone and will remove all associated courses and topics."
      />
    </AdminLayout>
  )
}
