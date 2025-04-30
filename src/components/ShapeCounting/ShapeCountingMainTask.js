import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShapeCounting.css';
import { saveTaskResults } from '../../utils/taskResults';

/**
 * ShapeCountingMainTask component
 * Main task component for shape counting with levels
 */
const ShapeCountingMainTask = () => {
  const navigate = useNavigate();
  
  // States for managing shapes and counts
  const [currentShape, setCurrentShape] = useState(null);
  const [showingShapes, setShowingShapes] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [squareCount, setSquareCount] = useState(0);
  const [triangleCount, setTriangleCount] = useState(0);
  const [circleCount, setCircleCount] = useState(0);
  const [correctCounts, setCorrectCounts] = useState({ squares: 0, triangles: 0, circles: 0 });
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [results, setResults] = useState([]);
  const [trialComplete, setTrialComplete] = useState(false);
  const [taskComplete, setTaskComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  // Refs to store and clear timers
  const timersRef = useRef([]);
  
  // Level configuration
  const levels = [
    { level: 1, shapes: 4 },
    { level: 2, shapes: 6 },
    { level: 3, shapes: 8 },
    { level: 4, shapes: 10 },
    { level: 5, shapes: 12 },
    { level: 6, shapes: 0 }  // Debug level to test if level 5 gets captured
  ];
  
  // Set maximum attempts to 1
  const maxAttempts = 1;
  
  // Shapes for the task
  const shapes = ['square', 'triangle', 'circle'];
  
  // Clear all timers
  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };
  
  // Generate a sequence of random shapes based on current level
  const generateSequence = () => {
    const currentLevelConfig = levels[currentLevel - 1];
    const sequenceLength = currentLevelConfig.shapes;
    
    const sequence = [];
    const counts = { squares: 0, triangles: 0, circles: 0 };
    
    // Ensure we have exactly the number of shapes defined for this level
    for (let i = 0; i < sequenceLength; i++) {
      const shapeIndex = Math.floor(Math.random() * shapes.length);
      const shape = shapes[shapeIndex];
      sequence.push(shape);
      
      // Count each shape
      if (shape === 'square') counts.squares++;
      else if (shape === 'triangle') counts.triangles++;
      else if (shape === 'circle') counts.circles++;
    }
    
    // Double-check the total number of shapes equals the required amount
    const totalShapes = counts.squares + counts.triangles + counts.circles;
    console.log(`Level ${currentLevel} (Attempt ${currentAttempt}) - Total shapes: ${totalShapes}, Expected: ${sequenceLength}`);
    
    if (totalShapes !== sequenceLength) {
      console.error(`Shape count mismatch: got ${totalShapes}, expected ${sequenceLength}`);
    }
    
    return { sequence, counts };
  };
  
  // Start showing the shapes
  const startSequence = () => {
    // Clear any existing timers
    clearAllTimers();
    
    // Special handling for invisible level 6
    if (currentLevel === 6) {
      console.log("Auto-completing invisible level 6");
      // Add a placeholder result for level 6
      const placeholderResult = {
        level: 6,
        attempt: 1,
        correctCounts: { squares: 0, triangles: 0, circles: 0 },
        userCounts: { squares: 0, triangles: 0, circles: 0 },
        categoryScores: {
          squaresCorrect: 0,
          trianglesCorrect: 0,
          circlesCorrect: 0,
          totalCorrectCategories: 0,
          totalCategories: 3
        },
        correct: true,
        timestamp: new Date().toISOString()
      };
      
      setResults(prevResults => [...prevResults, placeholderResult]);
      
      // Complete the task immediately
      setTimeout(() => {
        setTaskComplete(true);
        saveResultsToStorage();
      }, 500);
      return;
    }
    
    // Reset state
    setCurrentShape(null);
    setShowingShapes(true);
    setShowResponse(false);
    setShowFeedback(false);
    setTrialComplete(false);
    
    // Reset counts for new trial
    setSquareCount(0);
    setTriangleCount(0);
    setCircleCount(0);
    
    // Generate sequence for level
    const { sequence, counts } = generateSequence();
    console.log(`Level ${currentLevel} (Attempt ${currentAttempt}) - Generated sequence:`, sequence);
    console.log(`Level ${currentLevel} (Attempt ${currentAttempt}) - Correct counts:`, counts);
    
    // Store correct counts for scoring
    setCorrectCounts(counts);
    
    // Display shapes one by one
    sequence.forEach((shape, index) => {
      // Show shape
      const showTimer = setTimeout(() => {
        console.log(`Showing shape ${index + 1}/${sequence.length}: ${shape}`);
        setCurrentShape(shape);
      }, index * 1500); // Show each shape for 1.5 seconds
      
      timersRef.current.push(showTimer);
      
      // Hide shape (except for the last one)
      if (index < sequence.length - 1) {
        const hideTimer = setTimeout(() => {
          setCurrentShape(null);
        }, (index * 1500) + 1000); // Show for 1 second, blank for 0.5 seconds
        
        timersRef.current.push(hideTimer);
      } else {
        // For the last shape, ensure it's hidden before showing the response form
        const hideLastTimer = setTimeout(() => {
          setCurrentShape(null);
        }, (index * 1500) + 1000);
        
        timersRef.current.push(hideLastTimer);
      }
    });
    
    // Show response form after all shapes
    const responseTimer = setTimeout(() => {
      setShowingShapes(false);
      setCurrentShape(null);
      setShowResponse(true);
    }, (sequence.length * 1500) + 500); // Add a small buffer after the last shape
    
    timersRef.current.push(responseTimer);
  };
  
  // Check user's response and record result
  const checkResponse = () => {
    const userCounts = {
      squares: squareCount,
      triangles: triangleCount,
      circles: circleCount
    };
    
    // Calculate category-based scoring (1 point per correct shape type)
    const squaresCorrect = userCounts.squares === correctCounts.squares ? 1 : 0;
    const trianglesCorrect = userCounts.triangles === correctCounts.triangles ? 1 : 0;
    const circlesCorrect = userCounts.circles === correctCounts.circles ? 1 : 0;
    
    // Calculate total correct categories and total categories
    const totalCorrectCategories = squaresCorrect + trianglesCorrect + circlesCorrect;
    const totalCategories = 3; // We always have three shape types: squares, triangles, circles
    
    // Overall correctness is now based on getting more than half of the categories correct
    const isCorrect = totalCorrectCategories >= Math.ceil(totalCategories / 2);
    
    // Record result for this level and attempt with the new scoring approach
    const trialResult = {
      level: currentLevel,
      attempt: 1, // Always 1 since we're only doing one trial per level
      correctCounts: { ...correctCounts },
      userCounts: { ...userCounts },
      categoryScores: {
        squaresCorrect,
        trianglesCorrect,
        circlesCorrect,
        totalCorrectCategories,
        totalCategories
      },
      correct: isCorrect,
      timestamp: new Date().toISOString()
    };
    
    // Log the category-based scores for debugging
    console.log(`Level ${currentLevel} category scores:`, 
      `Squares: ${squaresCorrect}/1, `,
      `Triangles: ${trianglesCorrect}/1, `,
      `Circles: ${circlesCorrect}/1, `,
      `Total: ${totalCorrectCategories}/${totalCategories}`
    );
    
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
      // Save results to centralized storage when task completes
      setTimeout(() => {
        saveResultsToStorage();
      }, 500);
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
  
  // Effect to start sequence after level change
  useEffect(() => {
    if (!taskComplete) {
      const timer = setTimeout(() => {
        startSequence();
      }, 500); // Short delay to ensure state is updated
      
      timersRef.current.push(timer);
      return () => clearTimeout(timer);
    }
  }, [currentLevel, taskComplete]);
  
  // Navigate back to tasks menu
  const returnToMenu = () => {
    navigate('/tasks');
  };
  
  // Navigate to the next task (Counting Game)
  const handleNextTask = () => {
    navigate('/counting-game');
  };
  
  // Save results to centralized storage
  const saveResultsToStorage = () => {
    try {
      // Format results for CSV - simply use all level results since there's only one attempt per level
      const processedResults = [...results].sort((a, b) => a.level - b.level);
      
      // Format results for the centralized storage system
      const formattedResults = processedResults.map(result => ({
        level: result.level,
        shapeType: 'multiple',
        correctAnswer: `Squares: ${result.correctCounts.squares}, Triangles: ${result.correctCounts.triangles}, Circles: ${result.correctCounts.circles}`,
        answer: `Squares: ${result.userCounts.squares}, Triangles: ${result.userCounts.triangles}, Circles: ${result.userCounts.circles}`,
        isCorrect: result.correct,
        timestamp: result.timestamp,
        // Add category scoring data
        categoryScores: result.categoryScores || {
          squaresCorrect: 0,
          trianglesCorrect: 0,
          circlesCorrect: 0,
          totalCorrectCategories: 0,
          totalCategories: 3
        },
        totalCorrectCategories: result.categoryScores ? result.categoryScores.totalCorrectCategories : 0,
        totalCategories: result.categoryScores ? result.categoryScores.totalCategories : 3,
        categoryAccuracy: result.categoryScores ? 
          ((result.categoryScores.totalCorrectCategories / result.categoryScores.totalCategories) * 100).toFixed(2) + '%' : '0%'
      }));
      
      // Save results using the utility
      saveTaskResults('shapeCounting', formattedResults);
      
      console.log('Shape Counting results saved with category scoring:', formattedResults);
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };
  
  // Start task when component mounts
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
    setter(prev => Math.min(prev + 1, 20));
  };
  
  const handleDecrement = (setter) => {
    setter(prev => Math.max(prev - 1, 0));
  };
  
  // Calculate overall performance - simplified for one attempt per level
  const calculatePerformance = () => {
    const correctCount = results.filter(result => result.correct).length;
    
    // Calculate category-based scoring across all levels
    let totalCorrectCategories = 0;
    let totalCategories = 0;
    
    results.forEach(result => {
      if (result.categoryScores) {
        totalCorrectCategories += result.categoryScores.totalCorrectCategories;
        totalCategories += result.categoryScores.totalCategories;
      }
    });
    
    const categoryAccuracy = totalCategories > 0 ? 
      Math.round((totalCorrectCategories / totalCategories) * 100) : 0;
    
    return {
      correct: correctCount,
      total: results.length,
      percentage: results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0,
      highestLevel: results.length > 0 ? Math.max(...results.map(r => r.level)) : 1,
      categoryCorrect: totalCorrectCategories,
      categoryTotal: totalCategories,
      categoryPercentage: categoryAccuracy
    };
  };
  
  // Get descriptive level name
  const getLevelName = (level) => {
    const levelConfig = levels[level - 1];
    return `Level ${level} (${levelConfig.shapes} shapes)`;
  };
  
  return (
    <div className="task-screen">
      {!taskComplete && (
        <h1>Shape Counting Task</h1>
      )}
      
      {taskComplete && (
        <h1>Shape Counting Task - Complete</h1>
      )}
      
      {showingShapes && (
        <div className="shape-display">
          {currentShape === 'square' && <div className="shape square"></div>}
          {currentShape === 'triangle' && <div className="shape triangle"></div>}
          {currentShape === 'circle' && <div className="shape circle"></div>}
        </div>
      )}
      
      {showResponse && (
        <div className="response-section">
          <h2>How many of each shape did you count?</h2>
          
          <form onSubmit={handleSubmit} className="counting-form">
            <div className="count-input-group">
              <label>Squares:</label>
              <div className="number-input">
                <button type="button" onClick={() => handleDecrement(setSquareCount)}>-</button>
                <input 
                  type="number" 
                  value={squareCount} 
                  onChange={(e) => setSquareCount(parseInt(e.target.value) || 0)}
                  min="0" 
                  max="20"
                />
                <button type="button" onClick={() => handleIncrement(setSquareCount)}>+</button>
              </div>
            </div>
            
            <div className="count-input-group">
              <label>Triangles:</label>
              <div className="number-input">
                <button type="button" onClick={() => handleDecrement(setTriangleCount)}>-</button>
                <input 
                  type="number" 
                  value={triangleCount} 
                  onChange={(e) => setTriangleCount(parseInt(e.target.value) || 0)}
                  min="0" 
                  max="20"
                />
                <button type="button" onClick={() => handleIncrement(setTriangleCount)}>+</button>
              </div>
            </div>
            
            <div className="count-input-group">
              <label>Circles:</label>
              <div className="number-input">
                <button type="button" onClick={() => handleDecrement(setCircleCount)}>-</button>
                <input 
                  type="number" 
                  value={circleCount} 
                  onChange={(e) => setCircleCount(parseInt(e.target.value) || 0)}
                  min="0" 
                  max="20"
                />
                <button type="button" onClick={() => handleIncrement(setCircleCount)}>+</button>
              </div>
            </div>
            
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      )}
      
      {taskComplete && (
        <div className="results-section">
          <h2>Task Complete!</h2>
          
          <div className="task-options">
            <button onClick={handleNextTask} className="next-task-button">
              Next Task: Counting Game
            </button>
          </div>
        </div>
      )}
      
      {!showingShapes && !showResponse && !taskComplete && (
        <div className="loading">
          Preparing shapes...
        </div>
      )}
    </div>
  );
};

export default ShapeCountingMainTask; 