import { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ArrowLeft, Trash } from "lucide-react";
import { QuestionFormData, QuestionType } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { QuestionDetails } from "@/models/questions/questionDetails";
import { handleFetchSubTopics } from "@/services/subtopics/subTopicsRequest";
import { toast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { SubTopicDetails } from "@/models/subTopic/subTopicDetails";
import {
  getQuestionFormData,
  getQuestionFormIsLoading,
  getQuestionFormSubtopics,
  resetQuestionPageSlice,
  setAllQuestionFormData,
  setAllQuestionFormSubtopics,
  setQuestionFormData,
  setQuestionFormIsLoading,
  setQuestionFormSubtopics,
} from "@/store/questions.slice";
import { removeNulls } from "@/services/utils";
import {
  displayErrorMessage,
  displaySuccessMessage,
} from "@/services/displayMessages";
import { handleFetchQuestionById } from "@/services/questions/questionsRequest";
import { AuthContext as AuthContextProvider } from "@/contexts/AuthContext";

export default function UpdateQuestionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authContext = useContext(AuthContextProvider);

  const formData = useAppSelector(getQuestionFormData);
  const questionSubtopics = useAppSelector(getQuestionFormSubtopics);
  const isLoading = useAppSelector(getQuestionFormIsLoading);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subtopics, setSubtopics] = useState<SubTopicDetails[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [currentSubtopic, setCurrentSubtopic] = useState<string | undefined>(
    undefined
  );
  const [existingSubtopicLinks, setExistingSubtopicLinks] = useState<string[]>(
    []
  );

  // Initialize subtopicId from URL query
  useEffect(() => {
    if (router.isReady && router.query.questionId) {
      console.log("Setting question ID from router:", router.query.questionId);
      dispatch(
        setQuestionFormData({
          field: "id",
          value: router.query.questionId,
        })
      );
    }
  }, [
    dispatch,
    router.isReady,
    router.query.questionId,
  ]);

  // Cleanup effect to reset form data when questionId changes
  useEffect(() => {
    return () => {
      console.log("Cleaning up form data");
      dispatch(resetQuestionPageSlice());
    };
  }, [dispatch, router.query.questionId]);

  useEffect(() => {
    async function getQuestion() {
      if (!formData?.id) {
        console.log("No formData.id found, skipping question fetch");
        return;
      }
      
      dispatch(setQuestionFormIsLoading(true));
      let links = [];
      
      try {
        const results = await handleFetchQuestionById(
          authContext?.token,
          formData?.id as string
        );

        if ((results as { error: string })?.error) {
          toast({
            title: (results as { error: string })?.error,
            style: { background: "red", color: "white" },
            duration: 3500,
          });
        } else {
          const questionData = results as QuestionDetails;
          console.log('Fetched question data:', questionData);
          
          // Populate form with data
          const data: QuestionFormData = {
            id: formData?.id || router.query.questionId as string,
            title: questionData?.title || "",
            content: questionData?.content || "",
            description: questionData?.description || "",
            tags: questionData?.tags || [],
            totalPotentialMarks: questionData?.totalPotentialMarks || 1,
            difficultyLevel: questionData?.difficultyLevel || 0.1,
            type: questionData?.type === 'true_or_false' ? QuestionType.TRUE_FALSE : QuestionType.MULTIPLE_CHOICE,
            multipleChoiceOptions: [],
            isTrue: questionData?.isTrue || false
          };

          // Handle multiple choice options only for multiple choice questions
          if (questionData?.type !== "true_or_false") {
            const newOptions = questionData?.multipleChoiceOptions?.map(
              (option, index) => ({
                id: option.id || (index + 1).toString(),
                content: option.content,
                isCorrect: option.isCorrect,
              })
            ) || [];
            data.multipleChoiceOptions = newOptions;
          }
          
          links = questionData?.subTopics?.map((el) => el.id) || [];

          console.log('Processed question data:', data);
          console.log('Existing subtopic links:', links);
          
          dispatch(setAllQuestionFormData(data));
          dispatch(setAllQuestionFormSubtopics(links));
          setExistingSubtopicLinks(links);
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        toast({
          title: "Failed to fetch question",
          style: { background: "red", color: "white" },
          duration: 3500,
        });
      } finally {
        dispatch(setQuestionFormIsLoading(false));
      }
    }

    if (formData.id) getQuestion();
  }, [authContext?.token, dispatch, formData.id, router.query.questionId]);

  //  GET LIST OF SUB TOPICS
  useEffect(() => {
    async function getSubTopics() {
      const topic_id = undefined;
      const results = await handleFetchSubTopics(
        authContext?.token,
        1,
        100,
        topic_id
      );

      if ((results as { error: string })?.error) {
        toast({
          title: (results as { error: string })?.error,
          style: { background: "red", color: "white" },
          duration: 3500,
        });
        setSubtopics([]);
      } else {
        setSubtopics(results.data ?? []);
      }
    }

    getSubTopics();
  }, [authContext?.token]);

  // Update form data
  const handleInputChange = useCallback(
    (field: keyof QuestionFormData, value: any) => {
      dispatch(setQuestionFormData({ field, value }));
    },
    [dispatch]
  );

  // Handle question type change
  const handleTypeChange = useCallback(
    (type: QuestionType) => {
      if (type === QuestionType.TRUE_FALSE) {
        // For true/false, we don't need multiple choice options
        dispatch(setQuestionFormData({ field: "type", value: type }));
        dispatch(
          setQuestionFormData({
            field: "multipleChoiceOptions",
            value: [],
          })
        );
      } else if (type === QuestionType.MULTIPLE_CHOICE) {
        // For multiple choice, initialize with 4 empty options
        const newOptions = [
          { id: "1", content: "", isCorrect: false },
          { id: "2", content: "", isCorrect: false },
          { id: "3", content: "", isCorrect: false },
          { id: "4", content: "", isCorrect: false },
        ];
        
        dispatch(setQuestionFormData({ field: "type", value: type }));
        dispatch(
          setQuestionFormData({
            field: "multipleChoiceOptions",
            value: newOptions,
          })
        );
      }
    },
    [dispatch]
  );

  // Handle true/false toggle
  const handleTrueFalseToggle = useCallback(
    (isTrue: boolean) => {
      dispatch(
        setQuestionFormData({
          field: "isTrue",
          value: isTrue,
        })
      );
    },
    [dispatch]
  );

  // Handle option content change
  const handleOptionChange = useCallback(
    (id: string, content: string) => {
      console.log('handleOptionChange called:', { id, content });
      
      const currentOptions = formData.multipleChoiceOptions || [];
      const newOptions = currentOptions.map((option) =>
        option.id === id ? { ...option, content } : option
      );

      console.log('New options after update:', newOptions);

      dispatch(
        setQuestionFormData({
          field: "multipleChoiceOptions",
          value: newOptions,
        })
      );
    },
    [dispatch, formData.multipleChoiceOptions]
  );

  // Handle correct option selection
  const handleCorrectOptionChange = useCallback(
    (id: string) => {
      console.log('handleCorrectOptionChange called:', { id });
      
      const currentOptions = formData.multipleChoiceOptions || [];
      const newOptions = currentOptions.map((option) =>
        option.id === id ? { ...option, isCorrect: !option.isCorrect } : option
      );

      console.log('New options after update:', newOptions);

      dispatch(
        setQuestionFormData({
          field: "multipleChoiceOptions",
          value: newOptions,
        })
      );
    },
    [dispatch, formData.multipleChoiceOptions]
  );

  // Add a new option (for multiple choice)
  const handleAddOption = useCallback(() => {
    if (formData.type === QuestionType.MULTIPLE_CHOICE) {
      const currentOptions = formData.multipleChoiceOptions || [];
      const newId = String(Math.max(...currentOptions.map(o => parseInt(o.id) || 0), 0) + 1);
      
      const newOptions = [
        ...currentOptions,
        {
          id: newId,
          content: "",
          isCorrect: false,
        },
      ];
      
      dispatch(
        setQuestionFormData({
          field: "multipleChoiceOptions",
          value: newOptions,
        })
      );
    }
  }, [dispatch, formData.multipleChoiceOptions, formData.type]);

  // Remove an option (for multiple choice)
  const handleRemoveOption = useCallback(
    (id: string) => {
      if (
        formData.type === QuestionType.MULTIPLE_CHOICE &&
        formData.multipleChoiceOptions.length > 2
      ) {
        const currentOptions = formData.multipleChoiceOptions || [];
        
        // Check if we're removing the correct option
        const isRemovingCorrect = currentOptions.find(
          (o) => o.id === id
        )?.isCorrect;

        let newOptions = currentOptions.filter(
          (option) => option.id !== id
        );

        // If we removed the correct option, make the first option correct
        if (isRemovingCorrect && newOptions.length > 0) {
          newOptions = newOptions.map((option, index) => ({
            ...option,
            isCorrect: index === 0,
          }));
        }

        dispatch(
          setQuestionFormData({
            field: "multipleChoiceOptions",
            value: newOptions,
          })
        );
      }
    },
    [dispatch, formData.multipleChoiceOptions, formData.type]
  );

  // Handle tags
  const handleAddTag = useCallback(() => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      dispatch(
        setQuestionFormData({
          field: "tags",
          value: [...formData.tags, currentTag.trim()],
        })
      );
      setCurrentTag("");
    }
  }, [currentTag, dispatch, formData.tags]);

  const handleRemoveTag = useCallback(
    (tag: string) => {
      const newTags = formData.tags.filter((t) => t !== tag);
      dispatch(setQuestionFormData({ field: "tags", value: newTags }));
    },
    [dispatch, formData.tags]
  );

  const handleSubtopic = useCallback(
    (id: string) => {
      dispatch(
        setQuestionFormSubtopics({ operation_type: "REMOVE", value: id })
      );
    },
    [dispatch]
  );

  const handleAddSubtopic = useCallback(() => {
    if (currentSubtopic && !questionSubtopics.includes(currentSubtopic)) {
      dispatch(
        setQuestionFormSubtopics({
          operation_type: "ADD",
          value: currentSubtopic,
        })
      );
      setCurrentSubtopic(undefined);
    }
  }, [currentSubtopic, dispatch, questionSubtopics]);

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag]
  );

  // Simplified subtopic linking logic
  const handleSubtopicsUpdate = useCallback(
    async (questionId: string) => {
      try {
        // Get current subtopics from store
        const currentSubtopics = questionSubtopics || [];
        
        // Remove old links that are no longer needed
        for (const oldSubtopicId of existingSubtopicLinks) {
          if (!currentSubtopics.includes(oldSubtopicId)) {
            const response = await fetch(
              `/api/sub-topics/${oldSubtopicId}/question/${questionId}`,
              {
                method: "DELETE",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
              }
            );
            
            if (!response.ok) {
              console.error(`Failed to unlink subtopic ${oldSubtopicId}`);
            }
          }
        }
        
        // Add new links
        for (const newSubtopicId of currentSubtopics) {
          if (!existingSubtopicLinks.includes(newSubtopicId)) {
            const response = await fetch(
              `/api/sub-topics/${newSubtopicId}/question/${questionId}`,
              {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
              }
            );
            
            if (!response.ok) {
              console.error(`Failed to link subtopic ${newSubtopicId}`);
            }
          }
        }
        
        return true;
      } catch (error) {
        console.error("Error updating subtopic links:", error);
        return false;
      }
    },
    [existingSubtopicLinks, questionSubtopics]
  );

  // Form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Form submission started');
      console.log('Form data:', formData);
      console.log('Question subtopics at submission:', questionSubtopics);
      
      // Basic validation
      if (!formData.id) {
        displayErrorMessage("Missing question id", "No question id found");
        return;
      }
      
      if (!formData.title.trim()) {
        displayErrorMessage("Missing required fields", "Please enter a title");
        return;
      }

      if (!formData.content.trim()) {
        displayErrorMessage(
          "Missing required fields",
          "Please enter question content"
        );
        return;
      }

      // Check if we have subtopics
      const hasSubtopics = questionSubtopics?.length > 0 || existingSubtopicLinks.length > 0;
      
      if (!hasSubtopics) {
        displayErrorMessage(
          "Missing required fields",
          "Please select and add a subtopic"
        );
        return;
      }
      
      // If store state is empty but we have existing links, restore them
      if (questionSubtopics?.length === 0 && existingSubtopicLinks.length > 0) {
        console.log('Restoring subtopics from existing links');
        dispatch(setAllQuestionFormSubtopics(existingSubtopicLinks));
      }

      // Validate options based on question type
      if (formData.type === QuestionType.TRUE_FALSE) {
        // For true/false, isTrue should be defined
        if (formData.isTrue === undefined) {
          displayErrorMessage(
            "Missing required fields",
            "Please select the correct answer (True or False)"
          );
          return;
        }
      } else {
        // For multiple choice, validate options
        if (!formData.multipleChoiceOptions.some((option) => option.isCorrect)) {
          displayErrorMessage(
            "Missing required fields",
            "Please mark at least one option as correct"
          );
          return;
        }

        if (formData.multipleChoiceOptions.some((option) => !option.content.trim())) {
          displayErrorMessage(
            "Missing required fields",
            "Please fill in all options"
          );
          return;
        }
      }

      setIsSubmitting(true);

      try {
        // Prepare the update payload
        const questionDetails = {
          title: formData?.title,
          content: formData?.content,
          description: formData?.description,
          tags: formData?.tags,
          totalPotentialMarks: formData?.totalPotentialMarks,
          difficultyLevel: formData?.difficultyLevel,
          type: formData?.type,
          multipleChoiceOptions:
            formData?.type === QuestionType.MULTIPLE_CHOICE
              ? formData?.multipleChoiceOptions
              : null,
          isTrue: formData?.type === QuestionType.TRUE_FALSE ? formData?.isTrue : undefined,
        };

        const params = {
          questionDetails: removeNulls(questionDetails),
          id: formData.id,
        };

        console.log('Sending update request with params:', params);

        const rawResponse = await fetch("/api/questions", {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authContext.token}`,
          },
          body: JSON.stringify(params),
        });
        
        if (!rawResponse.ok) {
          const errorData = await rawResponse.json();
          throw new Error(errorData.error || 'Failed to update question');
        }
        
        const data: QuestionDetails = await rawResponse.json();
        console.log('Question updated successfully:', data);

        // Update subtopic links
        const subtopicsUpdated = await handleSubtopicsUpdate(data.id);
        
        if (!subtopicsUpdated) {
          displayErrorMessage("Warning", "Question updated but failed to update some subtopic links");
        } else {
          displaySuccessMessage("Question Updated Successfully!");
        }
        
        // Reset form and redirect
        dispatch(resetQuestionPageSlice());
        setTimeout(
          () => router.push("/admin/topics/subtopics/questions"),
          1500
        );
        
      } catch (error) {
        console.error("Update error:", error);
        displayErrorMessage("Failed to update question", error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      authContext.token,
      dispatch,
      formData,
      handleSubtopicsUpdate,
      questionSubtopics,
      existingSubtopicLinks,
      router,
    ]
  );

  const getSubtopicName = useCallback(
    (id: string) => subtopics.find((s) => s.id === id)?.name || "Unknown",
    [subtopics]
  );

  const getPlaceholderContent = useCallback(() => {
    return (
      formData.content ||
      "Question content will appear here. You can use LaTeX math: $E = mc^2$ or $$\\frac{d}{dx}\\sin x = \\cos x$$"
    );
  }, [formData.content]);

  return (
    <AdminLayout>
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Update New Question</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Question"}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Question Details</CardTitle>
              <CardDescription>
                Enter the basic information for your question. You can use LaTeX
                math formulas with $ or $$ delimiters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Question Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter a title for this question"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Enter a brief description"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Question Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Enter the question content. You can use LaTeX math: $E = mc^2$ or $$\frac{d}{dx}\sin x = \cos x$$"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Question Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    handleTypeChange(value as QuestionType)
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={QuestionType.MULTIPLE_CHOICE}>
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value={QuestionType.TRUE_FALSE}>
                      True/False
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="marks">Total Potential Marks</Label>
                  <Input
                    id="marks"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.totalPotentialMarks}
                    onChange={(e) =>
                      handleInputChange(
                        "totalPotentialMarks",
                        parseInt(e.target.value) || 1
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">
                    Difficulty Level (0.1 - 1.0)
                  </Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="difficulty"
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={formData.difficultyLevel}
                      onChange={(e) =>
                        handleInputChange(
                          "difficultyLevel",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                    <span className="text-sm font-medium">
                      {(formData.difficultyLevel * 10).toFixed(1)}/10
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Easy</span>
                    <span>Medium</span>
                    <span>Hard</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add a tag"
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subtopics</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {questionSubtopics.map((subtopic) => (
                    <Badge
                      key={`subtopic_${subtopic}`}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {getSubtopicName(subtopic)}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleSubtopic(subtopic)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Select
                    value={currentSubtopic ? currentSubtopic : undefined}
                    onValueChange={(value) =>
                      setCurrentSubtopic(value)
                    }
                  >
                    <SelectTrigger id="subtopic">
                      <SelectValue placeholder="Select a subtopic" />
                    </SelectTrigger>
                    <SelectContent>
                      {subtopics.map((subtopic) => (
                        <SelectItem key={subtopic.id} value={subtopic.id}>
                          {subtopic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={handleAddSubtopic} size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Answer Options</CardTitle>
              <CardDescription>
                {formData.type === QuestionType.MULTIPLE_CHOICE
                  ? "Add multiple choice options and mark the correct answer"
                  : "Select the correct answer for this true/false question"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.type === QuestionType.MULTIPLE_CHOICE ? (
                <div className="space-y-4">
                  {formData.multipleChoiceOptions.map((option, index) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <Input
                        value={option.content}
                        onChange={(e) =>
                          handleOptionChange(option.id, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={option.isCorrect}
                          onCheckedChange={(e) =>
                            handleCorrectOptionChange(option.id)
                          }
                          aria-label="Correct answer"
                        />
                        <Label
                          className="text-sm cursor-pointer"
                          onClick={() => handleCorrectOptionChange(option.id)}
                        >
                          Correct
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOption(option.id)}
                          disabled={formData.multipleChoiceOptions.length <= 2}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleAddOption}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.isTrue === true}
                        onCheckedChange={(checked) => handleTrueFalseToggle(checked)}
                        aria-label="True answer"
                      />
                      <Label
                        className="text-base cursor-pointer"
                        onClick={() => handleTrueFalseToggle(true)}
                      >
                        True
                      </Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.isTrue === false}
                        onCheckedChange={(checked) => handleTrueFalseToggle(!checked)}
                        aria-label="False answer"
                      />
                      <Label
                        className="text-base cursor-pointer"
                        onClick={() => handleTrueFalseToggle(false)}
                      >
                        False
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Preview how your question will appear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="question" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="question">Question</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="question"
                  className="p-4 border rounded-md mt-4"
                >
                  <div className="space-y-4">
                    <div>
                      <MarkdownRenderer
                        content={getPlaceholderContent()}
                        className="font-semibold text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      {formData.type === QuestionType.MULTIPLE_CHOICE ? (
                        formData.multipleChoiceOptions.map((option, index) => (
                          <div
                            key={option.id}
                            className="flex items-center space-x-2"
                          >
                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-sm font-medium">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <MarkdownRenderer
                              content={
                                option.content ||
                                `Option ${index + 1} will appear here`
                              }
                            />
                          </div>
                        ))
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-sm font-medium">
                              A
                            </div>
                            <span>True</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-sm font-medium">
                              B
                            </div>
                            <span>False</span>
                          </div>
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                            <span className="text-sm font-medium text-green-800">
                              Correct Answer: {formData.isTrue === true ? "True" : formData.isTrue === false ? "False" : "Not set"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent
                  value="metadata"
                  className="p-4 border rounded-md mt-4"
                >
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Title:
                        </span>
                        <p>{formData.title || "Not set"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Type:
                        </span>
                        <p>
                          {formData.type === QuestionType.MULTIPLE_CHOICE
                            ? "Multiple Choice"
                            : "True/False"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Subtopic:
                        </span>
                        {questionSubtopics?.length > 0 ? (
                          questionSubtopics.map((subtopic) => (
                            <p key={`subtopic_${subtopic}`}>
                              {getSubtopicName(subtopic as string)}
                            </p>
                          ))
                        ) : (
                          <p>Not set</p>
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Marks:
                        </span>
                        <p>{formData.totalPotentialMarks}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Difficulty:
                      </span>
                      <p>{(formData.difficultyLevel * 10).toFixed(1)}/10</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Tags:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.tags.length > 0 ? (
                          formData.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No tags
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Question"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}
