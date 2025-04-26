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
    
    // Prepare data for CSV
    const csvData = [];
    
    // Process Digit Span Task
    if (allResults.digitSpan && allResults.digitSpan.length > 0) {
      // Separate forward and backward digit span results
      const forwardResults = allResults.digitSpan.filter(r => r.spanMode === 'forward');
      const backwardResults = allResults.digitSpan.filter(r => r.spanMode === 'backward');
      
      // Process Forward Digit Span
      if (forwardResults.length > 0) {
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
      
      // Process Backward Digit Span
      if (backwardResults.length > 0) {
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
    
    // Process Object Span Task
    if (allResults.objectSpan && allResults.objectSpan.length > 0) {
      // Separate forward and backward object span results
      const forwardResults = allResults.objectSpan.filter(r => 
        r.spanMode === 'forward' || r.span_mode === 'forward');
      const backwardResults = allResults.objectSpan.filter(r => 
        r.spanMode === 'backward' || r.span_mode === 'backward');
      
      // Process Forward Object Span
      if (forwardResults.length > 0) {
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
      
      // Process Backward Object Span
      if (backwardResults.length > 0) {
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
      // Add section header
      csvData.push(['SHAPE COUNTING TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Difficulty Level',
        'Shape Configuration',
        'Correct Answer',
        'User Response',
        'Correct (1/0)',
        'Response Time (ms)',
        'Max Level Reached',
        'Overall Accuracy'
      ]);
      
      // Calculate metrics
      const maxLevel = allResults.shapeCounting.reduce((max, result) => {
        return result.level > max ? result.level : max;
      }, 0);
      
      const totalTrials = allResults.shapeCounting.length;
      const correctTrials = allResults.shapeCounting.filter(r => r.isCorrect || r.is_correct).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.shapeCounting.forEach((result, index) => {
        // Format shape configuration for better readability
        const shapeConfig = result.shapeConfiguration || result.shape_configuration || '';
        const formattedShapeConfig = typeof shapeConfig === 'object' ? 
          Object.entries(shapeConfig).map(([shape, count]) => `${shape}: ${count}`).join('; ') : 
          shapeConfig;
          
        csvData.push([
          result.participantId || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.level || '',
          formattedShapeConfig,
          result.correctAnswer || result.correct_answer || '',
          result.answer || result.userResponse || result.user_response || '',
          (result.isCorrect || result.is_correct) ? '1' : '0',
          result.responseTime || result.response_time || '',
          maxLevel,
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Counting Game (Ecological) Task
    if (allResults.countingGame && allResults.countingGame.length > 0) {
      // Add section header
      csvData.push(['COUNTING GAME TASK (ECOLOGICAL)']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Difficulty Level',
        'Scene Description',
        'Target Object',
        'Correct Count',
        'User Count',
        'Correct (1/0)',
        'Response Time (ms)',
        'Max Level Reached',
        'Overall Accuracy'
      ]);
      
      // Calculate metrics
      const maxLevel = allResults.countingGame.reduce((max, result) => {
        return result.level > max ? result.level : max;
      }, 0);
      
      const totalTrials = allResults.countingGame.length;
      const correctTrials = allResults.countingGame.filter(r => r.isCorrect || r.is_correct).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.countingGame.forEach((result, index) => {
        csvData.push([
          result.participantId || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.level || '',
          result.sceneDescription || result.scene_description || '',
          result.targetObject || result.target_object || '',
          result.correctAnswer || result.correct_answer || '',
          result.answer || result.userResponse || result.user_response || '',
          (result.isCorrect || result.is_correct) ? '1' : '0',
          result.responseTime || result.response_time || '',
          maxLevel,
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Spatial Memory Task
    if (allResults.spatialMemory && allResults.spatialMemory.length > 0) {
      // Add section header
      csvData.push(['SPATIAL MEMORY TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
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
      
      // Calculate metrics
      const maxLevel = allResults.spatialMemory.reduce((max, result) => {
        return result.level > max ? result.level : max;
      }, 0);
      
      const totalSelections = allResults.spatialMemory.reduce((sum, r) => {
        const correct = r.correctSelections || r.correct_selections || 0;
        const incorrect = r.incorrectSelections || r.incorrect_selections || 0;
        return sum + (correct + incorrect);
      }, 0);
      
      const correctSelections = allResults.spatialMemory.reduce((sum, r) => {
        return sum + (r.correctSelections || r.correct_selections || 0);
      }, 0);
      
      const overallAccuracy = totalSelections > 0 ? (correctSelections / totalSelections * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.spatialMemory.forEach((result, index) => {
        // Format position arrays for better readability
        const targetPositions = result.targetPositions || result.target_positions || [];
        const selectedPositions = result.selectedPositions || result.selected_positions || [];
        
        const formatPosition = (pos) => {
          if (Array.isArray(pos)) {
            return `[${pos.join(',')}]`;
          }
          return pos;
        };
        
        const formattedTargetPositions = Array.isArray(targetPositions) ?
          targetPositions.map(formatPosition).join('; ') :
          JSON.stringify(targetPositions);
          
        const formattedSelectedPositions = Array.isArray(selectedPositions) ?
          selectedPositions.map(formatPosition).join('; ') :
          JSON.stringify(selectedPositions);
        
        const correctSelections = result.correctSelections || result.correct_selections || 0;
        const incorrectSelections = result.incorrectSelections || result.incorrect_selections || 0;
        
        csvData.push([
          result.participantId || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.level || '',
          result.gridSize || result.grid_size || '',
          formattedTargetPositions,
          formattedSelectedPositions,
          correctSelections,
          incorrectSelections,
          (correctSelections + incorrectSelections),
          result.completionTime || result.completion_time || '',
          maxLevel,
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Ecological Spatial Task
    if (allResults.ecologicalSpatial && allResults.ecologicalSpatial.length > 0) {
      // Add section header
      csvData.push(['ECOLOGICAL SPATIAL TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
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
      const correctTrials = allResults.ecologicalSpatial.filter(r => r.isCorrect || r.is_correct).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.ecologicalSpatial.forEach((result, index) => {
        // Format objects arrays for better readability
        const correctItems = result.correctItems || result.correct_items || [];
        const selectedItems = result.selectedItems || result.selected_items || [];
        
        const formatItems = (items) => {
          if (typeof items === 'string') return items;
          if (Array.isArray(items)) {
            return items.map(item => {
              if (typeof item === 'object') return item.name || item.id || JSON.stringify(item);
              return item;
            }).join('; ');
          }
          return JSON.stringify(items);
        };
        
        const formattedCorrectItems = formatItems(correctItems);
        const formattedSelectedItems = formatItems(selectedItems);
        
        csvData.push([
          result.participantId || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.scenarioId || result.scenario_id || index + 1,
          result.scenarioName || result.scenario_name || '',
          result.sceneDescription || result.scene_description || '',
          formattedCorrectItems,
          formattedSelectedItems,
          (result.isCorrect || result.is_correct) ? '1' : '0',
          result.completionTime || result.completion_time || '',
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Deductive Reasoning Task
    if (allResults.deductiveReasoning && allResults.deductiveReasoning.length > 0) {
      // Add section header
      csvData.push(['DEDUCTIVE REASONING TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Puzzle ID',
        'Rule Description',
        'Difficulty Level',
        'Correct Cards',
        'Selected Cards',
        'Matches Rule (1/0)',
        'Decision Time (ms)',
        'Overall Accuracy'
      ]);
      
      // Calculate overall accuracy
      const totalTrials = allResults.deductiveReasoning.length;
      const correctTrials = allResults.deductiveReasoning.filter(r => r.isCorrect || r.is_correct).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.deductiveReasoning.forEach((result, index) => {
        // Format card arrays for better readability in CSV
        const correctCards = result.correctCards || result.correct_cards || [];
        const selectedCards = result.selectedCards || result.selected_cards || [];
        
        // Format cards as readable strings instead of raw JSON
        const formattedCorrectCards = Array.isArray(correctCards) ? 
          correctCards.map(card => card.id || card).join('; ') : 
          JSON.stringify(correctCards);
        
        const formattedSelectedCards = Array.isArray(selectedCards) ? 
          selectedCards.map(card => card.id || card).join('; ') : 
          JSON.stringify(selectedCards);
        
        csvData.push([
          result.participantId || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.puzzleId || result.puzzle_id || index + 1,
          result.question || result.ruleDescription || result.rule_description || '',
          result.difficultyLevel || result.difficulty_level || '',
          formattedCorrectCards,
          formattedSelectedCards,
          (result.isCorrect || result.is_correct) ? '1' : '0',
          result.decisionTime || result.decision_time || '',
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
    }
    
    // Process Ecological Deductive Reasoning Task
    if (allResults.ecologicalDeductive && allResults.ecologicalDeductive.length > 0) {
      // Add section header
      csvData.push(['ECOLOGICAL DEDUCTIVE REASONING TASK']);
      
      // Add task-specific headers
      csvData.push([
        'Participant ID',
        'Timestamp',
        'Trial Number',
        'Scenario ID',
        'Scenario Description',
        'Question',
        'Correct Options',
        'Selected Options',
        'Matches Rule (1/0)',
        'Decision Time (ms)',
        'Overall Accuracy'
      ]);
      
      // Calculate overall accuracy
      const totalTrials = allResults.ecologicalDeductive.length;
      const correctTrials = allResults.ecologicalDeductive.filter(r => r.isCorrect || r.is_correct).length;
      const overallAccuracy = totalTrials > 0 ? (correctTrials / totalTrials * 100).toFixed(2) + '%' : '0%';
      
      // Add data rows
      allResults.ecologicalDeductive.forEach((result, index) => {
        // Format option arrays for better readability
        const correctOptions = result.correctCards || result.correctOptions || 
                              result.correct_cards || result.correct_options || [];
        const selectedOptions = result.selectedCards || result.selectedOptions || 
                              result.selected_cards || result.selected_options || [];
        
        // Format options as readable strings
        const formattedCorrectOptions = Array.isArray(correctOptions) ? 
          correctOptions.map(opt => opt.id || opt.text || opt).join('; ') : 
          JSON.stringify(correctOptions);
        
        const formattedSelectedOptions = Array.isArray(selectedOptions) ? 
          selectedOptions.map(opt => opt.id || opt.text || opt).join('; ') : 
          JSON.stringify(selectedOptions);
        
        csvData.push([
          result.participantId || studentId,
          result.timestamp || timestamp,
          index + 1,
          result.scenarioId || result.scenario_id || index + 1,
          result.scenario || result.scenarioDescription || result.scenario_description || '',
          result.question || '',
          formattedCorrectOptions,
          formattedSelectedOptions,
          (result.isCorrect || result.is_correct) ? '1' : '0',
          result.decisionTime || result.decision_time || '',
          overallAccuracy
        ]);
      });
      
      // Add blank separator row
      csvData.push(['']);
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