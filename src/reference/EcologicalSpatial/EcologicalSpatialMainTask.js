import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EcologicalSpatial.css';

// Import all images from Ecoimages folder with correct paths
const dog = '/ecoimages/dog.jpg';
const cat = '/ecoimages/cat.jpg';
const bird = '/ecoimages/bird.jpg';
const car = '/ecoimages/car.jpg';
const house = '/ecoimages/house.jpg';
const bus = '/ecoimages/bus.jpg';
const chair = '/ecoimages/chair.jpg';
const computer = '/ecoimages/computer.jpg';
const umbrella = '/ecoimages/umbrella.jpg';
const clock = '/ecoimages/clock.jpg';
const teacup = '/ecoimages/teacup.jpg';
const guitar = '/ecoimages/guitar.jpg';
const flower = '/ecoimages/flower.jpg';
const bread = '/ecoimages/bread.jpg';
const bag = '/ecoimages/bag.jpg';
const shoe = '/ecoimages/shoe.jpg';
const kettle = '/ecoimages/kettle.jpg';
const fryingpan = '/ecoimages/fryingpan.jpg';
const electriciron = '/ecoimages/electriciron.jpg';
const elephant = '/ecoimages/elephant.jpg';

// Array of all image paths for preloading
const allImagePaths = [
  dog, cat, bird, car, house, bus, chair, computer, umbrella, clock,
  teacup, guitar, flower, bread, bag, shoe, kettle, fryingpan, electriciron, elephant
];

// Define image objects to use
const ecoImages = [
  { name: 'dog', src: dog },
  { name: 'cat', src: cat },
  { name: 'bird', src: bird },
  { name: 'car', src: car },
  { name: 'house', src: house },
  { name: 'bus', src: bus },
  { name: 'chair', src: chair },
  { name: 'computer', src: computer },
  { name: 'umbrella', src: umbrella },
  { name: 'clock', src: clock },
  { name: 'teacup', src: teacup },
  { name: 'guitar', src: guitar },
  { name: 'flower', src: flower },
  { name: 'bread', src: bread },
  { name: 'bag', src: bag },
  { name: 'shoe', src: shoe },
  { name: 'kettle', src: kettle },
  { name: 'fryingpan', src: fryingpan },
  { name: 'electriciron', src: electriciron },
  { name: 'elephant', src: elephant }
];

/**
 * EcologicalSpatialMainTask component
 * Main task component for the ecological spatial memory task with a larger grid
 */
