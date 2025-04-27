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

// SVG images for rain puzzle
const rainingSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
  <!-- Dark cloud -->
  <path d="M25,40 Q25,20 45,20 Q60,20 60,35 Q80,30 80,50 Q80,70 60,70 Q50,70 45,70 Q30,70 25,60 Q15,60 15,50 Q15,40 25,40" fill="#607D8B"/>
  <!-- Rain drops -->
  <path d="M30,75 L26,85" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
  <path d="M40,75 L36,85" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
  <path d="M50,75 L46,85" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
  <path d="M60,75 L56,85" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
  <path d="M70,75 L66,85" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
  <path d="M35,65 L31,75" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
  <path d="M45,65 L41,75" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
  <path d="M55,65 L51,75" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
  <path d="M65,65 L61,75" stroke="#2196F3" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const clearSkySvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
  <!-- Sun -->
  <circle cx="50" cy="50" r="20" fill="#FFD600"/>
  <!-- Sun rays -->
  <line x1="50" y1="20" x2="50" y2="10" stroke="#FFD600" stroke-width="3" stroke-linecap="round"/>
  <line x1="50" y1="80" x2="50" y2="90" stroke="#FFD600" stroke-width="3" stroke-linecap="round"/>
  <line x1="20" y1="50" x2="10" y2="50" stroke="#FFD600" stroke-width="3" stroke-linecap="round"/>
  <line x1="80" y1="50" x2="90" y2="50" stroke="#FFD600" stroke-width="3" stroke-linecap="round"/>
  <line x1="30" y1="30" x2="20" y2="20" stroke="#FFD600" stroke-width="3" stroke-linecap="round"/>
  <line x1="70" y1="30" x2="80" y2="20" stroke="#FFD600" stroke-width="3" stroke-linecap="round"/>
  <line x1="30" y1="70" x2="20" y2="80" stroke="#FFD600" stroke-width="3" stroke-linecap="round"/>
  <line x1="70" y1="70" x2="80" y2="80" stroke="#FFD600" stroke-width="3" stroke-linecap="round"/>
  <!-- Small cloud in distance -->
  <path d="M75,40 Q75,35 80,35 Q85,35 85,40 Q90,38 90,42 Q90,48 85,48 Q80,48 75,45 Q70,48 70,42 Q70,38 75,40" fill="#E0E0E0"/>
</svg>`;

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
      { front: "Raining", back: "Raining", type: "svg", svg: rainingSvg },
      { front: "Not raining", back: "Not raining", type: "svg", svg: clearSkySvg },
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
    try {
      // Import the task results utility functions
      const { saveTaskResults, exportAllTaskResults } = require('../../utils/taskResults');
      
      // Get student ID for identification
      const studentId = localStorage.getItem('studentId') || 'unknown';
      
      // Format the results with all necessary fields
      const formattedResults = results.map((result, index) => {
        const currentPuzzle = mainPuzzles[result.puzzleIndex];
      
        // Format arrays to use semicolons instead of commas
        const correctCards = currentPuzzle ? JSON.stringify(currentPuzzle.correctCards).replace(/,/g, ';') : '';
        const selectedCards = JSON.stringify(result.selectedCards || []).replace(/,/g, ';');
        
        return {
          participantId: studentId,
          timestamp: result.timestamp || new Date().toISOString(),
          trialNumber: index + 1,
          level: result.puzzleIndex + 1,
          scenarioId: result.puzzleIndex + 1,
          scenarioName: `Ecological Problem ${result.puzzleIndex + 1}`,
          question: result.question || currentPuzzle.question,
          correctItem: correctCards,
          userSelectedItem: selectedCards,
          isCorrect: result.isCorrect,
          maxLevelReached: results.length, // Number of puzzles completed
          completionTime: new Date().getTime(), // Current timestamp for completion time
          explanation: currentPuzzle ? currentPuzzle.explanation : ''
        };
      });
      
      // Save results with the EXACT key expected by the export function
      saveTaskResults('ecologicalDeductiveReasoning', formattedResults);
      
      console.log('Ecological Deductive Reasoning results saved:', formattedResults);
      
      // Export ALL tasks' results as a single CSV file
      exportAllTaskResults();
      
      // Navigate to the questionnaires task
      navigate('/combined-questionnaire');
    } catch (error) {
      console.error('Error saving or exporting results:', error);
    }
  };

  // Render card component
  const renderCard = (card, index) => {
    const isSelected = selectedCards.includes(index);
    
    // Determine text length class for text cards
    const getTextClass = (text) => {
      if (text.length > 30) return 'very-long-text';
      if (text.length > 15) return 'long-text';
      return '';
    };
    
    return (
      <div 
        key={index} 
        className={`eco-deductive-card ${isSelected ? 'selected' : ''}`}
        onClick={() => toggleCardSelection(index)}
      >
        <div className="eco-card-content">
          {card.type === 'text' ? (
            <span className={`eco-card-text ${getTextClass(card.front)}`}>{card.front}</span>
          ) : card.type === 'svg' ? (
            <div className="eco-card-svg-container">
              <div className="eco-card-svg" dangerouslySetInnerHTML={{ __html: card.svg }}></div>
              <div className="eco-card-svg-label">{card.front}</div>
            </div>
          ) : card.type === 'drink' ? (
            <div className="eco-card-img-container">
              <img 
                src={card.image} 
                alt={card.front} 
                className="eco-card-image"
              />
              <div className="eco-card-svg-label">{card.front}</div>
            </div>
          ) : (
            <div className="eco-card-img-container">
              <img 
                src={card.image} 
                alt={card.front} 
                className="eco-card-image"
              />
              <div className="eco-card-svg-label">{card.front}</div>
            </div>
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
    return (
      <div className="eco-deductive-screen">
        <div className="eco-deductive-content">
          <div className="completion-screen">
            <h1>Task Complete</h1>
            
            <div className="nav-buttons">
              <button 
                className="eco-deductive-button eco-complete-button" 
                onClick={handleComplete}
                style={{
                  fontSize: '1.5rem',
                  padding: '16px 28px 16px 32px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                  margin: '30px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '340px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
                }}
              >
                Next Task: Questionnaires
                <span style={{ marginLeft: '10px', fontSize: '1.6rem' }}>→</span>
              </button>
            </div>
          </div>
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