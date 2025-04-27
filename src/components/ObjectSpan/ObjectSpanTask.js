import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ObjectSpan.css';

// Main ObjectSpanTask component - now redirects to home
const ObjectSpanTask = () => {
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

export default ObjectSpanTask; 