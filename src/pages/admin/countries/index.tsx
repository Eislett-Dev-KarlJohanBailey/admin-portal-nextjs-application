
import { useState } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { DataManagementLayout } from "@/components/layout/DataManagementLayout"
import { DataTable } from "@/components/data/DataTable"
import { DataFormDrawer } from "@/components/data/DataFormDrawer"
import { DeleteConfirmationDialog } from "@/components/data/DeleteConfirmationDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

// Mock data for demonstration
const MOCK_COUNTRIES = [
  { 
    id: "1", 
    name: "United States",
    createdAt: "2025-01-15"
  },
  { 
    id: "2", 
    name: "Canada",
    createdAt: "2025-01-16"
  },
  { 
    id: "3", 
    name: "United Kingdom",
    createdAt: "2025-01-17"
  },
  { 
    id: "4", 
    name: "Australia",
    createdAt: "2025-01-18"
  },
  { 
    id: "5", 
    name: "Germany",
    createdAt: "2025-01-19"
  }
]

// Country form type
interface CountryFormData {
  id?: string
  name: string
  createdAt?: string
}

export default function CountriesPage() {
  const router = useRouter()
  const [countries, setCountries] = useState(MOCK_COUNTRIES)
  const [isLoading, setIsLoading] = useState(false)
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    search: ""
  })
  
  // Form drawer state
  const [formDrawerOpen, setFormDrawerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentCountry, setCurrentCountry] = useState<CountryFormData>({
    name: ""
  })
  const [isEditMode, setIsEditMode] = useState(false)
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [countryToDelete, setCountryToDelete] = useState<string | null>(null)
  
  // Handle form input changes
  const handleFormChange = (field: keyof CountryFormData, value: string) => {
    setCurrentCountry(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Open form drawer for creating a new country
  const handleAddNew = () => {
    setCurrentCountry({
      name: ""
    })
    setIsEditMode(false)
    setFormDrawerOpen(true)
  }
  
  // Open form drawer for editing a country
  const handleEdit = (id: string) => {
    const countryToEdit = countries.find(country => country.id === id)
    if (countryToEdit) {
      setCurrentCountry({
        id: countryToEdit.id,
        name: countryToEdit.name,
        createdAt: countryToEdit.createdAt
      })
      setIsEditMode(true)
      setFormDrawerOpen(true)
    }
  }
  
  // Handle form submission
  const handleFormSubmit = () => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      if (isEditMode && currentCountry.id) {
        // Update existing country
        setCountries(prev => 
          prev.map(country => 
            country.id === currentCountry.id 
              ? { 
                  ...country, 
                  name: currentCountry.name
                } 
              : country
          )
        )
      } else {
        // Create new country
        const newCountry = {
          id: `${countries.length + 1}`,
          name: currentCountry.name,
          createdAt: new Date().toISOString().split("T")[0]
        }
        setCountries(prev => [...prev, newCountry])
      }
      
      setIsSubmitting(false)
      setFormDrawerOpen(false)
    }, 1000)
  }
  
  // Open delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    setCountryToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!countryToDelete) return
    
    setIsDeleting(true)
    
    // Simulate API call
    setTimeout(() => {
      setCountries(countries.filter(country => country.id !== countryToDelete))
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setCountryToDelete(null)
    }, 1000)
  }
  
  // Simulate viewing a country
  const handleViewCountry = (id: string) => {
    router.push(`/admin/countries/${id}`)
  }
  
  // Simulate searching
  const handleSearch = (value: string) => {
    setFilters({...filters, search: value})
    setCurrentPage(1)
  }
  
  // Simulate sorting
  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column)
    setSortDirection(direction)
  }
  
  // Simulate refreshing data
  const handleRefresh = () => {
    setIsLoading(true)
    // In a real app, you would fetch fresh data from the API
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }
  
  // Table columns configuration
  const columns = [
    {
      id: "id",
      header: "ID",
      cell: (country: typeof MOCK_COUNTRIES[0]) => <span className="text-muted-foreground text-sm">{country.id}</span>,
      sortable: true
    },
    {
      id: "name",
      header: "Country Name",
      cell: (country: typeof MOCK_COUNTRIES[0]) => <span className="font-medium">{country.name}</span>,
      sortable: true
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (country: typeof MOCK_COUNTRIES[0]) => new Date(country.createdAt).toLocaleDateString(),
      sortable: true
    },
    {
      id: "actions",
      header: "",
      cell: (country: typeof MOCK_COUNTRIES[0]) => (
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
              <DropdownMenuItem onClick={() => handleViewCountry(country.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(country.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteClick(country.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ]
  
  // Sort options
  const sortOptions = [
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
    { label: "ID (Ascending)", value: "id_asc" },
    { label: "ID (Descending)", value: "id_desc" },
    { label: "Newest First", value: "createdAt_desc" },
    { label: "Oldest First", value: "createdAt_asc" }
  ]
  
  // Handle sort dropdown change
  const handleSortChange = (value: string) => {
    const [column, direction] = value.split("_")
    handleSort(column, direction as "asc" | "desc")
  }
  
  return (
    <AdminLayout>
      <DataManagementLayout
        title="Countries"
        description="Manage all countries in the system"
        onAddNew={handleAddNew}
        addNewLabel="Add Country"
        searchPlaceholder="Search countries..."
        onSearch={handleSearch}
        sortOptions={sortOptions}
        onSortChange={handleSortChange}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        className="px-2 sm:px-4"
      >
        <DataTable
          data={countries}
          columns={columns}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => handleViewCountry(item.id)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            currentPage,
            totalPages: Math.ceil(countries.length / 10),
            onPageChange: setCurrentPage
          }}
          emptyState={
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No countries found</p>
              <Button onClick={handleAddNew}>Add your first country</Button>
            </div>
          }
        />
      </DataManagementLayout>
      
      {/* Country Form Drawer */}
      <DataFormDrawer
        title={isEditMode ? "Edit Country" : "Add New Country"}
        description={isEditMode ? "Update country details" : "Create a new country"}
        open={formDrawerOpen}
        onOpenChange={setFormDrawerOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitLabel={isEditMode ? "Save Changes" : "Create Country"}
        size="md"
      >
        <div className="space-y-6">
          {isEditMode && currentCountry.id && (
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                value={currentCountry.id}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Country Name</Label>
            <Input
              id="name"
              value={currentCountry.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="Enter country name"
            />
          </div>
          
          {isEditMode && currentCountry.createdAt && (
            <div className="space-y-2">
              <Label htmlFor="createdAt">Created At</Label>
              <Input
                id="createdAt"
                value={new Date(currentCountry.createdAt).toLocaleDateString()}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
          )}
        </div>
      </DataFormDrawer>
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Country"
        description="Are you sure you want to delete this country? This action cannot be undone."
      />
    </AdminLayout>
  )
}
