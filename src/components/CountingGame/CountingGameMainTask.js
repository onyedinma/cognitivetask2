import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './CountingGame.css';

// Import images - update paths to use public folder
const dollarBillImage = '/counting/5dollar.jpg';
const busImage = '/counting/bus.jpg';
const faceImage = '/counting/face.jpg';

/**
 * CountingGameMainTask component
 * Main task component for the counting game
 */
const CountingGameMainTask = () => {
  const navigate = useNavigate();
  
  // State variables
  const [currentObject, setCurrentObject] = useState(null);
  const [showingObjects, setShowingObjects] = useState(true);
  const [showResponse, setShowResponse] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [trialComplete, setTrialComplete] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [billCount, setBillCount] = useState(0);
  const [busCount, setBusCount] = useState(0);
  const [faceCount, setFaceCount] = useState(0);
  const [correctCounts, setCorrectCounts] = useState({ bills: 0, buses: 0, faces: 0 });
  const [results, setResults] = useState([]);
  const [taskComplete, setTaskComplete] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);
  
  // Refs to store and clear timers
  const timersRef = useRef([]);
  
  // Level configuration
  const levels = [
    { level: 1, objects: 4 },
    { level: 2, objects: 6 },
    { level: 3, objects: 8 },
    { level: 4, objects: 10 },
    { level: 5, objects: 12 }
  ];
  
  // Object image mapping
  const objectImages = {
    bill: dollarBillImage,
    bus: busImage,
    face: faceImage
  };
  
  // Clear all timers
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  }, []);
  
  // Generate a sequence of random objects
  const generateSequence = useCallback(() => {
    const currentLevelConfig = levels[currentLevel - 1];
    const sequenceLength = currentLevelConfig.objects;
    
    const sequence = [];
    const counts = { bills: 0, buses: 0, faces: 0 };
    
    // Generate exactly the number of objects for this level
    for (let i = 0; i < sequenceLength; i++) {
      const object = ['bill', 'bus', 'face'][Math.floor(Math.random() * 3)];
      sequence.push(object);
      
      // Count occurrences
      if (object === 'bill') counts.bills++;
      else if (object === 'bus') counts.buses++;
      else if (object === 'face') counts.faces++;
    }
    
    // Double-check the total number of objects equals the required amount
    const totalObjects = counts.bills + counts.buses + counts.faces;
    console.log(`Level ${currentLevel} - Total objects: ${totalObjects}, Expected: ${sequenceLength}`);
    
    if (totalObjects !== sequenceLength) {
      console.error(`Object count mismatch: got ${totalObjects}, expected ${sequenceLength}`);
    }
    
    return { sequence, counts };
  }, [currentLevel, levels]);
  
  // Start showing the objects
  const startSequence = () => {
    // Clear any existing timers
    clearAllTimers();
    
    // Reset state
    setCurrentObject(null);
    setShowingObjects(true);
    setShowResponse(false);
    setShowFeedback(false);
    setTrialComplete(false);
    
    // Reset counts for new trial
    setBillCount(0);
    setBusCount(0);
    setFaceCount(0);
    
    // Generate a new sequence
    const { sequence, counts } = generateSequence();
    console.log(`Level ${currentLevel} - Generated sequence:`, sequence);
    console.log(`Level ${currentLevel} - Correct counts:`, counts);
    
    // Store correct counts for feedback
    setCorrectCounts(counts);
    
    // Display objects one by one with precise timing
    sequence.forEach((object, index) => {
      // Show object
      const showTimer = setTimeout(() => {
        console.log(`Showing object ${index + 1}/${sequence.length}: ${object}`);
        setCurrentObject(object);
      }, index * 1500); // Show each object for 1.5 seconds
      
      timersRef.current.push(showTimer);
      
      // Hide object (except for the last one)
      if (index < sequence.length - 1) {
        const hideTimer = setTimeout(() => {
          setCurrentObject(null);
        }, (index * 1500) + 1000); // Show for 1 second, blank for 0.5 seconds
        
        timersRef.current.push(hideTimer);
      } else {
        // For the last object, ensure it's hidden before showing the response form
        const hideLastTimer = setTimeout(() => {
          setCurrentObject(null);
        }, (index * 1500) + 1000);
        
        timersRef.current.push(hideLastTimer);
      }
    });
    
    // Show response form after all objects
    const responseTimer = setTimeout(() => {
      setShowingObjects(false);
      setCurrentObject(null);
      setShowResponse(true);
    }, (sequence.length * 1500) + 500); // Add a small buffer after the last object
    
    timersRef.current.push(responseTimer);
  };
  
  // Check user's response and record result
  const checkResponse = () => {
    const userCounts = {
      bills: billCount,
      buses: busCount,
      faces: faceCount
    };
    
    const isCorrect = 
      billCount === correctCounts.bills && 
      busCount === correctCounts.buses && 
      faceCount === correctCounts.faces;
    
    // Record result for this level
    const trialResult = {
      level: currentLevel,
      correctCounts: { ...correctCounts },
      userCounts: { ...userCounts },
      correct: isCorrect,
      timestamp: new Date().toISOString()
    };
    
    // Add result to results array
    setResults(prevResults => [...prevResults, trialResult]);
    
    setTrialComplete(true);
    setShowResponse(false);
    
    // Instead of showing feedback, immediately move to next level or complete task
    if (currentLevel < levels.length) {
      // Move to next level
      setCurrentLevel(prev => prev + 1);
    } else {
      // Game completed
      setTaskComplete(true);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    checkResponse();
  };
  
  // Continue to next level or complete task - this function is now only used for the results screen
  const continueTask = () => {
    if (trialComplete) {
      if (currentLevel < levels.length) {
        // Move to next level
        setCurrentLevel(prev => prev + 1);
        setShowFeedback(false);
      } else {
        // Game completed
        setTaskComplete(true);
      }
    }
  };
  
  // Navigate back to tasks menu
  const returnToMenu = () => {
    navigate('/');
  };
  
  // Export results to CSV
  const exportToCSV = () => {
    setExportingCSV(true);
    
    try {
      // Format results for CSV - sort by level
      const processedResults = [...results].sort((a, b) => a.level - b.level);
      
      const csvContent = processedResults.map(result => {
        return [
          result.timestamp,
          result.level,
          levels[result.level - 1].objects,
          result.correctCounts.bills,
          result.correctCounts.buses,
          result.correctCounts.faces,
          result.userCounts.bills,
          result.userCounts.buses,
          result.userCounts.faces,
          result.correct ? 1 : 0
        ].join(',');
      });
      
      // Add header row
      const header = 'Timestamp,Level,ObjectCount,CorrectBills,CorrectBuses,CorrectFaces,UserBills,UserBuses,UserFaces,Correct';
      const csv = [header, ...csvContent].join('\n');
      
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `counting-game-results-${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportingCSV(false);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setExportingCSV(false);
    }
  };
  
  // Start task when component mounts (only once)
  useEffect(() => {
    console.log("Component mounted - starting first sequence");
    const timer = setTimeout(() => {
      startSequence();
    }, 1000);
    
    timersRef.current.push(timer);
    
    // Cleanup on unmount
    return () => {
      clearAllTimers();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array with eslint disable - startSequence and clearAllTimers omitted to prevent infinite loops
  
  // Effect to start sequence after level change
  useEffect(() => {
    if (!taskComplete) {
      // Skip on initial mount
      if (currentLevel > 1) {
        console.log(`Starting new sequence for level ${currentLevel}`);
        const timer = setTimeout(() => {
          startSequence();
        }, 500); // Short delay to ensure state is updated
        
        timersRef.current.push(timer);
        return () => clearTimeout(timer);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel, taskComplete]); // startSequence and timersRef omitted to prevent infinite loops
  
  // Increment/decrement handlers for number inputs
  const handleIncrement = (setter) => {
    setter(prev => Math.min(prev + 1, 12));
  };
  
  const handleDecrement = (setter) => {
    setter(prev => Math.max(prev - 1, 0));
  };
  
  // Calculate performance for results screen
  const calculatePerformance = () => {
    const correctCount = results.filter(result => result.correct).length;
    return {
      correct: correctCount,
      total: results.length,
      percentage: Math.round((correctCount / results.length) * 100),
      highestLevel: results.length > 0 ? Math.max(...results.map(r => r.level)) : 1
    };
  };
  
  // Get descriptive level name
  const getLevelName = (level) => {
    const levelConfig = levels[level - 1];
    return `Level ${level} (${levelConfig.objects} objects)`;
  };
  
  return (
    <div className="task-screen">
      {!taskComplete && (
        <h1>Counting Game</h1>
      )}
      
      {taskComplete && (
        <h1>Counting Game - Complete</h1>
      )}
      
      {showingObjects && (
        <div className="object-display">
          {currentObject === 'bill' && 
            <div 
              className="counting-object dollar-bill" 
              style={{ backgroundImage: `url(${objectImages.bill})` }}
            ></div>
          }
          {currentObject === 'bus' && 
            <div 
              className="counting-object bus" 
              style={{ backgroundImage: `url(${objectImages.bus})` }}
            ></div>
          }
          {currentObject === 'face' && 
            <div 
              className="counting-object face" 
              style={{ backgroundImage: `url(${objectImages.face})` }}
            ></div>
          }
        </div>
      )}
      
      {showResponse && (
        <div className="response-section">
          <h2>How many of each object did you count?</h2>
          
          <form onSubmit={handleSubmit} className="counting-form">
            <div className="count-input-group">
              <label>$5 Bills:</label>
              <div className="number-input">
                <button type="button" onClick={() => handleDecrement(setBillCount)}>-</button>
                <input 
                  type="number" 
                  value={billCount} 
                  onChange={(e) => setBillCount(parseInt(e.target.value) || 0)}
                  min="0" 
                  max="12"
                />
                <button type="button" onClick={() => handleIncrement(setBillCount)}>+</button>
              </div>
            </div>
            
            <div className="count-input-group">
              <label>UTA Buses:</label>
              <div className="number-input">
                <button type="button" onClick={() => handleDecrement(setBusCount)}>-</button>
                <input 
                  type="number" 
                  value={busCount} 
                  onChange={(e) => setBusCount(parseInt(e.target.value) || 0)}
                  min="0" 
                  max="12"
                />
                <button type="button" onClick={() => handleIncrement(setBusCount)}>+</button>
              </div>
            </div>
            
            <div className="count-input-group">
              <label>Faces:</label>
              <div className="number-input">
                <button type="button" onClick={() => handleDecrement(setFaceCount)}>-</button>
                <input 
                  type="number" 
                  value={faceCount} 
                  onChange={(e) => setFaceCount(parseInt(e.target.value) || 0)}
                  min="0" 
                  max="12"
                />
                <button type="button" onClick={() => handleIncrement(setFaceCount)}>+</button>
              </div>
            </div>
            
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      )}
      
      {taskComplete && (
        <div className="results-section">
          <h2>Task Results</h2>
          
          {results.length > 0 && (
            <>
              <div className="performance-summary">
                <h3>Overall Performance</h3>
                <p>
                  Highest level reached: <strong>{getLevelName(calculatePerformance().highestLevel)}</strong>
                </p>
                <p>
                  Levels passed: <strong>{calculatePerformance().correct}</strong> out of <strong>{calculatePerformance().total}</strong> 
                  ({calculatePerformance().percentage}%)
                </p>
              </div>
              
              <div className="results-table-container">
                <h3>Level Details</h3>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Objects</th>
                      <th>$5 Bills</th>
                      <th>UTA Buses</th>
                      <th>Faces</th>
                      <th>Passed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levels.map((levelConfig) => {
                      // Find the attempt for this level if it exists
                      const levelAttempt = results.find(
                        r => r.level === levelConfig.level
                      );
                      
                      // Only show levels that were attempted
                      if (!levelAttempt) return null;
                      
                      return (
                        <tr key={levelConfig.level} className={levelAttempt.correct ? 'correct-row' : 'incorrect-row'}>
                          <td>{levelConfig.level}</td>
                          <td>{levelConfig.objects}</td>
                          <td>
                            {levelAttempt.userCounts.bills}/{levelAttempt.correctCounts.bills}
                          </td>
                          <td>
                            {levelAttempt.userCounts.buses}/{levelAttempt.correctCounts.buses}
                          </td>
                          <td>
                            {levelAttempt.userCounts.faces}/{levelAttempt.correctCounts.faces}
                          </td>
                          <td>{levelAttempt.correct ? 'Yes' : 'No'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="export-controls">
                <button 
                  onClick={exportToCSV} 
                  className="export-button"
                  disabled={exportingCSV}
                >
                  {exportingCSV ? 'Exporting...' : 'Export Results to CSV'}
                </button>
                
                <button onClick={returnToMenu} className="menu-button">
                  Return to Tasks Menu
                </button>
              </div>
            </>
          )}
        </div>
      )}
      
      {!showingObjects && !showResponse && !taskComplete && (
        <div className="loading">
          Preparing objects...
        </div>
      )}
    </div>
  );
};

export default CountingGameMainTask; 