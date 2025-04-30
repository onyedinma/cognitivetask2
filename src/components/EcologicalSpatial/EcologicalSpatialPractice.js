import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EcologicalSpatial.css';

// Define constant for image path
const IMAGE_PATH = '/ecoimages/';

// Import images from Ecoimages folder with correct paths
const dog = `${IMAGE_PATH}dog.jpg`;
const cat = `${IMAGE_PATH}cat.jpg`;
const bird = `${IMAGE_PATH}bird.jpg`;
const car = `${IMAGE_PATH}car.jpg`;
const house = `${IMAGE_PATH}house.jpg`;
const bus = `${IMAGE_PATH}bus.jpg`;
const chair = `${IMAGE_PATH}chair.jpg`;
const computer = `${IMAGE_PATH}computer.jpg`;
const umbrella = `${IMAGE_PATH}umbrella.jpg`;
const clock = `${IMAGE_PATH}clock.jpg`;

// Array of all image paths for preloading
const allImagePaths = [dog, cat, bird, car, house, bus, chair, computer, umbrella, clock];

// Define image objects to use for practice
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
  { name: 'clock', src: clock }
];

/**
 * EcologicalSpatialPractice component
 * Practice component for the ecological spatial memory task with study and response phases
 */
const EcologicalSpatialPractice = () => {
  const navigate = useNavigate();
  
  // Add image loading states
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const [phase, setPhase] = useState('instructions'); // 'instructions', 'study', 'response', 'feedback'
  const [shapes, setShapes] = useState([]);
  const [movedShapes, setMovedShapes] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showReadyButton, setShowReadyButton] = useState(false);
  const [movedPositions, setMovedPositions] = useState([]);
  
  // Timer refs for managing transitions
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

  // Cleanup effect for timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (studyTimerRef.current) clearInterval(studyTimerRef.current);
      if (readyButtonTimerRef.current) clearTimeout(readyButtonTimerRef.current);
    };
  }, []);
  
  // Generate shapes with ecological images
  const generateShapes = () => {
    // Shuffle the eco images array and take only 5 for practice
    const shuffledImages = [...ecoImages]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    
    // Create practice shapes with the selected images
    const practiceShapes = shuffledImages.map((image, index) => ({
      id: index,
      imageName: image.name,
      imageSrc: image.src,
      position: index
    }));
    
    setShapes(practiceShapes);
    return practiceShapes;
  };
  
  const moveShapes = (originalShapes) => {
    // Create a deep copy of shapes
    const shapesCopy = JSON.parse(JSON.stringify(originalShapes));
    
    // Randomly select two different positions to swap
    let pos1, pos2;
    do {
      pos1 = Math.floor(Math.random() * shapesCopy.length);
      pos2 = Math.floor(Math.random() * shapesCopy.length);
    } while (pos1 === pos2);
    
    // Store which positions were swapped for later evaluation
    // These are the positions in the FINAL arrangement where objects moved
    const movedShapeIds = [
      shapesCopy.find(s => s.position === pos1).id,
      shapesCopy.find(s => s.position === pos2).id
    ];
    
    // Swap the positions
    const temp = shapesCopy[pos1].position;
    shapesCopy[pos1].position = shapesCopy[pos2].position;
    shapesCopy[pos2].position = temp;
    
    // Now set the moved positions based on where these objects ended up
    const movedPositionsAfterSwap = [
      shapesCopy.find(s => s.id === movedShapeIds[0]).position,
      shapesCopy.find(s => s.id === movedShapeIds[1]).position
    ];
    
    setMovedPositions(movedPositionsAfterSwap);
    setMovedShapes(shapesCopy);
    return shapesCopy;
  };
  
  const transitionToResponsePhase = (originalShapes) => {
    // Clear all timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (studyTimerRef.current) clearInterval(studyTimerRef.current);
    if (readyButtonTimerRef.current) clearTimeout(readyButtonTimerRef.current);
    
    // Move to response phase
    moveShapes(originalShapes);
    setPhase('response');
  };
  
  const startStudyPhase = () => {
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
    const countdownTime = 30000; // 30 seconds in milliseconds
    
    studyTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((countdownTime - elapsed) / 1000));
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        clearInterval(studyTimerRef.current);
        transitionToResponsePhase(newShapes);
      }
    }, 1000);
    
    // Move to response phase after 30 seconds
    timerRef.current = setTimeout(() => {
      clearInterval(studyTimerRef.current);
      transitionToResponsePhase(newShapes);
    }, countdownTime);
  };
  
  const handleReadyClick = () => {
    transitionToResponsePhase(shapes);
  };
  
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (studyTimerRef.current) clearInterval(studyTimerRef.current);
      if (readyButtonTimerRef.current) clearTimeout(readyButtonTimerRef.current);
    };
  }, []);
  
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
  
  const handleSubmit = () => {
    if (phase !== 'response') return;
    
    // Use the dynamically generated changed positions
    const changedPositions = movedPositions;
    
    // Count correct and incorrect selections
    const correctSelections = selectedCells.filter(pos => changedPositions.includes(pos));
    const incorrectSelections = selectedCells.filter(pos => !changedPositions.includes(pos));
    
    // Get total number of moved objects
    const totalMovedObjects = changedPositions.length;
    
    if (correctSelections.length === totalMovedObjects && incorrectSelections.length === 0) {
      setFeedbackMessage('Perfect! You correctly identified all the objects that moved.');
    } else if (correctSelections.length > 0) {
      setFeedbackMessage(`You identified ${correctSelections.length} out of ${totalMovedObjects} objects that moved, with ${incorrectSelections.length} incorrect selections.`);
    } else {
      setFeedbackMessage(`You didn't identify any objects correctly. ${totalMovedObjects} objects moved in this trial.`);
    }
    
    setPhase('feedback');
  };
  
  // Function to restart practice session
  const handlePracticeAgain = () => {
    // Reset state for a new practice session
    setSelectedCells([]);
    setFeedbackMessage('');
    setMovedPositions([]);
    
    // Start a new study phase
    startStudyPhase();
  };
  
  const handleStartTask = () => {
    navigate('/ecological-spatial/task');
  };
  
  // Add a function to calculate responsive dimensions for the practice grid
  const getResponsiveGridStyles = () => {
    // Get viewport dimensions
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Calculate maximum available width (accounting for padding/margins)
    const maxAvailableWidth = Math.min(viewportWidth - 40, 700);
    
    // Calculate cell size based on available width (5 cells + gaps)
    const cellSize = Math.floor((maxAvailableWidth - (4 * 15)) / 5);
    
    // Calculate image size (smaller than cell)
    const imageSize = Math.floor(cellSize * 0.7);
    
    return {
      gridStyles: {
        display: 'grid',
        gridTemplateColumns: `repeat(5, ${cellSize}px)`,
        gridTemplateRows: `${cellSize}px`,
        gap: '15px',
        margin: '0 auto 20px',
        padding: '15px',
        background: '#f7f7f7',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        width: 'fit-content'
      },
      cellSize,
      imageSize
    };
  };
  
  // Render function for the instructions phase
  const renderInstructions = () => {
  return (
        <div className="instructions-container">
          <div className="instructions-header">
          <h1>Ecological Spatial Memory Task - Practice</h1>
          </div>
          
          <div className="instructions-content">
            <div className="instructions-section">
            <h2>How it works</h2>
            <p>This task tests your ability to remember the positions of everyday objects.</p>
              
              <div className="instructions-steps">
                <div className="instruction-step">
                  <div className="step-number">1</div>
                <div className="step-text">You will see a row of 5 objects</div>
                </div>
                <div className="instruction-step">
                  <div className="step-number">2</div>
                <div className="step-text">Study the positions carefully (30 seconds)</div>
                </div>
                <div className="instruction-step">
                  <div className="step-number">3</div>
                <div className="step-text">Two objects will swap positions</div>
              </div>
              <div className="instruction-step">
                <div className="step-number">4</div>
                <div className="step-text">Your job is to identify which objects moved</div>
              </div>
            </div>
            
            <div className="instructions-note">
              <p><strong>Note:</strong> When objects swap positions, you need to identify BOTH objects involved in the swap.</p>
            </div>
            
            <div className="instructions-note">
              <p><strong>Scoring:</strong> You gain 1 point for each correctly identified moved object, but lose 1 point for each incorrect selection. Your score can be negative if you make more incorrect than correct selections.</p>
            </div>
            
            <div className="instructions-examples">
              <h3>Example:</h3>
              <div className="examples-container">
                <div className="example">
                  <div className="example-label">Original Order:</div>
                  <div className="example-shapes">
                    <div className="eco-image-container">
                      <img src={`${IMAGE_PATH}dog.jpg`} alt="Dog" className="eco-image" />
                    </div>
                    <div className="eco-image-container">
                      <img src={`${IMAGE_PATH}cat.jpg`} alt="Cat" className="eco-image" />
                    </div>
                    <div className="eco-image-container">
                      <img src={`${IMAGE_PATH}bird.jpg`} alt="Bird" className="eco-image" />
                    </div>
                    <div className="eco-image-container">
                      <img src={`${IMAGE_PATH}car.jpg`} alt="Car" className="eco-image" />
                    </div>
                    <div className="eco-image-container">
                      <img src={`${IMAGE_PATH}house.jpg`} alt="House" className="eco-image" />
                    </div>
                  </div>
                </div>
                
                <div className="example-arrow">→</div>
                
                <div className="example">
                  <div className="example-label">After Change:</div>
                  <div className="example-shapes">
                    <div className="eco-image-container">
                      <img src={`${IMAGE_PATH}dog.jpg`} alt="Dog" className="eco-image" />
                    </div>
                    <div className="eco-image-container">
                      <img src={`${IMAGE_PATH}bird.jpg`} alt="Bird" className="eco-image" />
                    </div>
                    <div className="eco-image-container">
                      <img src={`${IMAGE_PATH}cat.jpg`} alt="Cat" className="eco-image" />
                    </div>
                    <div className="eco-image-container">
                      <img src={`${IMAGE_PATH}car.jpg`} alt="Car" className="eco-image" />
                    </div>
                    <div className="eco-image-container">
                      <img src={`${IMAGE_PATH}house.jpg`} alt="House" className="eco-image" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="example-caption">
                <p>In this example, the cat and bird switched positions. You would need to click on BOTH objects.</p>
              </div>
            </div>
          </div>
          
          <div className="instructions-footer">
            <button onClick={() => startStudyPhase()} className="primary-button">
              Start Practice
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render function for the study phase
  const renderStudyPhase = () => {
    return (
      <div className="study-phase">
        <h2 className="phase-title" style={{ textAlign: 'center', fontSize: '1.4rem', margin: '10px 0' }}>Study Phase</h2>
        <p className="phase-instruction" style={{ textAlign: 'center', fontSize: '1.1rem', margin: '10px 0' }}>
          Memorize the positions of these objects
        </p>
        
        <div className="timer-display" style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2rem', margin: '15px 0', textAlign: 'center' }}>
          Time remaining: {timeRemaining}s
        </div>
          
          <div className="grid-container practice" style={getResponsiveGridStyles().gridStyles}>
            {Array(5).fill().map((_, i) => {
              const shape = shapes.find(s => s.position === i);
            const { imageSize } = getResponsiveGridStyles();
              
              return (
                <div key={i} className="grid-cell" style={{ 
                  background: 'white', 
                  padding: '5px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  width: '100%',
                  height: '100%',
                  aspectRatio: '1/1'
                }}>
                  {shape && (
                    <div 
                    className="eco-image-container"
                    style={{ 
                      width: `${imageSize}px`, 
                      height: `${imageSize}px`,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {showReadyButton && (
          <button 
            onClick={handleReadyClick} 
            className="ready-button"
            style={{ 
              fontSize: "1.1rem", 
              padding: "10px 20px",
              marginTop: "20px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "block",
              margin: "20px auto 0"
            }}
          >
            I'm Ready
          </button>
          )}
        </div>
    );
  };
  
  // Render function for the response phase
  const renderResponsePhase = () => {
    return (
      <div className="response-phase">
        <h2 className="phase-title">Response Phase</h2>
        <p className="response-instruction">Click on the objects that moved</p>
          
          <div className="grid-container practice" style={getResponsiveGridStyles().gridStyles}>
            {Array(5).fill().map((_, i) => {
              const shape = movedShapes.find(s => s.position === i);
              const isSelected = selectedCells.includes(i);
            const { imageSize } = getResponsiveGridStyles();
              
              return (
                <div 
                  key={i} 
                  className={`grid-cell clickable ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleCellClick(i)}
                  style={{ 
                    background: isSelected ? '#e3f2fd' : 'white',
                    border: isSelected ? '2px solid #2196F3' : '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    padding: '5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    width: '100%',
                    height: '100%',
                    aspectRatio: '1/1'
                  }}
                >
                  {shape && (
                    <div 
                    className="eco-image-container"
                    style={{ 
                      width: `${imageSize}px`, 
                      height: `${imageSize}px`,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="response-hint">
            <p>Remember: When objects swap positions, you need to click on BOTH objects involved in the swap.</p>
          </div>
          
          <button 
            onClick={handleSubmit} 
            className="spatial-button submit-button"
            disabled={selectedCells.length < 2}
            style={{ 
              fontSize: "1.1rem", 
              padding: "10px 20px",
              marginTop: "15px",
              backgroundColor: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Submit Answers
          </button>
      </div>
    );
  };
  
  // Render function for the feedback phase
  const renderFeedbackPhase = () => {
    return (
      <div className="feedback-phase">
        <h2 className="phase-title">Feedback</h2>
        <div className={`feedback-message ${
          feedbackMessage.includes('Perfect') ? 'correct' : 'incorrect'}`}>
          {feedbackMessage}
        </div>
          
          <div className="grid-container practice" style={getResponsiveGridStyles().gridStyles}>
            {Array(5).fill().map((_, i) => {
              const shape = movedShapes.find(s => s.position === i);
              const didMove = movedPositions.includes(i);
            const { imageSize } = getResponsiveGridStyles();
              
              return (
                <div 
                  key={i} 
                  className={`grid-cell ${didMove ? 'moved' : ''}`}
                  style={{ 
                    background: didMove ? '#e3f2fd' : 'white',
                    border: didMove ? '2px solid #2196F3' : '1px solid #ddd',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    padding: '5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    width: '100%',
                    height: '100%',
                    aspectRatio: '1/1'
                  }}
                >
                  {shape && (
                    <div 
                    className="eco-image-container"
                    style={{ 
                      width: `${imageSize}px`, 
                      height: `${imageSize}px`,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="feedback-explanation">
            <p>The highlighted objects are the ones that swapped positions.</p>
            {movedPositions.length === 2 && (
              <p>
                The objects at positions {movedPositions.map(pos => pos + 1).join(' and ')} swapped positions.
              </p>
            )}
          </div>
          
        <div className="button-container" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={handlePracticeAgain} 
            className="spatial-button"
            style={{ 
              fontSize: "1.1rem", 
              padding: "10px 20px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Practice Again
          </button>
          <button 
            onClick={handleStartTask} 
            className="spatial-button ready-button"
            style={{ 
              fontSize: "1.1rem", 
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Start Main Task
          </button>
        </div>
        </div>
    );
  };

  return (
    <div className="spatial-memory-container">
      {!imagesLoaded ? (
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
      ) : phase === 'instructions' ? (
        renderInstructions()
      ) : phase === 'study' ? (
        renderStudyPhase()
      ) : phase === 'response' ? (
        renderResponsePhase()
      ) : (
        renderFeedbackPhase()
      )}
    </div>
  );
};

export default EcologicalSpatialPractice; 
