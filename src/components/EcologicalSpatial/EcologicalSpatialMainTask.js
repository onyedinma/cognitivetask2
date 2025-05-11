import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
const pot = '/ecoimages/Pot.jpg';
const horse = '/ecoimages/horse.png';
const flower = '/ecoimages/flower.jpg';
const bread = '/ecoimages/Bread.jpg';
const bag = '/ecoimages/bag.webp';
const shoe = '/ecoimages/Shoe.jpg';
const sofa = '/ecoimages/sofa.jpg';
const fryingpan = '/ecoimages/fryingpan.png';
const book = '/ecoimages/book.jpg';
const elephant = '/ecoimages/elephant.jpg';

// Array of all image paths for preloading
const allImagePaths = [
  dog, cat, bird, car, house, bus, chair, computer, umbrella, clock,
  pot, horse, flower, bread, bag, shoe, sofa, fryingpan, book, elephant
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
  { name: 'pot', src: pot },
  { name: 'horse', src: horse },
  { name: 'flower', src: flower },
  { name: 'bread', src: bread },
  { name: 'bag', src: bag },
  { name: 'shoe', src: shoe },
  { name: 'sofa', src: sofa },
  { name: 'fryingpan', src: fryingpan },
  { name: 'book', src: book },
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

  // More efficient preloading with status tracking
  useEffect(() => {
    let isMounted = true; // Track component mount state
    let loadedCount = 0;
    const totalImages = allImagePaths.length;
    const imageElements = []; // Keep references to avoid memory leaks
    
    const preloadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        imageElements.push(img); // Store reference
        
        img.onload = () => {
          if (isMounted) {
            loadedCount++;
            setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
          }
          resolve(true);
        };
        
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          if (isMounted) {
            loadedCount++;
            setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
          }
          resolve(false);
        };
        
        img.src = src;
      });
    };

    const loadAllImages = async () => {
      try {
        const results = await Promise.all(allImagePaths.map(src => preloadImage(src)));
        if (isMounted) {
          console.log(`Successfully loaded ${results.filter(Boolean).length}/${totalImages} images`);
          setImagesLoaded(true);
        }
      } catch (error) {
        console.error('Error preloading images:', error);
        if (isMounted) {
          setImagesLoaded(true); // Continue anyway
        }
      }
    };

    loadAllImages();
    
    // Cleanup function to prevent memory leaks and state updates after unmount
    return () => {
      isMounted = false;
      imageElements.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);

  // Update the useEffect to ensure it doesn't get stuck
  useEffect(() => {
    console.log(`useEffect triggered. Level: ${currentLevel}, Phase: ${phase}, Completed: ${completed}, ImagesLoaded: ${imagesLoaded}`);
    
    // Clean up all timers first
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
    
    // Only start the level if we're not in completed state, images are loaded, and phase is 'study'
    if (!completed && imagesLoaded && phase === 'study') {
      console.log(`Starting level ${currentLevel}`);
      startLevel();
    }
    
    // Export results when completed state becomes true
    if (completed && results.length > 0) {
      console.log('Task completed, exporting results...');
      exportResults();
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
  }, [currentLevel, completed, imagesLoaded, phase]);

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
    
    // Add a slight delay before changing phase for better transition
    setTimeout(() => {
      setPhase('response');
    }, 150);
  };

  const startLevel = () => {
    console.log(`startLevel called for level ${currentLevel}`);
    
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
    console.log(`Generated ${newShapes.length} shapes for level ${currentLevel}`);
    
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
    
    // Calculate level score (correct - incorrect) allowing negative scores
    const levelScore = correctSelections.length - incorrectSelections.length;
    
    // Check if level was passed (score >= 50% of possible moved objects)
    const totalMovedObjects = movedPositions.length;
    const isLevelPassed = correctSelections.length >= totalMovedObjects * 0.5;
    
    // Get completion time
    const completionTime = new Date().getTime();
    
    console.log(`Level ${currentLevel}: Score = ${levelScore}/${totalMovedObjects} (${correctSelections.length} correct, ${incorrectSelections.length} incorrect)`);
    
    // Provide feedback
    if (correctSelections.length === totalMovedObjects && incorrectSelections.length === 0) {
      setFeedbackMessage('Level complete! Ready for the next challenge?');
    } else if (correctSelections.length > 0) {
      setFeedbackMessage(`Level ${currentLevel} complete. Ready to continue?`);
    } else {
      setFeedbackMessage(`Level ${currentLevel} finished. Let's move on to the next level.`);
    }
    
    // Format target objects and selected objects as strings for CSV export
    const targetObjectsString = movedObjectPairs.map(obj => obj.imageName).join(',');
    const selectedObjectsString = selectedCells.map(pos => {
      const obj = movedShapes.find(s => s.position === pos);
      return obj ? obj.imageName : 'none';
    }).join(',');
    
    // Store result for current attempt with comprehensive data format
    const currentResult = {
      participantId: localStorage.getItem('studentId') || 'unknown',
      timestamp: new Date().toISOString(),
      trialNumber: currentLevel, // Using level as trial number for this task
      level: currentLevel,
      scenarioId: currentLevel, // Using level as scenario ID for now
      scenarioName: `Ecological Scene ${currentLevel}`,
      sceneDescription: `Level ${currentLevel} scene with ${shapes.length} objects`,
      targetObjects: targetObjectsString,
      selectedObjects: selectedObjectsString,
      correctSelections: correctSelections.length,
      incorrectSelections: incorrectSelections.length,
      totalMovedObjects: totalMovedObjects,
      completionTime: completionTime,
      score: levelScore,
      isCorrect: isLevelPassed, // For accuracy calculation
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
      // Set phase back to study to allow proper transition
      // Don't call startLevel() directly here - let the useEffect handle it based on the state changes
      setPhase('study');
    }
  };

  const exportResults = () => {
    try {
      // Import the task results utility function
      const { saveTaskResults } = require('../../utils/taskResults');
      
      // Format the results for CSV export to match expected fields
      const formattedResults = results.map(result => ({
        participantId: result.participantId || localStorage.getItem('studentId') || 'unknown',
        timestamp: result.timestamp || new Date().toISOString(),
        trialNumber: result.trialNumber || result.level,
        level: result.level,
        scenarioId: result.scenarioId || result.level,
        scenarioName: result.scenarioName || `Ecological Scene ${result.level}`,
        sceneDescription: result.sceneDescription || `Level ${result.level} scene`,
        targetObjects: result.targetObjects || '',
        selectedObjects: result.selectedObjects || '',
        correctSelections: result.correctSelections,
        incorrectSelections: result.incorrectSelections,
        totalMovedObjects: result.totalMovedObjects,
        completionTime: result.completionTime || 0,
        isCorrect: result.isCorrect || result.passed,
        score: result.score
      }));
      
      // Calculate and log accuracy metrics for verification
      const totalCorrectSelections = formattedResults.reduce((sum, result) => sum + (result.correctSelections || 0), 0);
      const totalPossibleSelections = formattedResults.reduce((sum, result) => sum + (result.totalMovedObjects || 0), 0);
      const overallAccuracy = totalPossibleSelections > 0 
        ? (totalCorrectSelections / totalPossibleSelections * 100).toFixed(2) + '%' 
        : '0%';
        
      console.log(`Ecological Spatial Task Accuracy Metrics:`);
      console.log(`- Total Correct Selections: ${totalCorrectSelections}`);
      console.log(`- Total Possible Selections: ${totalPossibleSelections}`);
      console.log(`- Overall Accuracy: ${overallAccuracy}`);
      
      // Save results to the centralized storage system
      saveTaskResults('ecologicalSpatial', formattedResults);
      
      console.log('Ecological Spatial results saved:', formattedResults);
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleNextTask = () => {
    // Navigate to the standard Deductive Reasoning task
    navigate('/deductive-reasoning');
  };

  // Memoize the grid rendering to prevent unnecessary re-renders
  const renderGrid = useCallback(() => {
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
              padding: '4px', // Reduced padding to allow for larger images
              transition: 'all 0.2s ease',
              cursor: phase === 'response' ? 'pointer' : 'default',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxSizing: 'border-box'
            };
            
            const imageSize = Math.floor(cellSize * 0.9); // Increased from 0.75 to 0.9
            
            return (
              <div 
                key={i} 
                className={`grid-cell ${phase === 'response' ? 'clickable' : ''} ${isSelected ? 'selected' : ''}`}
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
                      position: 'relative'
                    }}
                  >
                    <img 
                      src={shape.imageSrc} 
                      alt={shape.imageName}
                      className="eco-image"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [
    phase, 
    shapes, 
    movedShapes, 
    selectedCells, 
    currentLevel, 
    getGridDimensions, 
    handleCellClick
  ]);

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
                    {phase === 'response' && 'Response Phase: Click moved objects'}
                    {phase === 'feedback' && `Feedback: Level ${currentLevel}`}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '0.8rem' }}>Level {currentLevel}/5</div>
                    
                    {/* Smaller progress bar */}
                    <div style={{ width: '60px', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${(currentLevel / 5) * 100}%`, 
                          height: '100%', 
                          backgroundColor: '#2196F3', 
                          borderRadius: '4px',
                          transition: 'width 0.5s ease-out'  // Smooth transition for progress bar
                        }} 
                      />
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
                <div className="phase-container" 
                  style={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: 'fadeIn 0.3s ease-in-out' // Add fade-in animation
                  }}
                >
                  {renderGrid()}
                </div>
              )}
              
              {phase === 'response' && (
                <div className="phase-container" 
                  style={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: 'fadeIn 0.3s ease-in-out' // Add fade-in animation
                  }}
                >
                  {renderGrid()}
                </div>
              )}
              
              {phase === 'feedback' && (
                <div className="phase-container" 
                  style={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: 'fadeIn 0.3s ease-in-out' // Add fade-in animation
                  }}
                >
                  <p className="feedback-message" 
                    style={{ 
                      fontSize: '1.1rem', 
                      margin: '0 0 10px',
                      animation: 'slideInTop 0.4s ease-out' // Add slide-in animation
                    }}
                  >
                    {feedbackMessage}
                  </p>
                  <p 
                    style={{ 
                      fontSize: '0.9rem', 
                      color: '#666', 
                      margin: '0 0 10px',
                      animation: 'slideInTop 0.5s ease-out' // Add slide-in animation with delay
                    }}
                  >
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
                  Next Task: Deductive Reasoning
                <span style={{ marginLeft: '10px', fontSize: '1.6rem' }}>→</span>
                </button>
            </div>
          )}
        </div>
      </div>

      {/* Fixed buttons positioned outside the main content container - don't show during transitions */}
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
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          animation: 'slideInBottom 0.3s ease-out' // Add slide-in animation
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
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          animation: 'slideInBottom 0.3s ease-out' // Add slide-in animation
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
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          animation: 'slideInBottom 0.3s ease-out' // Add slide-in animation
        }}>
          <button 
            onClick={handleNextLevel}
            className="spatial-button next-button"
            style={{
              width: '200px',
              margin: '0 auto'
            }}
          >
            {currentLevel === 5 ? 'Finish' : 'Next Level'}
          </button>
        </div>
      )}
        </>
      )}
    </>
  );
};

export default EcologicalSpatialMainTask;
