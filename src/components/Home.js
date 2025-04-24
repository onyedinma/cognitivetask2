import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const startAssessment = () => {
    // Navigate to Forward Digit Span task
    navigate('/digit-span/forward');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="welcome-screen">
      <h1>Cognitive Task Assessment</h1>
      
      {/* Menu button */}
      <div className="menu-container">
        <button className="menu-button" onClick={toggleMenu}>
          <span className="menu-icon">≡</span> {menuOpen ? 'Close Menu' : 'Menu'}
        </button>
        
        {/* Dropdown menu */}
        {menuOpen && (
          <div className="task-dropdown">
            <h3>Available Tasks</h3>
            <Link to="/digit-span/forward" className="dropdown-item" onClick={() => setMenuOpen(false)}>
              Forward Digit Span
            </Link>
            <Link to="/digit-span/backward" className="dropdown-item" onClick={() => setMenuOpen(false)}>
              Backward Digit Span
            </Link>
            <Link to="/object-span/forward" className="dropdown-item" onClick={() => setMenuOpen(false)}>
              Forward Object Span
            </Link>
            <Link to="/object-span/backward" className="dropdown-item" onClick={() => setMenuOpen(false)}>
              Backward Object Span
            </Link>
            <Link to="/shape-counting" className="dropdown-item" onClick={() => setMenuOpen(false)}>
              Shape Counting Task
            </Link>
            <Link to="/counting-game" className="dropdown-item" onClick={() => setMenuOpen(false)}>
              Counting Game (Ecological)
            </Link>
            <Link to="/spatial-memory" className="dropdown-item" onClick={() => setMenuOpen(false)}>
              Spatial Working Memory
            </Link>
            <Link to="/ecological-spatial" className="dropdown-item" onClick={() => setMenuOpen(false)}>
              Ecological Spatial Memory
            </Link>
            <Link to="/ecological-deductive" className="dropdown-item" onClick={() => setMenuOpen(false)}>
              Ecological Deductive Reasoning
            </Link>
            <Link to="/deductive-reasoning" className="dropdown-item" onClick={() => setMenuOpen(false)}>
              Deductive Reasoning
            </Link>
            <Link to="/combined-questionnaire" className="dropdown-item" onClick={() => setMenuOpen(false)}>
              Questionnaires
            </Link>
          </div>
        )}
      </div>
      
      <div className="start-container">
        <button 
          className="start-button" 
          onClick={startAssessment}
        >
          Start Assessment
        </button>
        
        {/* Info box about CSV exports removed */}
      </div>
    </div>
  );
};

export default Home; 