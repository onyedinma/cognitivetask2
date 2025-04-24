import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ACEIQQuestionnaire from '../ACEIQ/ACEIQQuestionnaire';
import SESQuestionnaire from '../SES/SESQuestionnaire';
import MFQQuestionnaire from '../MFQ/MFQQuestionnaire';
import SDQQuestionnaire from '../SDQ/SDQQuestionnaire';
import './Combined.css';

const CombinedQuestionnaire = () => {
  const navigate = useNavigate();
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState('ACEIQ');
  const [aceiqCompleted, setAceiqCompleted] = useState(false);
  const [sesCompleted, setSesCompleted] = useState(false);
  const [mfqCompleted, setMfqCompleted] = useState(false);
  const [sdqCompleted, setSdqCompleted] = useState(false);
  const [questionnairesCompleted, setQuestionnairesCompleted] = useState(false);
  const [aceiqResults, setAceiqResults] = useState(null);
  const [sesResults, setSesResults] = useState(null);
  const [mfqResults, setMfqResults] = useState(null);
  const [sdqResults, setSdqResults] = useState(null);

  // Handle completion of ACEIQ questionnaire
  const handleAceiqComplete = (results) => {
    setAceiqResults(results);
    
    // Check if results is null (user clicked "Continue" without submitting)
    if (!results) {
      setCurrentQuestionnaire('SES');
      return;
    }
    
    // Move to next questionnaire
    setCurrentQuestionnaire('SES');
  };
  
  // Handle completion of SES questionnaire
  const handleSesComplete = (results) => {
    setSesResults(results);
    
    // Check if results is null (user clicked "Continue" without submitting)
    if (!results) {
      setCurrentQuestionnaire('MFQ');
      return;
    }
    
    // Move to next questionnaire
    setCurrentQuestionnaire('MFQ');
  };

  // Handle completion of MFQ questionnaire
  const handleMfqComplete = (results) => {
    setMfqResults(results);
    
    // Check if results is null (user clicked "Continue" without submitting)
    if (!results) {
      setCurrentQuestionnaire('SDQ');
      return;
    }
    
    // Move to next questionnaire
    setCurrentQuestionnaire('SDQ');
  };

  // Handle completion of SDQ questionnaire
  const handleSdqComplete = (results) => {
    setSdqResults(results);
    
    // Check if results is null (user clicked "Continue" without submitting)
    if (!results) {
      setQuestionnairesCompleted(true);
      return;
    }
    
    // Show completion screen
    setQuestionnairesCompleted(true);
    
    // No longer automatically export here
  };

  // Export all questionnaire results as a single CSV
  const exportCombinedResults = () => {
    if (!aceiqResults || !sesResults || !mfqResults || !sdqResults) return;
    
    const csvData = [];
    csvData.push(['Questionnaire', 'Question ID', 'Question', 'Response']);
    
    // ACEIQ
    if (aceiqResults.questions && Array.isArray(aceiqResults.questions)) {
      aceiqResults.questions.forEach(q => {
        csvData.push(['ACEIQ', q.id, q.question, q.answer]);
      });
      csvData.push(['ACEIQ', 'TOTAL', 'Total Score', aceiqResults.totalScore]);
    }
    
    // SES
    if (sesResults.questions && Array.isArray(sesResults.questions)) {
      sesResults.questions.forEach(q => {
        csvData.push(['SES', q.id, q.question, q.answer]);
      });
      csvData.push(['SES', 'TOTAL', 'Total Score', sesResults.totalScore]);
    }
    
    // MFQ
    if (mfqResults.questions && Array.isArray(mfqResults.questions)) {
      mfqResults.questions.forEach(q => {
        csvData.push(['MFQ', q.id, q.question, q.answer]);
      });
      csvData.push(['MFQ', 'TOTAL', 'Total Score', mfqResults.totalScore]);
      csvData.push(['MFQ', 'INTERP', 'Interpretation', mfqResults.interpretation]);
    }
    
    // SDQ
    if (sdqResults.questions && Array.isArray(sdqResults.questions)) {
      sdqResults.questions.forEach(q => {
        csvData.push(['SDQ', q.id, q.question, q.answer]);
      });
      
      // Also include the summary scores
      if (sdqResults.scores) {
        csvData.push(['SDQ', 'EMOTIONAL', 'Emotional Problems', sdqResults.scores.emotional]);
        csvData.push(['SDQ', 'CONDUCT', 'Conduct Problems', sdqResults.scores.conduct]);
        csvData.push(['SDQ', 'HYPERACTIVITY', 'Hyperactivity', sdqResults.scores.hyperactivity]);
        csvData.push(['SDQ', 'PEER', 'Peer Problems', sdqResults.scores.peer]);
        csvData.push(['SDQ', 'PROSOCIAL', 'Prosocial Behavior', sdqResults.scores.prosocial]);
        csvData.push(['SDQ', 'TOTAL', 'Total Difficulties', sdqResults.scores.totalDifficulties]);
      }
    } else if (sdqResults.scores) {
      // Fallback to just including summary scores if questions array isn't available
      csvData.push(['SDQ', 'EMOTIONAL', 'Emotional Problems', sdqResults.scores.emotional]);
      csvData.push(['SDQ', 'CONDUCT', 'Conduct Problems', sdqResults.scores.conduct]);
      csvData.push(['SDQ', 'HYPERACTIVITY', 'Hyperactivity', sdqResults.scores.hyperactivity]);
      csvData.push(['SDQ', 'PEER', 'Peer Problems', sdqResults.scores.peer]);
      csvData.push(['SDQ', 'PROSOCIAL', 'Prosocial Behavior', sdqResults.scores.prosocial]);
      csvData.push(['SDQ', 'TOTAL', 'Total Difficulties', sdqResults.scores.totalDifficulties]);
    }
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    
    // Export to CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const studentId = localStorage.getItem('studentId') || 'unknown';
    link.setAttribute('href', url);
    link.setAttribute('download', `questionnaire_results_${studentId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render the current questionnaire or completion screen
  const renderQuestionnaire = () => {
    if (questionnairesCompleted) {
      return (
        <div className="questionnaire-container">
          <div className="completion-screen">
            <h1>All Tasks Complete</h1>
            <p>Thank you for participating in this study!</p>
            
            <button 
              className="form-button" 
              onClick={exportCombinedResults}
              style={{
                fontSize: '1.2rem',
                padding: '14px 28px',
                fontWeight: 'bold',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                margin: '20px auto',
                display: 'block',
                minWidth: '300px',
                transition: 'all 0.3s ease'
              }}
            >
              Download Combined Results (CSV)
            </button>
            
            <button 
              className="form-button" 
              onClick={() => navigate('/')}
              style={{
                fontSize: '1.5rem',
                padding: '16px 32px',
                fontWeight: 'bold',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                margin: '20px auto',
                display: 'block',
                minWidth: '300px',
                transition: 'all 0.3s ease'
              }}
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }
    
    // ACEIQ questionnaire flow
    if (currentQuestionnaire === 'ACEIQ') {
      if (!aceiqCompleted) {
        return <ACEIQQuestionnaire onComplete={handleAceiqComplete} />;
      } else {
        // Show ACEIQ results with score before proceeding
        return (
          <div className="questionnaire-container">
            <h1 className="questionnaire-title">ACE-IQ Results</h1>
            
            {aceiqResults && (
              <div className="score-summary">
                <h2>Questionnaire Score Summary</h2>
                <p className="total-score">Total Score: <span>{aceiqResults.totalScore}</span></p>
                <p className="score-explanation">
                  Higher scores indicate more adverse childhood experiences.
                </p>
              </div>
            )}
            
            <button 
              className="form-button" 
              onClick={() => setCurrentQuestionnaire('SES')}
            >
              Continue to Next Questionnaire
            </button>
          </div>
        );
      }
    }
    
    // SES questionnaire flow
    if (currentQuestionnaire === 'SES') {
      if (!sesCompleted) {
        return <SESQuestionnaire onComplete={handleSesComplete} />;
      } else {
        // Show SES results with score before proceeding
        return (
          <div className="questionnaire-container">
            <h1 className="questionnaire-title">Socioeconomic Status Results</h1>
            
            {sesResults && (
              <div className="score-summary">
                <h2>Questionnaire Score Summary</h2>
                <p className="total-score">Total Score: <span>{sesResults.totalScore}</span> out of 35</p>
                <p className="score-explanation">
                  Higher scores indicate a higher socioeconomic status during childhood.
                </p>
              </div>
            )}
            
            <button 
              className="form-button" 
              onClick={() => setCurrentQuestionnaire('MFQ')}
            >
              Continue to Next Questionnaire
            </button>
          </div>
        );
      }
    }

    // MFQ questionnaire flow
    if (currentQuestionnaire === 'MFQ') {
      if (!mfqCompleted) {
        return <MFQQuestionnaire onComplete={handleMfqComplete} />;
      } else {
        // Show MFQ results with score before proceeding
        return (
          <div className="questionnaire-container">
            <h1 className="questionnaire-title">Mood and Feelings Results</h1>
            
            {mfqResults && (
              <div className="score-summary">
                <h2>Questionnaire Score Summary</h2>
                <p className="total-score">Total Score: <span>{mfqResults.totalScore}</span> out of 26</p>
                <p className="score-explanation">
                  {mfqResults.interpretation}
                </p>
              </div>
            )}
            
            <button 
              className="form-button" 
              onClick={() => setCurrentQuestionnaire('SDQ')}
            >
              Continue to Next Questionnaire
            </button>
          </div>
        );
      }
    }

    // SDQ questionnaire flow
    if (currentQuestionnaire === 'SDQ') {
      if (!sdqCompleted) {
        return <SDQQuestionnaire onComplete={handleSdqComplete} />;
      } else {
        // Show SDQ results with score before proceeding
        return (
          <div className="questionnaire-container">
            <h1 className="questionnaire-title">Strengths and Difficulties Results</h1>
            
            {sdqResults && (
              <div className="score-summary">
                <h2>Questionnaire Score Summary</h2>
                <p className="total-score">Emotional Problems: <span>{sdqResults.scores.emotional}</span></p>
                <p className="total-score">Conduct Problems: <span>{sdqResults.scores.conduct}</span></p>
                <p className="total-score">Hyperactivity: <span>{sdqResults.scores.hyperactivity}</span></p>
                <p className="total-score">Peer Problems: <span>{sdqResults.scores.peer}</span></p>
                <p className="total-score">Prosocial Behavior: <span>{sdqResults.scores.prosocial}</span></p>
                <p className="total-score">Total Difficulties: <span>{sdqResults.scores.totalDifficulties}</span></p>
              </div>
            )}
            
            <button 
              className="form-button" 
              onClick={() => setQuestionnairesCompleted(true)}
            >
              Finish All Questionnaires
            </button>
          </div>
        );
      }
    }
  };

  return (
    <div className="task-screen">
      {renderQuestionnaire()}
    </div>
  );
};

export default CombinedQuestionnaire; 