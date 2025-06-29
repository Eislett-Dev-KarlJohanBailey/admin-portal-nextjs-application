export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_or_false"
}

export interface Question {
  id: string
  title: string
  description?: string
  content: string
  tags: string[]
  createdAt: string
  type: QuestionType
  totalPotentialMarks: number
  difficultyLevel: number
  subtopicId: string
  options?: QuestionOption[]
}

export interface QuestionOption {
  id: string
  content: string
  isCorrect: boolean
}

export interface QuestionFormData {
  id?: string
  title: string
  description: string
  content: string
  tags: string[]
  type: QuestionType
  totalPotentialMarks: number
  difficultyLevel: number
  // subtopicId: string
  multipleChoiceOptions: QuestionOption[]
  isTrue?: boolean
}
