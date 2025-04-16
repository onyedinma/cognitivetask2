import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EcologicalDeductiveReasoning.css';

const EcologicalDeductiveReasoningPractice = () => {
  const navigate = useNavigate();
  
  // Define constants for paths to images
  const IMAGE_PATH = 'src/components/EcologicalDeductiveReasoning/deducimages/';

  // Define the practice puzzles
  const practicePuzzles = [
    {
      question: "If a person is drinking beer, then they must be over 21 years old.",
      cards: [
        { front: "16", back: "16", type: "text" },
        { front: "beer", back: "beer", type: "drink", image: 'src/components/EcologicalDeductiveReasoning/deducimages/beer.jpg' },
        { front: "25", back: "25", type: "text" },
        { front: "juice", back: "juice", type: "drink", image: 'src/components/EcologicalDeductiveReasoning/deducimages/juice.jpg' }
      ],
      correctCards: [0, 1],  // 16 and beer
      explanation: "Correct answer: 16 and beer. You need to check the 16 card (to verify this person is not drinking alcohol) and the beer card (to verify the person drinking it is at least 21)."
    },
    {
      question: "If an animal has feathers, then it must be a bird.",
      cards: [
        { front: "Has feathers", back: "Has feathers", type: "image", image: 'src/components/EcologicalDeductiveReasoning/deducimages/feathers.jpg' },
        { front: "No feathers", back: "No feathers", type: "image", image: 'src/components/EcologicalDeductiveReasoning/deducimages/dog.jpg' },
        { front: "Bird", back: "Bird", type: "text" },
        { front: "Dog", back: "Dog", type: "text" }
      ],
      correctCards: [0, 3],  // Has feathers and Dog
      explanation: "Correct answer: 'Has feathers' and Dog. You need to check if an animal with feathers is a bird and if a dog might also have feathers."
    }
  ];

  // Component state
  const [selectedCards, setSelectedCards] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [practiceResult, setPracticeResult] = useState({ isCorrect: false, message: '', explanation: '' });

  // Toggle card selection
  const toggleCardSelection = (cardIndex) => {
    setSelectedCards(prevSelected => {
      const isSelected = prevSelected.includes(cardIndex);
      
      if (isSelected) {
        // Remove from selected cards if already selected
        return prevSelected.filter(idx => idx !== cardIndex);
      } else {
        // Add to selected cards if not already selected
        return [...prevSelected, cardIndex];
      }
    });
  };

  // Check if selected cards match correct cards
  const checkCorrectCards = (correctCards) => {
    if (selectedCards.length !== 2) return false;
    
    // Sort both arrays for comparison
    const selectedSorted = [...selectedCards].sort((a, b) => a - b);
    const correctSorted = [...correctCards].sort((a, b) => a - b);
    
    return selectedSorted[0] === correctSorted[0] && selectedSorted[1] === correctSorted[1];
  };

  // Evaluate practice response
  const evaluatePracticeResponse = () => {
    const isCorrect = checkCorrectCards(practicePuzzles[0].correctCards);
    
    if (isCorrect) {
      setPracticeResult({
        isCorrect: true,
        message: 'Correct! You have selected the right cards.',
        explanation: practicePuzzles[0].explanation
      });
    } else {
      setPracticeResult({
        isCorrect: false,
        message: 'Incorrect. You did not select the right cards.',
        explanation: practicePuzzles[0].explanation
      });
    }
    
    setShowFeedback(true);
  };

  // Handle navigation to main task
  const handleStartMainTask = () => {
    navigate('/ecological-deductive/task');
  };

  // Render card component
  const renderCard = (card, index) => {
    const isSelected = selectedCards.includes(index);
    
    return (
      <div 
        key={index} 
        className={`eco-deductive-card ${isSelected ? 'selected' : ''}`}
        onClick={() => toggleCardSelection(index)}
      >
        <div className="eco-card-content">
          {card.type === 'text' ? (
            <span className="eco-card-text">{card.front}</span>
          ) : (
            <img 
              src={card.image} 
              alt={card.front} 
              className="eco-card-image" 
            />
          )}
        </div>
      </div>
    );
  };

  // Render practice component or feedback
  if (showFeedback) {
    return (
      <div className="eco-deductive-screen">
        <div className="eco-deductive-content">
          <div className="eco-deductive-feedback">
            <div className={`eco-feedback-result ${practiceResult.isCorrect ? 'eco-correct-answer' : 'eco-incorrect-answer'}`}>
              {practiceResult.message}
            </div>
            <div className="eco-feedback-explanation">
              {practiceResult.explanation}
            </div>
          </div>
          <button 
            className="eco-deductive-button eco-continue-button" 
            onClick={handleStartMainTask}
          >
            Continue to Main Task
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="eco-deductive-screen">
      <div className="eco-deductive-content">
        <div className="eco-deductive-header">
          <h2>Practice Round</h2>
          <div className="eco-deductive-question">
            {practicePuzzles[0].question}
          </div>
        </div>
        
        <p className="eco-selected-count">
          Selected cards: {selectedCards.length}/2
        </p>
        
        <div className="eco-cards-container">
          {practicePuzzles[0].cards.map((card, index) => renderCard(card, index))}
        </div>
        
        <button 
          className="eco-deductive-button eco-submit-button" 
          onClick={evaluatePracticeResponse}
          disabled={selectedCards.length !== 2}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default EcologicalDeductiveReasoningPractice; 