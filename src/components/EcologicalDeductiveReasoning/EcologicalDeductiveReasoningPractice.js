import React, { useState, useEffect } from 'react';
import './EcologicalDeductiveReasoning.css';

const IMAGE_PATH = '/images/deductimages/';

// Practice puzzles
const puzzles = [
  {
    question: "If a fruit is red on the outside, then it must be sweet.",
    cards: [
      {
        id: 1,
        type: 'p',
        front: 'Red Apple',
        back: 'Sweet',
        frontImage: `${IMAGE_PATH}red_apple.jpg`,
        backText: 'This fruit is sweet'
      },
      {
        id: 2,
        type: 'not-p',
        front: 'Green Apple',
        back: 'Sour',
        frontImage: `${IMAGE_PATH}green_apple.jpg`,
        backText: 'This fruit is sour'
      },
      {
        id: 3,
        type: 'q',
        front: 'Sweet Fruit',
        back: 'Yellow Banana',
        frontImage: `${IMAGE_PATH}banana.jpg`,
        backText: 'This fruit is yellow'
      },
      {
        id: 4,
        type: 'not-q',
        front: 'Sour Fruit',
        back: 'Red Grapefruit',
        frontImage: `${IMAGE_PATH}grapefruit.jpg`,
        backText: 'This fruit is red'
      }
    ],
    correctAnswer: [1, 4],
    explanation: "You need to check if all red fruits are sweet (P implies Q), so you need to check the 'Red Apple' card (P) to see if it's sweet. You also need to check the 'Sour Fruit' card (not-Q) to make sure it's not red on the outside."
  }
];

const EcologicalDeductiveReasoningPractice = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Preload all puzzle images
  useEffect(() => {
    const imageUrls = [];
    
    // Collect all image URLs
    puzzles.forEach(puzzle => {
      puzzle.cards.forEach(card => {
        if (card.frontImage) {
          imageUrls.push(card.frontImage);
        }
      });
    });
    
    let loadedCount = 0;
    const totalImages = imageUrls.length;
    
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
        await Promise.all(imageUrls.map(src => preloadImage(src)));
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesLoaded(true); // Continue anyway
      }
    };

    loadAllImages();
  }, []);

  const toggleCardSelection = (cardId) => {
    if (!showFeedback) {
      setSelectedCards(prevSelected => {
        if (prevSelected.includes(cardId)) {
          return prevSelected.filter(id => id !== cardId);
        } else {
          return [...prevSelected, cardId];
        }
      });
    }
  };

  const checkAnswer = () => {
    const puzzle = puzzles[0]; // Only one practice puzzle
    const correctAnswerIds = puzzle.correctAnswer;
    
    // Check if selected cards match the correct answer (same length and same elements)
    const isCorrectAnswer = 
      selectedCards.length === correctAnswerIds.length && 
      correctAnswerIds.every(id => selectedCards.includes(id));
    
    setIsCorrect(isCorrectAnswer);
    setShowFeedback(true);
  };

  const handleContinue = () => {
    if (!showExplanation) {
      setShowExplanation(true);
    } else {
      // Navigate to main task
      window.location.href = '/ecological-deductive/task';
    }
  };

  const handleTryAgain = () => {
    setSelectedCards([]);
    setShowFeedback(false);
    setShowExplanation(false);
  };

  // Show loading screen if images are not loaded
  if (!imagesLoaded) {
    return (
      <div className="task-screen">
        <div className="loading-container">
          <h2>Loading Task...</h2>
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

  const puzzle = puzzles[0]; // Only one practice puzzle

  return (
    <div className="deductive-reasoning-container">
      <h1>Practice: Ecological Deductive Reasoning</h1>
      
      <div className="puzzle-question">
        <p>{puzzle.question}</p>
        {selectedCards.length > 0 && (
          <p className="selected-count">
            You have selected {selectedCards.length} card{selectedCards.length !== 1 ? 's' : ''}.
          </p>
        )}
      </div>
      
      <div className="cards-container">
        {puzzle.cards.map((card) => (
          <div 
            key={card.id}
            className={`card ${selectedCards.includes(card.id) ? 'selected' : ''}`}
            onClick={() => toggleCardSelection(card.id)}
          >
            <div className="card-front">
              <img src={card.frontImage} alt={card.front} className="card-image" />
              <div className="card-label">{card.front}</div>
            </div>
          </div>
        ))}
      </div>
      
      {!showFeedback ? (
        <button 
          className="submit-button"
          onClick={checkAnswer}
          disabled={selectedCards.length === 0}
        >
          Submit Answer
        </button>
      ) : (
        <div className="feedback-container">
          <h2 className={isCorrect ? 'correct-feedback' : 'incorrect-feedback'}>
            {isCorrect ? 'Correct!' : 'Not quite right.'}
          </h2>
          
          {showExplanation ? (
            <>
              <p className="explanation">{puzzle.explanation}</p>
              <button className="continue-button" onClick={handleContinue}>
                Continue to Main Task
              </button>
            </>
          ) : (
            <>
              {isCorrect ? (
                <button className="continue-button" onClick={handleContinue}>
                  See Explanation
                </button>
              ) : (
                <button className="try-again-button" onClick={handleTryAgain}>
                  Try Again
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EcologicalDeductiveReasoningPractice; 