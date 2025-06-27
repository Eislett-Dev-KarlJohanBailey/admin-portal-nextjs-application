
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

// School data type
interface School {
  id: string
  name: string
  countryId: string
  city: string
  address: string
  createdAt: string
}

// School form type
interface SchoolFormData {
  id?: string
  name: string
  countryId: string
  city: string
  address: string
  createdAt?: string
}


// Mock data for demonstration
const MOCK_COUNTRIES = [
  { id: "1", name: "United States" },
  { id: "2", name: "Canada" },
  { id: "3", name: "United Kingdom" },
  { id: "4", name: "Australia" },
  { id: "5", name: "Germany" }
]

const MOCK_SCHOOLS: School[] = [
  { 
    id: "1", 
    name: "Harvard University", 
    countryId: "1",
    city: "Cambridge",
    address: "Massachusetts Hall, Cambridge, MA 02138",
    createdAt: "2025-01-10"
  },
  { 
    id: "2", 
    name: "University of Toronto", 
    countryId: "2",
    city: "Toronto",
    address: "27 King's College Cir, Toronto, ON M5S, Canada",
    createdAt: "2025-02-15"
  },
  { 
    id: "3", 
    name: "Oxford University", 
    countryId: "3",
    city: "Oxford",
    address: "University Offices, Wellington Square, Oxford OX1 2JD, UK",
    createdAt: "2025-03-01"
  },
  { 
    id: "4", 
    name: "University of Melbourne", 
    countryId: "4",
    city: "Melbourne",
    address: "Grattan St, Parkville VIC 3010, Australia",
    createdAt: "2025-01-20"
  },
  { 
    id: "5", 
    name: "Technical University of Munich", 
    countryId: "5",
    city: "Munich",
    address: "Arcisstraße 21, 80333 München, Germany",
    createdAt: "2025-02-20"
  }
]


