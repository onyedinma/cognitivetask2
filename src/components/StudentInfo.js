import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setLocalStorageItem, clearLocalStorage } from '../utils/localStorage';
import './StudentInfo.css';

const StudentInfo = () => {
  const [studentId, setStudentId] = useState('');
  const [idError, setIdError] = useState('');
  const navigate = useNavigate();

  // Check if already authorized
  useEffect(() => {
    const savedStudentId = localStorage.getItem('studentId');
    const savedCounterBalance = localStorage.getItem('counterBalance');
    
    if (savedStudentId && savedCounterBalance) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Validate student ID (5-10 digits)
  const validateStudentId = (id) => {
    return /^\d{5,10}$/.test(id);
  };

  // Handle student ID input change
  const handleStudentIdChange = (e) => {
    const value = e.target.value;
    setStudentId(value);
    
    // Clear error if input is valid
    if (validateStudentId(value)) {
      setIdError('');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate student ID
    if (!validateStudentId(studentId)) {
      setIdError('Please enter a valid ID (5-10 digits)');
      return;
    }
    
    try {
      // Clear first, then set
      clearLocalStorage();
      
      // Store values in localStorage
      setLocalStorageItem('studentId', studentId);
      setLocalStorageItem('counterBalance', 'A'); // Default value
      
      // Navigate to home page
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      alert('There was an error saving your information. Please try again.');
    }
  };

  return (
    <div className="student-info-container">
      <h1>Cognitive Task Assessment</h1>
      
      <form onSubmit={handleSubmit} className="student-info-form">
        <div className="input-group">
          <label htmlFor="studentId">Enter your participant ID:</label>
          <input
            type="text"
            id="studentId"
            value={studentId}
            onChange={handleStudentIdChange}
            placeholder="e.g. 12345678"
            className={idError ? 'error-input' : ''}
          />
          {idError && <p className="error-message">{idError}</p>}
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={!validateStudentId(studentId)}
        >
          Start
        </button>
      </form>
    </div>
  );
};

export default StudentInfo; 