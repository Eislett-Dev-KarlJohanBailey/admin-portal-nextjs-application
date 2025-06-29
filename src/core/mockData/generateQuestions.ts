import { QuestionType } from "@/lib/types";
import { QuestionDetails } from "@/models/questions/questionDetails";
import { QuestionSubTopicDetails } from "@/models/questions/QuestionSubTopicDetails";

// Helper function to validate question structure
function validateQuestion(question: QuestionDetails): boolean {
  // Check if question has isTrue attribute for true/false questions
  if (question.type === QuestionType.TRUE_FALSE) {
    if (typeof question.isTrue !== 'boolean') {
      console.error(`Question ${question.id}: TRUE_FALSE questions must have isTrue attribute`);
      return false;
    }
    if (question.multipleChoiceOptions && question.multipleChoiceOptions.length !== 2) {
      console.error(`Question ${question.id}: TRUE_FALSE questions must have exactly 2 options`);
      return false;
    }
  }

  // Check if multiple choice questions have proper options
  if (question.type === QuestionType.MULTIPLE_CHOICE) {
    if (question.isTrue !== undefined) {
      console.error(`Question ${question.id}: MULTIPLE_CHOICE questions should not have isTrue attribute`);
      return false;
    }
    if (!question.multipleChoiceOptions || question.multipleChoiceOptions.length < 2) {
      console.error(`Question ${question.id}: MULTIPLE_CHOICE questions must have at least 2 options`);
      return false;
    }
    // Check that exactly one option is correct
    const correctOptions = question.multipleChoiceOptions.filter(option => option.isCorrect);
    if (correctOptions.length !== 1) {
      console.error(`Question ${question.id}: MULTIPLE_CHOICE questions must have exactly one correct option`);
      return false;
    }
  }

  // Check subtopic connection
  if (!question.subTopics || question.subTopics.length === 0) {
    console.error(`Question ${question.id}: Questions must be connected to at least one subtopic`);
    return false;
  }

  return true;
}

// Generate subtopic details for questions
function generateSubtopicDetails(subtopicId: string, name: string, description: string): QuestionSubTopicDetails {
  return {
    id: subtopicId,
    name,
    description,
    createdAt: new Date().toISOString().split('T')[0],
    hints: [],
    progress: 0,
  };
}