export default function SchoolsPage() {
  const router = useRouter()
  const [schools, setSchools] = useState<School[]>(MOCK_SCHOOLS)
  const [filteredSchools, setFilteredSchools] = useState<School[]>(MOCK_SCHOOLS)
  const [countries, setCountries] = useState(MOCK_COUNTRIES)
  const [isLoading, setIsLoading] = useState(false)
  
  // URL-synced state
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [countryFilter, setCountryFilter] = useState<string>("")
  
  // Form drawer state
  const [formDrawerOpen, setFormDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentSchool, setCurrentSchool] = useState<SchoolFormData>({
    name: "",
    countryId: "",
    city: "",
    address: ""
  })
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [schoolToDelete, setSchoolToDelete] = useState<string | null>(null)
  
  // Apply all filters, sorting, and pagination
  const applyFilters = useCallback(() => {
    setIsLoading(true)
    
    let result = [...schools]
    
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase()
      result = result.filter(school => 
        school.name.toLowerCase().includes(lowerSearch) || 
        school.city.toLowerCase().includes(lowerSearch) ||
        school.address.toLowerCase().includes(lowerSearch)
      )
    }
    
    if (countryFilter) {
      result = result.filter(school => school.countryId === countryFilter)
    }
    
    result.sort((a, b) => {
      let comparison = 0
      const valA = a[sortColumn as keyof School]
      const valB = b[sortColumn as keyof School]

      if (sortColumn === "country") {
        const countryA = countries.find(c => c.id === a.countryId)?.name || ""
        const countryB = countries.find(c => c.id === b.countryId)?.name || ""
        comparison = countryA.localeCompare(countryB)
      } else if (typeof valA === "string" && typeof valB === "string") {
        comparison = valA.localeCompare(valB)
      } else if (typeof valA === "number" && typeof valB === "number") {
        comparison = valA - valB
      } else if (sortColumn === "createdAt") {
         comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return sortDirection === "asc" ? comparison : -comparison
    })
    
    setFilteredSchools(result)
    setIsLoading(false)
  }, [schools, searchQuery, countryFilter, sortColumn, sortDirection, countries])

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
    
    const countryFilterFromUrl = router.query.country as string
    if (countryFilterFromUrl) setCountryFilter(countryFilterFromUrl)
    
    applyFilters()
  }, [router.isReady, router.query, applyFilters])
  
  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters()
  }, [schools, searchQuery, countryFilter, sortColumn, sortDirection, applyFilters])
  
  const handleFormChange = (field: keyof SchoolFormData, value: string) => {
    setCurrentSchool(prev => ({ ...prev, [field]: value }))
  }
  
  const handleAddNew = () => {
    setCurrentSchool({ name: "", countryId: "", city: "", address: "" })
    setIsEditMode(false)
    setFormDrawerOpen(true)
  }
  
  const handleEdit = (id: string) => {
    const schoolToEdit = schools.find(school => school.id === id)
    if (schoolToEdit) {
      setCurrentSchool(schoolToEdit)
      setIsEditMode(true)
      setFormDrawerOpen(true)
    }
  }
  
  const handleFormSubmit = () => {
    setIsSubmitting(true)
    if (!currentSchool.name || !currentSchool.countryId || !currentSchool.city) {
      setIsSubmitting(false)
      return
    }
    
    setTimeout(() => {
      if (isEditMode && currentSchool.id) {
        const originalSchool = schools.find(s => s.id === currentSchool.id)
        if (originalSchool) {
          const updatedSchool: School = {
            id: currentSchool.id,
            name: currentSchool.name,
            countryId: currentSchool.countryId,
            city: currentSchool.city,
            address: currentSchool.address,
            createdAt: originalSchool.createdAt
          }
          setSchools(prev => prev.map(s => (s.id === updatedSchool.id ? updatedSchool : s)))
        }
      } else {
        const newSchool: School = {
          name: currentSchool.name,
          countryId: currentSchool.countryId,
          city: currentSchool.city,
          address: currentSchool.address,
          id: `${Date.now()}`, // Using timestamp for more unique ID
          createdAt: new Date().toISOString().split("T")[0]
        }
        setSchools(prev => [...prev, newSchool])
      }
      setIsSubmitting(false)
      setFormDrawerOpen(false)
    }, 1000)
  }
  
  const handleDeleteClick = (id: string) => {
    setSchoolToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  const handleDeleteConfirm = () => {
    if (!schoolToDelete) return
    setIsDeleting(true)
    setTimeout(() => {
      setSchools(schools.filter(school => school.id !== schoolToDelete))
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setSchoolToDelete(null)
    }, 1000)
  }
  
  const handleViewSchool = (id: string) => {
    router.push(`/admin/schools/${id}`)
  }
  
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }
  
  const handleCountryFilterChange = (value: string) => {
    setCountryFilter(value)
    setCurrentPage(1)
    const query = { ...router.query, country: value || undefined, page: "1" }
    if (!value) delete query.country
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
    return filteredSchools.slice(startIndex, startIndex + itemsPerPage)
  }
  
  const getCountryName = (countryId: string) => countries.find(c => c.id === countryId)?.name || "Unknown"
  
  const filterOptions = [
    {
      id: "country",
      label: "Country",
      type: "select" as const,
      value: countryFilter,
      onChange: handleCountryFilterChange,
      placeholder: "Select country",
      options: [
        { label: "All Countries", value: "" },
        ...countries.map(country => ({ label: country.name, value: country.id }))
      ]
    }
  ]
  
  const columns = [
    { id: "id", header: "ID", cell: (school: School) => <span className="text-muted-foreground text-sm">{school.id}</span>, sortable: true },
    { id: "name", header: "School Name", cell: (school: School) => <span className="font-medium">{school.name}</span>, sortable: true },
    { id: "country", header: "Country", cell: (school: School) => <span>{getCountryName(school.countryId)}</span>, sortable: true },
    { id: "city", header: "City", cell: (school: School) => <span>{school.city}</span>, sortable: true },
    { id: "address", header: "Address", cell: (school: School) => <span className="truncate block max-w-[250px]">{school.address}</span>, sortable: false },
    { id: "createdAt", header: "Created At", cell: (school: School) => new Date(school.createdAt).toLocaleDateString(), sortable: true },
    {
      id: "actions",
      header: "",
      cell: (school: School) => (
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
              <DropdownMenuItem onClick={() => handleViewSchool(school.id)}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(school.id)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteClick(school.id)} className="text-destructive focus:text-destructive"><Trash className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ]
  
  const sortOptions = [
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
    { label: "Country (A-Z)", value: "country_asc" },
    { label: "Country (Z-A)", value: "country_desc" },
    { label: "City (A-Z)", value: "city_asc" },
    { label: "City (Z-A)", value: "city_desc" },
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
        title="Schools"
        description="Manage all schools in the system"
        onAddNew={handleAddNew}
        addNewLabel="Add School"
        searchPlaceholder="Search schools by name, city, or address..."
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
        defaultShowFilters={!!countryFilter}
      >
        <DataTable
          data={getPaginatedData()}
          columns={columns}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => handleViewSchool(item.id)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            currentPage,
            totalPages: Math.max(1, Math.ceil(filteredSchools.length / 10)),
            onPageChange: handlePageChange
          }}
          emptyState={
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No schools found</p>
              <Button onClick={handleAddNew}>Add your first school</Button>
            </div>
          }
        />
      </DataManagementLayout>
      
      <DataFormDrawer
        title={isEditMode ? "Edit School" : "Add New School"}
        description={isEditMode ? "Update school details" : "Create a new school"}
        open={formDrawerOpen}
        onOpenChange={setFormDrawerOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitLabel={isEditMode ? "Save Changes" : "Create School"}
        size="md"
      >
        <div className="space-y-6">
          {isEditMode && currentSchool.id && (
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input id="id" value={currentSchool.id} readOnly disabled className="bg-muted" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">School Name</Label>
            <Input id="name" value={currentSchool.name} onChange={(e) => handleFormChange("name", e.target.value)} placeholder="Enter school name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={currentSchool.countryId} onValueChange={(value) => handleFormChange("countryId", value)}>
              <SelectTrigger id="country"><SelectValue placeholder="Select country" /></SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>{country.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={currentSchool.city} onChange={(e) => handleFormChange("city", e.target.value)} placeholder="Enter city" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" value={currentSchool.address} onChange={(e) => handleFormChange("address", e.target.value)} placeholder="Enter full address" rows={3} />
          </div>
          {isEditMode && currentSchool.createdAt && (
            <div className="space-y-2">
              <Label htmlFor="createdAt">Created At</Label>
              <Input id="createdAt" value={new Date(currentSchool.createdAt).toLocaleDateString()} readOnly disabled className="bg-muted" />
            </div>
          )}
        </div>
      </DataFormDrawer>
      
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete School"
        description="Are you sure you want to delete this school? This action cannot be undone."
      />
    </AdminLayout>
  )
}