const EcologicalSpatialMainTask = () => {
  const navigate = useNavigate();
  
  // Add image loading states
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
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
  const [recordedLevels, setRecordedLevels] = useState([]); // Track which levels have been recorded
  
  // Refs for timer management and configuration
  const timerRef = useRef(null);
  const studyTimerRef = useRef(null);
  const readyButtonTimerRef = useRef(null);

  // Preload images when component mounts
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = allImagePaths.length;
    
    const preloadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
          resolve(); // Resolve anyway to not block other images
        };
      });
    };

    const loadAllImages = async () => {
      try {
        await Promise.all(allImagePaths.map(src => preloadImage(src)));
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesLoaded(true); // Continue anyway
      }
    };

    loadAllImages();
  }, []);

  // Effect for starting new level or cleaning up
  useEffect(() => {
    // Clear any previous timers when starting a new level
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
    
    // Only start the level if we're not in completed state and images are loaded
    if (!completed && imagesLoaded) {
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
  }, [currentLevel, completed, imagesLoaded]);

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
    
    // Shuffle the eco images array and take only the number we need
    const shuffledImages = [...ecoImages]
      .sort(() => Math.random() - 0.5)
      .slice(0, numShapes);
    
    // Generate shapes with image info
    const newShapes = positions.map((position, index) => ({
      id: index,
      imageIndex: index,
      imageName: shuffledImages[index].name,
      imageSrc: shuffledImages[index].src,
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
    
    // Keep track of shapes that will move
    const movedShapeIds = [];
    
    // Get indices of shapes to swap
    const shapesToSwap = [];
    const availableIndices = Array.from({ length: shapesCopy.length }, (_, i) => i);
    
    for (let i = 0; i < numPairsToSwap * 2; i++) {
      if (availableIndices.length === 0) break;
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      shapesToSwap.push(availableIndices[randomIndex]);
      // Store the ID of shapes that will move
      movedShapeIds.push(shapesCopy[availableIndices[randomIndex]].id);
      availableIndices.splice(randomIndex, 1);
    }
    
    // Swap positions of selected shapes
    for (let i = 0; i < shapesToSwap.length; i += 2) {
      if (i + 1 >= shapesToSwap.length) break;
      
      const temp = shapesCopy[shapesToSwap[i]].position;
      shapesCopy[shapesToSwap[i]].position = shapesCopy[shapesToSwap[i + 1]].position;
      shapesCopy[shapesToSwap[i + 1]].position = temp;
    }
    
    // Get the new positions of moved shapes
    const swappedPositions = movedShapeIds.map(id => 
      shapesCopy.find(shape => shape.id === id).position
    );
    
    // Log the shapes that were swapped for debugging
    console.log("Moved objects:", shapesCopy.filter(shape => 
      movedShapeIds.includes(shape.id)).map(s => ({
        id: s.id,
        imageName: s.imageName,
        position: s.position
      }))
    );
    
    setMovedShapes(shapesCopy);
    return {
      movedShapes: shapesCopy,
      swappedPositions: swappedPositions
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

  // This function checks if the current level has been passed in any trial
  const isLevelComplete = (levelNum) => {
    return recordedLevels.includes(levelNum);
  };

  const handleSubmit = () => {
    if (phase !== 'response') return;
    
    // Find all positions that have moved objects
    const movedPositions = [];
    const movedObjectPairs = [];
    
    // Compare original and moved shapes to find all objects that moved
    shapes.forEach(originalShape => {
      const movedShape = movedShapes.find(s => s.id === originalShape.id);
      if (originalShape.position !== movedShape.position) {
        // Record the current position (in the response grid) of moved objects
        movedPositions.push(movedShape.position);
        movedObjectPairs.push({
          id: originalShape.id,
          imageName: originalShape.imageName,
          fromPosition: originalShape.position,
          toPosition: movedShape.position
        });
      }
    });
    
    // Count correct selections (objects that moved and were selected)
    const correctSelections = selectedCells.filter(pos => movedPositions.includes(pos));
    
    // Count incorrect selections (objects that didn't move but were selected)
    const incorrectSelections = selectedCells.filter(pos => !movedPositions.includes(pos));
    
    // Calculate level score (correct - incorrect)
    const levelScore = Math.max(0, correctSelections.length - incorrectSelections.length);
    
    // Check if level was passed (score >= 50% of possible moved objects)
    const totalMovedObjects = movedPositions.length;
    const isLevelPassed = levelScore >= totalMovedObjects * 0.5;
    
    console.log(`Level ${currentLevel}: Score = ${levelScore}/${totalMovedObjects} (${correctSelections.length} correct, ${incorrectSelections.length} incorrect)`);
    
    // Provide feedback
    if (correctSelections.length === totalMovedObjects && incorrectSelections.length === 0) {
      setFeedbackMessage('Perfect! You correctly identified all the objects that moved.');
    } else if (correctSelections.length > 0) {
      setFeedbackMessage(`You identified ${correctSelections.length} out of ${totalMovedObjects} moved objects, with ${incorrectSelections.length} incorrect selections.`);
    } else {
      setFeedbackMessage(`You didn't identify any moved objects correctly. ${totalMovedObjects} objects moved in this level.`);
    }
    
    // Store result for current attempt
    const currentResult = {
      level: currentLevel,
      correctSelections: correctSelections.length,
      incorrectSelections: incorrectSelections.length,
      totalMovedObjects: totalMovedObjects,
      score: levelScore,
      movedObjectPairs: movedObjectPairs,
      passed: isLevelPassed
    };
    
    // Add the result to the results array
    setResults(prev => [...prev, currentResult]);
    
    // Update total score and max score
    setScore(prev => prev + levelScore);
    setMaxScore(prev => prev + totalMovedObjects);
    
    // If the level was passed, mark it as recorded so we don't repeat it
    if (isLevelPassed) {
      setRecordedLevels(prev => {
        if (!prev.includes(currentLevel)) {
          return [...prev, currentLevel];
        }
        return prev;
      });
    }
    
    setPhase('feedback');
  };

  const handleNextLevel = () => {
    if (phase !== 'feedback') return;
    
    // Get the most recent result
    const latestResult = results[results.length - 1];
    
    // After each level, always progress to the next level regardless of performance
    // End the task when we complete level 5
    if (currentLevel === 5) {
      setCompleted(true);
    } else {
      // Move to the next level
      setCurrentLevel(prev => prev + 1);
    }
  };

  const exportResults = () => {
    // Prepare CSV content
    const headers = ['Level', 'Correct Selections', 'Incorrect Selections', 'Total Moved Objects', 'Score'];
    const csvRows = [headers];
    
    // Add results to CSV
    results.forEach(result => {
      csvRows.push([
        result.level,
        result.correctSelections,
        result.incorrectSelections,
        result.totalMovedObjects,
        result.score
      ]);
    });
    
    // Add a summary row
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const totalPossible = results.reduce((sum, r) => sum + r.totalMovedObjects, 0);
    
    csvRows.push(['Summary', '', '', totalPossible, totalScore]);
    
    // Convert to CSV format
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ecological_spatial_results.csv');
    link.style.visibility = 'hidden';
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
            
            const imageSize = Math.floor(cellSize * 0.75); // Adjusted for images
            
            return (
              <div 
                key={i} 
                className={`grid-cell ${phase === 'response' ? 'clickable' : ''} ${isSelected ? 'selected' : ''} ${isChangedPosition ? 'changed' : ''}`}
                onClick={phase === 'response' ? () => handleCellClick(i) : undefined}
                style={cellStyle}
              >
                {shape && (
                  <div 
                    className="eco-image-container"
                    style={{ 
                      width: `${imageSize}px`,
                      height: `${imageSize}px`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      ...(isChangedPosition ? getChangedStyle(i) : {})
                    }}
                  >
                    <img 
                      src={shape.imageSrc} 
                      alt={shape.imageName}
                      className="eco-image"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
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

  // Render method - no early returns for loading state
  return (
    <>
      {!imagesLoaded ? (
        <div className="eco-spatial-screen">
          <div className="eco-loading-container">
            <h2>Loading Images...</h2>
            <div className="eco-loading-bar">
              <div 
                className="eco-loading-progress" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p>{loadingProgress}%</p>
          </div>
        </div>
      ) : (
        <>
          <div className="spatial-screen" style={{ 
            height: 'calc(100vh - 40px)', 
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
                          `Moving to level ${currentLevel + 1} next.` : 
                          "This is the final level. The task will end now."}
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
                onClick={handleNextLevel} 
                className="spatial-button next-button"
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
      )}
    </>
  );
};

export default EcologicalSpatialMainTask;
