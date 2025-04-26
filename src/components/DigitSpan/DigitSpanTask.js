import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DigitSpan.css';

/**
 * Main DigitSpan Task selection component - now redirects to home
 */
const DigitSpanTask = () => {
  const navigate = useNavigate();
  
  // Redirect to home page on mount
  useEffect(() => {
    navigate('/');
  }, [navigate]);
  
  return (
    <div className="task-screen">
      <h1>Redirecting...</h1>
    </div>
  );
};

export default DigitSpanTask; 