import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EcologicalSpatial.css';

// Define constant for image path
const IMAGE_PATH = '/ecoimages/';

/**
 * EcologicalSpatialTask component
 * Entry point for the Ecological Spatial Working Memory task
 */
const EcologicalSpatialTask = () => {
  const navigate = useNavigate();
  const [animationStep, setAnimationStep] = useState(0);
  const [showOriginal, setShowOriginal] = useState(true);
  const [currentSwap, setCurrentSwap] = useState(0);

  // Example images for animation
  const originalImages = [
    { id: 1, src: `${IMAGE_PATH}dog.jpg`, position: 0 },
    { id: 2, src: `${IMAGE_PATH}car.jpg`, position: 1 },
    { id: 3, src: `${IMAGE_PATH}chair.jpg`, position: 2 }
  ];

  // Different swap configurations
  const swaps = [
    // Swap 1: dog and car
    [
      { id: 1, src: `${IMAGE_PATH}dog.jpg`, position: 1 },
      { id: 2, src: `${IMAGE_PATH}car.jpg`, position: 0 },
      { id: 3, src: `${IMAGE_PATH}chair.jpg`, position: 2 }
    ],
    // Swap 2: dog and chair
    [
      { id: 1, src: `${IMAGE_PATH}dog.jpg`, position: 2 },
      { id: 2, src: `${IMAGE_PATH}car.jpg`, position: 1 },
      { id: 3, src: `${IMAGE_PATH}chair.jpg`, position: 0 }
    ],
    // Swap 3: car and chair
    [
      { id: 1, src: `${IMAGE_PATH}dog.jpg`, position: 0 },
      { id: 2, src: `${IMAGE_PATH}car.jpg`, position: 2 },
      { id: 3, src: `${IMAGE_PATH}chair.jpg`, position: 1 }
    ]
  ];

  // Get current moved images based on current swap
  const getMovedImages = () => {
    return swaps[currentSwap];
  };

  // Autoplay the animation
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Step 1: Show original grid
      setShowOriginal(true);
      
      // Step 2: After 2.5 seconds, show moved images
      setTimeout(() => {
        setShowOriginal(false);
      }, 2500);
      
      // Step 3: After another 2.5 seconds, highlight the moved images
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
    navigate('/ecological-spatial/practice');
  };

  // Determine if an image has moved
  const hasMoved = (image) => {
    const original = originalImages.find(i => i.id === image.id);
    return original.position !== image.position;
  };

  // Get description of the current swap
  const getSwapDescription = () => {
    switch(currentSwap) {
      case 0:
        return "In this example, the dog and car have swapped positions.";
      case 1:
        return "In this example, the dog and chair have swapped positions.";
      case 2:
        return "In this example, the car and chair have swapped positions.";
      default:
        return "Watch carefully as positions change...";
    }
  };

  return (
    <div className="spatial-screen">
      <h1>Ecological Spatial Working Memory Task</h1>
      
      <div className="task-description">
        <p>This task measures your ability to remember the positions of real-world objects in space.</p>
        
        <h2>How it works:</h2>
        <ol className="instruction-list">
          <li>You will be shown a grid containing various everyday objects</li>
          <li>Study the positions of these objects carefully</li>
          <li>After some time, a second grid will appear where some objects have moved positions</li>
          <li>Your task is to identify which objects have changed position by clicking on them</li>
        </ol>
        
        <div className="animated-example">
          <h3>Example:</h3>
          <p className="example-label">
            {showOriginal ? 
              "Study the original positions:" : 
              animationStep === 3 ? 
                "Identify the objects that moved (highlighted):" : 
                "Notice the new positions:"}
          </p>
          
          <div className="example-grid-container">
            <div className="example-grid">
              {(showOriginal ? originalImages : getMovedImages()).map((image) => (
                <div 
                  key={image.id} 
                  className={`example-cell ${!showOriginal && animationStep === 3 && hasMoved(image) ? 'selected' : ''}`}
                  style={{ order: image.position }}
                >
                  <div className="eco-image-container">
                    <img 
                      src={image.src} 
                      alt={`Object ${image.id}`} 
                      className="eco-image"
                    />
                  </div>
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
            <li>The same objects appear in both grids - only their positions change</li>
            <li>When objects swap positions, you need to identify BOTH objects involved</li>
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

export default EcologicalSpatialTask; 