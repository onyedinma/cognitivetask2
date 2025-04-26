# Cognitive Task Assessment Application

A comprehensive web-based platform for administering a structured sequence of cognitive assessments to evaluate various mental abilities and cognitive functions.

## Overview

This application provides a collection of validated cognitive tasks designed to measure different aspects of cognitive function, including:

- Working memory (visual-spatial)
- Visual perception
- Logical reasoning
- Spatial memory
- Ecological cognitive assessments (real-world context)

The platform features both laboratory-style tasks and ecological variants with real-world contexts to enable comprehensive assessment of cognitive abilities.

## Features

- **Structured Task Sequence**: Pre-defined task progression with standardized administration
- **Adaptive Difficulty**: Tasks adjust difficulty based on participant performance
- **Comprehensive Data Collection**: Detailed metrics recorded for each task
- **Centralized Results Export**: Export all task data as a single CSV file with clear headers
- **Participant Management**: Track participants with unique IDs
- **Task Instructions**: Clear instructions and practice trials for each task
- **Responsive Design**: Works on tablets and desktop computers
- **Focused Assessment Flow**: Prominent "Start Assessment" button with clear task progression
- **Development Mode**: Hidden menu for accessing individual tasks during development or testing

## User Interface

The application features an intuitive user interface designed for both participants and administrators:

1. **Participant Information Screen**: Collects a unique identifier for each participant
2. **Home Screen**: 
   - Displays a prominent "Start Assessment" button to begin the full assessment sequence
   - Shows the current participant ID for verification
   - Includes a hidden developer menu to access individual tasks (toggled by button)
3. **Task Screens**: Consistent layout across all tasks with clear instructions and intuitive interactions
4. **Results Export**: Centralized export of all results at the end of the assessment

## Cognitive Tasks

### 1. Working Memory Assessment

#### Digit Span Task
- **Forward Mode**: Recall sequences of digits in the presented order
- **Backward Mode**: Recall sequences of digits in reverse order
- **Metrics**: Maximum span reached, accuracy per trial, exact responses

#### Object Span Task  
- **Forward Mode**: Recall sequences of objects in the presented order
- **Backward Mode**: Recall sequences of objects in reverse order
- **Metrics**: Maximum span reached, accuracy per trial, exact responses

### 2. Visual Working Memory

#### Shape Counting Task
- Count specific shapes presented in a visual array
- Increasing difficulty levels
- Metrics: Accuracy, user counts, correct counts

#### Counting Game (Ecological)
- Count objects in real-world scenes
- Increasing difficulty levels
- Metrics: Accuracy, user counts, correct counts

### 3. Spatial Memory

#### Spatial Memory Task
- Remember locations of shapes in a grid
- Multiple difficulty levels
- Metrics: Correct/incorrect selections, completion time

#### Ecological Spatial Task
- Remember locations of objects in real-world scenarios
- Metrics: Selected items, correct items, completion time

### 4. Logical Reasoning

#### Deductive Reasoning Task (Wason Selection Task)
- Evaluate logical rules using card selection problems
- Metrics: Selected cards, correct cards, accuracy

#### Ecological Deductive Reasoning
- Apply logical reasoning to real-world scenarios
- Metrics: Selected options, correct options, accuracy

## Data Management

### Data Collection
All task results are automatically saved to the browser's local storage after each task completion. The data is structured to capture task-specific metrics while maintaining a consistent format.

### CSV Export
The application provides a comprehensive CSV export with:
- Detailed headers for all data fields
- Task section headers for clear organization
- Separator rows between different task types
- Consistent formatting across all tasks

See [TaskDataFields.md](./TaskDataFields.md) for a detailed explanation of all collected fields.

## Getting Started

### Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server

### Running the Application
1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Enter a participant ID when prompted
3. Follow the task sequence as directed or use the developer menu to access specific tasks
4. Export results after completion using the export functionality

## Development

### Available Scripts
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

### Project Structure
- `/src/components` - Task-specific React components
- `/src/utils` - Utility functions for task management
- `/src/styles` - CSS files for component styling
- `/src/config.js` - Configuration settings for tasks

## License
[This App was built for research purposes and is not intended for commercial use.]
*DEVELOPED BY XINNOV TECH SOLUTIONS (NIGERIA) - +2348038198759, xinovtech@gmail.com*