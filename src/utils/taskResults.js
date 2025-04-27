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
    
    // Helper function to properly format values for CSV export
    const formatForCSV = (value) => {
      if (value === null || value === undefined) return '';
      
      // Convert the value to string
      let strValue = String(value);
      
      // If it looks like JSON, replace commas with semicolons
      if (strValue.startsWith('[') || strValue.startsWith('{')) {
        strValue = strValue.replace(/,/g, ';');
      }
      
      // If the value contains quotes, double them for CSV escape
      if (strValue.includes('"')) {
        strValue = strValue.replace(/"/g, '""');
      }
      
      // Wrap in quotes if it contains commas, quotes, or newlines
      if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n') || strValue.includes('\r')) {
        strValue = `"${strValue}"`;
      }
      
      return strValue;
    };
    
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
          formatForCSV(result.participantId || studentId),
          formatForCSV(result.timestamp || timestamp),
          formatForCSV(index + 1),
          formatForCSV(result.spanLength || ''),
          formatForCSV(result.sequence || ''),
          formatForCSV(result.expectedResponse || ''),
          formatForCSV(result.userResponse || ''),
          formatForCSV(result.isCorrect ? '1' : '0'),
          formatForCSV(maxSpan),
          formatForCSV(overallAccuracy)
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
          formatForCSV(result.participantId || studentId),
          formatForCSV(result.timestamp || timestamp),
          formatForCSV(index + 1),
          formatForCSV(result.spanLength || ''),
          formatForCSV(result.sequence || ''),
          formatForCSV(result.expectedResponse || ''),
          formatForCSV(result.userResponse || ''),
          formatForCSV(result.isCorrect ? '1' : '0'),
          formatForCSV(maxSpan),
          formatForCSV(overallAccuracy)
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
          formatForCSV(result.participantId || result.participant_id || studentId),
          formatForCSV(result.timestamp || timestamp),
          formatForCSV(index + 1),
          formatForCSV(result.spanLength || result.span_length || ''),
          formatForCSV(result.presentedSequence || result.presented_sequence || ''),
          formatForCSV(result.expectedResponse || result.expected_response || ''),
          formatForCSV(result.userResponse || result.user_response || ''),
          formatForCSV((result.isCorrect || result.is_correct) ? '1' : '0'),
          formatForCSV(maxSpan),
          formatForCSV(result.totalCorrectSequences || correctTrials),
          formatForCSV(overallAccuracy)
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
          formatForCSV(result.participantId || result.participant_id || studentId),
          formatForCSV(result.timestamp || timestamp),
          formatForCSV(index + 1),
          formatForCSV(result.spanLength || result.span_length || ''),
          formatForCSV(result.presentedSequence || result.presented_sequence || ''),
          formatForCSV(result.expectedResponse || result.expected_response || ''),
          formatForCSV(result.userResponse || result.user_response || ''),
          formatForCSV((result.isCorrect || result.is_correct) ? '1' : '0'),
          formatForCSV(maxSpan),
          formatForCSV(result.totalCorrectSequences || correctTrials),
          formatForCSV(overallAccuracy)
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
            formatForCSV(result.participantId || studentId),
            formatForCSV(result.timestamp || timestamp),
            formatForCSV(index + 1),
            formatForCSV(result.spanLength || ''),
            formatForCSV(result.sequence || ''),
            formatForCSV(result.expectedResponse || ''),
            formatForCSV(result.userResponse || ''),
            formatForCSV(result.isCorrect ? '1' : '0'),
            formatForCSV(maxSpan),
            formatForCSV(overallAccuracy)
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
            formatForCSV(result.participantId || studentId),
            formatForCSV(result.timestamp || timestamp),
            formatForCSV(index + 1),
            formatForCSV(result.spanLength || ''),
            formatForCSV(result.sequence || ''),
            formatForCSV(result.expectedResponse || ''),
            formatForCSV(result.userResponse || ''),
            formatForCSV(result.isCorrect ? '1' : '0'),
            formatForCSV(maxSpan),
            formatForCSV(overallAccuracy)
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
            formatForCSV(result.participantId || result.participant_id || studentId),
            formatForCSV(result.timestamp || timestamp),
            formatForCSV(index + 1),
            formatForCSV(result.spanLength || result.span_length || ''),
            formatForCSV(result.presentedSequence || result.presented_sequence || ''),
            formatForCSV(result.expectedResponse || result.expected_response || ''),
            formatForCSV(result.userResponse || result.user_response || ''),
            formatForCSV((result.isCorrect || result.is_correct) ? '1' : '0'),
            formatForCSV(maxSpan),
            formatForCSV(correctTrials),
            formatForCSV(overallAccuracy)
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
            formatForCSV(result.participantId || result.participant_id || studentId),
            formatForCSV(result.timestamp || timestamp),
            formatForCSV(index + 1),
            formatForCSV(result.spanLength || result.span_length || ''),
            formatForCSV(result.presentedSequence || result.presented_sequence || ''),
            formatForCSV(result.expectedResponse || result.expected_response || ''),
            formatForCSV(result.userResponse || result.user_response || ''),
            formatForCSV((result.isCorrect || result.is_correct) ? '1' : '0'),
            formatForCSV(maxSpan),
            formatForCSV(correctTrials),
            formatForCSV(overallAccuracy)
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
        // Format the expected and user answers in a more compact representation
        let formattedExpectedAnswer = '';
        let formattedUserAnswer = '';
        
        try {
          // For expected answer - try to parse the JSON if it's in that format
          if (result.correctAnswer) {
            let correctAnswer;
            if (typeof result.correctAnswer === 'string' && (result.correctAnswer.startsWith('{') || result.correctAnswer.startsWith('['))) {
              correctAnswer = JSON.parse(result.correctAnswer);
            } else {
              correctAnswer = result.correctAnswer;
            }
            
            // If it's an object with shape counts
            if (correctAnswer && typeof correctAnswer === 'object') {
              // Format for standard shape counting
              const parts = [];
              if (correctAnswer.squares > 0) parts.push(`${correctAnswer.squares}squares`);
              if (correctAnswer.triangles > 0) parts.push(`${correctAnswer.triangles}triangles`);
              if (correctAnswer.circles > 0) parts.push(`${correctAnswer.circles}circles`);
              formattedExpectedAnswer = parts.join(' ');
            } else if (typeof correctAnswer === 'string' && correctAnswer.includes('Squares:')) {
              // Handle string format like "Squares: 2, Triangles: 3, Circles: 1"
              const squares = correctAnswer.match(/Squares: (\d+)/);
              const triangles = correctAnswer.match(/Triangles: (\d+)/);
              const circles = correctAnswer.match(/Circles: (\d+)/);
              
              const parts = [];
              if (squares && squares[1] && parseInt(squares[1]) > 0) parts.push(`${squares[1]}squares`);
              if (triangles && triangles[1] && parseInt(triangles[1]) > 0) parts.push(`${triangles[1]}triangles`);
              if (circles && circles[1] && parseInt(circles[1]) > 0) parts.push(`${circles[1]}circles`);
              
              formattedExpectedAnswer = parts.join(' ');
            } else {
              formattedExpectedAnswer = result.correctAnswer;
            }
          }
          
          // For user answer - check both userAnswer and answer fields
          // First try userAnswer field
          let userAnswer = result.userAnswer;
          
          // If not found, try the answer field instead
          if (!userAnswer && result.answer) {
            userAnswer = result.answer;
          }
          
          // Also look for userCounts object which might be nested
          if (!userAnswer && result.userCounts) {
            userAnswer = result.userCounts;
          }
          
          if (userAnswer) {
            // If it's a string and looks like JSON, parse it
            if (typeof userAnswer === 'string' && (userAnswer.startsWith('{') || userAnswer.startsWith('['))) {
              try {
                userAnswer = JSON.parse(userAnswer);
              } catch (e) {
                // If parsing fails, leave as is
                console.log("Failed to parse user answer JSON:", e);
              }
            }
            
            // If it's an object with shape counts
            if (userAnswer && typeof userAnswer === 'object') {
              // Format for standard shape counting
              const parts = [];
              if (userAnswer.squares > 0) parts.push(`${userAnswer.squares}squares`);
              if (userAnswer.triangles > 0) parts.push(`${userAnswer.triangles}triangles`);
              if (userAnswer.circles > 0) parts.push(`${userAnswer.circles}circles`);
              formattedUserAnswer = parts.join(' ');
            } else if (typeof userAnswer === 'string' && userAnswer.includes('Squares:')) {
              // Handle string format like "Squares: 2, Triangles: 3, Circles: 1"
              const squares = userAnswer.match(/Squares: (\d+)/);
              const triangles = userAnswer.match(/Triangles: (\d+)/);
              const circles = userAnswer.match(/Circles: (\d+)/);
              
              const parts = [];
              if (squares && squares[1] && parseInt(squares[1]) > 0) parts.push(`${squares[1]}squares`);
              if (triangles && triangles[1] && parseInt(triangles[1]) > 0) parts.push(`${triangles[1]}triangles`);
              if (circles && circles[1] && parseInt(circles[1]) > 0) parts.push(`${circles[1]}circles`);
              
              formattedUserAnswer = parts.join(' ');
            } else {
              formattedUserAnswer = userAnswer.toString();
            }
          }
        } catch (e) {
          // Fallback to original values if parsing fails
          console.error('Error formatting shape counts:', e);
          formattedExpectedAnswer = result.correctAnswer || '';
          formattedUserAnswer = result.userAnswer || result.answer || '';
        }
        
        csvData.push([
          formatForCSV(result.participantId || studentId),
          formatForCSV(result.timestamp || timestamp),
          formatForCSV(index + 1),
          formatForCSV(result.level || ''),
          formatForCSV(result.questionText || ''),
          formatForCSV(formattedExpectedAnswer),
          formatForCSV(formattedUserAnswer),
          formatForCSV(result.isCorrect ? '1' : '0'),
          formatForCSV(maxLevel),
          formatForCSV(overallAccuracy)
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Counting Game Task (Ecological Shape Counting)
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
        // Format the expected and user answers in a more compact representation
        let formattedExpectedAnswer = '';
        let formattedUserAnswer = '';
        
        try {
          // For expected answer - try to parse the JSON if it's in that format
          if (result.correctAnswer) {
            let correctAnswer;
            if (typeof result.correctAnswer === 'string' && (result.correctAnswer.startsWith('{') || result.correctAnswer.startsWith('['))) {
              correctAnswer = JSON.parse(result.correctAnswer);
            } else {
              correctAnswer = result.correctAnswer;
            }
            
            // If it's an object with item counts (ecological items)
            if (correctAnswer && typeof correctAnswer === 'object') {
              // Format for ecological counting game (e.g., "1bill 2faces 3buses")
              const parts = [];
              // Check if it has specific fields
              if (typeof correctAnswer.bills !== 'undefined' && correctAnswer.bills > 0) {
                parts.push(`${correctAnswer.bills}bills`);
              }
              if (typeof correctAnswer.buses !== 'undefined' && correctAnswer.buses > 0) {
                parts.push(`${correctAnswer.buses}buses`);
              }
              if (typeof correctAnswer.faces !== 'undefined' && correctAnswer.faces > 0) {
                parts.push(`${correctAnswer.faces}faces`);
              }
              
              // If we found specific fields, use them
              if (parts.length > 0) {
                formattedExpectedAnswer = parts.join(' ');
              } else {
                // Otherwise iterate through all keys
                const itemNames = Object.keys(correctAnswer);
                for (const itemName of itemNames) {
                  if (correctAnswer[itemName] > 0) {
                    parts.push(`${correctAnswer[itemName]}${itemName}`);
                  }
                }
                formattedExpectedAnswer = parts.join(' ');
              }
            } else if (typeof correctAnswer === 'string' && correctAnswer.includes('Bills:')) {
              // Handle string format like "Bills: 1, Buses: 2, Faces: 3"
              const bills = correctAnswer.match(/Bills: (\d+)/);
              const buses = correctAnswer.match(/Buses: (\d+)/);
              const faces = correctAnswer.match(/Faces: (\d+)/);
              
              const parts = [];
              if (bills && bills[1] && parseInt(bills[1]) > 0) parts.push(`${bills[1]}bills`);
              if (buses && buses[1] && parseInt(buses[1]) > 0) parts.push(`${buses[1]}buses`);
              if (faces && faces[1] && parseInt(faces[1]) > 0) parts.push(`${faces[1]}faces`);
              
              formattedExpectedAnswer = parts.join(' ');
            } else {
              formattedExpectedAnswer = result.correctAnswer;
            }
          }
          
          // For user answer - check both userAnswer and answer fields
          // First try userAnswer field
          let userAnswer = result.userAnswer;
          
          // If not found, try the answer field instead
          if (!userAnswer && result.answer) {
            userAnswer = result.answer;
          }
          
          // Also look for userCounts object which might be nested
          if (!userAnswer && result.userCounts) {
            userAnswer = result.userCounts;
          }
          
          if (userAnswer) {
            // If it's a string and looks like JSON, parse it
            if (typeof userAnswer === 'string' && (userAnswer.startsWith('{') || userAnswer.startsWith('['))) {
              try {
                userAnswer = JSON.parse(userAnswer);
              } catch (e) {
                // If parsing fails, leave as is
                console.log("Failed to parse user answer JSON:", e);
              }
            }
            
            // If it's an object with item counts
            if (userAnswer && typeof userAnswer === 'object') {
              // Format for ecological counting game
              const parts = [];
              
              // Check if it has specific fields
              if (typeof userAnswer.bills !== 'undefined' && userAnswer.bills > 0) {
                parts.push(`${userAnswer.bills}bills`);
              }
              if (typeof userAnswer.buses !== 'undefined' && userAnswer.buses > 0) {
                parts.push(`${userAnswer.buses}buses`);
              }
              if (typeof userAnswer.faces !== 'undefined' && userAnswer.faces > 0) {
                parts.push(`${userAnswer.faces}faces`);
              }
              
              // If we found specific fields, use them
              if (parts.length > 0) {
                formattedUserAnswer = parts.join(' ');
              } else {
                // Otherwise iterate through all keys
                const itemNames = Object.keys(userAnswer);
                for (const itemName of itemNames) {
                  if (userAnswer[itemName] > 0) {
                    parts.push(`${userAnswer[itemName]}${itemName}`);
                  }
                }
                formattedUserAnswer = parts.join(' ');
              }
            } else if (typeof userAnswer === 'string' && userAnswer.includes('Bills:')) {
              // Handle string format like "Bills: 1, Buses: 2, Faces: 3"
              const bills = userAnswer.match(/Bills: (\d+)/);
              const buses = userAnswer.match(/Buses: (\d+)/);
              const faces = userAnswer.match(/Faces: (\d+)/);
              
              const parts = [];
              if (bills && bills[1] && parseInt(bills[1]) > 0) parts.push(`${bills[1]}bills`);
              if (buses && buses[1] && parseInt(buses[1]) > 0) parts.push(`${buses[1]}buses`);
              if (faces && faces[1] && parseInt(faces[1]) > 0) parts.push(`${faces[1]}faces`);
              
              formattedUserAnswer = parts.join(' ');
            } else {
              formattedUserAnswer = userAnswer.toString();
            }
          }
        } catch (e) {
          // Fallback to original values if parsing fails
          console.error('Error formatting counting game counts:', e);
          formattedExpectedAnswer = result.correctAnswer || '';
          formattedUserAnswer = result.userAnswer || result.answer || '';
        }
        
        csvData.push([
          formatForCSV(result.participantId || studentId),
          formatForCSV(result.timestamp || timestamp),
          formatForCSV(index + 1),
          formatForCSV(result.level || ''),
          formatForCSV(formattedExpectedAnswer),
          formatForCSV(formattedUserAnswer),
          formatForCSV(result.isCorrect ? '1' : '0'),
          formatForCSV(maxLevel),
          formatForCSV(overallAccuracy)
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Spatial Memory Task
    if (allResults.spatialMemory && allResults.spatialMemory.length > 0) {
      console.log('Found spatialMemory results:', allResults.spatialMemory.length, 'entries');
      
      // Add section header for Spatial Memory
      csvData.push(['SPATIAL MEMORY TASK']);
      
      // Add task-specific headers matching the image
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Num',
        'Difficulty Level',
        'Grid Size',
        'Target Positions',
        'Selected Positions',
        'Correct Selections',
        'Incorrect Selections',
        'Total Selections Made',
        'Completion Time (ms)',
        'Max Level Reached',
        'Overall Accuracy'
      ]);
      
      // Calculate max level reached and overall accuracy
      const maxLevel = allResults.spatialMemory.reduce((max, result) => {
        return (result.isCorrect || result.passed) && result.level > max ? result.level : max;
      }, 0);
      
      // Calculate overall accuracy based on correct selections vs total moved shapes
      // This is more appropriate than using isCorrect/passed flags
      const totalCorrectSelections = allResults.spatialMemory.reduce((sum, result) => {
        return sum + (result.correctSelections || 0);
      }, 0);
      
      const totalPossibleSelections = allResults.spatialMemory.reduce((sum, result) => {
        return sum + (result.totalMovedShapes || 0);
      }, 0);
      
      // Calculate accuracy based on correct selections
      const overallAccuracy = totalPossibleSelections > 0 
        ? (totalCorrectSelections / totalPossibleSelections * 100).toFixed(2) + '%' 
        : '0%';
      
      console.log(`Spatial Memory accuracy calculation: ${totalCorrectSelections} correct selections out of ${totalPossibleSelections} possible selections = ${overallAccuracy}`);
      
      // Add data rows with expanded fields
      allResults.spatialMemory.forEach((result, index) => {
        csvData.push([
          formatForCSV(result.participantId || studentId),
          formatForCSV(result.timestamp || timestamp),
          formatForCSV(result.trial || result.trialNumber || index + 1),
          formatForCSV(result.difficultyLevel || result.level || ''),
          formatForCSV(result.gridSize || ''),
          formatForCSV(result.targetPositions || ''),
          formatForCSV(result.selectedPositions || ''),
          formatForCSV(result.correctSelections || 0),
          formatForCSV(result.incorrectSelections || 0),
          formatForCSV(result.totalSelectionsCount || result.correctSelections + result.incorrectSelections || 0),
          formatForCSV(result.completionTime || ''),
          formatForCSV(maxLevel),
          formatForCSV(overallAccuracy)
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Ecological Spatial Task
    if (allResults.ecologicalSpatial && allResults.ecologicalSpatial.length > 0) {
      console.log('Found ecologicalSpatial results:', allResults.ecologicalSpatial.length, 'entries');
      
      // Add section header for Ecological Spatial
      csvData.push(['ECOLOGICAL SPATIAL TASK']);
      
      // Add task-specific headers matching the image
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Num',
        'Scenario ID',
        'Scenario Name',
        'Scene Description',
        'Target Objects',
        'Selected Objects',
        'Correct (1/0)',
        'Completion Time (ms)',
        'Overall Accuracy'
      ]);
      
      // Calculate overall accuracy
      const totalTrials = allResults.ecologicalSpatial.length;
      const correctTrials = allResults.ecologicalSpatial.filter(r => r.isCorrect || r.passed).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows with all fields
      allResults.ecologicalSpatial.forEach((result, index) => {
        csvData.push([
          formatForCSV(result.participantId || studentId),
          formatForCSV(result.timestamp || timestamp),
          formatForCSV(result.trialNumber || index + 1),
          formatForCSV(result.scenarioId || result.level || index + 1),
          formatForCSV(result.scenarioName || `Scenario ${result.level || index + 1}`),
          formatForCSV(result.sceneDescription || ''),
          formatForCSV(result.targetObjects || ''),
          formatForCSV(result.selectedObjects || ''),
          formatForCSV((result.isCorrect || result.passed) ? '1' : '0'),
          formatForCSV(result.completionTime || ''),
          formatForCSV(overallAccuracy)
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
          formatForCSV(result.participantId || studentId),
          formatForCSV(result.timestamp || timestamp),
          formatForCSV(index + 1),
          formatForCSV(result.level || ''),
          formatForCSV(result.scenarioName || ''),
          formatForCSV(result.question || ''),
          formatForCSV(result.correctItem || ''),
          formatForCSV(result.userSelectedItem || ''),
          formatForCSV(result.isCorrect ? '1' : '0'),
          formatForCSV(result.maxLevelReached || ''),
          formatForCSV(overallAccuracy)
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Ecological Deductive Reasoning Task
    if (allResults.ecologicalDeductiveReasoning && allResults.ecologicalDeductiveReasoning.length > 0) {
      console.log('Found ecologicalDeductiveReasoning results:', allResults.ecologicalDeductiveReasoning.length, 'entries');
      
      // Add section header for Ecological Deductive Reasoning
      csvData.push(['ECOLOGICAL DEDUCTIVE REASONING TASK']);
      
      // Add task-specific headers matching expected fields
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Scenario ID',
        'Scenario Name',
        'Question',
        'Correct Items',
        'Selected Items',
        'Correct (1/0)',
        'Completion Time (ms)',
        'Overall Accuracy'
      ]);
      
      // Log available field names for debugging
      if (allResults.ecologicalDeductiveReasoning.length > 0) {
        console.log('First ecologicalDeductiveReasoning result fields:', Object.keys(allResults.ecologicalDeductiveReasoning[0]));
      }
      
      // Calculate overall accuracy
      const totalTrials = allResults.ecologicalDeductiveReasoning.length;
      const correctTrials = allResults.ecologicalDeductiveReasoning.filter(r => r.isCorrect).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows with flexible field mapping
      allResults.ecologicalDeductiveReasoning.forEach((result, index) => {
        csvData.push([
          formatForCSV(result.participantId || studentId),
          formatForCSV(result.timestamp || timestamp),
          formatForCSV(result.trialNumber || index + 1),
          formatForCSV(result.scenarioId || result.level || index + 1),
          formatForCSV(result.scenarioName || `Scenario ${result.level || index + 1}`),
          formatForCSV(result.question || ''),
          formatForCSV(result.correctItem || ''),
          formatForCSV(result.userSelectedItem || ''),
          formatForCSV(result.isCorrect ? '1' : '0'),
          formatForCSV(result.completionTime || ''),
          formatForCSV(overallAccuracy)
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Create CSV content - each field is already properly formatted for CSV by the formatForCSV function
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