import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CountingGame.css';

// Import images - update paths to use public folder
const dollarBillImage = '/counting/5dollar.jpg';
const busImage = '/counting/bus.jpg';
const faceImage = '/counting/face.jpg';

/**
 * CountingGameInstructions component
 * Shows examples of the objects and explains the task
 */
const CountingGameInstructions = () => {
  const navigate = useNavigate();
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [billCount, setBillCount] = useState(0);
  const [busCount, setBusCount] = useState(0);
  const [faceCount, setFaceCount] = useState(0);

  // Example sequence of objects to show
  const exampleSequence = [
    'face',
    'bill',
    'bus',
    'bus',
    'bill',
    'bus'
  ];

  // Object image mapping
  const objectImages = {
    bill: dollarBillImage,
    bus: busImage,
    face: faceImage
  };

  // Animate through the example sequence
  useEffect(() => {
    if (currentObjectIndex < exampleSequence.length) {
      const timer = setTimeout(() => {
        // Update the appropriate counter
        const object = exampleSequence[currentObjectIndex];
        if (object === 'bill') setBillCount(prev => prev + 1);
        if (object === 'bus') setBusCount(prev => prev + 1);
        if (object === 'face') setFaceCount(prev => prev + 1);
        
        // Move to the next object
        setCurrentObjectIndex(prev => prev + 1);
      }, 1200);
      
      return () => clearTimeout(timer);
    } else if (currentObjectIndex === exampleSequence.length) {
      // Animation complete
      setAnimationComplete(true);
    }
  }, [currentObjectIndex]);

  const startPractice = () => {
    navigate('/counting-game/practice');
  };

  const restartAnimation = () => {
    setCurrentObjectIndex(0);
    setBillCount(0);
    setBusCount(0);
    setFaceCount(0);
    setAnimationComplete(false);
  };

  return (
    <div className="task-screen">
      <h1>Counting Game Instructions</h1>

      <div className="task-description">
        <div className="instruction-card">
          <h2>Task Overview</h2>
          <p>In this task, you will see a series of objects ($5 bills, UTA buses, and faces) presented one at a time.</p>
          <p>Your job is to <strong>keep count of how many of each object type</strong> you see in the sequence.</p>
        </div>
        
        <div className="instruction-card">
          <h2>Interactive Example</h2>
          <p>Below is an example sequence. Watch as objects appear one by one:</p>
          
          <div className="example-animation">
            {!animationComplete ? (
              <div className="animated-object-container">
                {currentObjectIndex > 0 && currentObjectIndex <= exampleSequence.length && (
                  <div 
                    className={`animated-object ${exampleSequence[currentObjectIndex-1]}`}
                    style={{ 
                      backgroundImage: 
                        `url(${objectImages[exampleSequence[currentObjectIndex-1]]})` 
                    }}
                  ></div>
                )}
                <div className="animation-progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${(currentObjectIndex / exampleSequence.length) * 100}%` }}
                  ></div>
                </div>
                <div className="current-counts">
                  <span>$5 Bills: {billCount}</span>
                  <span>UTA Buses: {busCount}</span>
                  <span>Faces: {faceCount}</span>
                </div>
              </div>
            ) : (
              <div className="example-complete">
                <div className="example-objects">
                  {exampleSequence.map((object, index) => (
                    <div 
                      key={index} 
                      className={`example-object ${object}`}
                      style={{ backgroundImage: `url(${objectImages[object]})` }}
                    ></div>
                  ))}
                </div>
                <button onClick={restartAnimation} className="replay-button">
                  Replay Animation
                </button>
              </div>
            )}
          </div>
          
          <div className="example-counts">
            <p><strong>$5 Bills: <span className="important">{animationComplete ? "2" : billCount}</span></strong></p>
            <p><strong>UTA Buses: <span className="important">{animationComplete ? "3" : busCount}</span></strong></p>
            <p><strong>Faces: <span className="important">{animationComplete ? "1" : faceCount}</span></strong></p>
          </div>
        </div>
        
        <div className="instruction-card">
          <h2>Important Rules</h2>
          <ul className="instruction-list">
            <li>Objects will appear one at a time</li>
            <li>Keep a mental count of each object type</li>
            <li>When the sequence ends, you'll be asked to report your counts</li>
            <li>Do NOT use your fingers or pen and paper to help counting</li>
            <li>Focus and pay attention to each object as it appears</li>
          </ul>
        </div>
        
        <div className="instruction-card">
          <h2>Levels Information</h2>
          <p>The task consists of 5 levels with an increasing number of objects:</p>
          <ul className="instruction-list">
            <li>Level 1: 4 objects</li>
            <li>Level 2: 6 objects</li>
            <li>Level 3: 8 objects</li>
            <li>Level 4: 10 objects</li>
            <li>Level 5: 12 objects</li>
          </ul>
          <p>You will practice with 6 objects (Level 2) before starting the main task.</p>
        </div>
      </div>
      
      <div className="navigation-buttons">
        <Link to="/counting-game" className="back-button">Go Back</Link>
        <button onClick={startPractice} className="start-button">Start Practice</button>
      </div>
    </div>
  );
};

export default CountingGameInstructions; 