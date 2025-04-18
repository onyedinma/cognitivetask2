import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EcologicalDeductiveReasoning.css';

const IMAGE_PATH = '/deducimages/';

// Practice puzzles
const puzzles = [
  {
    question: "If Amy treats sick children in the hospital, then she must be a doctor.",
    cards: [
      {
        id: 1,
        type: 'image',
        frontText: "Treats children",
        frontImage: `${IMAGE_PATH}doctor-patient.jpg`,
        backText: "Treats children in hospital",
        selected: false
      },
      {
        id: 2,
        type: 'image',
        frontText: "Teaching",
        frontImage: `${IMAGE_PATH}teacher.jpg`,
        backText: "Teaching in classroom",
        selected: false
      },
      {
        id: 3,
        type: 'text',
        frontText: "Doctor",
        backText: "Doctor",
        selected: false
      },
      {
        id: 4,
        type: 'text',
        frontText: "Teacher",
        backText: "Teacher",
        selected: false
      }
    ],
    correctAnswer: [1, 4],
    explanation: "To test the rule 'If Amy treats sick children in the hospital, then she must be a doctor', we need to find cases that could potentially violate this rule. The rule is in the form 'If P, then Q', where P is 'treats sick children in hospital' and Q is 'is a doctor'. The rule is violated when P is true but Q is false. So we need to check cases where someone treats children in a hospital (Card 1) and cases where someone is not a doctor (Card 4 - Teacher). We don't need to check Card 2 (Teaching) or Card 3 (Doctor) because they don't directly test the rule - even if they were flipped, they couldn't violate the 'If P, then Q' statement."
  }
];

const EcologicalDeductiveReasoningPractice = () => {
  const navigate = useNavigate();
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
      // Navigate directly to main task using React Router
      navigate('/ecological-deductive/task');
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
      <div className="eco-deductive-screen">
        <div className="eco-loading-container">
          <h2>Loading Task...</h2>
          <div className="eco-loading-bar">
            <div 
              className="eco-loading-progress" 
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
    <div className="eco-deductive-screen">
      <div className="eco-deductive-content">
        <div className="eco-deductive-header">
          <h1>Practice: Ecological Deductive Reasoning</h1>
          
          <div className="eco-deductive-question">
            <p>{puzzle.question}</p>
          </div>
          {selectedCards.length > 0 && (
            <p className="eco-selected-count">
              Selected cards: {selectedCards.length}/2
            </p>
          )}
        </div>
        
        <div className="eco-cards-container">
          {puzzle.cards.map((card) => (
            <div 
              key={card.id}
              className={`eco-deductive-card ${selectedCards.includes(card.id) ? 'selected' : ''}`}
              onClick={() => toggleCardSelection(card.id)}
            >
              <div className="eco-card-content">
                {card.type === 'image' ? (
                  <div className="eco-card-img-container">
                    <img 
                      src={card.frontImage} 
                      alt={card.frontText} 
                      className="eco-card-image"
                    />
                    <div className="eco-card-svg-label">{card.frontText}</div>
                  </div>
                ) : (
                  <span className="eco-card-text">{card.frontText}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {!showFeedback ? (
          <button 
            className="eco-deductive-button eco-submit-button"
            onClick={checkAnswer}
            disabled={selectedCards.length !== 2}
          >
            Submit Answer
          </button>
        ) : (
          <div className="eco-deductive-feedback">
            <div className={`eco-feedback-result ${isCorrect ? 'eco-correct-answer' : 'eco-incorrect-answer'}`}>
              {isCorrect ? 'Correct!' : 'Not quite right.'}
            </div>
            
            {showExplanation ? (
              <>
                <div className="eco-feedback-explanation">{puzzle.explanation}</div>
                <button className="eco-deductive-button eco-continue-button" onClick={handleContinue}>
                  Continue to Main Task
                </button>
              </>
            ) : (
              <>
                {isCorrect ? (
                  <button className="eco-deductive-button eco-continue-button" onClick={handleContinue}>
                    See Explanation
                  </button>
                ) : (
                  <button className="eco-deductive-button" onClick={handleTryAgain}>
                    Try Again
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EcologicalDeductiveReasoningPractice; 