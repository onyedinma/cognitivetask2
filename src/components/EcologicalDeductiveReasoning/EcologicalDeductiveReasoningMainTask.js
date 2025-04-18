import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EcologicalDeductiveReasoning.css';

// Define constants for paths to images
const IMAGE_PATH = '/deducimages/';
const beer = `${IMAGE_PATH}beer.jpg`;
const juice = `${IMAGE_PATH}juice.jpg`;
const doctorPatient = `${IMAGE_PATH}doctor-patient.jpg`;
const teacher = `${IMAGE_PATH}teacher.jpg`;
const dogBarking = `${IMAGE_PATH}dog-barking.jpg`;
const cat = `${IMAGE_PATH}cat.jpg`;

// All images used in the component - for preloading
const allImages = [beer, juice, doctorPatient, teacher, dogBarking, cat];

// Define the main puzzles
const mainPuzzles = [
  {
    question: "If a person drinks an alcoholic drink, then they must be over the age of 21 years old.",
    cards: [
      { front: "16", back: "16", type: "text" },
      { front: "beer", back: "beer", type: "drink", image: beer },
      { front: "25", back: "25", type: "text" },
      { front: "juice", back: "juice", type: "drink", image: juice }
    ],
    correctCards: [0, 1],  // 16 and beer
    explanation: "Correct answer: 16 and beer. You need to check the 16 card (to verify this person is not drinking alcohol) and the beer card (to verify the person drinking it is at least 21)."
  },
  {
    question: "If Mary and Jane always hang out together, then they must be friends.",
    cards: [
      { front: "Mary and Jane hang out", back: "Mary and Jane hang out", type: "text" },
      { front: "Mary and Jane do not hang out", back: "Mary and Jane do not hang out", type: "text" },
      { front: "Mary and Jane are friends", back: "Mary and Jane are friends", type: "text" },
      { front: "Mary and Jane are not friends", back: "Mary and Jane are not friends", type: "text" }
    ],
    correctCards: [0, 3],  // "Mary and Jane hang out" and "Mary and Jane are not friends"
    explanation: "Correct answer: 'Mary and Jane hang out' and 'Mary and Jane are not friends'. You need to check if they hang out (to verify they are friends) and if they are not friends (to verify they don't hang out)."
  },
  {
    question: "If it's raining, then the ground is wet.",
    cards: [
      { front: "Raining", back: "Raining", type: "text" },
      { front: "Not raining", back: "Not raining", type: "text" },
      { front: "Ground is wet", back: "Ground is wet", type: "text" },
      { front: "Ground is dry", back: "Ground is dry", type: "text" }
    ],
    correctCards: [0, 3],  // "Raining" and "Ground is dry"
    explanation: "Correct answer: 'Raining' and 'Ground is dry'. You need to check if when it's raining the ground is wet (the rule requires this) and if when the ground is dry it's not raining (to verify the rule is consistent)."
  },
  {
    question: "If an animal barks, then it must be a dog.",
    cards: [
      { front: "Barks", back: "Barks", type: "image", image: dogBarking },
      { front: "Doesn't bark", back: "Doesn't bark", type: "image", image: cat },
      { front: "Dog", back: "Dog", type: "text" },
      { front: "Cat", back: "Cat", type: "text" }
    ],
    correctCards: [0, 3],  // Barks and Cat
    explanation: "Correct answer: 'Barks' and Cat. You need to check if a barking animal is a dog and if a cat might also bark."
  }
];

const EcologicalDeductiveReasoningMainTask = () => {
  const navigate = useNavigate();
  
  // All state declarations must come at the top level of the component
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Preload images when component mounts
  useEffect(() => {
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
        task: 'ecological_deductive_reasoning',
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
      
      console.log('Ecological Deductive Reasoning results saved:', exportData);
    } catch (error) {
      console.error('Error saving results:', error);
    }
    
    navigate('/home');
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

  // Show loading screen while images are loading
  if (!imagesLoaded) {
    return (
      <div className="eco-deductive-screen">
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
      </div>
    );
  }

  // Render results screen
  if (showResults) {
    const correctCount = results.filter(result => result.isCorrect).length;
    const totalCount = results.length;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    
    return (
      <div className="eco-deductive-screen">
        <div className="eco-deductive-content">
          <div className="eco-deductive-results">
            <h2>Results</h2>
            <div className="eco-results-item">
              Correct answers: <span className="eco-results-value">{correctCount}</span>
            </div>
            <div className="eco-results-item">
              Total problems: <span className="eco-results-value">{totalCount}</span>
            </div>
            <div className="eco-results-item">
              Accuracy: <span className="eco-results-value">{accuracy}%</span>
            </div>
          </div>
          
          <button 
            className="eco-deductive-button eco-complete-button" 
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
  
  return (
    <div className="eco-deductive-screen">
      <div className="eco-deductive-content">
        <div className="eco-deductive-header">
          <div className="eco-deductive-question">
            {currentPuzzle.question}
          </div>
          <p>
            Problem {currentPuzzleIndex + 1} of {mainPuzzles.length}
          </p>
        </div>
        
        <p className="eco-selected-count">
          Selected cards: {selectedCards.length}/2
        </p>
        
        <div className="eco-cards-container">
          {currentPuzzle.cards.map((card, index) => renderCard(card, index))}
        </div>
        
        <button 
          className="eco-deductive-button eco-submit-button" 
          onClick={evaluateResponse}
          disabled={submitDisabled}
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default EcologicalDeductiveReasoningMainTask; 