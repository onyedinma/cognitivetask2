import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setLocalStorageItem, clearLocalStorage } from '../utils/localStorage';
import '../styles/ParticipantInfo.css';

const ParticipantInfo = () => {
  const [participantId, setParticipantId] = useState('');
  const [idError, setIdError] = useState('');
  const navigate = useNavigate();

  // Check if already authorized
  useEffect(() => {
    const savedParticipantId = localStorage.getItem('studentId'); // Keep key as 'studentId' for backward compatibility
    const savedCounterBalance = localStorage.getItem('counterBalance');
    
    if (savedParticipantId && savedCounterBalance) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Validate participant ID (5-10 digits)
  const validateParticipantId = (id) => {
    return /^\d{5,10}$/.test(id);
  };

  // Handle participant ID input change
  const handleParticipantIdChange = (e) => {
    const value = e.target.value;
    setParticipantId(value);
    
    // Clear error if input is valid
    if (validateParticipantId(value)) {
      setIdError('');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate participant ID
    if (!validateParticipantId(participantId)) {
      setIdError('Please enter a valid ID (5-10 digits)');
      return;
    }
    
    try {
      // Clear first, then set
      clearLocalStorage();
      
      // Store values in localStorage (keeping keys the same for backward compatibility)
      setLocalStorageItem('studentId', participantId);
      setLocalStorageItem('counterBalance', 'A'); // Default value
      
      // Navigate to home page
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      alert('There was an error saving your information. Please try again.');
    }
  };

  return (
    <div className="participant-info-container">
      <h1>Cognitive Task Assessment</h1>
      
      <form onSubmit={handleSubmit} className="participant-info-form">
        <div className="input-group">
          <label htmlFor="participantId">Enter your participant ID:</label>
          <input
            type="text"
            id="participantId"
            value={participantId}
            onChange={handleParticipantIdChange}
            placeholder="e.g. 12345678"
            className={idError ? 'error-input' : ''}
          />
          {idError && <p className="error-message">{idError}</p>}
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={!validateParticipantId(participantId)}
        >
          Start
        </button>
      </form>
    </div>
  );
};

export default ParticipantInfo; 