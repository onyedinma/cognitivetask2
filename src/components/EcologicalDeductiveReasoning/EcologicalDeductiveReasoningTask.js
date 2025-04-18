import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EcologicalDeductiveReasoning.css';

const EcologicalDeductiveReasoningTask = () => {
  const navigate = useNavigate();
  
  // Component state to track the current instruction step
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // Handle navigation to practice section
  const handleStartPractice = () => {
    navigate('/ecological-deductive/practice');
  };

  // Function to go to next instruction step
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Function to go to previous instruction step
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Example cards for visualization
  const exampleCards = [
    { front: 'A', back: '4', selected: true },
    { front: 'K', back: '7', selected: false },
    { front: '2', back: 'E', selected: false },
    { front: '7', back: 'A', selected: true }
  ];
  
  return (
    <div className="eco-deductive-screen">
      <div className="eco-deductive-content">
        <div className="eco-deductive-header">
          <h1>Ecological Deductive Reasoning Task</h1>
          
          {/* Progress indicators */}
          <div className="instruction-progress">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index} 
                className={`progress-dot ${currentStep >= index + 1 ? 'active' : ''}`}
                onClick={() => setCurrentStep(index + 1)}
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
                        <div key={index} className="eco-example-card">
                          <div className="eco-example-card-inner">
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
                    <p className="eco-image-caption">You will see four cards with information on one side.</p>
                  </div>
                  <p>
                    Your task is to determine which cards you need to turn over to check if a given rule is being followed.
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
                      <p>Think carefully about which cards could provide evidence that would prove the rule is being broken.</p>
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
                        >
                          <div className="eco-example-card-inner">
                            <div className="eco-example-card-front">
                              <span>{card.front}</span>
                            </div>
                            <div className="eco-example-card-back">
                              <span>{card.back}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
            >
              Previous
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button 
              className="eco-deductive-button eco-next-button" 
              onClick={goToNextStep}
            >
              Next
            </button>
          ) : (
            <button 
              className="eco-deductive-button eco-continue-button" 
              onClick={handleStartPractice}
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