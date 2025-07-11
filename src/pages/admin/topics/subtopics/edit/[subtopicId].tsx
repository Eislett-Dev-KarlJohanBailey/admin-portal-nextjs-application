import { useEffect, useState, useContext } from "react"
import { useRouter } from "next/router"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { AuthContext as AuthContextProvider } from "@/contexts/AuthContext"
import { handleFetchSubTopic, handleUpdateSubTopic, UpdateSubTopicData } from "@/services/subtopics/subTopicsRequest"
import { handleFetchAllTopics } from "@/services/topics/topicsRequest"
import { SubTopicDetails } from "@/models/subTopic/subTopicDetails"
import { TopicDetails } from "@/services/topics/topicsRequest"
import { toast } from "@/hooks/use-toast"

export default function EditSubtopicPage() {
  const router = useRouter()
  const { subtopicId } = router.query
  const authContext = useContext(AuthContextProvider)
  const token = authContext?.token

  // State for form data
  const [formData, setFormData] = useState<UpdateSubTopicData>({
    name: "",
    description: "",
    topicId: "",
    order: 0
  })

  // State for topics dropdown
  const [topics, setTopics] = useState<TopicDetails[]>([])
  const [isLoadingTopics, setIsLoadingTopics] = useState(false)

  // State for form submission
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch subtopic data when component mounts
  useEffect(() => {
    if (!token || !subtopicId || typeof subtopicId !== 'string') return

    const fetchSubtopic = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await handleFetchSubTopic(token, subtopicId)
        
        if (result.error) {
          setError(result.error)
          return
        }

        if (result.data) {
          setFormData({
            name: result.data.name,
            description: result.data.description,
            topicId: result.data.topicId,
            order: result.data.order || 0
          })
        }
      } catch (err) {
        setError('Failed to fetch subtopic')
        console.error('Error fetching subtopic:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubtopic()
  }, [token, subtopicId])

  // Fetch topics for dropdown
  useEffect(() => {
    if (!token) return

    const fetchTopics = async () => {
      setIsLoadingTopics(true)

      try {
        const result = await handleFetchAllTopics(token, 1, 100)
        
        if (result.error) {
          toast({
            title: 'Error fetching topics',
            description: result.error,
            variant: 'destructive'
          })
          return
        }

        if (result.data) {
          setTopics(result.data)
        }
      } catch (err) {
        toast({
          title: 'Error fetching topics',
          description: 'Failed to load topics for dropdown',
          variant: 'destructive'
        })
        console.error('Error fetching topics:', err)
      } finally {
        setIsLoadingTopics(false)
      }
    }

    fetchTopics()
  }, [token])

  const handleInputChange = (field: keyof UpdateSubTopicData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token || !subtopicId || typeof subtopicId !== 'string') return

    // Validation
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Name is required',
        variant: 'destructive'
      })
      return
    }

    if (!formData.topicId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a topic',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await handleUpdateSubTopic(token, subtopicId, formData)
      
      if (result.error) {
        toast({
          title: 'Error updating subtopic',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      if (result.data) {
        toast({
          title: 'Success',
          description: 'Subtopic updated successfully',
        })
        
        // Redirect back to subtopics list
        router.push('/admin/topics/subtopics')
      }
    } catch (err) {
      toast({
        title: 'Error updating subtopic',
        description: 'Failed to update subtopic',
        variant: 'destructive'
      })
      console.error('Error updating subtopic:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.push('/admin/topics/subtopics')
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading subtopic...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Error Loading Subtopic</h2>
            <p>{error}</p>
          </div>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subtopics
          </Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={handleBack} variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Subtopic</h1>
              <p className="text-muted-foreground">Update subtopic details</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Subtopic Information</CardTitle>
            <CardDescription>
              Update the subtopic details below. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter subtopic name"
                  required
                />
              </div>

              {/* Topic Selection */}
              <div className="space-y-2">
                <Label htmlFor="topic">
                  Topic <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.topicId}
                  onValueChange={(value) => handleInputChange("topicId", value)}
                  disabled={isLoadingTopics}
                >
                  <SelectTrigger id="topic">
                    <SelectValue placeholder={isLoadingTopics ? "Loading topics..." : "Select a topic"} />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isLoadingTopics && (
                  <p className="text-sm text-muted-foreground">Loading topics...</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter subtopic description"
                  rows={4}
                />
              </div>

              {/* Order */}
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 0)}
                  placeholder="Enter order number"
                  min="0"
                />
                <p className="text-sm text-muted-foreground">
                  Lower numbers appear first. Use 0 for default ordering.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
} 