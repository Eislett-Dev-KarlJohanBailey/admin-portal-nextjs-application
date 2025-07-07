# Question-Subtopic Linking Guide

This guide explains how to use the question-subtopic linking endpoint to associate questions with subtopics in your admin portal.

## API Endpoint

**URL Pattern:** `/api/sub-topics/[subTopicId]/question/[questionId]`

**Methods:**
- `POST` - Link a question to a subtopic
- `DELETE` - Unlink a question from a subtopic

## Usage Examples

### 1. Basic Linking After Question Creation

When you create a question, you can link it to one or more subtopics using the provided utility functions:

```typescript
import { linkQuestionToSubtopic, linkQuestionToSubtopics } from '@/services/questions/questionsRequest';

// Link to a single subtopic
const success = await linkQuestionToSubtopic(questionId, subtopicId, authToken);

// Link to multiple subtopics
const success = await linkQuestionToSubtopics(questionId, [subtopicId1, subtopicId2], authToken);
```

### 2. Integration in Question Creation Flow

The question creation page (`src/pages/admin/topics/subtopics/questions/create.tsx`) already includes automatic linking:

```typescript
// After successful question creation
if (data?.id && questionSubtopics.length > 0) {
  const linkedAllSubtopics = await handleLinkSubtopics(data.id);
  
  if (!linkedAllSubtopics) {
    displayErrorMessage("Failed to Link questions");
  } else {
    displaySuccessMessage("Question Created!");
    // Navigate to questions list
  }
}
```

### 3. Manual Linking Component

Use the `QuestionSubtopicLinker` component for manual linking:

```typescript
import { QuestionSubtopicLinker } from '@/components/examples/QuestionSubtopicLinker';

// In your component
<QuestionSubtopicLinker 
  questionId="your-question-id"
  subtopicIds={["subtopic-1", "subtopic-2"]}
/>
```

## Utility Functions

### `linkQuestionToSubtopic(questionId, subtopicId, token)`

Links a single question to a single subtopic.

**Parameters:**
- `questionId` (string): The ID of the question
- `subtopicId` (string): The ID of the subtopic
- `token` (string): Authorization token

**Returns:** `Promise<boolean>` - True if successful, false otherwise

### `linkQuestionToSubtopics(questionId, subtopicIds, token)`

Links a question to multiple subtopics.

**Parameters:**
- `questionId` (string): The ID of the question
- `subtopicIds` (string[]): Array of subtopic IDs
- `token` (string): Authorization token

**Returns:** `Promise<boolean>` - True if all links successful, false otherwise

### `unlinkQuestionFromSubtopic(questionId, subtopicId, token)`

Unlinks a question from a subtopic.

**Parameters:**
- `questionId` (string): The ID of the question
- `subtopicId` (string): The ID of the subtopic
- `token` (string): Authorization token

**Returns:** `Promise<boolean>` - True if successful, false otherwise

## Error Handling

The utility functions include proper error handling:

```typescript
try {
  const success = await linkQuestionToSubtopic(questionId, subtopicId, token);
  if (success) {
    displaySuccessMessage('Success', 'Question linked successfully!');
  } else {
    displayErrorMessage('Failed to link', 'Could not link question to subtopic');
  }
} catch (error) {
  displayErrorMessage('Error', 'An error occurred while linking the question');
}
```

## API Response

The endpoint returns:
- `200` - Success (no body for POST/DELETE)
- `400` - Invalid request parameters
- `401` - Unauthorized (missing or invalid token)
- `500` - Server error

## Best Practices

1. **Always check authentication** before making requests
2. **Validate IDs** before sending requests
3. **Handle errors gracefully** with user-friendly messages
4. **Use the utility functions** instead of direct fetch calls
5. **Link after creation** - Create the question first, then link to subtopics
6. **Batch operations** - Use `linkQuestionToSubtopics` for multiple links

## Example Workflow

1. Create a question using `/api/questions` (POST)
2. Get the question ID from the response
3. Link the question to subtopics using the linking utilities
4. Handle success/error responses appropriately
5. Navigate to the questions list or show success message

```typescript
// Complete workflow example
const createAndLinkQuestion = async (questionData, subtopicIds) => {
  try {
    // 1. Create the question
    const questionResponse = await fetch('/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(questionData)
    });
    
    if (questionResponse.status !== 201) {
      throw new Error('Failed to create question');
    }
    
    const question = await questionResponse.json();
    
    // 2. Link to subtopics
    if (subtopicIds.length > 0) {
      const linkSuccess = await linkQuestionToSubtopics(
        question.id, 
        subtopicIds, 
        token
      );
      
      if (!linkSuccess) {
        throw new Error('Failed to link question to subtopics');
      }
    }
    
    displaySuccessMessage('Success', 'Question created and linked successfully!');
    return question;
    
  } catch (error) {
    displayErrorMessage('Error', error.message);
    throw error;
  }
};
``` 