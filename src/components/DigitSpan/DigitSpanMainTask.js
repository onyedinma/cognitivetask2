import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TASK_CONFIG } from '../../config';
import { getNextTask } from '../../utils/taskSequence';
import './DigitSpan.css';
import { saveTaskResults } from '../../utils/taskResults';

/**
 * DigitSpanMainTask component - Main task for both forward and backward digit span
 */
const DigitSpanMainTask = () => {
  const { direction } = useParams();
  const navigate = useNavigate();
  
  const [currentDigit, setCurrentDigit] = useState(null);
  const [sequence, setSequence] = useState([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [currentSpan, setCurrentSpan] = useState(TASK_CONFIG.digitSpan.minSpan);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [results, setResults] = useState([]);
  const [taskComplete, setTaskComplete] = useState(false);
  const [maxSpanReached, setMaxSpanReached] = useState(0);
  const [exportingCSV, setExportingCSV] = useState(false);
  
  // Refs to store and clear timers
  const timersRef = useRef([]);
  
  const isBackward = direction === 'backward';
  const title = isBackward ? 'Backward Digit Span Task' : 'Forward Digit Span Task';
  
  // Clear all timers
  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };
  
  // Start showing the digit sequence with improved timing
  const startSequence = () => {
    // Simply call startNextSequence with the current span level
    startNextSequence(currentSpan);
  };
  
  // Check user's response
  const checkResponse = () => {
    let expectedResponse = '';
    
    if (isBackward) {
      expectedResponse = [...sequence].reverse().join('');
    } else {
      expectedResponse = sequence.join('');
    }
    
    const isCorrect = userResponse === expectedResponse;
    console.log(`Response: ${userResponse}, Expected: ${expectedResponse}, Correct: ${isCorrect}`);
    
    const newSpan = isCorrect && currentSpan < TASK_CONFIG.digitSpan.maxSpan 
      ? currentSpan + 1 
      : currentSpan;
      
    const newAttempt = isCorrect 
      ? 1 
      : currentAttempt === 1 
        ? 2 
        : currentAttempt;
        
    const isTaskComplete = 
      (isCorrect && currentSpan >= TASK_CONFIG.digitSpan.maxSpan) || 
      (!isCorrect && currentAttempt === 2);
    
    // Record result before changing state
    const result = {
      span: currentSpan,
      attempt: currentAttempt,
      isCorrect,
      isBackward,
      sequence: [...sequence],
      userResponse: userResponse,
      expectedResponse: expectedResponse, // Already a combined string with join('')
      timestamp: new Date().toISOString()
    };
    
    // Update max span if needed
    const newMaxSpan = isCorrect && currentSpan > maxSpanReached 
      ? currentSpan 
      : maxSpanReached;
    
    // Update all states at once to ensure consistency
    setUserResponse('');
    setShowResponse(false);
    setResults(prev => [...prev, result]);
    setMaxSpanReached(newMaxSpan);
    setCurrentSpan(newSpan);
    setCurrentAttempt(newAttempt);
    setTaskComplete(isTaskComplete);
    
    // If the task is not complete, start the next sequence with the updated span
    if (!isTaskComplete) {
      // Add a slight delay before starting the next sequence
      const nextTimer = setTimeout(() => {
        console.log("Starting next sequence with span:", newSpan, "attempt:", newAttempt);
        startNextSequence(newSpan);
      }, 1500);
      timersRef.current.push(nextTimer);
    } else {
      // If task is complete, automatically export to CSV
      setTimeout(() => {
        exportAsCSV();
      }, 500);
    }
  };
  
  // Function to start a sequence with a specific span
  const startNextSequence = (spanToUse) => {
    // Clear any existing timers
    clearAllTimers();
    
    // Generate sequence using the provided span
    const newSequence = [];
    for (let i = 0; i < spanToUse; i++) {
      newSequence.push(Math.floor(Math.random() * 9) + 1); // Digits 1-9
    }
    
    console.log(`Starting next sequence for span ${spanToUse}:`, newSequence.join(', '));
    console.log(`Sequence length: ${newSequence.length}, specified span: ${spanToUse}`);
    
    setSequence(newSequence);
    setShowingSequence(true);
    
    // Empty display before starting sequence
    setCurrentDigit(null);
    
    // Use individual timeouts for each digit
    newSequence.forEach((digit, index) => {
      // Timer for showing each digit
      const showTimer = setTimeout(() => {
        console.log(`Showing digit ${digit} at index ${index}`);
        setCurrentDigit(digit);
      }, index * (TASK_CONFIG.digitSpan.displayTime + TASK_CONFIG.digitSpan.blankTime));
      
      timersRef.current.push(showTimer);
      
      // Timer for clearing each digit (except the last one)
      if (index < newSequence.length - 1) {
        const hideTimer = setTimeout(() => {
          console.log(`Hiding digit ${digit}`);
          setCurrentDigit(null);
        }, index * (TASK_CONFIG.digitSpan.displayTime + TASK_CONFIG.digitSpan.blankTime) + TASK_CONFIG.digitSpan.displayTime);
        
        timersRef.current.push(hideTimer);
      }
    });
    
    // Timer for ending the sequence and showing response
    const endTimer = setTimeout(() => {
      console.log('Sequence ended, showing response form');
      setShowingSequence(false);
      setCurrentDigit(null);
      setShowResponse(true);
    }, newSequence.length * (TASK_CONFIG.digitSpan.displayTime + TASK_CONFIG.digitSpan.blankTime));
    
    timersRef.current.push(endTimer);
  };
  
  // Handle CSV export
  const exportAsCSV = () => {
    try {
      // Import the task results utility function
      const { saveTaskResults } = require('../../utils/taskResults');
      
      const studentId = localStorage.getItem('studentId') || 'unknown';
      
      // Format results for storage - completely independent task structure
      const formattedResults = results.map(item => ({
        participantId: studentId,
        timestamp: item.timestamp || new Date().toISOString(),
        taskType: isBackward ? 'digitSpanBackward' : 'digitSpanForward',
        spanMode: isBackward ? 'backward' : 'forward',
        spanLength: item.span,
        attemptNumber: item.attempt,
        sequence: item.sequence.join(''), // Join without separator for a combined string
        expectedResponse: item.expectedResponse, // Already a combined string
        userResponse: item.userResponse,
        isCorrect: item.isCorrect,
        maxSpanReached: maxSpanReached
      }));
      
      // Save results using completely separate keys based on direction
      const taskKey = isBackward ? 'digitSpanBackward' : 'digitSpanForward';
      
      // Clear any existing results for this specific task 
      // to ensure we don't have mixing of task types
      const existingResults = localStorage.getItem('cognitiveTasksResults');
      if (existingResults) {
        try {
          const resultsObj = JSON.parse(existingResults);
          resultsObj[taskKey] = formattedResults;
          localStorage.setItem('cognitiveTasksResults', JSON.stringify(resultsObj));
        } catch (e) {
          console.error('Error updating existing results:', e);
          // Fall back to the utility function if there's an error
          saveTaskResults(taskKey, formattedResults);
        }
      } else {
        saveTaskResults(taskKey, formattedResults);
      }
      
      console.log(`${isBackward ? 'Backward' : 'Forward'} Digit Span results saved:`, formattedResults);
      console.log(`Task key used: ${taskKey}`);
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };
  
  // Start the task when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      startSequence();
    }, 1000);
    
    timersRef.current.push(timer);
    
    // Cleanup on unmount
    return () => {
      clearAllTimers();
    };
  }, []);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    checkResponse();
  };
  
  // Handle task completion
  const handleTaskComplete = () => {
    // Just use the exportAsCSV function since it's already implementing
    // the proper save logic using saveTaskResults
    exportAsCSV();
    
    // Navigate to the next task in the sequence
    const currentTaskId = isBackward ? 'digit-span-backward' : 'digit-span-forward';
    const nextTask = getNextTask(currentTaskId);
    
    if (nextTask) {
      navigate(nextTask.path);
    } else {
      // If no next task, navigate back to home
      navigate('/');
    }
  };
  
  // Navigate to the next task
  const handleNextTask = () => {
    // Use the exportAsCSV function to save results
    exportAsCSV();
    
    // If in forward mode, navigate to backward mode
    if (!isBackward) {
      navigate('/digit-span/backward');
    } else {
      // If in backward mode, navigate to the next task in sequence
      navigate('/object-span/forward');
    }
  };
  
  return (
    <div className="task-screen">
      {!taskComplete ? (
        <>
          <h1>{title}</h1>
          
          {showingSequence && (
            <div className="digit-display">
              <div className="span-indicator">Current Span: {currentSpan}</div>
              <div className={`digit ${currentDigit ? 'visible' : 'hidden'}`}>
                {currentDigit}
              </div>
            </div>
          )}
          
          {showResponse && (
            <div className="response-section">
              <h2>Please type the digits in the {isBackward ? 'reverse' : 'same'} order</h2>
              <p>Do not leave spaces between the numbers.</p>
              
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  className="response-input"
                  autoFocus
                  pattern="[0-9]*"
                  inputMode="numeric"
                  placeholder={isBackward ? "Enter in reverse order..." : "Enter in same order..."}
                />
                <button type="submit" className="submit-button">Submit</button>
              </form>
            </div>
          )}
          
          {!showingSequence && !showResponse && (
            <div className="loading">
              Preparing next sequence...
            </div>
          )}
        </>
      ) : (
        <div className="completion-screen">
          <h1>Task Complete</h1>
          
            <button 
              onClick={handleNextTask} 
            className="next-task-button"
              style={{
                fontSize: '1.5rem',
              padding: '16px 28px 16px 32px',
                fontWeight: 'bold',
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: 'white',
                border: 'none',
              borderRadius: '12px',
                cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                margin: '30px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '340px',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
            }}
          >
            {isBackward ? 'Next Task: Object Span' : 'Next Task: Backward Recall'}
            <span style={{ marginLeft: '10px', fontSize: '1.6rem' }}>→</span>
            </button>
        </div>
      )}
    </div>
  );
};

export default DigitSpanMainTask; 