import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeductiveReasoning.css';

/**
 * DeductiveReasoningPractice component
 * Practice component for the deductive reasoning task (Wason Selection Task)
 */
const DeductiveReasoningPractice = () => {
  const navigate = useNavigate();
  
  // Define practice puzzle (Wason Selection Task)
  const practicePuzzle = {
    question: "If a card shows a king on one side, then it has a heart symbol on the other side.",
    cards: [
      { front: "King", back: "Heart", type: "text", cardType: "text-card" },
      { front: "Queen", back: "Spade", type: "text", cardType: "text-card" },
      { front: "Heart", back: "Jack", type: "text", cardType: "text-card" },
      { front: "Diamond", back: "King", type: "text", cardType: "text-card" }
    ],
    correctCards: [0, 3],  // "King" and "Diamond"
    explanation: "You need to check the 'King' card (to see if it has a heart on the other side) and the 'Diamond' card (to make sure it doesn't have a king on the other side, which would break the rule)."
  };

  // Component state
  const [selectedCards, setSelectedCards] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Toggle card selection
  const toggleCardSelection = (cardIndex) => {
    setSelectedCards(prevSelected => {
      if (prevSelected.includes(cardIndex)) {
        return prevSelected.filter(index => index !== cardIndex);
      } else {
        if (prevSelected.length < 2) {
          return [...prevSelected, cardIndex];
        }
        return prevSelected;
      }
    });
  };

  // Check if the selected cards are correct
  const checkAnswer = () => {
    if (selectedCards.length !== 2) return;
    
    const sortedSelected = [...selectedCards].sort();
    const sortedCorrect = [...practicePuzzle.correctCards].sort();
    
    const isAnswerCorrect = 
      sortedSelected[0] === sortedCorrect[0] && 
      sortedSelected[1] === sortedCorrect[1];
    
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
  };

  // Handle continue to home page
  const handleContinue = () => {
    // Navigate to the DeductiveReasoningMainTask component
    navigate('/deductive-reasoning/task');
  };

  // Handle try again
  const handleTryAgain = () => {
    setSelectedCards([]);
    setShowFeedback(false);
  };

  // Render practice component or feedback
  if (showFeedback) {
    return (
      <div className="deductive-screen">
        <div className="deductive-content">
          <div className="deductive-feedback">
            <div className={`feedback-result ${isCorrect ? 'correct-answer' : 'incorrect-answer'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect!'}
            </div>
            
            <div className="feedback-explanation">
              {isCorrect ? (
                <p>
                  You correctly identified that we need to check the King card and the Diamond card.
                </p>
              ) : (
                <p>
                  We need to check the King card (to verify it has a heart on the back) and the Diamond card (to verify it doesn't have a king on the back).
                </p>
              )}
              
              <p>
                The rule states: "If a card shows a king on one side, then it has a heart symbol on the other side."
              </p>
              
              <p>
                <strong>For the King card:</strong> We need to check if it has a heart on the back, as required by the rule.
              </p>
              
              <p>
                <strong>For the Diamond card:</strong> We need to check if it has a king on the back, which would break the rule (as kings must have hearts, not diamonds, on the back).
              </p>
              
              <p>
                <strong>We don't need to check the Queen card:</strong> The rule only applies to kings, so a queen can have any symbol on its back.
              </p>
              
              <p>
                <strong>We don't need to check the Heart card:</strong> The rule doesn't say that hearts must have kings on the back, only that kings must have hearts on the back.
              </p>
            </div>
            
            <div className="deductive-navigation">
              <button 
                className="deductive-button deductive-continue-button" 
                onClick={handleContinue}
              >
                Complete Task
              </button>
              
              {!isCorrect && (
                <button 
                  className="deductive-button" 
                  onClick={handleTryAgain}
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="deductive-screen">
      <div className="deductive-content">
        <div className="deductive-header">
          <h2>Practice Round</h2>
          <div className="deductive-question">
            {practicePuzzle.question}
          </div>
        </div>
        
        <div className="deductive-selected-count">
          Selected cards: {selectedCards.length}/2
        </div>
        
        <div className="horizontal-container">
          <div className="playing-cards-row">
            {/* King of Spades */}
            <div 
              className={`playing-card symbol-card ${selectedCards.includes(0) ? 'selected' : ''}`}
              onClick={() => toggleCardSelection(0)}
            >
              <div className="card-corner top-left">
                <span className="card-value">K</span>
                <span className="card-suit">♠</span>
              </div>
              <div className="card-face">K</div>
              <div className="card-corner bottom-right">
                <span className="card-value">K</span>
                <span className="card-suit">♠</span>
              </div>
            </div>
            
            {/* Queen of Diamonds */}
            <div 
              className={`playing-card symbol-card ${selectedCards.includes(1) ? 'selected' : ''}`}
              onClick={() => toggleCardSelection(1)}
            >
              <div className="card-corner top-left">
                <span className="card-value">Q</span>
                <span className="card-suit">♦</span>
              </div>
              <div className="card-face">Q</div>
              <div className="card-corner bottom-right">
                <span className="card-value">Q</span>
                <span className="card-suit">♦</span>
              </div>
            </div>
            
            {/* Heart Symbol */}
            <div 
              className={`playing-card heart-card ${selectedCards.includes(2) ? 'selected' : ''}`}
              onClick={() => toggleCardSelection(2)}
            >
              <div className="card-symbol heart-symbol">♥</div>
            </div>
            
            {/* Diamond Symbol */}
            <div 
              className={`playing-card heart-card ${selectedCards.includes(3) ? 'selected' : ''}`}
              onClick={() => toggleCardSelection(3)}
            >
              <div className="card-symbol" style={{ color: '#F44336', fontSize: '4rem' }}>♦</div>
            </div>
          </div>
        </div>
        
        <div className="card-labels-row">
          <div className="card-label-container">King</div>
          <div className="card-label-container">Queen</div>
          <div className="card-label-container">Heart</div>
          <div className="card-label-container">Diamond</div>
        </div>
        
        <button 
          className="deductive-button" 
          onClick={checkAnswer}
          disabled={selectedCards.length !== 2}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default DeductiveReasoningPractice; 