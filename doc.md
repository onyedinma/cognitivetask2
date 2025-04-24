# Cognitive Task Assessment Application Documentation

## 1. Overview

This application is a comprehensive cognitive assessment platform that administers a structured sequence of cognitive tasks to evaluate various mental abilities and cognitive functions. The assessment includes memory tasks, reasoning tasks, and questionnaires.

## 2. Technical Architecture

- **Framework**: React.js with React Router for navigation
- **State Management**: React Hooks (useState, useEffect, useRef)
- **Routing**: Browser-based routing with path-based task navigation
- **Data Storage**: LocalStorage for results and user information
- **Data Export**: CSV export functionality

## 3. Task Sequence

The application follows a predefined sequence of tasks defined in `taskSequence.js`:

1. Digit Span Forward
2. Digit Span Backward
3. Object Span Forward
4. Object Span Backward
5. Shape Counting Task
6. Counting Game (Ecological)
7. Spatial Working Memory
8. Ecological Spatial Memory
9. Deductive Reasoning
10. Ecological Deductive Reasoning
11. Combined Questionnaire

## 4. Cognitive Tasks

### 4.1 Digit Span Tasks
- **Purpose**: Measures working memory capacity
- **Forward Variant**: Present digits in sequence, recall in same order
- **Backward Variant**: Present digits in sequence, recall in reverse order
- **Implementation**: Adaptively increases span length on correct responses
- **Scoring**: Maximum span length successfully recalled

### 4.2 Object Span Tasks
- **Purpose**: Measures visual-verbal working memory
- **Forward Variant**: Present objects in sequence, recall in same order
- **Backward Variant**: Present objects in sequence, recall in reverse order
- **Implementation**: Similar to Digit Span but with visual objects
- **Helpers**: Includes an object reference guide to assist with naming

### 4.3 Shape Counting Tasks
- **Standard**: Count different shapes displayed in sequence
- **Ecological (Counting Game)**: Contextual variant of shape counting

### 4.4 Spatial Memory Tasks
- **Standard**: Remember spatial locations of shapes
- **Ecological**: Contextual variant with real-world spatial references

### 4.5 Deductive Reasoning Tasks
- **Standard**: Wason Selection Task paradigm
- **Ecological**: Contextual variant with real-world reasoning problems

### 4.6 Combined Questionnaire
- Includes multiple psychological assessments:
  - ACEIQ (Adverse Childhood Experiences)
  - SES (Socioeconomic Status)
  - MFQ (Mood and Feelings)
  - SDQ (Strengths and Difficulties)

## 5. Task Structure Pattern

Each cognitive task follows a common structure:
1. **Introduction/Instructions**: Explains the task
2. **Practice Round**: Allows user to understand the procedure
3. **Main Task**: Formal assessment with data collection
4. **Completion**: Shows task completion and navigates to next task

## 6. Navigation System

- `getNextTask(currentTaskId)`: Returns the next task in sequence
- `isLastTask(currentTaskId)`: Checks if current task is final
- `MAIN_TASK_MAPPING`: Maps parent tasks to their first subtask

## 7. Major Functions

### 7.1 Task Sequence Functions (`taskSequence.js`)
- `getNextTask(currentTaskId)`: Identifies and returns the next task in the predefined sequence
- `isLastTask(currentTaskId)`: Determines if the current task is the final task in the sequence

### 7.2 Results Management (`taskResults.js`)
- `saveTaskResults(taskName, results)`: Saves task results to localStorage
- `getAllTaskResults()`: Retrieves all stored task results
- `getTaskResults(taskName)`: Fetches results for a specific task
- `clearAllTaskResults()`: Clears all stored task results
- `exportAllTaskResults()`: Exports all task results as a CSV file

### 7.3 Digit Span Task Functions
- `startSequence()`: Initiates the digit span task sequence
- `checkResponse()`: Validates user's response against expected sequence
- `startNextSequence(spanToUse)`: Begins a new sequence with specified span length
- `exportAsCSV()`: Exports digit span results in CSV format

### 7.4 Object Span Task Functions
- `generateSequenceForRound(round)`: Creates a sequence of objects based on round number
- `startDisplayingSequence(sequence)`: Begins showing object sequence to user
- `displayObjects(objectSequence)`: Shows objects one by one with timing
- `handleSubmit(e)`: Processes user's object span response
- `handleTaskResponse(responseIsCorrect)`: Manages task flow based on response correctness

### 7.5 Navigation Functions
- `handleNextTask()`: Navigates to the next task in sequence
- `handleTaskComplete()`: Finalizes task and prepares for next task
- `handleReturnHome()`: Returns to application home screen

## 8. Data Collection and Storage

- Results for each task are collected in state
- On task completion, results are:
  1. Saved to localStorage
  2. Formatted and stored via `taskResults.js` utilities
  3. Available for CSV export

## 9. User Flow

1. Student information collection
2. Home screen with task menu
3. Sequential progression through cognitive tasks
4. Questionnaires
5. Completion screen with results export option

## 10. Security and Performance

- Static assets cached for 1 year (headers configuration)
- Security headers implemented (X-Frame-Options, X-XSS-Protection)
- Designed for in-browser execution without server requirements

## 11. Deployment

The application is configured for deployment as a static web application, with appropriate caching and security headers predefined. 