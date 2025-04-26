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

// Export all task results as a single CSV file with task-specific headers
export const exportAllTaskResults = () => {
  try {
    const allResults = getAllTaskResults();
    const studentId = localStorage.getItem('studentId') || 'unknown';
    const timestamp = new Date().toISOString();
    
    // Log what's available in the results for debugging
    console.log('All task results available for export:', Object.keys(allResults));
    
    // Prepare data for CSV
    const csvData = [];
    
    // Process Forward Digit Span Task - Explicit handling
    if (allResults.digitSpanForward && allResults.digitSpanForward.length > 0) {
      console.log('Found digitSpanForward results:', allResults.digitSpanForward.length, 'entries');
      
      // Add section header for Forward Digit Span
      csvData.push(['FORWARD DIGIT SPAN TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Span Length',
        'Presented Sequence',
        'Expected Response',
        'User Response',
        'Correct (1/0)',
        'Max Span Reached',
        'Overall Accuracy'
      ]);
      
      // Calculate max span reached for forward digit span
      const maxSpan = allResults.digitSpanForward.reduce((max, result) => {
        return result.isCorrect && result.spanLength > max ? result.spanLength : max;
      }, 0);
      
      // Calculate overall accuracy
      const totalTrials = allResults.digitSpanForward.length;
      const correctTrials = allResults.digitSpanForward.filter(r => r.isCorrect).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.digitSpanForward.forEach((result, index) => {
        csvData.push([
          result.participantId || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.spanLength || '',
          result.sequence || '',
          result.expectedResponse || '',
          result.userResponse || '',
          result.isCorrect ? '1' : '0',
          maxSpan,
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Backward Digit Span Task - Explicit handling
    if (allResults.digitSpanBackward && allResults.digitSpanBackward.length > 0) {
      console.log('Found digitSpanBackward results:', allResults.digitSpanBackward.length, 'entries');
      
      // Add section header for Backward Digit Span
      csvData.push(['BACKWARD DIGIT SPAN TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Span Length',
        'Presented Sequence',
        'Expected Response',
        'User Response',
        'Correct (1/0)',
        'Max Span Reached',
        'Overall Accuracy'
      ]);
      
      // Calculate max span and accuracy
      const maxSpan = allResults.digitSpanBackward.reduce((max, result) => {
        return result.isCorrect && result.spanLength > max ? result.spanLength : max;
      }, 0);
      
      const totalTrials = allResults.digitSpanBackward.length;
      const correctTrials = allResults.digitSpanBackward.filter(r => r.isCorrect).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.digitSpanBackward.forEach((result, index) => {
        csvData.push([
          result.participantId || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.spanLength || '',
          result.sequence || '',
          result.expectedResponse || '',
          result.userResponse || '',
          result.isCorrect ? '1' : '0',
          maxSpan,
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Forward Object Span Task - Explicit handling
    if (allResults.objectSpanForward && allResults.objectSpanForward.length > 0) {
      console.log('Found objectSpanForward results:', allResults.objectSpanForward.length, 'entries');
      
      // Add section header for Forward Object Span
      csvData.push(['FORWARD OBJECT SPAN TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Span Length',
        'Presented Sequence',
        'Expected Response',
        'User Response',
        'Correct (1/0)',
        'Max Span Reached',
        'Total Correct Sequences',
        'Overall Accuracy'
      ]);
      
      // Calculate metrics with flexible field naming
      const maxSpan = allResults.objectSpanForward.reduce((max, result) => {
        const isCorrect = result.isCorrect || result.is_correct;
        const spanLength = result.spanLength || result.span_length;
        return isCorrect && spanLength > max ? spanLength : max;
      }, 0);
      
      const totalTrials = allResults.objectSpanForward.length;
      const correctTrials = allResults.objectSpanForward.filter(r => {
        return r.isCorrect || r.is_correct;
      }).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows with flexible field names
      allResults.objectSpanForward.forEach((result, index) => {
        csvData.push([
          result.participantId || result.participant_id || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.spanLength || result.span_length || '',
          result.presentedSequence || result.presented_sequence || '',
          result.expectedResponse || result.expected_response || '',
          result.userResponse || result.user_response || '',
          (result.isCorrect || result.is_correct) ? '1' : '0',
          maxSpan,
          result.totalCorrectSequences || correctTrials,
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Backward Object Span Task
    if (allResults.objectSpanBackward && allResults.objectSpanBackward.length > 0) {
      console.log('Found objectSpanBackward results:', allResults.objectSpanBackward.length, 'entries');
      
      // Add section header for Backward Object Span
      csvData.push(['BACKWARD OBJECT SPAN TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Span Length',
        'Presented Sequence',
        'Expected Response',
        'User Response',
        'Correct (1/0)',
        'Max Span Reached',
        'Total Correct Sequences',
        'Overall Accuracy'
      ]);
      
      // Calculate metrics
      const maxSpan = allResults.objectSpanBackward.reduce((max, result) => {
        const isCorrect = result.isCorrect || result.is_correct;
        const spanLength = result.spanLength || result.span_length;
        return isCorrect && spanLength > max ? spanLength : max;
      }, 0);
      
      const totalTrials = allResults.objectSpanBackward.length;
      const correctTrials = allResults.objectSpanBackward.filter(r => r.isCorrect || r.is_correct).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.objectSpanBackward.forEach((result, index) => {
        csvData.push([
          result.participantId || result.participant_id || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.spanLength || result.span_length || '',
          result.presentedSequence || result.presented_sequence || '',
          result.expectedResponse || result.expected_response || '',
          result.userResponse || result.user_response || '',
          (result.isCorrect || result.is_correct) ? '1' : '0',
          maxSpan,
          result.totalCorrectSequences || correctTrials,
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Check for legacy data format and include if present
    if (allResults.digitSpan && allResults.digitSpan.length > 0) {
      // Process legacy Digit Span data (for backward compatibility)
      // Separate forward and backward digit span results
      const forwardResults = allResults.digitSpan.filter(r => r.spanMode === 'forward');
      const backwardResults = allResults.digitSpan.filter(r => r.spanMode === 'backward');
      
      // Process Forward Digit Span legacy data
      if (forwardResults.length > 0 && (!allResults.digitSpanForward || allResults.digitSpanForward.length === 0)) {
        // Add section header for Forward Digit Span
        csvData.push(['FORWARD DIGIT SPAN TASK (LEGACY FORMAT)']);
        
        // Add task-specific headers
        csvData.push([
          'Participant ID',
          'Timestamp',
          'Trial Number',
          'Span Length',
          'Presented Sequence',
          'Expected Response',
          'User Response',
          'Correct (1/0)',
          'Max Span Reached',
          'Overall Accuracy'
        ]);
        
        // Calculate max span reached for forward digit span
        const maxSpan = forwardResults.reduce((max, result) => {
          return result.isCorrect && result.spanLength > max ? result.spanLength : max;
        }, 0);
        
        // Calculate overall accuracy
        const totalTrials = forwardResults.length;
        const correctTrials = forwardResults.filter(r => r.isCorrect).length;
        const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
        
        // Add data rows
        forwardResults.forEach((result, index) => {
          csvData.push([
            result.participantId || studentId,
            result.timestamp || timestamp,
            index + 1,
            result.spanLength || '',
            result.sequence || '',
            result.expectedResponse || '',
            result.userResponse || '',
            result.isCorrect ? '1' : '0',
            maxSpan,
            overallAccuracy
          ]);
        });
        
        // Add blank separator row
        csvData.push(['']);
      }
      
      // Process Backward Digit Span legacy data
      if (backwardResults.length > 0 && (!allResults.digitSpanBackward || allResults.digitSpanBackward.length === 0)) {
        // Add section header for Backward Digit Span
        csvData.push(['BACKWARD DIGIT SPAN TASK (LEGACY FORMAT)']);
        
        // Add task-specific headers
        csvData.push([
          'Participant ID',
          'Timestamp',
          'Trial Number',
          'Span Length',
          'Presented Sequence',
          'Expected Response',
          'User Response',
          'Correct (1/0)',
          'Max Span Reached',
          'Overall Accuracy'
        ]);
        
        // Calculate max span and accuracy
        const maxSpan = backwardResults.reduce((max, result) => {
          return result.isCorrect && result.spanLength > max ? result.spanLength : max;
        }, 0);
        
        const totalTrials = backwardResults.length;
        const correctTrials = backwardResults.filter(r => r.isCorrect).length;
        const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
        
        // Add data rows
        backwardResults.forEach((result, index) => {
          csvData.push([
            result.participantId || studentId,
            result.timestamp || timestamp,
            index + 1,
            result.spanLength || '',
            result.sequence || '',
            result.expectedResponse || '',
            result.userResponse || '',
            result.isCorrect ? '1' : '0',
            maxSpan,
            overallAccuracy
          ]);
        });
        
        // Add blank separator row
        csvData.push(['']);
      }
    }
    
    // Check for legacy object span data and include if present
    if (allResults.objectSpan && allResults.objectSpan.length > 0) {
      // Process legacy Object Span data (for backward compatibility)
      // Separate forward and backward object span results
      const forwardResults = allResults.objectSpan.filter(r => 
        r.spanMode === 'forward' || r.span_mode === 'forward');
      const backwardResults = allResults.objectSpan.filter(r => 
        r.spanMode === 'backward' || r.span_mode === 'backward');
      
      // Process Forward Object Span legacy data
      if (forwardResults.length > 0 && (!allResults.objectSpanForward || allResults.objectSpanForward.length === 0)) {
        // Add section header for Forward Object Span
        csvData.push(['FORWARD OBJECT SPAN TASK (LEGACY FORMAT)']);
        
        // Add task-specific headers
        csvData.push([
          'Participant ID',
          'Timestamp',
          'Trial Number',
          'Span Length',
          'Presented Sequence',
          'Expected Response',
          'User Response',
          'Correct (1/0)',
          'Max Span Reached',
          'Total Correct Sequences',
          'Overall Accuracy'
        ]);
        
        // Calculate metrics
        const maxSpan = forwardResults.reduce((max, result) => {
          const isCorrect = result.isCorrect || result.is_correct;
          const spanLength = result.spanLength || result.span_length;
          return isCorrect && spanLength > max ? spanLength : max;
        }, 0);
        
        const totalTrials = forwardResults.length;
        const correctTrials = forwardResults.filter(r => r.isCorrect || r.is_correct).length;
        const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
        
        // Add data rows
        forwardResults.forEach((result, index) => {
          csvData.push([
            result.participantId || result.participant_id || studentId,
            result.timestamp || timestamp,
            index + 1,
            result.spanLength || result.span_length || '',
            result.presentedSequence || result.presented_sequence || '',
            result.expectedResponse || result.expected_response || '',
            result.userResponse || result.user_response || '',
            (result.isCorrect || result.is_correct) ? '1' : '0',
            maxSpan,
            correctTrials,
            overallAccuracy
          ]);
        });
        
        // Add blank separator row
        csvData.push(['']);
      }
      
      // Process Backward Object Span legacy data
      if (backwardResults.length > 0 && (!allResults.objectSpanBackward || allResults.objectSpanBackward.length === 0)) {
        // Add section header for Backward Object Span
        csvData.push(['BACKWARD OBJECT SPAN TASK (LEGACY FORMAT)']);
        
        // Add task-specific headers
        csvData.push([
          'Participant ID',
          'Timestamp',
          'Trial Number',
          'Span Length',
          'Presented Sequence',
          'Expected Response',
          'User Response',
          'Correct (1/0)',
          'Max Span Reached',
          'Total Correct Sequences',
          'Overall Accuracy'
        ]);
        
        // Calculate metrics
        const maxSpan = backwardResults.reduce((max, result) => {
          const isCorrect = result.isCorrect || result.is_correct;
          const spanLength = result.spanLength || result.span_length;
          return isCorrect && spanLength > max ? spanLength : max;
        }, 0);
        
        const totalTrials = backwardResults.length;
        const correctTrials = backwardResults.filter(r => r.isCorrect || r.is_correct).length;
        const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
        
        // Add data rows
        backwardResults.forEach((result, index) => {
          csvData.push([
            result.participantId || result.participant_id || studentId,
            result.timestamp || timestamp,
            index + 1,
            result.spanLength || result.span_length || '',
            result.presentedSequence || result.presented_sequence || '',
            result.expectedResponse || result.expected_response || '',
            result.userResponse || result.user_response || '',
            (result.isCorrect || result.is_correct) ? '1' : '0',
            maxSpan,
            correctTrials,
            overallAccuracy
          ]);
        });
        
        // Add blank separator row
        csvData.push(['']);
      }
    }
    
    // Process Shape Counting Task
    if (allResults.shapeCounting && allResults.shapeCounting.length > 0) {
      // Add section header for Shape Counting
      csvData.push(['SHAPE COUNTING TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Level',
        'Question Text',
        'Expected Answer',
        'User Answer',
        'Correct (1/0)',
        'Max Level Reached',
        'Overall Accuracy'
      ]);
      
      // Calculate max level reached and overall accuracy
      const maxLevel = allResults.shapeCounting.reduce((max, result) => {
        return result.isCorrect && result.level > max ? result.level : max;
      }, 0);
      
      const totalTrials = allResults.shapeCounting.length;
      const correctTrials = allResults.shapeCounting.filter(r => r.isCorrect).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.shapeCounting.forEach((result, index) => {
        csvData.push([
          result.participantId || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.level || '',
          result.questionText || '',
          result.correctAnswer || '',
          result.userAnswer || '',
          result.isCorrect ? '1' : '0',
          maxLevel,
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Counting Game Task
    if (allResults.countingGame && allResults.countingGame.length > 0) {
      // Add section header for Counting Game
      csvData.push(['COUNTING GAME TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Level',
        'Expected Answer',
        'User Answer',
        'Correct (1/0)',
        'Max Level Reached',
        'Overall Accuracy'
      ]);
      
      // Calculate max level reached and overall accuracy
      const maxLevel = allResults.countingGame.reduce((max, result) => {
        return result.isCorrect && result.level > max ? result.level : max;
      }, 0);
      
      const totalTrials = allResults.countingGame.length;
      const correctTrials = allResults.countingGame.filter(r => r.isCorrect).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.countingGame.forEach((result, index) => {
        csvData.push([
          result.participantId || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.level || '',
          result.correctAnswer || '',
          result.userAnswer || '',
          result.isCorrect ? '1' : '0',
          maxLevel,
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Spatial Memory Task
    if (allResults.spatialMemory && allResults.spatialMemory.length > 0) {
      // Add section header for Spatial Memory
      csvData.push(['SPATIAL MEMORY TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Level',
        'Expected Sequence',
        'User Sequence',
        'Correct (1/0)',
        'Max Level Reached',
        'Overall Accuracy'
      ]);
      
      // Calculate max level reached and overall accuracy
      const maxLevel = allResults.spatialMemory.reduce((max, result) => {
        return result.isCorrect && result.level > max ? result.level : max;
      }, 0);
      
      const totalTrials = allResults.spatialMemory.length;
      const correctTrials = allResults.spatialMemory.filter(r => r.isCorrect).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.spatialMemory.forEach((result, index) => {
        csvData.push([
          result.participantId || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.level || '',
          result.expectedSequence || '',
          result.userSequence || '',
          result.isCorrect ? '1' : '0',
          maxLevel,
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Ecological Spatial Task
    if (allResults.ecologicalSpatial && allResults.ecologicalSpatial.length > 0) {
      // Add section header for Ecological Spatial
      csvData.push(['ECOLOGICAL SPATIAL TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Level',
        'Expected Sequence',
        'User Sequence',
        'Correct (1/0)',
        'Max Level Reached',
        'Overall Accuracy'
      ]);
      
      // Calculate max level reached and overall accuracy
      const maxLevel = allResults.ecologicalSpatial.reduce((max, result) => {
        return result.isCorrect && result.level > max ? result.level : max;
      }, 0);
      
      const totalTrials = allResults.ecologicalSpatial.length;
      const correctTrials = allResults.ecologicalSpatial.filter(r => r.isCorrect).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.ecologicalSpatial.forEach((result, index) => {
        csvData.push([
          result.participantId || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.level || '',
          result.expectedSequence || '',
          result.userSequence || '',
          result.isCorrect ? '1' : '0',
          maxLevel,
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Deductive Reasoning Task
    if (allResults.deductiveReasoning && allResults.deductiveReasoning.length > 0) {
      // Add section header for Deductive Reasoning
      csvData.push(['DEDUCTIVE REASONING TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Level',
        'Scenario Name',
        'Question',
        'Correct Item',
        'User Selected Item',
        'Correct (1/0)',
        'Max Level Reached',
        'Overall Accuracy'
      ]);
      
      // Calculate overall accuracy
      const totalTrials = allResults.deductiveReasoning.length;
      const correctTrials = allResults.deductiveReasoning.filter(r => r.isCorrect).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.deductiveReasoning.forEach((result, index) => {
        csvData.push([
          result.participantId || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.level || '',
          result.scenarioName || '',
          result.question || '',
          result.correctItem || '',
          result.userSelectedItem || '',
          result.isCorrect ? '1' : '0',
          result.maxLevelReached || '',
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Ecological Deductive Reasoning Task
    if (allResults.ecologicalDeductiveReasoning && allResults.ecologicalDeductiveReasoning.length > 0) {
      // Add section header for Ecological Deductive Reasoning
      csvData.push(['ECOLOGICAL DEDUCTIVE REASONING TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Level',
        'Scenario Name',
        'Question',
        'Correct Item',
        'User Selected Item',
        'Correct (1/0)',
        'Max Level Reached',
        'Overall Accuracy'
      ]);
      
      // Calculate overall accuracy
      const totalTrials = allResults.ecologicalDeductiveReasoning.length;
      const correctTrials = allResults.ecologicalDeductiveReasoning.filter(r => r.isCorrect).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.ecologicalDeductiveReasoning.forEach((result, index) => {
        csvData.push([
          result.participantId || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.level || '',
          result.scenarioName || '',
          result.question || '',
          result.correctItem || '',
          result.userSelectedItem || '',
          result.isCorrect ? '1' : '0',
          result.maxLevelReached || '',
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Create CSV content
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    
    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cognitive_assessment_results_${studentId}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error exporting task results:', error);
    return false;
  }
}; 