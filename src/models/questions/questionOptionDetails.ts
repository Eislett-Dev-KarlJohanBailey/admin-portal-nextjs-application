export interface QuestionOptionDetails {
  id? : string
  content : string // the actual option
  isCorrect : boolean 
  createdAt? : string
  questionId? : string
}