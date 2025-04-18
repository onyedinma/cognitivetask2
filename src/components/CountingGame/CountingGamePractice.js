import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CountingGame.css';

// Import images - update paths to use public folder
const dollarBillImage = '/counting/5dollar.jpg';
const busImage = '/counting/bus.jpg';
const faceImage = '/counting/face.jpg';

/**
 * CountingGamePractice component
 * Practice round for the counting game task
 */
const CountingGamePractice = () => {
  const navigate = useNavigate();
  
  // States for managing objects and counts
  const [currentObject, setCurrentObject] = useState(null);
  const [showingObjects, setShowingObjects] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [billCount, setBillCount] = useState(0);
  const [busCount, setBusCount] = useState(0);
  const [faceCount, setFaceCount] = useState(0);
  const [correctCounts, setCorrectCounts] = useState({ bills: 0, buses: 0, faces: 0 });
  const [result, setResult] = useState({ correct: false, feedback: '' });
  const [practiceAttempts, setPracticeAttempts] = useState(0);
  
  // Refs to store and clear timers
  const timersRef = useRef([]);
  
  // Clear all timers
  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };
  
  // Objects for the practice
  const objects = ['bill', 'bus', 'face'];
  
  // Object image mapping
  const objectImages = {
    bill: dollarBillImage,
    bus: busImage,
    face: faceImage
  };
  
  // Generate a sequence of random objects
  const generateSequence = () => {
    // Set sequence length to exactly 6 objects
    const sequenceLength = 6;
    const sequence = [];
    const counts = { bills: 0, buses: 0, faces: 0 };
    
    for (let i = 0; i < sequenceLength; i++) {
      const objectIndex = Math.floor(Math.random() * objects.length);
      const object = objects[objectIndex];
      sequence.push(object);
      
      // Count each object
      if (object === 'bill') counts.bills++;
      else if (object === 'bus') counts.buses++;
      else if (object === 'face') counts.faces++;
    }
    
    console.log(`Practice sequence generated with exactly ${sequenceLength} objects`);
    return { sequence, counts };
  };
  
  // Start showing the objects
  const startSequence = () => {
    // Clear any existing timers
    clearAllTimers();
    
    // Reset state
    setCurrentObject(null);
    setShowingObjects(true);
    setShowResponse(false);
    setShowFeedback(false);
    
    // Generate sequence
    const { sequence, counts } = generateSequence();
    console.log('Generated sequence:', sequence);
    console.log('Correct counts:', counts);
    
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
  
  // Check user's response
  const checkResponse = () => {
    const isCorrect = 
      billCount === correctCounts.bills && 
      busCount === correctCounts.buses && 
      faceCount === correctCounts.faces;
    
    const feedback = isCorrect
      ? 'Correct! You counted all the objects accurately.'
      : 'Not quite right. Check the correct counts below.';
    
    setResult({
      correct: isCorrect,
      feedback,
      userCounts: {
        bills: billCount,
        buses: busCount,
        faces: faceCount
      }
    });
    
    // Show feedback after practice attempt
    setShowResponse(false);
    setShowFeedback(true);
    setPracticeAttempts(prev => prev + 1);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    checkResponse();
  };
  
  // These functions are kept for compatibility but no longer used
  const continuePractice = () => {
    // Reset counts
    setBillCount(0);
    setBusCount(0);
    setFaceCount(0);
    setShowFeedback(false);
    startSequence();
  };
  
  const goToMainTask = () => {
    navigate('/counting-game/task');
  };
  
  // Start practice when component mounts
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
  
  // Increment/decrement handlers for number inputs
  const handleIncrement = (setter) => {
    setter(prev => Math.min(prev + 1, 9));
  };
  
  const handleDecrement = (setter) => {
    setter(prev => Math.max(prev - 1, 0));
  };
  
  return (
    <div className="task-screen">
      <h1>Counting Game Practice</h1>
      
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
                  max="9"
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
                  max="9"
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
                  max="9"
                />
                <button type="button" onClick={() => handleIncrement(setFaceCount)}>+</button>
              </div>
            </div>
            
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      )}
      
      {showFeedback && (
        <div className="feedback-section">
          <h2>Practice Feedback</h2>
          <p className={result.correct ? 'feedback-correct' : 'feedback-incorrect'}>
            {result.feedback}
          </p>
          
          <div className="counts-comparison">
            <div className="correct-counts">
              <h3>Correct Counts:</h3>
              <p>$5 Bills: <span className="important">{correctCounts.bills}</span></p>
              <p>UTA Buses: <span className="important">{correctCounts.buses}</span></p>
              <p>Faces: <span className="important">{correctCounts.faces}</span></p>
            </div>
            
            <div className="user-counts">
              <h3>Your Counts:</h3>
              <p>$5 Bills: <span className={result.userCounts.bills === correctCounts.bills ? 'correct' : 'incorrect'}>{result.userCounts.bills}</span></p>
              <p>UTA Buses: <span className={result.userCounts.buses === correctCounts.buses ? 'correct' : 'incorrect'}>{result.userCounts.buses}</span></p>
              <p>Faces: <span className={result.userCounts.faces === correctCounts.faces ? 'correct' : 'incorrect'}>{result.userCounts.faces}</span></p>
            </div>
          </div>
          
          <div className="practice-controls">
            <button onClick={continuePractice} className="continue-button">
              Continue Practice
            </button>
            
            <button onClick={goToMainTask} className="main-task-button">
              Continue to Main Task
            </button>
          </div>
        </div>
      )}
      
      {!showingObjects && !showResponse && !showFeedback && (
        <div className="loading">
          Preparing objects...
        </div>
      )}
    </div>
  );
};

export default CountingGamePractice; 