// Generate comprehensive questions with proper structure
export const GENERATED_QUESTIONS: QuestionDetails[] = [
  // Calculus Questions
  {
    id: "1",
    title: "Understanding Limits",
    description: "Test your understanding of limits in calculus",
    content: "What is the limit of f(x) = (x^2 - 1)/(x - 1) as x approaches 1?",
    tags: ["calculus", "limits", "algebra"],
    createdAt: "2025-01-20",
    type: QuestionType.MULTIPLE_CHOICE,
    totalPotentialMarks: 2,
    difficultyLevel: 0.6,
    subTopics: [
      generateSubtopicDetails("1", "Epsilon-Delta Definition", "Formal definition of limits using epsilon-delta notation"),
    ],
    multipleChoiceOptions: [
      { id: "1", content: "0", isCorrect: false },
      { id: "2", content: "1", isCorrect: false },
      { id: "3", content: "2", isCorrect: true },
      { id: "4", content: "Undefined", isCorrect: false },
    ],
  },
  {
    id: "2",
    title: "Limit Laws Application",
    description: "Apply limit laws to solve problems",
    content: "If lim(x→0) f(x) = 3 and lim(x→0) g(x) = 2, what is lim(x→0) [f(x) + g(x)]?",
    tags: ["calculus", "limit laws", "properties"],
    createdAt: "2025-01-22",
    type: QuestionType.MULTIPLE_CHOICE,
    totalPotentialMarks: 1,
    difficultyLevel: 0.3,
    subTopics: [
      generateSubtopicDetails("2", "Limit Laws", "Properties and rules for calculating limits"),
    ],
    multipleChoiceOptions: [
      { id: "1", content: "1", isCorrect: false },
      { id: "2", content: "5", isCorrect: true },
      { id: "3", content: "6", isCorrect: false },
      { id: "4", content: "0", isCorrect: false },
    ],
  },
  {
    id: "3",
    title: "Continuity Definition",
    description: "Understanding the formal definition of continuity",
    content: "A function f(x) is continuous at a point x = a if and only if lim(x→a) f(x) = f(a).",
    tags: ["calculus", "continuity", "definition"],
    createdAt: "2025-01-25",
    type: QuestionType.TRUE_FALSE,
    isTrue: true,
    totalPotentialMarks: 1,
    difficultyLevel: 0.4,
    subTopics: [
      generateSubtopicDetails("1", "Epsilon-Delta Definition", "Formal definition of limits using epsilon-delta notation"),
    ],
    multipleChoiceOptions: [
      { id: "1", content: "True", isCorrect: true },
      { id: "2", content: "False", isCorrect: false },
    ],
  },

  // Physics Questions
  {
    id: "4",
    title: "Newton's First Law",
    description: "Understanding inertia and the first law of motion",
    content: "An object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force.",
    tags: ["physics", "newton", "inertia"],
    createdAt: "2025-02-15",
    type: QuestionType.TRUE_FALSE,
    isTrue: true,
    totalPotentialMarks: 1,
    difficultyLevel: 0.2,
    subTopics: [
      generateSubtopicDetails("3", "First Law of Motion", "An object at rest stays at rest, and an object in motion stays in motion"),
    ],
    multipleChoiceOptions: [
      { id: "1", content: "True", isCorrect: true },
      { id: "2", content: "False", isCorrect: false },
    ],
  },
  {
    id: "5",
    title: "Force and Acceleration Relationship",
    description: "Understanding the relationship between force, mass, and acceleration",
    content: "According to Newton's Second Law, if the mass of an object is doubled while the force remains constant, the acceleration will be:",
    tags: ["physics", "newton", "acceleration", "force"],
    createdAt: "2025-02-18",
    type: QuestionType.MULTIPLE_CHOICE,
    totalPotentialMarks: 2,
    difficultyLevel: 0.5,
    subTopics: [
      generateSubtopicDetails("4", "Second Law of Motion", "Force equals mass times acceleration (F = ma)"),
    ],
    multipleChoiceOptions: [
      { id: "1", content: "Doubled", isCorrect: false },
      { id: "2", content: "Halved", isCorrect: true },
      { id: "3", content: "Unchanged", isCorrect: false },
      { id: "4", content: "Quadrupled", isCorrect: false },
    ],
  },
  {
    id: "6",
    title: "Action-Reaction Pairs",
    description: "Understanding Newton's Third Law",
    content: "For every action, there is an equal and opposite reaction.",
    tags: ["physics", "newton", "third law"],
    createdAt: "2025-02-20",
    type: QuestionType.TRUE_FALSE,
    isTrue: true,
    totalPotentialMarks: 1,
    difficultyLevel: 0.3,
    subTopics: [
      generateSubtopicDetails("4", "Second Law of Motion", "Force equals mass times acceleration (F = ma)"),
    ],
    multipleChoiceOptions: [
      { id: "1", content: "True", isCorrect: true },
      { id: "2", content: "False", isCorrect: false },
    ],
  },

  // Literature Questions
  {
    id: "7",
    title: "Hamlet's Soliloquy",
    description: "Understanding Hamlet's famous 'To be or not to be' soliloquy",
    content: "In Hamlet's 'To be or not to be' soliloquy, what is he primarily contemplating?",
    tags: ["literature", "shakespeare", "hamlet", "soliloquy"],
    createdAt: "2025-03-06",
    type: QuestionType.MULTIPLE_CHOICE,
    totalPotentialMarks: 2,
    difficultyLevel: 0.7,
    subTopics: [
      generateSubtopicDetails("5", "Character Analysis", "In-depth study of Hamlet's character and motivations"),
    ],
    multipleChoiceOptions: [
      { id: "1", content: "Whether to kill Claudius", isCorrect: false },
      { id: "2", content: "Whether to commit suicide", isCorrect: true },
      { id: "3", content: "Whether to marry Ophelia", isCorrect: false },
      { id: "4", content: "Whether to become king", isCorrect: false },
    ],
  },
  {
    id: "8",
    title: "Hamlet's Madness",
    description: "Understanding whether Hamlet's madness is real or feigned",
    content: "Hamlet's madness throughout the play is entirely feigned and not genuine.",
    tags: ["literature", "shakespeare", "hamlet", "madness"],
    createdAt: "2025-03-08",
    type: QuestionType.TRUE_FALSE,
    isTrue: false,
    totalPotentialMarks: 1,
    difficultyLevel: 0.6,
    subTopics: [
      generateSubtopicDetails("5", "Character Analysis", "In-depth study of Hamlet's character and motivations"),
    ],
    multipleChoiceOptions: [
      { id: "1", content: "True", isCorrect: false },
      { id: "2", content: "False", isCorrect: true },
    ],
  },

  // Computer Science Questions
  {
    id: "9",
    title: "Binary Tree Traversal",
    description: "Understanding different methods of traversing binary trees",
    content: "Which traversal method visits the root node first, then the left subtree, then the right subtree?",
    tags: ["computer science", "data structures", "binary trees", "traversal"],
    createdAt: "2025-02-26",
    type: QuestionType.MULTIPLE_CHOICE,
    totalPotentialMarks: 1,
    difficultyLevel: 0.4,
    subTopics: [
      generateSubtopicDetails("6", "Tree Traversal", "Methods for visiting all nodes in a binary tree"),
    ],
    multipleChoiceOptions: [
      { id: "1", content: "Inorder", isCorrect: false },
      { id: "2", content: "Preorder", isCorrect: true },
      { id: "3", content: "Postorder", isCorrect: false },
      { id: "4", content: "Level-order", isCorrect: false },
    ],
  },
  {
    id: "10",
    title: "Balanced Binary Trees",
    description: "Understanding the properties of balanced binary trees",
    content: "A balanced binary tree ensures that the height difference between left and right subtrees is at most 1.",
    tags: ["computer science", "data structures", "binary trees", "balancing"],
    createdAt: "2025-02-27",
    type: QuestionType.TRUE_FALSE,
    isTrue: true,
    totalPotentialMarks: 1,
    difficultyLevel: 0.3,
    subTopics: [
      generateSubtopicDetails("7", "Balanced Trees", "Techniques for maintaining balanced binary trees"),
    ],
    multipleChoiceOptions: [
      { id: "1", content: "True", isCorrect: true },
      { id: "2", content: "False", isCorrect: false },
    ],
  },
];

// Validation function to check all questions
export function validateAllQuestions(): boolean {
  console.log("Validating all questions...");
  let allValid = true;
  
  for (const question of GENERATED_QUESTIONS) {
    if (!validateQuestion(question)) {
      allValid = false;
    }
  }
  
  if (allValid) {
    console.log("✅ All questions are valid!");
  } else {
    console.error("❌ Some questions have validation errors.");
  }
  
  return allValid;
}

// Function to get questions by type
export function getQuestionsByType(type: QuestionType): QuestionDetails[] {
  return GENERATED_QUESTIONS.filter(question => question.type === type);
}

// Function to get questions by subtopic
export function getQuestionsBySubtopic(subtopicId: string): QuestionDetails[] {
  return GENERATED_QUESTIONS.filter(question => 
    question.subTopics?.some(subtopic => subtopic.id === subtopicId)
  );
}

// Function to get questions by difficulty level
export function getQuestionsByDifficulty(minDifficulty: number, maxDifficulty: number): QuestionDetails[] {
  return GENERATED_QUESTIONS.filter(question => 
    question.difficultyLevel >= minDifficulty && question.difficultyLevel <= maxDifficulty
  );
}

// Export the questions array
export { GENERATED_QUESTIONS as MOCK_QUESTIONS }; 