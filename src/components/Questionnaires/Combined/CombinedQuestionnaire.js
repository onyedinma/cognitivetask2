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
    
    // Export all task results automatically when questionnaires are completed
    try {
      const { exportAllTaskResults } = require('../../utils/taskResults');
      exportAllTaskResults();
      console.log('All cognitive task results exported automatically');
    } catch (error) {
      console.error('Error exporting all task results:', error);
    }
  };

  // Export all questionnaire results as a single CSV
  const exportCombinedResults = () => {
    if (!aceiqResults || !sesResults || !mfqResults || !sdqResults) return;
    
    const csvData = [];
    
    // Add file header
    csvData.push(['COGNITIVE TASKS QUESTIONNAIRE RESULTS']);
    csvData.push(['Student ID:', localStorage.getItem('studentId') || 'unknown']);
    csvData.push(['Export Date:', new Date().toISOString()]);
    csvData.push([]);  // Blank row
    
    // ACEIQ section
    csvData.push(['===== ADVERSE CHILDHOOD EXPERIENCES QUESTIONNAIRE (ACE-IQ) =====']);
    csvData.push(['Questionnaire', 'Question ID', 'Response', 'Score', 'Score Type']);
    
    if (aceiqResults.questions && Array.isArray(aceiqResults.questions)) {
      // Map question IDs to their types for the CSV
      const aceiqQuestionTypes = {};
      
      // These arrays should match the ones in ACEIQQuestionnaire.js
      const frequencyType5Questions = ['parentsUnderstandProblems', 'parentsKnowFreeTime'];
      const yesNoQuestions = [
        'alcoholicHouseholdMember', 'mentallyIllHouseholdMember', 
        'imprisonedHouseholdMember', 'parentsSeparated', 'parentDied'
      ];
      // All other questions are frequency4 type
      
      frequencyType5Questions.forEach(id => aceiqQuestionTypes[id] = 'Reverse scored (Protective factor)');
      yesNoQuestions.forEach(id => aceiqQuestionTypes[id] = 'Binary');
      
      aceiqResults.questions.forEach(q => {
        // Determine score type if not already set
        let scoreType = q.type || aceiqQuestionTypes[q.id] || '0-3 scale';
        
        csvData.push([
          'ACEIQ', 
          q.id, 
          q.response || '', // Include the raw response if available
          q.score,
          scoreType
        ]);
      });
      
      csvData.push(['ACEIQ', 'TOTAL', '', aceiqResults.totalScore, 'Sum of all items']);
    }
    
    // Blank row between questionnaires
    csvData.push([]);
    csvData.push([]);
    
    // SES section
    csvData.push(['===== SOCIOECONOMIC STATUS QUESTIONNAIRE (SES) =====']);
    csvData.push(['Questionnaire', 'Question ID', 'Response', 'Score', 'Score Type']);
    
    if (sesResults.questions && Array.isArray(sesResults.questions)) {
      sesResults.questions.forEach(q => {
        // Determine score type - only struggledFinancially is reverse scored
        const scoreType = q.type || (q.id === 'struggledFinancially' ? 'Reverse scored' : 'Standard scored');
        csvData.push(['SES', q.id, q.response || '', q.score, scoreType]);
      });
      csvData.push(['SES', 'TOTAL', '', sesResults.totalScore, 'Sum of all items']);
    }
    
    // Blank row between questionnaires
    csvData.push([]);
    csvData.push([]);
    
    // MFQ section
    csvData.push(['===== MOOD AND FEELINGS QUESTIONNAIRE (MFQ) =====']);
    csvData.push(['Questionnaire', 'Question ID', 'Response', 'Score', 'Score Type']);
    
    if (mfqResults.questions && Array.isArray(mfqResults.questions)) {
      mfqResults.questions.forEach(q => {
        csvData.push(['MFQ', q.id, q.response || '', q.score, q.type || 'Standard scored']);
      });
      csvData.push(['MFQ', 'TOTAL', '', mfqResults.totalScore, 'Sum of all items']);
      
      // Add interpretation row
      if (mfqResults.interpretation) {
        csvData.push(['MFQ', 'INTERPRETATION', '', mfqResults.interpretation, 'Clinical interpretation']);
      }
    }
    
    // Blank row between questionnaires
    csvData.push([]);
    csvData.push([]);
    
    // SDQ section
    csvData.push(['===== STRENGTHS AND DIFFICULTIES QUESTIONNAIRE (SDQ) =====']);
    csvData.push(['Questionnaire', 'Question ID', 'Response', 'Score', 'Score Type']);
    
    if (sdqResults.questions && Array.isArray(sdqResults.questions)) {
      sdqResults.questions.forEach(q => {
        // Determine if question is reverse scored based on subscale and item
        let scoreType = q.type || 'Standard scored';
        
        // Prosocial items are reverse scored relative to problems
        if (!q.type && q.id.startsWith('prosocial')) {
          scoreType = 'Prosocial item (higher is better)';
        }
        // Specific reverse scored items in the difficulties subscales
        else if (!q.type && ['emotional7', 'conduct5', 'conduct7', 'hyperactivity2', 'hyperactivity10', 'peer6'].includes(q.id)) {
          scoreType = 'Reverse scored';
        }
        
        csvData.push(['SDQ', q.id, q.response || '', q.score, scoreType]);
      });
      
      // Add a separator before summary scores
      csvData.push([]);
      csvData.push(['===== SDQ SUMMARY SCORES =====']);
      csvData.push(['Scale', 'Score', 'Category']);
      
      // Include subscale scores with categories
      if (sdqResults.scores) {
        csvData.push(['SDQ', 'EMOTIONAL_PROBLEMS', '', sdqResults.scores.emotional, 'Subscale total']);
        csvData.push(['SDQ', 'EMOTIONAL_CATEGORY', '', sdqResults.scores.emotionalCategory, 'Clinical category']);
        
        csvData.push(['SDQ', 'CONDUCT_PROBLEMS', '', sdqResults.scores.conduct, 'Subscale total']);
        csvData.push(['SDQ', 'CONDUCT_CATEGORY', '', sdqResults.scores.conductCategory, 'Clinical category']);
        
        csvData.push(['SDQ', 'HYPERACTIVITY', '', sdqResults.scores.hyperactivity, 'Subscale total']);
        csvData.push(['SDQ', 'HYPERACTIVITY_CATEGORY', '', sdqResults.scores.hyperactivityCategory, 'Clinical category']);
        
        csvData.push(['SDQ', 'PEER_PROBLEMS', '', sdqResults.scores.peer, 'Subscale total']);
        csvData.push(['SDQ', 'PEER_CATEGORY', '', sdqResults.scores.peerCategory, 'Clinical category']);
        
        csvData.push(['SDQ', 'PROSOCIAL', '', sdqResults.scores.prosocial, 'Subscale total (higher is better)']);
        csvData.push(['SDQ', 'PROSOCIAL_CATEGORY', '', sdqResults.scores.prosocialCategory, 'Clinical category']);
        
        csvData.push(['SDQ', 'TOTAL_DIFFICULTIES', '', sdqResults.scores.totalDifficulties, 'Sum of problem subscales']);
        csvData.push(['SDQ', 'TOTAL_CATEGORY', '', sdqResults.scores.totalDifficultiesCategory, 'Clinical category']);
        
        csvData.push(['SDQ', 'EXTERNALIZING', '', sdqResults.scores.externalizing, 'Conduct + Hyperactivity']);
        csvData.push(['SDQ', 'INTERNALIZING', '', sdqResults.scores.internalizing, 'Emotional + Peer']);
      }
      
      // Interpretation
      if (sdqResults.interpretation) {
        csvData.push(['SDQ', 'INTERPRETATION', '', sdqResults.interpretation, '']);
      }
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
                
                <h3>Subscale Scores</h3>
                <div className="sdq-category-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Scale</th>
                        <th>Score</th>
                        <th>Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Emotional Problems:</td>
                        <td>{sdqResults.scores.emotional}</td>
                        <td>{sdqResults.scores.emotionalCategory}</td>
                      </tr>
                      <tr>
                        <td>Conduct Problems:</td>
                        <td>{sdqResults.scores.conduct}</td>
                        <td>{sdqResults.scores.conductCategory}</td>
                      </tr>
                      <tr>
                        <td>Hyperactivity:</td>
                        <td>{sdqResults.scores.hyperactivity}</td>
                        <td>{sdqResults.scores.hyperactivityCategory}</td>
                      </tr>
                      <tr>
                        <td>Peer Problems:</td>
                        <td>{sdqResults.scores.peer}</td>
                        <td>{sdqResults.scores.peerCategory}</td>
                      </tr>
                      <tr>
                        <td>Prosocial Behavior:</td>
                        <td>{sdqResults.scores.prosocial}</td>
                        <td>{sdqResults.scores.prosocialCategory}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <h3>Composite Scores</h3>
                <div className="sdq-category-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Scale</th>
                        <th>Score</th>
                        <th>Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Total Difficulties:</td>
                        <td>{sdqResults.scores.totalDifficulties}</td>
                        <td>{sdqResults.scores.totalDifficultiesCategory}</td>
                      </tr>
                      <tr>
                        <td>Externalizing:</td>
                        <td>{sdqResults.scores.externalizing}</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>Internalizing:</td>
                        <td>{sdqResults.scores.internalizing}</td>
                        <td>-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="sdq-note">
                  Categories based on official SDQ four-band classification for self-report
                </p>
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