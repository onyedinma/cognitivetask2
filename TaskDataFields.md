# Cognitive Tasks Data Fields

This document details all the data fields collected for each cognitive assessment task. Each task captures specific metrics relevant to its cognitive domain, with both common and task-specific fields.

## Common Fields

These fields are collected for all task types:

| Field | Description |
|-------|-------------|
| Task Type | Unique identifier for the task (e.g., 'digit_span_forward', 'object_span_backward') |
| Task Heading | Descriptive name of the task (e.g., 'Working Memory - Forward Digit Span Assessment') |
| Participant ID | Unique identifier for the participant |
| Date/Time | Timestamp when the task was completed |
| Trial Number | Sequential number of the trial within the task |
| Accuracy | Binary value (1=correct, 0=incorrect) indicating if the trial was successful |
| Overall Accuracy | Percentage of correct trials across all trials for this task |

## Task-Specific Fields

### Forward Digit Span Task

Measures verbal working memory by asking participants to recall sequences of digits in the same order they were presented.

| Field | Description |
|-------|-------------|
| Level/Span Length | Number of digits in the sequence for this trial |
| Task Mode | Always 'forward' (repeat in same order) |
| Maximum Span/Level Reached | Highest span length correctly recalled across all trials |
| User Response | The sequence of digits entered by the participant |
| Correct Answer | The correct sequence of digits that should have been entered |

### Backward Digit Span Task

Measures verbal working memory and executive function by asking participants to recall sequences of digits in reverse order.

| Field | Description |
|-------|-------------|
| Level/Span Length | Number of digits in the sequence for this trial |
| Task Mode | Always 'backward' (repeat in reverse order) |
| Maximum Span/Level Reached | Highest span length correctly recalled across all trials |
| User Response | The sequence of digits entered by the participant |
| Correct Answer | The correct sequence of digits that should have been entered |

### Forward Object Span Task

Measures visual-object working memory by asking participants to recall sequences of objects in the same order they were presented.

| Field | Description |
|-------|-------------|
| Level/Span Length | Number of objects in the sequence for this trial |
| Task Mode | Always 'forward' (repeat in same order) |
| Maximum Span/Level Reached | Highest span length correctly recalled across all trials |
| User Response | The sequence of objects named by the participant |
| Correct Answer | The correct sequence of objects that should have been named |

### Backward Object Span Task

Measures visual-object working memory and executive function by asking participants to recall sequences of objects in reverse order.

| Field | Description |
|-------|-------------|
| Level/Span Length | Number of objects in the sequence for this trial |
| Task Mode | Always 'backward' (repeat in reverse order) |
| Maximum Span/Level Reached | Highest span length correctly recalled across all trials |
| User Response | The sequence of objects named by the participant |
| Correct Answer | The correct sequence of objects that should have been named |

### Shape Counting Task

Measures visual working memory by requiring participants to count specific shapes.

| Field | Description |
|-------|-------------|
| Level/Span Length | Difficulty level of the counting task |
| Maximum Span/Level Reached | Highest level successfully completed |
| User Response | The count entered by the participant |
| Correct Answer | The correct count of shapes |
| Correct Counts | The correct number of shapes (same as Correct Answer) |
| User Counts | The number counted by the participant (same as User Response) |

### Counting Game Task

Ecological version of shape counting using real-world objects.

| Field | Description |
|-------|-------------|
| Level/Span Length | Difficulty level of the counting task |
| Maximum Span/Level Reached | Highest level successfully completed |
| User Response | The count entered by the participant |
| Correct Answer | The correct count of objects |
| Correct Counts | The correct number of objects (same as Correct Answer) |
| User Counts | The number counted by the participant (same as User Response) |

### Spatial Memory Task

Measures spatial working memory by asking participants to remember the location of shapes.

| Field | Description |
|-------|-------------|
| Level/Span Length | Difficulty level (number of shapes to remember) |
| Maximum Span/Level Reached | Highest level successfully completed |
| Correct Selections | Number of correct shape selections made |
| Incorrect Selections | Number of incorrect shape selections made |
| Total Moved/Manipulated | Total number of shapes interacted with |
| Completion Time | Time taken to complete the trial (in milliseconds) |

### Ecological Spatial Task

Ecological version of spatial memory using real-world scenarios.

| Field | Description |
|-------|-------------|
| Question/Scenario | Name or description of the real-world scenario presented |
| Selected Items/Cards | JSON array of items selected by the participant |
| Correct Items/Cards | JSON array of items that should have been selected |
| Completion Time | Time taken to complete the scenario (in milliseconds) |

### Deductive Reasoning Task (Wason Selection Task)

Measures logical reasoning ability using abstract card selection problems.

| Field | Description |
|-------|-------------|
| Question/Scenario | The logical rule or problem statement presented |
| Selected Items/Cards | JSON array of cards selected by the participant |
| Correct Items/Cards | JSON array of cards that should have been selected |

### Ecological Deductive Reasoning Task

Ecological version of the Wason Selection Task using real-world scenarios.

| Field | Description |
|-------|-------------|
| Question/Scenario | The real-world logical rule or problem statement |
| Selected Items/Cards | JSON array of items selected by the participant |
| Correct Items/Cards | JSON array of items that should have been selected |

## CSV Export Format

The task results are exported as a single CSV file with a comprehensive header row containing all possible fields. Each task's data is grouped together with:

1. A task-specific section header row (e.g., "FORWARD DIGIT SPAN TASK", "BACKWARD OBJECT SPAN TASK")
2. Individual data rows for each trial
3. A blank separator row between different task types

The filename follows the format: `cognitive_tasks_results_[participantId]_[date].csv` 