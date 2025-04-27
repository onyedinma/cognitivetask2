import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SDQ.css';

/**
 * Strengths and Difficulties Questionnaire (SDQ)
 */
const SDQQuestionnaire = ({ onComplete }) => {
  const navigate = useNavigate();
  
  // State for form submission
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scores, setScores] = useState({});
  const [exportError, setExportError] = useState('');
  const [exportSuccess, setExportSuccess] = useState('');
  
  // Simulate loading to ensure consistent rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // SDQ questions
  const questions = [
    { id: 'q1', text: 'I try to be nice to other people. I care about their feelings.' },
    { id: 'q2', text: 'I am restless, I cannot stay still for long.' },
    { id: 'q3', text: 'I get a lot of headaches, stomach-aches or sickness.' },
    { id: 'q4', text: 'I usually share with others, for example CDs, games, food.' },
    { id: 'q5', text: 'I get very angry and often lose my temper.' },
    { id: 'q6', text: 'I would rather be alone than with people of my age.' },
    { id: 'q7', text: 'I usually do as I am told.' },
    { id: 'q8', text: 'I worry a lot.' },
    { id: 'q9', text: 'I am helpful if someone is hurt, upset or feeling ill.' },
    { id: 'q10', text: 'I am constantly fidgeting or squirming.' },
    { id: 'q11', text: 'I have one good friend or more.' },
    { id: 'q12', text: 'I fight a lot. I can make other people do what I want.' },
    { id: 'q13', text: 'I am often unhappy, depressed or tearful.' },
    { id: 'q14', text: 'Other people my age generally like me.' },
    { id: 'q15', text: 'I am easily distracted, I find it difficult to concentrate.' },
    { id: 'q16', text: 'I am nervous in new situations. I easily lose confidence.' },
    { id: 'q17', text: 'I am kind to younger children.' },
    { id: 'q18', text: 'I am often accused of lying or cheating.' },
    { id: 'q19', text: 'Other children or young people pick on me or bully me.' },
    { id: 'q20', text: 'I often offer to help others (parents, teachers, children).' },
    { id: 'q21', text: 'I think before I do things.' },
    { id: 'q22', text: 'I take things that are not mine from home, school or elsewhere.' },
    { id: 'q23', text: 'I get along better with adults than with people my own age.' },
    { id: 'q24', text: 'I have many fears, I am easily scared.' },
    { id: 'q25', text: 'I finish the work I\'m doing. My attention is good.' }
  ];
  
  // Response options
  const responseOptions = [
    { value: '0', label: 'NOT TRUE', description: 'This is not true' },
    { value: '1', label: 'SOMEWHAT TRUE', description: 'This is somewhat true' },
    { value: '2', label: 'CERTAINLY TRUE', description: 'This is certainly true' }
  ];
  
  // State for form data (initialize with empty responses)
  const [formData, setFormData] = useState(
    questions.reduce((acc, question) => {
      acc[question.id] = '';
      return acc;
    }, {})
  );
  
  // Auto-save to localStorage when form data changes
  useEffect(() => {
    localStorage.setItem('sdqQuestionnaireData', JSON.stringify(formData));
  }, [formData]);
  
  // Load saved data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('sdqQuestionnaireData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);
  
  // Check if all questions are answered
  useEffect(() => {
    // Only require the main SDQ questions (not impact questions)
    const allMainQuestionsAnswered = Object.keys(formData).every(key => formData[key] !== '');
    setAllQuestionsAnswered(allMainQuestionsAnswered);
    setValidationError(false); // Reset validation error when form changes
  }, [formData]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // SDQ has 5 scales with 5 items each
  const scales = {
    emotional: ['q3', 'q8', 'q13', 'q16', 'q24'],
    conduct: ['q5', 'q7', 'q12', 'q18', 'q22'],
    hyperactivity: ['q2', 'q10', 'q15', 'q21', 'q25'],
    peer: ['q6', 'q11', 'q14', 'q19', 'q23'],
    prosocial: ['q1', 'q4', 'q9', 'q17', 'q20']
  };
  
  // Reverse-scored items (scored as 2-1-0 instead of 0-1-2)
  const reverseScored = ['q7', 'q11', 'q14', 'q21', 'q25'];
  
  // Calculate SDQ scores and subscales
  const calculateScores = () => {
    // Calculate subscale scores
    const emotional = calculateSubscaleScore('emotional');
    const conduct = calculateSubscaleScore('conduct');
    const hyperactivity = calculateSubscaleScore('hyperactivity');
    const peer = calculateSubscaleScore('peer');
    const prosocial = calculateSubscaleScore('prosocial');
    
    // Calculate total difficulties score
    const totalDifficulties = emotional + conduct + hyperactivity + peer;
    
    // Calculate externalizing and internalizing
    const externalizing = conduct + hyperactivity;
    const internalizing = emotional + peer;
    
    // Get clinical categories for each subscale
    const emotionalCategory = getCategoryScore(emotional, 'emotional');
    const conductCategory = getCategoryScore(conduct, 'conduct');
    const hyperactivityCategory = getCategoryScore(hyperactivity, 'hyperactivity');
    const peerCategory = getCategoryScore(peer, 'peer');
    const prosocialCategory = getCategoryScore(prosocial, 'prosocial');
    const totalDifficultiesCategory = getCategoryScore(totalDifficulties, 'totalDifficulties');
    
    return {
      emotional,
      conduct,
      hyperactivity,
      peer,
      prosocial,
      totalDifficulties,
      externalizing,
      internalizing,
      emotionalCategory,
      conductCategory,
      hyperactivityCategory,
      peerCategory,
      prosocialCategory,
      totalDifficultiesCategory
    };
  };
  
  // Calculate score for a specific subscale
  const calculateSubscaleScore = (subscale) => {
    // Get the questions for this subscale
    const subscaleQuestions = scales[subscale];
    
    // Calculate score for the subscale
    return subscaleQuestions.reduce((sum, qId) => {
      // Get the response value (0, 1, or 2)
      const responseValue = formData[qId] ? parseInt(formData[qId]) : 0;
      
      // Check if this question is reverse scored
      if (reverseScored.includes(qId)) {
        return sum + (2 - responseValue); // Reverse scoring: 0->2, 1->1, 2->0
      }
      
      // Standard scoring (0, 1, 2)
      return sum + responseValue;
    }, 0);
  };
  
  // Get category based on score and type
  const getCategoryScore = (score, type) => {
    if (type === 'totalDifficulties') {
      if (score <= 13) return 'Close to average';
      if (score <= 16) return 'Slightly raised';
      if (score <= 19) return 'High';
      return 'Very high';
    }
    else if (type === 'emotional') {
      if (score <= 3) return 'Close to average';
      if (score === 4) return 'Slightly raised';
      if (score === 5) return 'High';
      return 'Very high';
    }
    else if (type === 'conduct') {
      if (score <= 2) return 'Close to average';
      if (score === 3) return 'Slightly raised';
      if (score === 4) return 'High';
      return 'Very high';
    }
    else if (type === 'hyperactivity') {
      if (score <= 5) return 'Close to average';
      if (score === 6) return 'Slightly raised';
      if (score === 7) return 'High';
      return 'Very high';
    }
    else if (type === 'peer') {
      if (score <= 2) return 'Close to average';
      if (score === 3) return 'Slightly raised';
      if (score === 4) return 'High';
      return 'Very high';
    }
    else if (type === 'prosocial') {
      if (score >= 8) return 'Close to average';
      if (score === 7) return 'Slightly lowered';
      if (score === 6) return 'Low';
      return 'Very low';
    }
    return 'Unknown';
  };
  
  // Reusable question component for each item
  const QuestionItem = ({ question, value, onChange }) => {
    return (
      <div className="sdq-question-item">
        <div className="sdq-question-text">
          {question.text}
        </div>
        <div className="sdq-response-options">
          {responseOptions.map(option => (
            <div key={option.value} className="sdq-response-option">
              <input
                type="radio"
                id={`${question.id}-${option.value}`}
                name={question.id}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                aria-label={`${option.label} - ${option.description}`}
              />
              <label htmlFor={`${question.id}-${option.value}`}>
                <div className="sdq-option-label">{option.label}</div>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Generate interpretation based on total difficulties score
  const generateInterpretation = (totalDifficultiesScore) => {
    const category = getCategoryScore(totalDifficultiesScore, 'totalDifficulties');
    
    if (category === 'Close to average') {
      return 'The total difficulties score is within the normal range for children of this age.';
    } else if (category === 'Slightly raised') {
      return 'The total difficulties score is slightly raised, which may reflect some difficulties.';
    } else if (category === 'High') {
      return 'The total difficulties score is high, which may reflect significant difficulties in multiple areas.';
    } else if (category === 'Very high') {
      return 'The total difficulties score is very high, suggesting substantial risk of clinically significant problems.';
    } 
    
    return 'Unable to generate interpretation.';
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all questions are answered
    if (!allQuestionsAnswered) {
      setValidationError(true);
      return;
    }
    
    // Calculate all SDQ scores
    const calculatedScores = calculateScores();
    
    setScores(calculatedScores);
    
    // Create a structured array of questions with their scores and types
    const questionsArray = questions.map(question => {
      const response = formData[question.id];
      const numericScore = parseInt(response) || 0;
      
      // Determine if question is reverse scored
      const isReversed = reverseScored.includes(question.id);
      let scoreType = isReversed ? 'Reverse scored' : 'Standard scored';
      
      // Identify which scale this question belongs to
      let scale = '';
      Object.keys(scales).forEach(key => {
        if (scales[key].includes(question.id)) {
          scale = key;
        }
      });
      
      return {
        id: question.id,
        scale: scale,
        score: numericScore,
        finalScore: isReversed ? 2 - numericScore : numericScore,
        type: scoreType
      };
    });
    
    // Generate overall interpretation
    const overallInterpretation = generateInterpretation(calculatedScores.totalDifficulties);
    
    // Create results object
    const studentId = localStorage.getItem('studentId') || 'unknown';
    const timestamp = new Date().toISOString();
    const results = {
      studentId,
      timestamp,
      scores: calculatedScores,
      interpretation: overallInterpretation,
      questions: questionsArray
    };
    
    // Log results
    console.log('SDQ Questionnaire Results:', results);
    
    // Save to localStorage
    const storedResults = JSON.parse(localStorage.getItem('sdqResults') || '[]');
    localStorage.setItem('sdqResults', JSON.stringify([...storedResults, results]));
    
    setFormSubmitted(true);
    
    // If onComplete callback is provided, use it
    if (onComplete) {
      onComplete(results);
    }
  };
  
  // Export results as JSON
  const exportResults = () => {
    const scores = calculateScores();
    
    const dataStr = JSON.stringify({
      formData,
      scores
    }, null, 2);
    
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `SDQ_Results_${localStorage.getItem('studentId') || 'unknown'}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setExportError('');
    setExportSuccess('Results exported successfully!');
  };

  // Export results as CSV
  const exportToCSV = () => {
    setExportingCSV(true);
    
    // Calculate scores again to ensure latest data
    const emotionalScore = calculateSubscaleScore('emotional');
    const conductScore = calculateSubscaleScore('conduct');
    const hyperactivityScore = calculateSubscaleScore('hyperactivity');
    const peerScore = calculateSubscaleScore('peer');
    const prosocialScore = calculateSubscaleScore('prosocial');
    const totalDifficultiesScore = emotionalScore + conductScore + hyperactivityScore + peerScore;

    // Get categories for each score
    const emotionalCategory = getCategoryScore(emotionalScore, 'emotional');
    const conductCategory = getCategoryScore(conductScore, 'conduct');
    const hyperactivityCategory = getCategoryScore(hyperactivityScore, 'hyperactivity');
    const peerCategory = getCategoryScore(peerScore, 'peer');
    const prosocialCategory = getCategoryScore(prosocialScore, 'prosocial');
    const totalDifficultiesCategory = getCategoryScore(totalDifficultiesScore, 'totalDifficulties');
    
    const studentId = localStorage.getItem('studentId') || 'unknown';
    
    // Create CSV content with header row
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add metadata headers
    csvContent += "Student ID,Timestamp,";
    
    // Add score headers
    csvContent += "Emotional Problems Score,Emotional Problems Category,";
    csvContent += "Conduct Problems Score,Conduct Problems Category,";
    csvContent += "Hyperactivity Score,Hyperactivity Category,";
    csvContent += "Peer Problems Score,Peer Problems Category,";
    csvContent += "Prosocial Behavior Score,Prosocial Behavior Category,";
    csvContent += "Total Difficulties Score,Total Difficulties Category\n";
    
    // Add data row
    const timestamp = new Date().toISOString();
    csvContent += `${studentId},${timestamp},`;
    csvContent += `${emotionalScore},${emotionalCategory},`;
    csvContent += `${conductScore},${conductCategory},`;
    csvContent += `${hyperactivityScore},${hyperactivityCategory},`;
    csvContent += `${peerScore},${peerCategory},`;
    csvContent += `${prosocialScore},${prosocialCategory},`;
    csvContent += `${totalDifficultiesScore},${totalDifficultiesCategory}\n`;
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SDQ_Results_${studentId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExportError('');
    setExportSuccess('Results exported successfully!');
  };
  
  // Return to main menu
  const returnToMenu = () => {
    if (onComplete) {
      onComplete(null);
    } else {
      navigate('/');
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    const answeredCount = Object.values(formData).filter(val => val !== '').length;
    return (answeredCount / questions.length) * 100;
  };
  
  // Render the form
  return (
    <div className="task-screen">
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading questionnaire...</p>
        </div>
      ) : !formSubmitted ? (
        <div className="sdq-questionnaire-container">
          <h1 className="sdq-title">Strengths and Difficulties Questionnaire</h1>
          <h2 className="sdq-subtitle">Self-Report Version</h2>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          
          <div className="sdq-instructions">
            <p>For each item, please mark the box for Not True, Somewhat True or Certainly True.</p>
            <p>Please answer all items as best you can even if you are not absolutely certain.</p>
            <p>Please give your answers on the basis of <strong>how things have been for you over the last six months</strong>.</p>
          </div>
          
          {validationError && (
            <div className="validation-error">
              Please answer all of the first 25 questions before submitting.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="sdq-form">
            <div className="sdq-section">
              <div className="sdq-response-header">
                <div></div>
                <div className="sdq-response-label">NOT TRUE</div>
                <div className="sdq-response-label">SOMEWHAT TRUE</div>
                <div className="sdq-response-label">CERTAINLY TRUE</div>
              </div>
              
              {questions.map(question => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  value={formData[question.id]}
                  onChange={handleChange}
                />
              ))}
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className="form-button submit"
                disabled={!allQuestionsAnswered}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="sdq-questionnaire-container">
          <h1 className="sdq-title">Results</h1>
          <p>Your responses have been recorded. Thank you for completing the questionnaire.</p>
          
          <div className="score-summary">
            <h2>SDQ Score Summary</h2>
            
            <div className="scores-grid">
              <div className="score-item">
                <h3>Emotional Problems:</h3>
                <p className="score">{scores.emotional}</p>
                <p className="category">{scores.emotionalCategory}</p>
              </div>
              
              <div className="score-item">
                <h3>Conduct Problems:</h3>
                <p className="score">{scores.conduct}</p>
                <p className="category">{scores.conductCategory}</p>
              </div>
              
              <div className="score-item">
                <h3>Hyperactivity:</h3>
                <p className="score">{scores.hyperactivity}</p>
                <p className="category">{scores.hyperactivityCategory}</p>
              </div>
              
              <div className="score-item">
                <h3>Peer Problems:</h3>
                <p className="score">{scores.peer}</p>
                <p className="category">{scores.peerCategory}</p>
              </div>
              
              <div className="score-item">
                <h3>Prosocial Behavior:</h3>
                <p className="score">{scores.prosocial}</p>
                <p className="category">{scores.prosocialCategory}</p>
              </div>
              
              <div className="score-item total">
                <h3>Total Difficulties:</h3>
                <p className="score">{scores.totalDifficulties}</p>
                <p className="category">{scores.totalDifficultiesCategory}</p>
              </div>
            </div>
            
            <p className="interpretation">{generateInterpretation(scores.totalDifficulties)}</p>
            
            <p className="note" style={{ color: '#3498db', marginTop: '15px', fontStyle: 'italic' }}>
              A combined CSV file with all questionnaire results will be available for download 
              after completing all questionnaires.
            </p>
          </div>
          
          {exportError && <div className="error-message">{exportError}</div>}
          {exportSuccess && <div className="success-message">{exportSuccess}</div>}
          
          <div className="form-actions">
            <button
              className="form-button export"
              onClick={exportResults}
            >
              Export Results as JSON
            </button>
            
            <button 
              className="form-button" 
              onClick={exportToCSV}
            >
              Export Results as CSV
            </button>
            
            <button 
              className="form-button" 
              onClick={returnToMenu}
            >
              {onComplete ? "Continue to Next Questionnaire" : "Return to Home"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SDQQuestionnaire; 