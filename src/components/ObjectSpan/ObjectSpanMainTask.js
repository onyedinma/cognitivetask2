import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TASK_CONFIG, UTILS, EXPORT_FORMATS } from '../../config';
import { getNextTask } from '../../utils/taskSequence';
import './ObjectSpan.css';
import ObjectReference from './ObjectReference';

const ObjectSpanMainTask = () => {
  const { direction } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [currentState, setCurrentState] = useState('ready'); // ready, displaying, responding, feedback, complete
  const [currentRound, setCurrentRound] = useState(1);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [maxSpanReached, setMaxSpanReached] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentObject, setCurrentObject] = useState(null);
  const [results, setResults] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [counterBalance, setCounterBalance] = useState('');
  
  // Store the current sequence separately
  const [currentSequence, setCurrentSequence] = useState([]);
  
  const responseInputRef = useRef(null);
  const isBackward = direction === 'backward';

  // Calculate the span for a given round
  const getSpanForRound = (round) => {
    return TASK_CONFIG.objectSpan.minSpan + (round - 1);
  };

  // Load student info from localStorage
  useEffect(() => {
    const savedStudentId = localStorage.getItem('studentId') || 'unknown';
    const savedCounterBalance = localStorage.getItem('counterBalance') || 'unknown';
    
    setStudentId(savedStudentId);
    setCounterBalance(savedCounterBalance);
    
    // Generate initial sequence for round 1
    prepareRound(1, 1);
  }, []);

  // Generate a new sequence for the specified round
  const generateSequenceForRound = (round) => {
    const spanLength = getSpanForRound(round);
    console.log(`Generating sequence for Round ${round} with span ${spanLength}`);
    
    const newSequence = [];
    for (let i = 0; i < spanLength; i++) {
      // Random object from 1-9
      const randomObjectId = Math.floor(Math.random() * 9) + 1;
      newSequence.push(randomObjectId);
    }
    return newSequence;
  };
  
  // Prepare for a new round/attempt
  const prepareRound = (round, attempt) => {
    console.log(`Preparing Round ${round}, Attempt ${attempt}`);
    
    // Generate the sequence for this round
    const sequence = generateSequenceForRound(round);
    
    // Update state with the new sequence
    setCurrentSequence(sequence);
    setCurrentRound(round);
    setCurrentAttempt(attempt);
    
    // Schedule starting the sequence
    setTimeout(() => {
      startDisplayingSequence(sequence);
    }, 50);
  };
  
  // Start displaying a given sequence
  const startDisplayingSequence = (sequence) => {
    console.log(`Starting to display sequence with ${sequence.length} objects`);
    
    setCurrentState('displaying');
    setCurrentIndex(0);
    
    // Show the first object
    if (sequence.length > 0) {
      setCurrentObject(TASK_CONFIG.objectSpan.objectMapping[sequence[0]]);
    }
    
    // Display the objects one by one
    displayObjects(sequence);
  };
  
  // Display objects one by one
  const displayObjects = (objectSequence) => {
    let index = 0;
    
    const displayNext = () => {
      if (index < objectSequence.length) {
        // Set the current object
        setCurrentIndex(index);
        setCurrentObject(TASK_CONFIG.objectSpan.objectMapping[objectSequence[index]]);
        
        // Schedule next object
        index++;
        setTimeout(() => {
          // Hide current object (blank period)
          setCurrentObject(null);
          
          // Schedule next object or end sequence
          setTimeout(() => {
            if (index < objectSequence.length) {
              displayNext();
            } else {
              // End of sequence, show response input
              setCurrentState('responding');
              setTimeout(() => {
                if (responseInputRef.current) {
                  responseInputRef.current.focus();
                }
              }, 100);
            }
          }, TASK_CONFIG.objectSpan.blankTime);
        }, TASK_CONFIG.objectSpan.displayTime);
      }
    };
    
    displayNext();
  };
  
  // Handle response submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Normalize response (trim whitespace, lowercase)
    const normalizedResponse = userResponse.trim().toLowerCase();
    
    // Don't proceed if response is empty
    if (normalizedResponse === '') {
      return;
    }
    
    // Get expected sequence of object names
    let expectedSequence = currentSequence.map(index => 
      TASK_CONFIG.objectSpan.objectMapping[index].name
    );
    
    // If in backward mode, reverse the expected sequence
    if (isBackward) {
      expectedSequence = expectedSequence.reverse();
    }
    
    // Join the sequence into a string with spaces between object names
    const expectedString = expectedSequence.join(' ');
    
    // For the presented sequence - original order of objects regardless of direction
    const presentedSequence = currentSequence.map(index => 
      TASK_CONFIG.objectSpan.objectMapping[index].name
    ).join(' ');
    
    // More flexible comparison:
    // 1. Normalize both strings by removing extra spaces
    // 2. Compare the normalized strings
    const normalizedExpected = expectedString.replace(/\s+/g, ' ').trim();
    const normalizedUserResponse = normalizedResponse.replace(/\s+/g, ' ').trim();
    
    let responseIsCorrect = false;
    
    // First try exact match
    if (normalizedUserResponse === normalizedExpected) {
      responseIsCorrect = true;
    } 
    // Then try checking if all the object names are present in the right order
    else {
      const expectedObjects = normalizedExpected.split(' ');
      const responseObjects = normalizedUserResponse.split(' ');
      
      // Only consider it correct if the number of objects matches
      if (expectedObjects.length === responseObjects.length) {
        responseIsCorrect = true;
        // Check each object
        for (let i = 0; i < expectedObjects.length; i++) {
          if (expectedObjects[i] !== responseObjects[i]) {
            responseIsCorrect = false;
            break;
          }
        }
      }
    }
    
    // Calculate the current span based on the round
    const currentSpan = getSpanForRound(currentRound);
    
    // Store the result
    const newResult = {
      participant_id: studentId,
      counter_balance: counterBalance,
      task_type: 'object_span',
      span_mode: isBackward ? 'backward' : 'forward',
      trial_number: currentRound,
      timestamp: new Date().toISOString(),
      span_length: currentSpan,
      attempt_number: currentAttempt,
      is_correct: responseIsCorrect,
      max_span_reached: maxSpanReached,
      presented_sequence: presentedSequence, // Combined string with spaces
      expected_response: expectedString, // Combined string with spaces
      user_response: normalizedUserResponse
    };
    
    setResults([...results, newResult]);
    
    // Store the response and correctness
    setLastResponse(normalizedResponse);
    setIsCorrect(responseIsCorrect);
    
    // Clear the input field
    setUserResponse('');
    
    // Handle result based on correctness
    handleTaskResponse(responseIsCorrect);
  };
  
  // Handle task response based on correctness
  const handleTaskResponse = (responseIsCorrect) => {
    if (responseIsCorrect) {
      // Record current max span reached
      const currentSpan = getSpanForRound(currentRound);
      setMaxSpanReached(prevMax => Math.max(prevMax, currentSpan));
      
      // Move to next round
      const newRound = currentRound + 1;
      
      // Check if we've completed all rounds
      if (newRound > TASK_CONFIG.objectSpan.mainTaskRounds) {
        // Completed all rounds, end task
        setCurrentState('complete');
        // Automatically export results when task completes
        setTimeout(() => {
          exportResultsAsCSV();
        }, 500);
        return;
      }
      
      // Calculate the span for the next round
      const newSpan = getSpanForRound(newRound);
      
      // Check if we've reached the maximum span
      if (newSpan > TASK_CONFIG.objectSpan.maxSpan) {
        // Reached maximum span, end task
        setCurrentState('complete');
        // Automatically export results when task completes
        setTimeout(() => {
          exportResultsAsCSV();
        }, 500);
        return;
      }
      
      // Prepare for the next round
      prepareRound(newRound, 1);
    } else {
      // If this was the first attempt, give a second chance
      if (currentAttempt === 1) {
        // Give second attempt at same span length
        prepareRound(currentRound, 2);
      } else {
        // Failed both attempts, end the task
        setCurrentState('complete');
        // Automatically export results when task completes
        setTimeout(() => {
          exportResultsAsCSV();
        }, 500);
        return;
      }
    }
  };
  
  // Export results as CSV
  const exportResultsAsCSV = () => {
    try {
      // Import the task results utility function
      const { saveTaskResults } = require('../../utils/taskResults');
      
      // Calculate total correct sequences
      const correctSequences = results.filter(r => r.is_correct).length;
      
      // Normalize and format the results data structure
      const finalResults = results.map(result => {
        // Make sure to use the current maxSpanReached state value for all results
        return {
          participantId: result.participant_id || studentId,
          timestamp: result.timestamp || new Date().toISOString(),
          taskType: isBackward ? 'objectSpanBackward' : 'objectSpanForward',
          spanMode: isBackward ? 'backward' : 'forward',
          trialNumber: result.trial_number,
          spanLength: result.span_length,
          attemptNumber: result.attempt_number,
          isCorrect: result.is_correct,
          maxSpanReached: maxSpanReached, // Use the current maxSpanReached state
          totalCorrectSequences: correctSequences,
          presentedSequence: result.presented_sequence, // Already a string with spaces
          expectedResponse: result.expected_response, // Already a string with spaces
          userResponse: result.user_response
        };
      });
      
      // Explicitly separate keys for forward and backward tasks
      const taskKey = isBackward ? 'objectSpanBackward' : 'objectSpanForward';
      
      // Clear any existing results for this specific task type
      // to ensure we don't have mixing of forward/backward results
      const existingResults = localStorage.getItem('cognitiveTasksResults');
      if (existingResults) {
        try {
          const resultsObj = JSON.parse(existingResults);
          // Replace the results for the specific task key
          resultsObj[taskKey] = finalResults;
          localStorage.setItem('cognitiveTasksResults', JSON.stringify(resultsObj));
        } catch (e) {
          console.error('Error updating existing results:', e);
          // Fall back to the utility function if there's an error
          saveTaskResults(taskKey, finalResults);
        }
      } else {
        saveTaskResults(taskKey, finalResults);
      }
      
      console.log(`${isBackward ? 'Backward' : 'Forward'} Object Span results saved:`, finalResults);
      console.log(`Task key used: ${taskKey}`);
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };
  
  // Navigation handlers
  const handleBackToTasks = () => {
    navigate('/object-span');
  };

  const handleReturnHome = () => {
    navigate('/');
  };
  
  // Navigate to the next task
  const handleNextTask = () => {
    // If in forward mode, navigate to backward mode
    if (!isBackward) {
      navigate('/object-span/backward');
    } else {
      // If in backward mode, navigate to the next task in sequence
      navigate('/shape-counting');
    }
  };

  // Start the main task
  const startMainTask = () => {
    navigate(`/object-span/${direction}/task`);
  };

  return (
    <div className="task-screen">
      <h1>{isBackward ? 'Backward' : 'Forward'} Object Span Task</h1>

      {currentState === 'displaying' && (
        <div className="object-display-container">
          <p className="sequence-instruction">
            Remember these objects in {isBackward ? 'REVERSE' : 'the SAME'} order
          </p>
          <div className="object-display">
            {currentObject && (
              <img 
                src={currentObject.image} 
                alt={currentObject.name} 
                className="object-image"
              />
            )}
          </div>
          <p className="sequence-progress">
            Object {currentIndex + 1} of {currentSequence.length}
          </p>
          <p className="task-progress">
            Round {currentRound}/{TASK_CONFIG.objectSpan.mainTaskRounds} | 
            Span {getSpanForRound(currentRound)} | 
            Attempt {currentAttempt}
          </p>
        </div>
      )}

      {currentState === 'responding' && (
        <div className="response-container">
          <p className="response-instruction">
            Type the objects you saw in <strong>{isBackward ? 'REVERSE' : 'the SAME'}</strong> order:
          </p>
          <form onSubmit={handleSubmit} className="response-form">
            <input
              type="text"
              ref={responseInputRef}
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="e.g. car bread book"
              className="response-input"
              autoComplete="off"
              spellCheck="false"
            />
            <button type="submit" className="submit-button">Submit Answer</button>
          </form>
          <p className="hint">Separate object names with spaces. Names are not case-sensitive.</p>
          <div className="task-metadata-inline">
            <p>Round {currentRound}/{TASK_CONFIG.objectSpan.mainTaskRounds} • 
            Span {getSpanForRound(currentRound)} • 
            Attempt {currentAttempt}</p>
          </div>
          
          {/* Object Reference Guide */}
          <ObjectReference />
        </div>
      )}

      {currentState === 'complete' && (
        <div className="results-container">
          <h2>Task Complete</h2>
          
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
            {isBackward ? 'Next Task: Shape Counting' : 'Next Task: Backward Recall'}
            <span style={{ marginLeft: '10px', fontSize: '1.6rem' }}>→</span>
          </button>
        </div>
      )}
      
      {currentState !== 'complete' && (
        <div className="task-metadata">
          <p>Participant ID: {studentId}</p>
          <p>Mode: {isBackward ? 'Backward' : 'Forward'}</p>
        </div>
      )}
    </div>
  );
};

export default ObjectSpanMainTask; 