/**
 * Task Results Utility
 * Manages storing, retrieving, and exporting task results for all cognitive tasks.
 */

// Save task results to localStorage
export const saveTaskResults = (taskName, results) => {
  try {
    // Get existing results from localStorage
    const allResults = getAllTaskResults();
    
    // Add or update the results for this task
    allResults[taskName] = results;
    
    // Save back to localStorage
    localStorage.setItem('cognitiveTasksResults', JSON.stringify(allResults));
    
    return true;
  } catch (error) {
    console.error(`Error saving ${taskName} results:`, error);
    return false;
  }
};

// Get all task results from localStorage
export const getAllTaskResults = () => {
  try {
    const resultsJSON = localStorage.getItem('cognitiveTasksResults');
    return resultsJSON ? JSON.parse(resultsJSON) : {};
  } catch (error) {
    console.error('Error retrieving task results:', error);
    return {};
  }
};

// Get results for a specific task
export const getTaskResults = (taskName) => {
  const allResults = getAllTaskResults();
  return allResults[taskName] || null;
};

// Clear all task results
export const clearAllTaskResults = () => {
  try {
    localStorage.removeItem('cognitiveTasksResults');
    return true;
  } catch (error) {
    console.error('Error clearing task results:', error);
    return false;
  }
};

// Export all task results as a single CSV file
export const exportAllTaskResults = () => {
  try {
    const allResults = getAllTaskResults();
    const studentId = localStorage.getItem('studentId') || 'unknown';
    const counterBalance = localStorage.getItem('counterBalance') || 'unknown';
    const timestamp = new Date().toISOString();
    
    // Prepare data for CSV
    const csvData = [];
    
    // Header row
    csvData.push(['Task', 'Student ID', 'Counter Balance', 'Trial', 'Question', 'Is Correct', 'Response Details', 'Correct Answer', 'Timestamp']);
    
    // Process Object Span results
    if (allResults.objectSpan) {
      allResults.objectSpan.forEach((result, index) => {
        csvData.push([
          'object_span',
          studentId,
          counterBalance,
          index + 1,
          `Span ${result.spanLength || ''} - ${result.spanMode || ''}`,
          result.isCorrect ? '1' : '0',
          result.sequence || '',
          result.correctSequence || '',
          result.timestamp || ''
        ]);
      });
    }
    
    // Process Digit Span results
    if (allResults.digitSpan) {
      allResults.digitSpan.forEach((result, index) => {
        csvData.push([
          'digit_span',
          studentId,
          counterBalance,
          index + 1,
          `Span ${result.spanLength || ''} - ${result.spanMode || ''}`,
          result.isCorrect ? '1' : '0',
          result.sequence || '',
          result.correctSequence || '',
          result.timestamp || ''
        ]);
      });
    }
    
    // Process Shape Counting results
    if (allResults.shapeCounting) {
      allResults.shapeCounting.forEach((result, index) => {
        csvData.push([
          'shape_counting',
          studentId,
          counterBalance,
          index + 1,
          result.shapeType || '',
          result.isCorrect ? '1' : '0',
          result.answer || '',
          result.correctAnswer || '',
          result.timestamp || ''
        ]);
      });
    }
    
    // Process Counting Game results
    if (allResults.countingGame) {
      allResults.countingGame.forEach((result, index) => {
        csvData.push([
          'counting_game',
          studentId,
          counterBalance,
          index + 1,
          result.imageType || '',
          result.isCorrect ? '1' : '0',
          result.answer || '',
          result.correctAnswer || '',
          result.timestamp || ''
        ]);
      });
    }
    
    // Process Spatial Memory results
    if (allResults.spatialMemory) {
      allResults.spatialMemory.forEach((result, index) => {
        csvData.push([
          'spatial_memory',
          studentId,
          counterBalance,
          index + 1,
          `Level ${result.level || ''}`,
          result.correctSelections > result.incorrectSelections ? '1' : '0',
          `Correct: ${result.correctSelections}, Incorrect: ${result.incorrectSelections}`,
          `Total Moved: ${result.totalMovedShapes || ''}`,
          result.timestamp || ''
        ]);
      });
    }
    
    // Process Ecological Spatial results
    if (allResults.ecologicalSpatial) {
      allResults.ecologicalSpatial.forEach((result, index) => {
        csvData.push([
          'ecological_spatial',
          studentId,
          counterBalance,
          index + 1,
          result.scenarioName || '',
          result.isCorrect ? '1' : '0',
          JSON.stringify(result.selectedItems || []),
          JSON.stringify(result.correctItems || []),
          result.timestamp || ''
        ]);
      });
    }
    
    // Process Deductive Reasoning results
    if (allResults.deductiveReasoning) {
      allResults.deductiveReasoning.forEach((result, index) => {
        csvData.push([
          'deductive_reasoning',
          studentId,
          counterBalance,
          index + 1,
          result.question || '',
          result.isCorrect ? '1' : '0',
          JSON.stringify(result.selectedAnswer || ''),
          JSON.stringify(result.correctAnswer || ''),
          result.timestamp || ''
        ]);
      });
    }
    
    // Process Ecological Deductive Reasoning results
    if (allResults.ecologicalDeductive) {
      allResults.ecologicalDeductive.forEach((result, index) => {
        csvData.push([
          'ecological_deductive_reasoning',
          studentId,
          counterBalance,
          index + 1,
          result.question || '',
          result.isCorrect ? '1' : '0',
          JSON.stringify(result.selectedCards || []),
          JSON.stringify(result.correctCards || []),
          result.timestamp || ''
        ]);
      });
    }
    
    // Create CSV content
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cognitive_tasks_results_${studentId}_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error exporting all task results:', error);
    return false;
  }
}; 