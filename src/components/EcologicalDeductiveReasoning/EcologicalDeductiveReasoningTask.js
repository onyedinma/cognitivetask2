import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EcologicalDeductiveReasoning.css';

const EcologicalDeductiveReasoningTask = () => {
  const navigate = useNavigate();
  
  // Component state to track the current instruction step
  const [currentStep, setCurrentStep] = useState(1);
  const [animating, setAnimating] = useState(false);
  const totalSteps = 3;
  
  // State for card flipping in examples
  const [flippedCard, setFlippedCard] = useState(null);
  
  // Handle navigation to practice section
  const handleStartPractice = () => {
    setAnimating(true);
    setTimeout(() => {
      navigate('/ecological-deductive/practice');
    }, 500);
  };

  // Function to go to next instruction step with animation
  const goToNextStep = () => {
    if (currentStep < totalSteps && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setAnimating(false);
      }, 400);
    }
  };

  // Function to go to previous instruction step with animation
  const goToPrevStep = () => {
    if (currentStep > 1 && !animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setAnimating(false);
      }, 400);
    }
  };
  
  // Handle card flip
  const handleCardFlip = (index) => {
    setFlippedCard(flippedCard === index ? null : index);
  };
  
  // Example cards for visualization with enhanced interaction
  const exampleCards = [
    { front: 'A', back: '4', selected: true, label: 'Vowel' },
    { front: 'K', back: '7', selected: false, label: 'Consonant' },
    { front: '2', back: 'E', selected: false, label: 'Even Number' },
    { front: '7', back: 'A', selected: true, label: 'Odd Number' }
  ];
  
  // Auto-flip timer for example cards
  useEffect(() => {
    if (currentStep === 3) {
      const flipInterval = setInterval(() => {
        setFlippedCard(prev => {
          const next = prev === null ? 0 : (prev + 1) % exampleCards.length;
          return next;
        });
      }, 3000);
      
      return () => clearInterval(flipInterval);
    }
  }, [currentStep, exampleCards.length]);
  
  return (
    <div className="eco-deductive-screen">
      <div className={`eco-deductive-content ${animating ? 'fade-out' : 'fade-in'}`}>
        <div className="eco-deductive-header">
          <h1>Ecological Deductive Reasoning Task</h1>
          
          {/* Progress indicators */}
          <div className="instruction-progress">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index} 
                className={`progress-dot ${currentStep >= index + 1 ? 'active' : ''}`}
                onClick={() => !animating && setCurrentStep(index + 1)}
                title={`Step ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="eco-instructions-container">
          {currentStep === 1 && (
            <div className="eco-instructions-step">
              <h2>What is this task about?</h2>
              <div className="eco-instructions-card">
                <div className="eco-instructions-content">
                  <p>
                    This task measures your <strong>deductive reasoning ability</strong> with everyday scenarios.
                  </p>
                  <p>
                    You will be presented with a rule and four cards. Each card has different information on each side.
                  </p>
                  <div className="eco-instructions-image">
                    <div className="eco-instructions-cards-row">
                      {['Card 1', 'Card 2', 'Card 3', 'Card 4'].map((cardText, index) => (
                        <div 
                          key={index} 
                          className="eco-example-card"
                          onClick={() => handleCardFlip(index + 10)}
                        >
                          <div className={`eco-example-card-inner ${flippedCard === index + 10 ? 'flipped' : ''}`}>
                            <div className="eco-example-card-front">
                              <span>{cardText}</span>
                            </div>
                            <div className="eco-example-card-back">
                              <span>?</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="eco-image-caption">You will see four cards with information on one side. (Click to flip)</p>
                  </div>
                  <p>
                    Your task is to determine which cards you need to turn over to check if a given rule is being followed.
                  </p>
                  <p>
                    This type of task helps assess your ability to apply logical rules to real-world scenarios.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="eco-instructions-step">
              <h2>How to Play</h2>
              <div className="eco-instructions-card">
                <div className="eco-instructions-content">
                  <ol className="eco-steps-list">
                    <li>
                      <span className="step-number">1</span>
                      <div className="step-content">
                        <p>Read the rule statement at the top of the screen</p>
                      </div>
                    </li>
                    <li>
                      <span className="step-number">2</span>
                      <div className="step-content">
                        <p>Examine the four cards shown below the rule</p>
                      </div>
                    </li>
                    <li>
                      <span className="step-number">3</span>
                      <div className="step-content">
                        <p>Select exactly 2 cards that need to be turned over to verify if the rule is being followed</p>
                      </div>
                    </li>
                    <li>
                      <span className="step-number">4</span>
                      <div className="step-content">
                        <p>Click "Submit" to check your answer</p>
                      </div>
                    </li>
                  </ol>
                  
                  <div className="eco-instructions-hint">
                    <div className="hint-icon">💡</div>
                    <div className="hint-content">
                      <p>Think carefully about which cards could provide evidence that would prove the rule is being broken. The goal is to find the minimal set of cards needed to check the rule.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="eco-instructions-step">
              <h2>Example</h2>
              <div className="eco-instructions-card">
                <div className="eco-instructions-content">
                  <div className="example-rule">
                    <p>Rule: "If a card has a vowel on one side, then it has an even number on the other side."</p>
                  </div>
                  
                  <div className="eco-instructions-image">
                    <div className="eco-instructions-cards-row">
                      {exampleCards.map((card, index) => (
                        <div 
                          key={index} 
                          className={`eco-example-card ${card.selected ? 'selected' : ''}`}
                          onClick={() => handleCardFlip(index)}
                          title={card.label}
                        >
                          <div className={`eco-example-card-inner ${flippedCard === index ? 'flipped' : ''}`}>
                            <div className="eco-example-card-front">
                              <span>{card.front}</span>
                              <small className="card-label">{card.label}</small>
                            </div>
                            <div className="eco-example-card-back">
                              <span>{card.back}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="eco-image-caption">Click on any card to see what's on the other side</p>
                  </div>
                  
                  <div className="example-explanation">
                    <h3>Correct Answer: Cards A and 7</h3>
                    <div className="explanation-reason">
                      <p><strong>Card A:</strong> Since A is a vowel, the rule says it must have an even number on the back. We need to check that.</p>
                      <p><strong>Card 7:</strong> If 7 has a vowel on the back, it would break the rule (odd number with vowel). We need to check that.</p>
                      <p><strong>Card K:</strong> The rule doesn't say anything about cards with consonants, so we don't need to check this.</p>
                      <p><strong>Card 2:</strong> The rule doesn't require even numbers to have vowels, so we don't need to check this.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="eco-navigation-buttons">
          {currentStep > 1 && (
            <button 
              className="eco-deductive-button eco-back-button" 
              onClick={goToPrevStep}
              disabled={animating}
            >
              Previous
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button 
              className="eco-deductive-button eco-next-button" 
              onClick={goToNextStep}
              disabled={animating}
            >
              Next
            </button>
          ) : (
            <button 
              className="eco-deductive-button eco-continue-button" 
              onClick={handleStartPractice}
              disabled={animating}
            >
              Start Practice
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EcologicalDeductiveReasoningTask; 