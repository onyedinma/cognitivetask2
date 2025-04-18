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
    
    // Generate shapes with types and colors
    const newShapes = positions.map((position, index) => ({
      id: index,
      type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
      color: shapeColors[Math.floor(Math.random() * shapeColors.length)],
      position: position
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
    
    // Get indices of shapes to swap
    const shapesToSwap = [];
    const availableIndices = Array.from({ length: shapesCopy.length }, (_, i) => i);
    
    for (let i = 0; i < numPairsToSwap * 2; i++) {
      if (availableIndices.length === 0) break;
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      shapesToSwap.push(availableIndices[randomIndex]);
      availableIndices.splice(randomIndex, 1);
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
    
    // Only start the level if we're not in completed state
    if (!completed) {
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
  }, [currentLevel, completed]);

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
    if (phase !== 'response') return;
    
    // Find all shapes that have moved from their original positions
    const movedShapeIds = [];
    const shapesCurrentPositions = new Map(); // Map of shape ID to its current position
    const changedShapePairs = [];
    
    // Compare original and moved shapes to find all shapes that moved
    shapes.forEach(originalShape => {
      const movedShape = movedShapes.find(s => s.id === originalShape.id);
      if (originalShape.position !== movedShape.position) {
        movedShapeIds.push(originalShape.id);
        // Store only the current position of moved shapes
        shapesCurrentPositions.set(originalShape.id, movedShape.position);
        changedShapePairs.push({
          id: originalShape.id,
          from: originalShape.position,
          to: movedShape.position
        });
      }
    });
    
    // Get array of current positions of moved shapes
    const movedPositions = Array.from(shapesCurrentPositions.values());
    
    // Count correct selections (current positions of moved shapes that were selected)
    const correctSelections = selectedCells.filter(pos => movedPositions.includes(pos));
    
    // Count incorrect selections (positions that were selected but don't contain moved shapes)
    const incorrectSelections = selectedCells.filter(pos => !movedPositions.includes(pos));
    
    // Calculate level score: +1 for each correct, -1 for each incorrect
    const levelScore = Math.max(0, correctSelections.length - incorrectSelections.length);
    
    // Always record the level result
    const totalMovedShapes = movedShapeIds.length;
    const isLevelPassed = correctSelections.length > incorrectSelections.length; // Pass if more correct than incorrect
    
    console.log(`Level ${currentLevel}: Score = ${levelScore}/${totalMovedShapes} (${correctSelections.length} correct, ${incorrectSelections.length} incorrect)`);
    
    // Provide feedback - focus on the number of shapes that moved
    if (correctSelections.length === totalMovedShapes && incorrectSelections.length === 0) {
      setFeedbackMessage('Perfect! You identified all the moved shapes correctly.');
    } else if (correctSelections.length > 0) {
      setFeedbackMessage(`You identified ${correctSelections.length} out of ${totalMovedShapes} moved shapes, with ${incorrectSelections.length} incorrect selections.`);
    } else {
      setFeedbackMessage(`You didn't identify any moved shapes correctly. There were ${totalMovedShapes} shapes that changed positions.`);
    }
    
    // Store result for current attempt
    const currentResult = {
      level: currentLevel,
      correctSelections: correctSelections.length,
      incorrectSelections: incorrectSelections.length,
      totalMovedShapes: totalMovedShapes,
      score: levelScore,
      changedPairs: changedShapePairs,
      passed: isLevelPassed
    };
    
    // Add the result to the results array
    setResults(prev => [...prev, currentResult]);
    
    // Update total score and max score
    setScore(prev => prev + levelScore);
    setMaxScore(prev => prev + totalMovedShapes);
    
    // Always add the level to recordedLevels
    setRecordedLevels(prev => {
      if (!prev.includes(currentLevel)) {
        return [...prev, currentLevel];
      }
      return prev;
    });
    
    setPhase('feedback');
  };

  const handleNextLevel = () => {
    if (phase !== 'feedback') return;
    
    // If we're at the last level (5), end the task
    if (currentLevel === 5) {
      setCompleted(true);
      return;
    }
    
    // Always move to the next level regardless of performance
    setCurrentLevel(prev => prev + 1);
  };

  const exportResults = () => {
    // Prepare CSV content
    const headers = ['Level', 'Correct Selections', 'Incorrect Selections', 'Total Moved Shapes', 'Score', 'Pass/Fail'];
    const csvRows = [headers];
    
    // Get the best result for each level
    const bestResults = [];
    const seenLevels = new Set();
    
    // Process results to get best outcome per level
    results.forEach(result => {
      if (!seenLevels.has(result.level)) {
        bestResults.push(result);
        seenLevels.add(result.level);
      } else {
        // Compare with existing result for this level
        const existingIndex = bestResults.findIndex(r => r.level === result.level);
        if (existingIndex >= 0) {
          const existingResult = bestResults[existingIndex];
          // Replace if this result is better (higher score)
          if (result.score > existingResult.score) {
            bestResults[existingIndex] = result;
          }
        }
      }
    });
    
    // Add results to CSV
    bestResults.forEach(result => {
      const passed = result.correctSelections > result.incorrectSelections ? 'Pass' : 'Fail';
      csvRows.push([
        result.level,
        result.correctSelections,
        result.incorrectSelections,
        result.totalMovedShapes,
        result.score,
        passed
      ]);
    });
    
    // Add summary row
    csvRows.push(['Total', '', '', maxScore, score, '']);
    
    // Convert to CSV
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create file and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'spatial_memory_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      if (phase !== 'feedback') return {};
      
      // Find if a different shape was originally in this position
      const originalShapeAtPosition = shapes.find(s => s.position === position);
      const currentShapeAtPosition = movedShapes.find(s => s.position === position);
      
      if (!originalShapeAtPosition || !currentShapeAtPosition) return {};
      
      // If different shapes are at this position in original vs moved state
      if (originalShapeAtPosition.id !== currentShapeAtPosition.id) {
        return {
          boxShadow: '0 0 0 3px #4CAF50, 0 4px 8px rgba(0,0,0,0.2)',
          transform: 'scale(1.05)'
        };
      }
      
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
        marginTop: '-30px' // Reduced negative margin to prevent shapes from being hidden
      }}>
        <div className={`grid-container level-${currentLevel}`} style={gridStyle}>
          {Array(totalCells).fill().map((_, i) => {
            const shape = displayShapes.find(s => s.position === i);
            const isSelected = selectedCells.includes(i);
            const isChangedPosition = phase === 'feedback' && getChangedStyle(i).boxShadow;
            
            const cellStyle = {
              width: '100%',
              height: '100%',
              background: isSelected ? '#e3f2fd' : 'white',
              border: isSelected ? '3px solid #2196F3' : (isChangedPosition ? '3px solid #4CAF50' : '1px solid #ddd'),
              borderRadius: '10px',
              padding: '8px', // Slightly reduced from 9px
              transition: 'all 0.2s ease',
              cursor: phase === 'response' ? 'pointer' : 'default',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxSizing: 'border-box'
            };
            
            const shapeSize = Math.floor(cellSize * 0.6); // Slightly reduced from 0.62
            
            return (
              <div 
                key={i} 
                className={`grid-cell ${phase === 'response' ? 'clickable' : ''} ${isSelected ? 'selected' : ''} ${isChangedPosition ? 'changed' : ''}`}
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
                      position: 'relative',
                      ...(isChangedPosition ? getChangedStyle(i) : {})
                    }}
                  >
                    {phase === 'feedback' && isChangedPosition && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#4CAF50',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }}>
                        ✓
                      </div>
                    )}
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
              <h1>Task Complete!</h1>
              <p>You've completed the Spatial Memory Task.</p>
              <p className="score-item">Final score: <span className="score-value">{score} / {maxScore}</span></p>
              <p className="score-item">Highest level reached: <span className="score-value">{currentLevel}</span></p>
              
              <div className="action-buttons">
                <button className="spatial-button export-button" onClick={exportResults}>
                  Export Results (CSV)
                </button>
                <button className="spatial-button home-button" onClick={handleReturnHome}>
                  Return to Home
                </button>
              </div>
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
            {currentLevel === 5 ? 'Show Final Results' : 'Next Level'}
          </button>
        </div>
      )}
    </>
  );
};

export default SpatialMemoryMainTask;
