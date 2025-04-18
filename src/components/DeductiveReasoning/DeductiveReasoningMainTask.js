import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeductiveReasoning.css';

/**
 * DeductiveReasoningMainTask component
 * Main task component for the deductive reasoning assessment (Wason Selection Task)
 */
const DeductiveReasoningMainTask = () => {
  const navigate = useNavigate();
  
  // Define the main puzzles (Wason Selection Tasks)
  const mainPuzzles = [
    {
      question: "If a vowel is on one side of a card, then an even number is on the other side.",
      cards: [
        { front: "A", back: "4", type: "text", cardType: "text-card" },
        { front: "B", back: "7", type: "text", cardType: "text-card" },
        { front: "2", back: "K", type: "text", cardType: "text-card" },
        { front: "7", back: "E", type: "text", cardType: "text-card" }
      ],
      correctCards: [0, 3],  // A and 7 (0-indexed)
      explanation: "Correct answer: A and 7. You need to check if A has an even number on the back (the rule requires this) and if 7 has a vowel on the back (which would break the rule)."
    },
    {
      question: "If a card has an even number on one side, then it has the color yellow on the other side.",
      cards: [
        { front: "3", back: "red", type: "text", cardType: "text-card" },
        { front: "8", back: "yellow", type: "text", cardType: "text-card" },
        { front: "yellow", back: "5", type: "color", cardType: "color-card yellow", color: "#FDD835" },
        { front: "red", back: "6", type: "color", cardType: "color-card red", color: "#F44336" }
      ],
      correctCards: [1, 3],  // 8 and red (with 6)
      explanation: "Correct answer: 8 and red (with 6). You need to check the 8 card (even number, to verify it has yellow on the other side) and the red card (to verify it doesn't have an even number on the other side)."
    },
    {
      question: "If a card has the digit \"5\" on one side, then it has a triangle symbol on the other side.",
      cards: [
        { front: "5", back: "square", type: "text", cardType: "text-card" },
        { front: "triangle", back: "7", type: "shape", cardType: "shape-card", shape: "triangle" },
        { front: "3", back: "triangle", type: "text", cardType: "text-card" },
        { front: "circle", back: "5", type: "shape", cardType: "shape-card", shape: "circle" }
      ],
      correctCards: [0, 3],  // 5 and Circle (with 5)
      explanation: "Correct answer: 5 and Circle (with 5). You need to check the 5 card (to verify it has a triangle on the other side) and the circle card (to verify it doesn't have a 5 on the other side)."
    },
    {
      question: "If a card has a square symbol on one side, then it has the color red on the other side.",
      cards: [
        { front: "square", back: "yellow", type: "shape", cardType: "shape-card", shape: "square" },
        { front: "circle", back: "red", type: "shape", cardType: "shape-card", shape: "circle" },
        { front: "red", back: "triangle", type: "color", cardType: "color-card red", color: "#F44336" },
        { front: "yellow", back: "square", type: "color", cardType: "color-card yellow", color: "#FDD835" }
      ],
      correctCards: [0, 3],  // Square and Yellow (with Square)
      explanation: "Correct answer: Square and Yellow (with Square). You need to check the square card (to verify it has red on the other side) and the yellow card (to verify it doesn't have a square on the other side)."
    }
  ];

  // Component state
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Toggle card selection
  const toggleCardSelection = (cardIndex) => {
    setSelectedCards(prevSelected => {
      const isSelected = prevSelected.includes(cardIndex);
      
      if (isSelected) {
        // Remove from selected cards if already selected
        return prevSelected.filter(idx => idx !== cardIndex);
      } else {
        // Add to selected cards if not already selected and not already have 2
        if (prevSelected.length < 2) {
          return [...prevSelected, cardIndex];
        }
        return prevSelected;
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

  // Evaluate response for current puzzle
  const evaluateResponse = () => {
    const currentPuzzle = mainPuzzles[currentPuzzleIndex];
    const isCorrect = checkCorrectCards(currentPuzzle.correctCards);
    
    // Store result
    const newResult = {
      puzzleIndex: currentPuzzleIndex,
      question: currentPuzzle.question,
      selectedCards: [...selectedCards],
      correctCards: [...currentPuzzle.correctCards],
      isCorrect: isCorrect,
      timestamp: new Date().toISOString()
    };
    
    setResults(prevResults => [...prevResults, newResult]);
    
    // Move to next puzzle or show results
    if (currentPuzzleIndex < mainPuzzles.length - 1) {
      setCurrentPuzzleIndex(prevIndex => prevIndex + 1);
      setSelectedCards([]);
    } else {
      setShowResults(true);
    }
  };

  // Complete task and return to home
  const handleComplete = () => {
    // Save results to localStorage for later retrieval
    try {
      const studentId = localStorage.getItem('studentId') || 'unknown';
      const counterBalance = localStorage.getItem('counterBalance') || 'unknown';
      
      const exportData = {
        task: 'deductive_reasoning',
        studentId: studentId,
        counterBalance: counterBalance,
        results: results,
        timestamp: new Date().toISOString(),
        score: {
          correct: results.filter(result => result.isCorrect).length,
          total: results.length,
          accuracy: results.length > 0 
            ? Math.round((results.filter(result => result.isCorrect).length / results.length) * 100) 
            : 0
        }
      };
      
      // Get existing results or initialize new array
      const existingResults = JSON.parse(localStorage.getItem('taskResults') || '[]');
      existingResults.push(exportData);
      localStorage.setItem('taskResults', JSON.stringify(existingResults));
      
      console.log('Deductive Reasoning results saved:', exportData);
    } catch (error) {
      console.error('Error saving results:', error);
    }
    
    navigate('/home');
  };

  // Render shape based on type
  const renderShape = (shape) => {
    switch(shape) {
      case 'triangle':
        return <div className="deductive-triangle"></div>;
      case 'circle':
        return <div className="deductive-circle"></div>;
      case 'square':
        return <div className="deductive-square"></div>;
      default:
        return null;
    }
  };

  // Render results screen
  if (showResults) {
    const correctCount = results.filter(result => result.isCorrect).length;
    const totalCount = results.length;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    
    return (
      <div className="deductive-screen">
        <div className="deductive-content">
          <div className="deductive-results">
            <h2>Results</h2>
            <div className="results-item">
              Correct answers: <span className="results-value">{correctCount}</span>
            </div>
            <div className="results-item">
              Total problems: <span className="results-value">{totalCount}</span>
            </div>
            <div className="results-item">
              Accuracy: <span className="results-value">{accuracy}%</span>
            </div>
          </div>
          
          <button 
            className="deductive-button complete-button" 
            onClick={handleComplete}
          >
            Complete Task
          </button>
        </div>
      </div>
    );
  }

  // Get current puzzle
  const currentPuzzle = mainPuzzles[currentPuzzleIndex];
  const submitDisabled = selectedCards.length !== 2;
  
  // Render main task
  return (
    <div className="deductive-screen">
      <div className="deductive-content">
        <div className="deductive-header">
          <div className="deductive-question">
            {currentPuzzle.question}
          </div>
          <p>
            Problem {currentPuzzleIndex + 1} of {mainPuzzles.length}
          </p>
        </div>
        
        <div className="deductive-selected-count">
          Selected cards: {selectedCards.length}/2
        </div>
        
        <div className="horizontal-container">
          <div className="playing-cards-row">
            {currentPuzzle.cards.map((card, index) => (
              <div 
                key={index} 
                className={`playing-card ${card.type === 'color' ? 'color-card' : 'symbol-card'} ${selectedCards.includes(index) ? 'selected' : ''}`}
                onClick={() => toggleCardSelection(index)}
                style={card.type === 'color' ? { backgroundColor: card.color } : {}}
              >
                {card.type === 'text' && (
                  <div className="card-face">{card.front}</div>
                )}
                {card.type === 'shape' && (
                  <div className="deductive-shape">
                    {renderShape(card.shape)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="card-labels-row">
          {currentPuzzle.cards.map((card, index) => (
            <div key={index} className="card-label-container">
              {card.front}
            </div>
          ))}
        </div>
        
        <button 
          className="deductive-button" 
          onClick={evaluateResponse}
          disabled={submitDisabled}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default DeductiveReasoningMainTask; 