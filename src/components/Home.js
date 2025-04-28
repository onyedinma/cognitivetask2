import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [participantId, setParticipantId] = useState('');

  // Get participant ID from localStorage on component mount
  useEffect(() => {
    const storedId = localStorage.getItem('studentId');
    if (storedId) {
      setParticipantId(storedId);
    } else {
      // Redirect to participant info if no ID is found
      navigate('/participant-info', { replace: true });
    }
  }, [navigate]);

  // Start the assessment with the first task - Forward Digit Span
  const startAssessment = () => {
    navigate('/digit-span/forward');
  };

  // Toggle the dev menu visibility
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Cognitive Assessment Tasks</h1>
        <p className="subtitle">Battery of tasks measuring working memory and reasoning skills</p>
        {participantId && <p className="participant-info">ID: {participantId}</p>}
      </header>

      <div className="main-content">
        <div className="start-assessment-section">
          <h2 className="welcome-heading">Assessment Overview</h2>
          <div className="assessment-description">
            <p>
              This 30-40 minute assessment measures different cognitive abilities through a series of tasks. 
              Each task includes instructions and practice trials.
            </p>
          </div>
          
          <div className="task-flow">
            <div className="task-flow-item">
              <div className="task-flow-icon memory-icon">1</div>
              <div className="task-flow-label">
                <h3>Working Memory</h3>
                <p>Digit & Object</p>
              </div>
            </div>
            <div className="task-flow-arrow">→</div>
            <div className="task-flow-item">
              <div className="task-flow-icon visual-icon">2</div>
              <div className="task-flow-label">
                <h3>Visual Processing</h3>
                <p>Shape Counting</p>
              </div>
            </div>
            <div className="task-flow-arrow">→</div>
            <div className="task-flow-item">
              <div className="task-flow-icon spatial-icon">3</div>
              <div className="task-flow-label">
                <h3>Spatial Memory</h3>
                <p>Position Tasks</p>
              </div>
            </div>
            <div className="task-flow-arrow">→</div>
            <div className="task-flow-item">
              <div className="task-flow-icon reasoning-icon">4</div>
              <div className="task-flow-label">
                <h3>Reasoning</h3>
                <p>Logic Tasks</p>
              </div>
            </div>
            <div className="task-flow-arrow">→</div>
            <div className="task-flow-item">
              <div className="task-flow-icon questionnaire-icon">5</div>
              <div className="task-flow-label">
                <h3>Questionnaires</h3>
                <p>Daily Function</p>
              </div>
            </div>
          </div>
          
          <button 
            className="start-assessment-button" 
            onClick={startAssessment}
            aria-label="Start the cognitive assessment"
          >
            Start Assessment
          </button>
          <p className="start-description">
            Results save automatically and can be exported at the end
          </p>
        </div>

        {/* Developer Menu Toggle */}
        <div className="dev-menu-section">
          <button 
            className="toggle-menu-button" 
            onClick={toggleMenu}
            aria-expanded={showMenu}
            aria-controls="task-menu"
          >
            {showMenu ? 'Hide Task Menu' : 'Individual Tasks (Dev)'}
        </button>
        
          {showMenu && (
            <div id="task-menu" className="task-grid">
              <div className="task-category">
                <h3 className="task-category-title">Working Memory Tasks</h3>
                <div className="task-cards-row">
                  <div className="task-card" onClick={() => navigate('/digit-span/forward')}>
                    <h3>Forward Digit Span</h3>
                    <p>Remember digits</p>
                  </div>
                  <div className="task-card" onClick={() => navigate('/digit-span/backward')}>
                    <h3>Backward Digit Span</h3>
                    <p>Reverse digits</p>
                  </div>
                  <div className="task-card" onClick={() => navigate('/object-span/forward')}>
                    <h3>Forward Object Span</h3>
                    <p>Remember objects</p>
                  </div>
                  <div className="task-card" onClick={() => navigate('/object-span/backward')}>
                    <h3>Backward Object Span</h3>
                    <p>Reverse objects</p>
                  </div>
                </div>
              </div>

              <div className="task-category">
                <h3 className="task-category-title">Visual & Spatial Tasks</h3>
                <div className="task-cards-row">
                  <div className="task-card" onClick={() => navigate('/shape-counting')}>
                    <h3>Shape Counting</h3>
                    <p>Count shapes</p>
                  </div>
                  <div className="task-card" onClick={() => navigate('/counting-game')}>
                    <h3>Counting Game</h3>
                    <p>Count objects</p>
                  </div>
                  <div className="task-card" onClick={() => navigate('/spatial-memory')}>
                    <h3>Spatial Memory</h3>
                    <p>Remember positions</p>
                  </div>
                  <div className="task-card" onClick={() => navigate('/ecological-spatial')}>
                    <h3>Ecological Spatial</h3>
                    <p>Object locations</p>
                  </div>
                </div>
              </div>

              <div className="task-category">
                <h3 className="task-category-title">Reasoning & Questionnaires</h3>
                <div className="task-cards-row">
                  <div className="task-card" onClick={() => navigate('/deductive-reasoning')}>
                    <h3>Deductive Reasoning</h3>
                    <p>Logical puzzles</p>
                  </div>
                  <div className="task-card" onClick={() => navigate('/ecological-deductive')}>
                    <h3>Ecological Deductive</h3>
                    <p>Scenario reasoning</p>
                  </div>
                  <div className="task-card" onClick={() => navigate('/combined-questionnaire')}>
                    <h3>Questionnaires</h3>
                    <p>Daily functioning</p>
                  </div>
                </div>
              </div>
          </div>
        )}
        </div>
      </div>
      
      <footer className="home-footer">
        {/* Footer content removed as requested */}
      </footer>
    </div>
  );
};

export default Home; 