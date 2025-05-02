import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpatialMemory.css';

// Define shape types and colors to match reference images
const shapeTypes = ['circle', 'square', 'triangle', 'pentagon', 'heart', 'purple'];
const shapeColors = ['black', 'green', 'blue', 'yellow', 'red', 'purple'];

/**
 * SpatialMemoryMainTask component
 * Main task component for the spatial memory task with a larger grid
 */
const SpatialMemoryMainTask = () => {
  const navigate = useNavigate();
  
  // States for managing the grids and timer
  const [currentLevel, setCurrentLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(5);
  const [phase, setPhase] = useState('study'); // 'study', 'response', 'feedback', 'levelComplete'
  const [shapes, setShapes] = useState([]);
  const [movedShapes, setMovedShapes] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showReadyButton, setShowReadyButton] = useState(false);
  const [trialCount, setTrialCount] = useState(1); // Track trials for each level (always 1)
  const [recordedLevels, setRecordedLevels] = useState([]); // Track level results

  // Refs for timer management and configuration
  const timerRef = useRef(null);
  const studyTimerRef = useRef(null);
  const readyButtonTimerRef = useRef(null);

  // Calculate grid dimensions based on current level
  const getGridDimensions = () => {
    // Always 4 shapes per row
    const columns = 4;
    
    // Each level adds one row: level 1 = 1 row, level 2 = 2 rows, etc.
    const rows = currentLevel;
    
    return { columns, rows };
  };

  const generateShapes = () => {
    const dimensions = getGridDimensions();
    const totalCells = dimensions.columns * dimensions.rows;
    
    // Number of shapes is exactly 4 * number of rows (current level)
    const numShapes = dimensions.columns * dimensions.rows;
    
    // Generate positions for all cells in the grid
    const positions = Array.from({ length: numShapes }, (_, i) => i);
    
    // Create all possible shape-color combinations
    const allCombinations = [];
    for (const type of shapeTypes) {
      for (const color of shapeColors) {
        // Only add combinations where type and color are different
        // (e.g., avoid "purple purple" combinations)
        if (type !== color) {
          allCombinations.push({ type, color });
        }
      }
    }
    
    // Shuffle the combinations to ensure randomness
    const shuffledCombinations = [...allCombinations]
      .sort(() => Math.random() - 0.5)
      .slice(0, numShapes);
    
    // If we need more shapes than unique combinations, repeat some combinations
    // but ensure there are no duplicate shape-color pairs in adjacent positions
    if (shuffledCombinations.length < numShapes) {
      const additionalNeeded = numShapes - shuffledCombinations.length;
      const additionalCombinations = [...allCombinations]
        .sort(() => Math.random() - 0.5)
        .slice(0, additionalNeeded);
      
      shuffledCombinations.push(...additionalCombinations);
    }
    
    // Generate shapes with types and colors
    const newShapes = positions.map((position, index) => ({
      id: index,
      type: shuffledCombinations[index].type,
      color: shuffledCombinations[index].color,
      position: position,
      // Add a visual identifier for debugging
      visualId: `${shuffledCombinations[index].color}-${shuffledCombinations[index].type}`
    }));
    
    setShapes(newShapes);
    return newShapes;
  };

  const moveShapes = (originalShapes) => {
    const dimensions = getGridDimensions();
    const totalCells = dimensions.columns * dimensions.rows;
    
    // Number of shapes to swap (1 pair for levels 1-2, 2 pairs for 3-4, 3 pairs for 5-6)
    const numPairsToSwap = Math.ceil(currentLevel / 2);
    
    // Create a deep copy of the shapes array
    const shapesCopy = JSON.parse(JSON.stringify(originalShapes));
    
    // Get indices of shapes to swap, ensuring we don't swap identical shapes
    const shapesToSwap = [];
    let swapAttempts = 0;
    const maxSwapAttempts = 100; // Safety to prevent infinite loops
    
    while (shapesToSwap.length < numPairsToSwap * 2 && swapAttempts < maxSwapAttempts) {
      swapAttempts++;
      
      // If we've tried too many times to find unique shapes, just use what we have
      if (swapAttempts >= maxSwapAttempts && shapesToSwap.length >= 2) {
        console.warn(`Couldn't find ${numPairsToSwap} pairs of distinct shapes after ${maxSwapAttempts} attempts. Using ${Math.floor(shapesToSwap.length / 2)} pairs instead.`);
        break;
      }
      
      // Pick a random shape
      const availableIndices = Array.from({ length: shapesCopy.length }, (_, i) => i)
        .filter(idx => !shapesToSwap.includes(idx));
      
      if (availableIndices.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      const firstShapeIndex = availableIndices[randomIndex];
      const firstShape = shapesCopy[firstShapeIndex];
      
      // Find shapes that are DEFINITELY different (must have different TYPE AND COLOR)
      const differentShapeIndices = availableIndices
        .filter(idx => idx !== firstShapeIndex)
        .filter(idx => {
          const shape = shapesCopy[idx];
          // Both type AND color must be different
          return !(shape.type === firstShape.type && shape.color === firstShape.color);
        });
      
      // If no different shapes available, try again
      if (differentShapeIndices.length === 0) continue;
      
      // Randomly pick a different shape
      const secondShapeIndex = differentShapeIndices[Math.floor(Math.random() * differentShapeIndices.length)];
      const secondShape = shapesCopy[secondShapeIndex];
      
      // Double-check they're not visually identical
      if (firstShape.type === secondShape.type && firstShape.color === secondShape.color) {
        console.warn("Attempted to swap identical shapes, skipping this pair");
        continue;
      }
      
      // Add this pair to our swap list
      shapesToSwap.push(firstShapeIndex, secondShapeIndex);
    }
    
    // Ensure we have an even number of shapes to swap
    if (shapesToSwap.length % 2 !== 0) {
      shapesToSwap.pop();
    }
    
    // Swap positions of selected shapes
    for (let i = 0; i < shapesToSwap.length; i += 2) {
      if (i + 1 >= shapesToSwap.length) break;
      
      const temp = shapesCopy[shapesToSwap[i]].position;
      shapesCopy[shapesToSwap[i]].position = shapesCopy[shapesToSwap[i + 1]].position;
      shapesCopy[shapesToSwap[i + 1]].position = temp;
    }
    
    // Log the shapes that were swapped for debugging
    console.log("Moved shapes:", shapesCopy.filter((shape, index) => 
      shapesToSwap.includes(index)).map(s => ({
        id: s.id,
        type: s.type,
        color: s.color,
        visualId: s.visualId,
        position: s.position
      }))
    );
    
    setMovedShapes(shapesCopy);
    return {
      movedShapes: shapesCopy,
      swappedPositions: shapesToSwap.map(index => shapesCopy[index].position)
    };
  };

  const transitionToResponsePhase = (originalShapes) => {
    // Clear all timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (studyTimerRef.current) {
      clearInterval(studyTimerRef.current);
      studyTimerRef.current = null;
    }
    if (readyButtonTimerRef.current) {
      clearTimeout(readyButtonTimerRef.current);
      readyButtonTimerRef.current = null;
    }
    
    // Move shapes instead of reshuffling all positions
    moveShapes(originalShapes);
    setPhase('response');
  };

  const startLevel = () => {
    // Clear any existing timers first
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (studyTimerRef.current) {
      clearInterval(studyTimerRef.current);
      studyTimerRef.current = null;
    }
    if (readyButtonTimerRef.current) {
      clearTimeout(readyButtonTimerRef.current);
      readyButtonTimerRef.current = null;
    }
    
    const newShapes = generateShapes();
    setPhase('study');
    setSelectedCells([]);
    setTimeRemaining(30);
    setShowReadyButton(false);
    
    // Show "I'm ready" button after 10 seconds
    readyButtonTimerRef.current = setTimeout(() => {
      setShowReadyButton(true);
    }, 10000);
    
    // Start countdown timer
    const startTime = Date.now();
    const countdownTime = 30000; // 30 seconds to study in milliseconds
    
    studyTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((countdownTime - elapsed) / 1000));
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        if (studyTimerRef.current) {
          clearInterval(studyTimerRef.current);
          studyTimerRef.current = null;
        }
        transitionToResponsePhase(newShapes);
      }
    }, 1000);
    
    // Move to response phase after study time
    timerRef.current = setTimeout(() => {
      if (studyTimerRef.current) {
        clearInterval(studyTimerRef.current);
        studyTimerRef.current = null;
      }
      transitionToResponsePhase(newShapes);
    }, countdownTime);
  };

  const handleReadyClick = () => {
    // Only transition if we're still in study phase
    if (phase === 'study') {
      transitionToResponsePhase(shapes);
    }
  };

  useEffect(() => {
    // Clear any previous timers when starting a new level or trial
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (studyTimerRef.current) {
      clearInterval(studyTimerRef.current);
      studyTimerRef.current = null;
    }
    if (readyButtonTimerRef.current) {
      clearTimeout(readyButtonTimerRef.current);
      readyButtonTimerRef.current = null;
    }
    
    // Only start the level if we're not in completed state and phase is 'study'
    if (!completed && phase === 'study') {
      startLevel();
    }
    
    return () => {
      // Clean up all timers when component unmounts or dependencies change
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (studyTimerRef.current) {
        clearInterval(studyTimerRef.current);
        studyTimerRef.current = null;
      }
      if (readyButtonTimerRef.current) {
        clearTimeout(readyButtonTimerRef.current);
        readyButtonTimerRef.current = null;
      }
    };
  }, [currentLevel, completed, phase]);

  const handleCellClick = (position) => {
    if (phase !== 'response') return;
    
    setSelectedCells(prev => {
      if (prev.includes(position)) {
        return prev.filter(pos => pos !== position);
      } else {
        return [...prev, position];
      }
    });
  };

  // This function is simplified since we no longer need to check if a level is complete
  // We keep it to avoid breaking references, but it always returns true
  const isLevelComplete = (levelNum) => {
    return true;
  };

  const handleSubmit = () => {
    const dimensions = getGridDimensions();
    const totalShapes = dimensions.columns * dimensions.rows;
    
    // Changed shapes are those that swapped positions
    const changedShapes = [];
    shapes.forEach((originalShape) => {
      const movedShape = movedShapes.find(s => s.id === originalShape.id);
      if (originalShape.position !== movedShape.position) {
        changedShapes.push({
          id: originalShape.id,
          originalPosition: originalShape.position,
          newPosition: movedShape.position
        });
      }
    });
    
    // Count correct and incorrect selections
    let correctSelections = 0;
    let incorrectSelections = 0;
    
    selectedCells.forEach(position => {
      // Check if this position contains a shape that moved
      const originalShapeAtPosition = shapes.find(s => s.position === position);
      const currentShapeAtPosition = movedShapes.find(s => s.position === position);
      
      if (!originalShapeAtPosition || !currentShapeAtPosition) return;
      
      // If different shapes are at this position in original vs moved state, it's a correct selection
      if (originalShapeAtPosition.id !== currentShapeAtPosition.id) {
        correctSelections++;
      } else {
        incorrectSelections++;
      }
    });
    
    const totalMovedShapes = changedShapes.length;
    const totalSelectionsCount = selectedCells.length;
    
    // Calculate score: correctSelections minus incorrectSelections
    const levelScore = correctSelections - incorrectSelections;
    
    // Record completion time (we could add a timer in the future)
    const completionTime = new Date().getTime(); // Placeholder for now
    
    // Update score and max score
    setScore(prevScore => prevScore + levelScore);
    
    // Update max score by adding the number of moved objects for this level
    setMaxScore(prevMax => prevMax + totalMovedShapes);
    
    // Create formatted target and selected positions strings
    const targetPositions = changedShapes.map(shape => shape.newPosition).join(',');
    const selectedPositions = selectedCells.join(',');
    
    // Record results for this level with comprehensive data format
    const result = {
      participantId: localStorage.getItem('studentId') || 'unknown',
      timestamp: new Date().toISOString(),
      trial: trialCount,
      level: currentLevel,
      difficultyLevel: currentLevel, // Same as level for this task
      gridSize: `${dimensions.columns}x${dimensions.rows}`,
      targetPositions: targetPositions,
      selectedPositions: selectedPositions,
      correctSelections: correctSelections,
      incorrectSelections: incorrectSelections,
      totalSelectionsCount: totalSelectionsCount,
      totalMovedShapes: totalMovedShapes,
      completionTime: completionTime,
      score: levelScore,
      maxLevelReached: currentLevel, // Will be updated in exportResults based on all results
      isCorrect: correctSelections > incorrectSelections // Used for accuracy calculation
    };
    
    console.log(`Level ${currentLevel}: ${correctSelections} correct out of ${totalMovedShapes} possible. Score: ${levelScore}`);
    console.log('Result with totalMovedShapes:', result); // Add debugging log
    
    setResults(prevResults => [...prevResults, result]);
    
    // Has the user passed the level?
    const passed = correctSelections > incorrectSelections;
    
    // Set feedback message
    const feedbackText = passed
      ? `Level ${currentLevel} complete! Ready for the next level?`
      : `Level ${currentLevel} complete. Ready for the next challenge?`;
    
    setFeedbackMessage(feedbackText);
    setRecordedLevels(prev => [...prev, currentLevel]);
    
    // Transition to feedback phase temporarily
    setPhase('feedback');
    
    // If all levels are completed, show completion screen
    if (currentLevel >= maxLevel) {
      setTimeout(() => {
        setCompleted(true);
      }, 2000);
    }
  };

  const handleNextLevel = () => {
    if (phase !== 'feedback') return;
    
    // If we're at the last level (5), end the task
    if (currentLevel === 5) {
      // First export the results
      exportResults();
      // Then set completed state
      setCompleted(true);
      return;
    }
    
    // Always move to the next level regardless of performance
    setCurrentLevel(prev => prev + 1);
    // Set phase back to study to allow proper transition
    setPhase('study');
  };

  // Navigate to the next task (Ecological Spatial Memory)
  const handleNextTask = () => {
    navigate('/ecological-spatial');
  };

  const exportResults = () => {
    try {
      // Import the task results utility function
      const { saveTaskResults } = require('../../utils/taskResults');
      
      // Calculate max level reached and overall accuracy before saving
      const maxLevelReached = Math.max(...results.map(r => r.level));
      
      // Calculate overall accuracy based on correct selections vs total moved shapes
      const totalCorrectSelections = results.reduce((sum, result) => sum + (result.correctSelections || 0), 0);
      const totalPossibleSelections = results.reduce((sum, result) => sum + (result.totalMovedShapes || 0), 0);
      
      // Set overall task metrics for each result
      const enhancedResults = results.map(result => ({
        ...result,
        maxLevelReached,
        overallAccuracy: totalPossibleSelections > 0 
          ? (totalCorrectSelections / totalPossibleSelections * 100).toFixed(2) + '%' 
          : '0%'
      }));
      
      console.log('Enhanced Spatial Working Memory results being saved:', enhancedResults);
      console.log(`Overall accuracy: ${totalCorrectSelections} correct selections out of ${totalPossibleSelections} possible selections`);
      
      // Save enhanced results to the centralized storage system
      saveTaskResults('spatialWorkingMemory', enhancedResults);
      
      console.log('Spatial Working Memory results saved successfully');
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  const renderGrid = () => {
    const dimensions = getGridDimensions();
    const displayShapes = phase === 'study' ? shapes : movedShapes;
    const totalCells = dimensions.columns * dimensions.rows;
    
    // Calculate grid size based on viewport
    const gridCols = dimensions.columns;
    const gridRows = dimensions.rows;
    
    // Calculate container size to fit all shapes
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxGridWidth = viewportWidth * 0.98;
    const maxGridHeight = viewportHeight - 165; // Slightly increased space for header
    
    // Calculate cell size to fit within constraints
    const maxCellWidth = Math.floor(maxGridWidth / gridCols);
    const maxCellHeight = Math.floor(maxGridHeight / gridRows);
    const cellSize = Math.min(maxCellWidth, maxCellHeight, 103); // Very slight reduction from 105px
    
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: `repeat(${gridCols}, ${cellSize}px)`,
      gridTemplateRows: `repeat(${gridRows}, ${cellSize}px)`,
      gap: '12px',
      background: '#f7f7f7',
      padding: '20px', // Slightly reduced padding
      borderRadius: '10px',
      boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
      margin: '0 auto',
      width: 'fit-content',
      minHeight: 'min-content'
    };

    // In feedback phase, highlight shapes that changed positions
    const getChangedStyle = (position) => {
      // Remove feedback styling
      return {};
    };

    return (
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        marginTop: '-30px'
      }}>
        <div className={`grid-container level-${currentLevel}`} style={gridStyle}>
          {Array(totalCells).fill().map((_, i) => {
            const shape = displayShapes.find(s => s.position === i);
            const isSelected = selectedCells.includes(i);
            
            const cellStyle = {
              width: '100%',
              height: '100%',
              background: isSelected ? '#e3f2fd' : 'white',
              border: isSelected ? '3px solid #2196F3' : '1px solid #ddd',
              borderRadius: '10px',
              padding: '8px',
              transition: 'all 0.2s ease',
              cursor: phase === 'response' ? 'pointer' : 'default',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxSizing: 'border-box'
            };
            
            const shapeSize = Math.floor(cellSize * 0.6);
            
            return (
              <div 
                key={i} 
                className={`grid-cell ${phase === 'response' ? 'clickable' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={phase === 'response' ? () => handleCellClick(i) : undefined}
                style={cellStyle}
              >
                {shape && (
                  <div 
                    className={`grid-shape shape-${shape.type} shape-${shape.color}`}
                    style={{ 
                      width: `${shapeSize}px`,
                      height: `${shapeSize}px`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '0',
                      color: 'transparent',
                      boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="spatial-screen" style={{ 
        height: 'calc(100vh - 40px)', // Reduced height to leave space for button
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="spatial-content" style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: '10px',
          boxSizing: 'border-box'
        }}>
          {!completed ? (
            <>
              <div className="instruction-container" style={{ 
                padding: '5px',
                marginBottom: '5px',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                flexShrink: 0,
                height: '40px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  width: '100%',
                  height: '100%'
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {phase === 'study' && 'Study Phase: Memorize positions'}
                    {phase === 'response' && 'Response Phase: Click moved shapes'}
                    {phase === 'feedback' && `Feedback: Level ${currentLevel}`}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '0.8rem' }}>Level {currentLevel}/5</div>
                    
                    {/* Smaller progress bar */}
                    <div style={{ width: '60px', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(currentLevel / 5) * 100}%`, height: '100%', backgroundColor: '#2196F3', borderRadius: '4px' }} />
                    </div>
                    
                    {/* Always reserve space for timer, show 0s when not in study phase */}
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: phase === 'study' ? '#e53935' : 'transparent', 
                      fontWeight: 'bold',
                      marginLeft: '5px',
                      whiteSpace: 'nowrap',
                      width: '30px',
                      textAlign: 'right'
                    }}>
                      {phase === 'study' ? `${timeRemaining}s` : '0s'}
                    </div>
                  </div>
                </div>
              </div>
              
              {phase === 'study' && (
                <div className="phase-container" style={{ 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {renderGrid()}
                </div>
              )}
              
              {phase === 'response' && (
                <div className="phase-container" style={{ 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {renderGrid()}
                </div>
              )}
              
              {phase === 'feedback' && (
                <div className="phase-container" style={{ 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <p className="feedback-message" style={{ fontSize: '1.1rem', margin: '0 0 10px' }}>{feedbackMessage}</p>
                  <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 10px' }}>
                    {currentLevel < 5 ? 
                      `Level ${currentLevel} completed. Moving to level ${currentLevel + 1} next.` : 
                      "Level 5 completed. This is the final level."
                    }
                  </p>
                  
                  {renderGrid()}
                </div>
              )}
            </>
          ) : (
            <div className="completion-screen">
              <h2>Task Complete!</h2>
              
              <button 
                onClick={handleNextTask} 
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
                Next Task: Ecological Spatial Memory
                <span style={{ marginLeft: '10px', fontSize: '1.6rem' }}>→</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fixed buttons positioned outside the main content container */}
      {phase === 'study' && showReadyButton && (
        <div style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '10px 0',
          zIndex: 100,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}>
          <button 
            className="spatial-button ready-button"
            onClick={handleReadyClick}
            style={{
              width: '250px',
              margin: '0 auto'
            }}
          >
            I'm ready to identify changes
          </button>
        </div>
      )}
      
      {phase === 'response' && (
        <div style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '10px 0',
          zIndex: 100,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}>
          <button 
            className="spatial-button submit-button"
            onClick={handleSubmit}
            style={{
              width: '200px',
              margin: '0 auto'
            }}
          >
            <span style={{ marginRight: '5px' }}>✓</span> Submit Answers
          </button>
        </div>
      )}
      
      {phase === 'feedback' && (
        <div style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '10px 0',
          zIndex: 100,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}>
          <button 
            className="spatial-button next-button"
            onClick={handleNextLevel}
            style={{
              width: '200px',
              margin: '0 auto'
            }}
          >
            Next Level
          </button>
        </div>
      )}
    </>
  );
};

export default SpatialMemoryMainTask;
