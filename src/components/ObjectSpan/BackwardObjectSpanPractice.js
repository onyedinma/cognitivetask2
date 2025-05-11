import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ObjectSpan.css';

const BackwardObjectSpanPractice = () => {
  const navigate = useNavigate();
  const [currentPracticeStep, setCurrentPracticeStep] = useState(0);
  const [showingObjects, setShowingObjects] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Preload all practice images
  useEffect(() => {
    const allImages = [
      '/images/Bread.png',
      '/images/Car.png', 
      '/images/Books.png',
      '/images/Bag.png',
      '/images/Chair.png',
      '/images/Computer.png',
      '/images/Money.png',
      '/images/Pot.png',
      '/images/Shoes.png'
    ];
    
    let loadedCount = 0;
    const totalImages = allImages.length;
    
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
        await Promise.all(allImages.map(src => preloadImage(src)));
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesLoaded(true); // Continue anyway
      }
    };

    loadAllImages();
  }, []);

  const practiceTrials = [
    {
      objects: ['Bread', 'Car'],
      correctAnswer: 'car bread',
    },
    {
      objects: ['Books', 'Bag', 'Chair'],
      correctAnswer: 'chair bag books',
    },
    {
      objects: ['Computer', 'Money', 'Pot', 'Shoes'],
      correctAnswer: 'shoes pot money computer',
    },
  ];

  useEffect(() => {
    if (imagesLoaded && showingObjects && currentPracticeStep < practiceTrials.length) {
      const objects = practiceTrials[currentPracticeStep].objects;
      
      if (currentObjectIndex < objects.length) {
        const timer = setTimeout(() => {
          setCurrentObjectIndex(currentObjectIndex + 1);
        }, 2000); // Show each object for 2 seconds
        
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setShowingObjects(false);
        }, 1000); // Wait a second after showing all objects before prompting for recall
        
        return () => clearTimeout(timer);
      }
    }
  }, [currentObjectIndex, currentPracticeStep, showingObjects, imagesLoaded]);

  const checkAnswer = () => {
    const currentTrial = practiceTrials[currentPracticeStep];
    const userInputCleaned = userInput.trim().toLowerCase();
    
    if (userInputCleaned === currentTrial.correctAnswer) {
      setFeedback('Correct! The objects in reverse order were: ' + currentTrial.correctAnswer);
    } else {
      setFeedback('Not quite right. The objects in reverse order were: ' + currentTrial.correctAnswer);
    }
  };

  const moveToNextTrial = () => {
    if (currentPracticeStep < practiceTrials.length - 1) {
      setCurrentPracticeStep(currentPracticeStep + 1);
      setShowingObjects(true);
      setCurrentObjectIndex(0);
      setUserInput('');
      setFeedback('');
    } else {
      // All practice trials completed
      navigate('/object-span/backward/main');
    }
  };

  const getCurrentObject = () => {
    if (currentPracticeStep < practiceTrials.length && currentObjectIndex < practiceTrials[currentPracticeStep].objects.length) {
      return practiceTrials[currentPracticeStep].objects[currentObjectIndex];
    }
    return null;
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Show loading screen if images are not loaded
  if (!imagesLoaded) {
    return (
      <div className="task-screen">
        <div className="loading-container">
          <h2>Loading Images...</h2>
          <div className="loading-bar">
            <div 
              className="loading-progress" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p>{loadingProgress}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-screen">
      <h1>Backward Object Span Practice</h1>
      
      {showingObjects ? (
        <div className="object-display">
          {getCurrentObject() && (
            <div className="current-object">
              <img 
                src={`/images/${getCurrentObject()}.png`} 
                alt={getCurrentObject()} 
                className="object-image"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="recall-section">
          <p>Now, type the objects you saw in <strong>REVERSE ORDER</strong> (last to first)</p>
          <p>Separate each object with a space. For example: "shoes pot money"</p>
          
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="recall-input"
            placeholder="Type objects in reverse order..."
          />
          
          {!feedback ? (
            <button onClick={checkAnswer} className="check-button">
              Check Answer
            </button>
          ) : (
            <>
              <div className="feedback-message">{feedback}</div>
              <button onClick={moveToNextTrial} className="next-button">
                {currentPracticeStep < practiceTrials.length - 1 ? 'Next Practice Trial' : 'Start Main Task'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BackwardObjectSpanPractice; 