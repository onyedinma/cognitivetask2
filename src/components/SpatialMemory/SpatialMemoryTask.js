import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SpatialMemory.css';

/**
 * SpatialMemoryTask component
 * Entry point for the Spatial Working Memory task
 */
const SpatialMemoryTask = () => {
  const navigate = useNavigate();
  const [animationStep, setAnimationStep] = useState(0);
  const [showOriginal, setShowOriginal] = useState(true);
  const [currentSwap, setCurrentSwap] = useState(0);

  // Example shapes for animation
  const originalShapes = [
    { id: 1, type: 'circle', color: 'blue', position: 0 },
    { id: 2, type: 'square', color: 'red', position: 1 },
    { id: 3, type: 'triangle', color: 'green', position: 2 }
  ];

  // Different swap configurations
  const swaps = [
    // Swap 1: circle and square
    [
      { id: 1, type: 'circle', color: 'blue', position: 1 },
      { id: 2, type: 'square', color: 'red', position: 0 },
      { id: 3, type: 'triangle', color: 'green', position: 2 }
    ],
    // Swap 2: circle and triangle
    [
      { id: 1, type: 'circle', color: 'blue', position: 2 },
      { id: 2, type: 'square', color: 'red', position: 1 },
      { id: 3, type: 'triangle', color: 'green', position: 0 }
    ],
    // Swap 3: square and triangle
    [
      { id: 1, type: 'circle', color: 'blue', position: 0 },
      { id: 2, type: 'square', color: 'red', position: 2 },
      { id: 3, type: 'triangle', color: 'green', position: 1 }
    ]
  ];

  // Get current moved shapes based on current swap
  const getMovedShapes = () => {
    return swaps[currentSwap];
  };

  // Autoplay the animation
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Step 1: Show original grid
      setShowOriginal(true);
      
      // Step 2: After 2.5 seconds, show moved shapes
      setTimeout(() => {
        setShowOriginal(false);
      }, 2500);
      
      // Step 3: After another 2.5 seconds, highlight the moved shapes
      setTimeout(() => {
        setAnimationStep(3);
        
        // Step 4: Reset after 2.5 more seconds and change to next swap
        setTimeout(() => {
          setAnimationStep(0);
          setShowOriginal(true);
          setCurrentSwap((currentSwap + 1) % swaps.length);
        }, 2500);
      }, 5000);
      
    }, 8000); // Full animation cycle takes 8 seconds
    
    return () => clearInterval(intervalId);
  }, [currentSwap]);

  const startPractice = () => {
    navigate('/spatial-memory/practice');
  };

  // Render a shape based on type and color
  const renderShape = (shape) => {
    return (
      <div 
        key={shape.id}
        className={`grid-shape shape-${shape.type} shape-${shape.color}`}
      />
    );
  };

  // Determine if a shape has moved
  const hasMoved = (shape) => {
    const original = originalShapes.find(s => s.id === shape.id);
    return original.position !== shape.position;
  };

  // Get description of the current swap
  const getSwapDescription = () => {
    switch(currentSwap) {
      case 0:
        return "In this example, the blue circle and red square have swapped positions.";
      case 1:
        return "In this example, the blue circle and green triangle have swapped positions.";
      case 2:
        return "In this example, the red square and green triangle have swapped positions.";
      default:
        return "Watch carefully as positions change...";
    }
  };

  return (
    <div className="spatial-screen">
      <h1>Spatial Working Memory Task</h1>
      
      <div className="task-description">
        <p>This task measures your ability to remember the positions of objects in space.</p>
        
        <h2>How it works:</h2>
        <ol className="instruction-list">
          <li>You will be shown a grid containing various colored shapes</li>
          <li>Study the positions of these shapes carefully</li>
          <li>After some time, a second grid will appear where some shapes have moved positions</li>
          <li>Your task is to identify which shapes have changed position by clicking on them</li>
        </ol>
        
        <div className="animated-example">
          <h3>Example:</h3>
          <p className="example-label">
            {showOriginal ? 
              "Study the original positions:" : 
              animationStep === 3 ? 
                "Identify the shapes that moved (highlighted):" : 
                "Notice the new positions:"}
          </p>
          
          <div className="example-grid-container">
            <div className="example-grid">
              {(showOriginal ? originalShapes : getMovedShapes()).map((shape) => (
                <div 
                  key={shape.id} 
                  className={`example-cell ${!showOriginal && animationStep === 3 && hasMoved(shape) ? 'selected' : ''}`}
                  style={{ order: shape.position }}
                >
                  {renderShape(shape)}
                </div>
              ))}
            </div>
          </div>
          
          <p className="example-caption">
            {animationStep === 3 ? 
              getSwapDescription() : 
              "Watch carefully as positions change..."}
          </p>
        </div>
        
        <div className="task-note">
          <p><strong>Important:</strong></p>
          <ul className="instruction-list">
            <li>The same shapes appear in both grids - only their positions change</li>
            <li>When shapes swap positions, you need to identify BOTH shapes involved</li>
            <li>You gain one point for each correctly identified moved shape</li>
            <li>You lose one point for each incorrectly identified shape</li>
          </ul>
        </div>
        
        <p>We'll start with a practice session using a small grid before moving to the main task.</p>
      </div>
      
      <div className="navigation-buttons">
        <Link to="/" className="spatial-button">Back to Tasks</Link>
        <button onClick={startPractice} className="spatial-button ready-button">Start Practice</button>
      </div>
    </div>
  );
};

export default SpatialMemoryTask; 