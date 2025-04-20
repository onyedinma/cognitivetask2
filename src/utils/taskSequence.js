/**
 * Task sequence utility
 * Defines the sequence of tasks and provides a function to get the next task
 */

// Define the sequence of tasks with subtasks
export const TASK_SEQUENCE = [
  { id: 'digit-span-forward', path: '/digit-span/forward', name: 'Digit Span Forward' },
  { id: 'digit-span-backward', path: '/digit-span/backward', name: 'Digit Span Backward' },
  { id: 'object-span-forward', path: '/object-span/forward', name: 'Object Span Forward' },
  { id: 'object-span-backward', path: '/object-span/backward', name: 'Object Span Backward' },
  { id: 'shape-counting', path: '/shape-counting', name: 'Shape Counting Task' },
  { id: 'counting-game', path: '/counting-game', name: 'Counting Game (Ecological)' },
  { id: 'spatial-memory', path: '/spatial-memory', name: 'Spatial Working Memory' },
  { id: 'ecological-spatial', path: '/ecological-spatial', name: 'Ecological Spatial Memory' },
  { id: 'deductive-reasoning', path: '/deductive-reasoning', name: 'Deductive Reasoning' },
  { id: 'ecological-deductive', path: '/ecological-deductive', name: 'Ecological Deductive Reasoning' },
  { id: 'combined-questionnaire', path: '/combined-questionnaire', name: 'Questionnaires' }
];

// Also define mapping of main tasks to their subtasks (for navigating from main task to first subtask)
export const MAIN_TASK_MAPPING = {
  'digit-span': 'digit-span-forward',
  'object-span': 'object-span-forward'
};

/**
 * Get the next task in the sequence
 * @param {string} currentTaskId - ID of the current task
 * @returns {Object|null} - The next task object or null if at the end
 */
export const getNextTask = (currentTaskId) => {
  // First check if this is a main task that needs to be mapped to a subtask
  if (MAIN_TASK_MAPPING[currentTaskId]) {
    currentTaskId = MAIN_TASK_MAPPING[currentTaskId];
  }
  
  const currentIndex = TASK_SEQUENCE.findIndex(task => task.id === currentTaskId);
  
  // If not found or at the end, return null
  if (currentIndex === -1 || currentIndex >= TASK_SEQUENCE.length - 1) {
    return null;
  }
  
  // Return the next task
  return TASK_SEQUENCE[currentIndex + 1];
};

/**
 * Check if the current task is the last in the sequence
 * @param {string} currentTaskId - ID of the current task
 * @returns {boolean} - True if this is the last task
 */
export const isLastTask = (currentTaskId) => {
  // First check if this is a main task that needs to be mapped to a subtask
  if (MAIN_TASK_MAPPING[currentTaskId]) {
    currentTaskId = MAIN_TASK_MAPPING[currentTaskId];
  }
  
  const currentIndex = TASK_SEQUENCE.findIndex(task => task.id === currentTaskId);
  return currentIndex === TASK_SEQUENCE.length - 1;
}; 