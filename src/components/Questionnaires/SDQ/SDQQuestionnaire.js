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
    const allAnswered = Object.values(formData).every(value => value !== '');
    setAllQuestionsAnswered(allAnswered);
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
  
  // Some items are reverse-scored
  const reverseScored = ['q7', 'q11', 'q14', 'q21', 'q25'];
  
  // Calculate scores
  const calculateScores = () => {
    // SDQ has 5 scales with 5 items each
    const scores = {};
    
    // Calculate score for each scale
    Object.entries(scales).forEach(([scale, items]) => {
      scores[scale] = items.reduce((sum, item) => {
        let value = parseInt(formData[item]);
        
        // If the item is reverse-scored, reverse it (0->2, 1->1, 2->0)
        if (reverseScored.includes(item)) {
          value = 2 - value;
        }
        
        return sum + value;
      }, 0);
    });
    
    // Calculate total difficulties score (all but prosocial)
    scores.totalDifficulties = scores.emotional + scores.conduct + scores.hyperactivity + scores.peer;
    
    return scores;
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
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all questions are answered
    if (!allQuestionsAnswered) {
      setValidationError(true);
      window.scrollTo(0, 0); // Scroll to top to show error
      return;
    }
    
    // Calculate scores
    const scores = calculateScores();
    
    // Prepare structured questions array for combined export
    const questionsArray = questions.map(question => {
      const response = formData[question.id];
      const responseLabel = responseOptions.find(option => option.value === response)?.label || '';
      
      // Get the scale this question belongs to
      let scale = '';
      if (scales.emotional.includes(question.id)) scale = 'emotional';
      else if (scales.conduct.includes(question.id)) scale = 'conduct';
      else if (scales.hyperactivity.includes(question.id)) scale = 'hyperactivity';
      else if (scales.peer.includes(question.id)) scale = 'peer';
      else if (scales.prosocial.includes(question.id)) scale = 'prosocial';
      
      // Check if question is reverse scored
      const isReversed = reverseScored.includes(question.id);
      
      return {
        id: question.id,
        question: question.text,
        answer: responseLabel,
        scale: scale,
        isReversed: isReversed,
        rawScore: parseInt(response),
        finalScore: isReversed ? (2 - parseInt(response)) : parseInt(response)
      };
    });
    
    // Save form data
    const studentId = localStorage.getItem('studentId') || 'unknown';
    const timestamp = new Date().toISOString();
    const results = {
      studentId,
      timestamp,
      data: formData,
      scores,
      questions: questionsArray, // Include the detailed questions array
      scaleScores: {
        emotional: scores.emotional,
        conduct: scores.conduct,
        hyperactivity: scores.hyperactivity,
        peer: scores.peer,
        prosocial: scores.prosocial,
        totalDifficulties: scores.totalDifficulties
      }
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
      scores,
      timestamp: new Date().toISOString()
    }, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `sdq_results_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Export results as CSV
  const exportToCSV = (scores) => {
    setExportingCSV(true);
    
    try {
      // Get participant ID and timestamp
      const studentId = localStorage.getItem('studentId') || 'unknown';
      const timestamp = new Date().toISOString();
      
      // Create CSV header row
      let csvContent = 'StudentID,Timestamp,QuestionID,QuestionText,Response,ResponseValue\n';
      
      // Add row for each question with response
      questions.forEach(question => {
        const response = formData[question.id];
        const responseLabel = responseOptions.find(option => option.value === response)?.label || '';
        
        csvContent += [
          studentId,
          timestamp,
          question.id,
          `"${question.text.replace(/"/g, '""')}"`, // Escape any quotes in question text
          `"${responseLabel}"`,
          response
        ].join(',') + '\n';
      });
      
      // Add scores
      if (scores) {
        Object.entries(scores).forEach(([scale, score]) => {
          csvContent += [
            studentId,
            timestamp,
            `SCORE_${scale.toUpperCase()}`,
            `"SDQ ${scale} score"`,
            '',
            score
          ].join(',') + '\n';
        });
      }
      
      // Create downloadable link
      const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `sdq_results_${studentId}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      
      // Download file
      link.click();
      document.body.removeChild(link);
      setExportingCSV(false);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setExportingCSV(false);
    }
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
              Please answer all questions before submitting.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="sdq-form">
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
            <p>Your questionnaire has been successfully submitted.</p>
            <p>The results will be analyzed by a qualified professional.</p>
            <p className="note" style={{ color: '#3498db', marginTop: '15px', fontStyle: 'italic' }}>
              A combined CSV file with all questionnaire results will be available for download 
              after completing all questionnaires.
            </p>
          </div>
          
          <div className="form-actions">
            <button
              className="form-button export"
              onClick={exportResults}
            >
              Export Results as JSON
            </button>
            
            {/* CSV export removed - will be handled at the end of all questionnaires */}
            
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