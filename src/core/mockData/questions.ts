import { QuestionType } from "@/lib/types";
import { QuestionDetails } from "@/models/questions/questionDetails";

const MOCK_QUESTIONS: QuestionDetails[] = [
  {
    id: "1",
    title: "Understanding Limits",
    description: "Test your understanding of limits in calculus",
    content: "What is the limit of f(x) = (x^2 - 1)/(x - 1) as x approaches 1?",
    tags: ["calculus", "limits"],
    createdAt: "2025-01-20",
    type: QuestionType.MULTIPLE_CHOICE,
    totalPotentialMarks: 2,
    difficultyLevel: 0.6,
    subTopics: [
      {
        id: "1",
        name: "Limits",
        description: "Limits in calculus",
        createdAt: "2025-01-01",
        hints: [],
        progress: 0,
      },
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
    content:
      "If lim(x→0) f(x) = 3 and lim(x→0) g(x) = 2, what is lim(x→0) [f(x) + g(x)]?",
    tags: ["calculus", "limit laws"],
    createdAt: "2025-01-22",
    type: QuestionType.MULTIPLE_CHOICE,
    totalPotentialMarks: 1,
    difficultyLevel: 0.3,
    subTopics: [
      {
        id: "2",
        name: "Limit Laws",
        description: "Laws of limits",
        createdAt: "2025-01-02",
        hints: [],
        progress: 0,
      },
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
    title: "Newton's First Law",
    description: "Understanding inertia",
    content:
      "An object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force.",
    tags: ["physics", "newton"],
    createdAt: "2025-02-15",
    type: QuestionType.TRUE_FALSE,
    totalPotentialMarks: 1,
    difficultyLevel: 0.2,
    subTopics: [
      {
        id: "3",
        name: "Newton's First Law",
        description: "Law of inertia",
        createdAt: "2025-02-01",
        hints: [],
        progress: 0,
      },
    ],
    multipleChoiceOptions: [
      { id: "1", content: "True", isCorrect: true },
      { id: "2", content: "False", isCorrect: false },
    ],
  },
  {
    id: "4",
    title: "Force and Acceleration",
    description: "Understanding F=ma",
    content:
      "According to Newton's Second Law, if the mass of an object is doubled while the force remains constant, the acceleration will be halved.",
    tags: ["physics", "newton", "acceleration"],
    createdAt: "2025-02-18",
    type: QuestionType.TRUE_FALSE,
    totalPotentialMarks: 1,
    difficultyLevel: 0.4,
    subTopics: [
      {
        id: "4",
        name: "Force and Acceleration",
        description: "Newton's Second Law",
        createdAt: "2025-02-02",
        hints: [],
        progress: 0,
      },
    ],
    multipleChoiceOptions: [
      { id: "1", content: "True", isCorrect: true },
      { id: "2", content: "False", isCorrect: false },
    ],
  },
];

export { MOCK_QUESTIONS };
