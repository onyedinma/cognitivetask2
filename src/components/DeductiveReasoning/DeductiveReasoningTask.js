import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DeductiveReasoning.css';

/**
 * DeductiveReasoningTask component
 * Entry point for the Deductive Reasoning task (Wason Selection Task)
 */
const DeductiveReasoningTask = () => {
  const navigate = useNavigate();
  
  // Handle navigation to practice section
  const handleStartPractice = () => {
    navigate('/deductive-reasoning/practice');
  };
  
  return (
    <div className="deductive-screen">
      <div className="deductive-content">
        <div className="deductive-header">
          <h1>Deductive Reasoning Task</h1>
        </div>
        
        <div className="deductive-instructions-container">
          <div className="deductive-section">
            <p>
              In this task, you will be presented with a rule and four cards. Each card has different information on each side.
            </p>
            <p>
              Your task is to determine which cards you need to turn over to check if the rule is being followed.
            </p>
          </div>
          
          <div className="deductive-section">
            <h2>How to Play</h2>
            <ol className="deductive-steps-list">
              <li>
                <span className="step-number">1</span>
                <div className="step-content">
                  <p>You will see a rule statement at the top of the screen, followed by four cards below.</p>
                </div>
              </li>
              <li>
                <span className="step-number">2</span>
                <div className="step-content">
                  <p>Each card shows information, and there is hidden information on the back of each card.</p>
                </div>
              </li>
              <li>
                <span className="step-number">3</span>
                <div className="step-content">
                  <p>Your task is to select exactly 2 cards that you would need to turn over to check if the rule is being followed or broken. You can select a card by simply clicking on it. Selected cards will be highlighted with a blue border.</p>
                </div>
              </li>
              <li>
                <span className="step-number">4</span>
                <div className="step-content">
                  <p>Think carefully about which cards could provide evidence that would prove the rule is being broken.</p>
                </div>
              </li>
            </ol>
          </div>
          
          <div className="deductive-section">
            <h2>Example</h2>
            <div className="deductive-example">
              <div className="deductive-example-rule">
                <p>If a card shows a king on one side, then it has a heart symbol on the other side.</p>
              </div>
              
              <p>And you see these four cards (you can only see one side of each card):</p>
              
              <div className="deductive-example-cards horizontal-cards">
                <div className="playing-card symbol-card selected">
                  <div className="card-corner top-left">
                    <span className="card-value">K</span>
                    <span className="card-suit">♠</span>
                  </div>
                  <div className="card-face">K</div>
                  <div className="card-corner bottom-right">
                    <span className="card-value">K</span>
                    <span className="card-suit">♠</span>
                  </div>
                  <div className="card-label">King of Spades</div>
                </div>
                
                <div className="playing-card symbol-card">
                  <div className="card-corner top-left">
                    <span className="card-value">Q</span>
                    <span className="card-suit">♦</span>
                  </div>
                  <div className="card-face">Q</div>
                  <div className="card-corner bottom-right">
                    <span className="card-value">Q</span>
                    <span className="card-suit">♦</span>
                  </div>
                  <div className="card-label">Queen of Diamonds</div>
                </div>
                
                <div className="playing-card heart-card">
                  <div className="card-symbol heart-symbol">♥</div>
                  <div className="card-label">Heart Symbol</div>
                </div>
                
                <div className="playing-card heart-card selected">
                  <div className="card-symbol">♣</div>
                  <div className="card-label">Club Symbol</div>
                </div>
              </div>
              
              <div className="deductive-example-explanation">
                <h3>The correct cards to turn over would be: King of Spades and Club Symbol</h3>
                <div className="explanation-reason">
                  <p><strong>Why?</strong> Because we need to check if:</p>
                  <p>1. The King of Spades has a Heart symbol on the back (the rule requires this)</p>
                  <p>2. The Club Symbol has a King on the back (which would break the rule)</p>
                  <p><strong>We don't need to check the other cards because:</strong></p>
                  <p>- The Queen of Diamonds: The rule only applies to Kings, so we don't care what's on the back of non-King cards</p>
                  <p>- The Heart Symbol: The rule doesn't say that hearts must have kings on the back, only that kings must have hearts on the back</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          className="deductive-button deductive-start-button" 
          onClick={handleStartPractice}
        >
          Start Practice
        </button>
      </div>
    </div>
  );
};

export default DeductiveReasoningTask; 