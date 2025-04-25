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
  
  // Calculate SDQ scores and subscales
  const calculateScores = () => {
    // Check if all questions are answered
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
    const subscaleQuestions = {
      emotional: ['often_complains_of_headaches', 'many_worries', 'often_unhappy', 'nervous_or_clingy', 'many_fears'],
      conduct: ['often_has_temper_tantrums', 'generally_obedient', 'often_fights_with_other_children', 'often_lies_or_cheats', 'steals_from_home'],
      hyperactivity: ['restless_overactive', 'constantly_fidgeting', 'easily_distracted', 'thinks_things_out', 'sees_tasks_through'],
      peer: ['rather_solitary', 'has_at_least_one_good_friend', 'generally_liked_by_others', 'picked_on_or_bullied', 'gets_on_better_with_adults'],
      prosocial: ['considerate_of_others', 'shares_readily', 'helpful_if_someone_hurt', 'kind_to_younger_children', 'often_volunteers']
    };

    const reverseScored = {
      conduct: ['generally_obedient'],
      hyperactivity: ['thinks_things_out', 'sees_tasks_through'],
      peer: ['has_at_least_one_good_friend', 'generally_liked_by_others']
    };
    
    // Calculate score for the subscale
    return subscaleQuestions[subscale].reduce((sum, qId) => {
      const score = formData[qId] ? parseInt(formData[qId]) : 0;
      // Check if this question is reverse scored
      if (reverseScored[subscale] && reverseScored[subscale].includes(qId)) {
        return sum + (2 - score); // Reverse scoring: 0->2, 1->1, 2->0
      }
      return sum + score;
    }, 0);
  };
  
  // Get clinical category based on score and subscale
  const getCategoryScore = (score, subscale) => {
    // Clinical cutoff values based on parent-report SDQ (ages 4-17)
    const cutoffs = {
      emotional: { normal: [0, 3], borderline: [4, 4], abnormal: [5, 10] },
      conduct: { normal: [0, 2], borderline: [3, 3], abnormal: [4, 10] },
      hyperactivity: { normal: [0, 5], borderline: [6, 6], abnormal: [7, 10] },
      peer: { normal: [0, 2], borderline: [3, 3], abnormal: [4, 10] },
      prosocial: { normal: [6, 10], borderline: [5, 5], abnormal: [0, 4] }, // Note: Reversed thresholds
      totalDifficulties: { normal: [0, 13], borderline: [14, 16], abnormal: [17, 40] }
    };
    
    // Determine category
    if (cutoffs[subscale]) {
      if (score >= cutoffs[subscale].normal[0] && score <= cutoffs[subscale].normal[1]) {
        return 'Normal';
      } else if (score >= cutoffs[subscale].borderline[0] && score <= cutoffs[subscale].borderline[1]) {
        return 'Borderline';
      } else if (score >= cutoffs[subscale].abnormal[0] && score <= cutoffs[subscale].abnormal[1]) {
        return 'Abnormal';
      }
    }
    
    return 'Unknown'; // Default if no match
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
  
  // Generate overall interpretation text based on scores
  const generateInterpretation = (scores) => {
    let interpretation = '';
    
    if (scores.totalDifficultiesCategory === 'Abnormal') {
      interpretation = 'The total difficulties score suggests significant difficulties that likely warrant further assessment and intervention.';
    } else if (scores.totalDifficultiesCategory === 'Borderline') {
      interpretation = 'The total difficulties score suggests some difficulties that may warrant monitoring or follow-up.';
    } else {
      interpretation = 'The total difficulties score is within the normal range.';
    }
    
    return interpretation;
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
      
      // Determine if question is reverse scored based on subscale and item
      let scoreType = 'Standard scored';
      
      // Prosocial items are reverse scored relative to problems (higher is better)
      if (question.id.startsWith('prosocial')) {
        scoreType = 'Prosocial item (higher is better)';
      }
      // Specific reverse scored items in the difficulties subscales
      else if (['emotional7', 'conduct5', 'conduct7', 'hyperactivity2', 'hyperactivity10', 'peer6'].includes(question.id)) {
        scoreType = 'Reverse scored';
      }
      
      return {
        id: question.id,
        score: numericScore,
        type: scoreType
      };
    });
    
    // Generate overall interpretation
    const overallInterpretation = generateInterpretation(calculatedScores);
    
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
  const exportToCSV = () => {
    setExportingCSV(true);
    
    try {
      // Get participant ID and timestamp
      const studentId = localStorage.getItem('studentId') || 'unknown';
      const timestamp = new Date().toISOString();
      
      // Create CSV header row - exclude response data
      let csvContent = 'StudentID,Timestamp,QuestionID,Score,Score Type\n';
      
      // Add row for each question
      questions.forEach(question => {
        const response = formData[question.id];
        const numericScore = parseInt(response) || 0;
        
        // Determine if question is reverse scored or a special type
        let scoreType = 'Standard scored';
        
        // Prosocial items are reverse scored relative to problems
        if (question.id.startsWith('prosocial')) {
          scoreType = 'Prosocial item (higher is better)';
        }
        // Specific reverse scored items in the difficulties subscales
        else if (['emotional7', 'conduct5', 'conduct7', 'hyperactivity2', 'hyperactivity10', 'peer6'].includes(question.id)) {
          scoreType = 'Reverse scored';
        }
        
        csvContent += [
          studentId,
          timestamp,
          question.id,
          numericScore,
          `"${scoreType}"`
        ].join(',') + '\n';
      });
      
      // Add subscale scores
      const scoreEntries = [
        ['EMOTIONAL', scores.emotional, 'Subscale total'],
        ['EMOTIONAL_CATEGORY', `"${scores.emotionalCategory}"`, 'Clinical category'],
        ['CONDUCT', scores.conduct, 'Subscale total'],
        ['CONDUCT_CATEGORY', `"${scores.conductCategory}"`, 'Clinical category'],
        ['HYPERACTIVITY', scores.hyperactivity, 'Subscale total'],
        ['HYPERACTIVITY_CATEGORY', `"${scores.hyperactivityCategory}"`, 'Clinical category'],
        ['PEER', scores.peer, 'Subscale total'],
        ['PEER_CATEGORY', `"${scores.peerCategory}"`, 'Clinical category'],
        ['PROSOCIAL', scores.prosocial, 'Subscale total (higher is better)'],
        ['PROSOCIAL_CATEGORY', `"${scores.prosocialCategory}"`, 'Clinical category'],
        ['TOTAL_DIFFICULTIES', scores.totalDifficulties, 'Sum of problem subscales'],
        ['TOTAL_CATEGORY', `"${scores.totalDifficultiesCategory}"`, 'Clinical category'],
        ['EXTERNALIZING', scores.externalizing, 'Conduct + Hyperactivity'],
        ['INTERNALIZING', scores.internalizing, 'Emotional + Peer']
      ];
      
      scoreEntries.forEach(([label, value, type]) => {
        csvContent += [
          studentId,
          timestamp,
          label,
          value,
          `"${type}"`
        ].join(',') + '\n';
      });
      
      // Add interpretation if available
      const interpretation = generateInterpretation(scores);
      if (interpretation) {
        csvContent += [
          studentId,
          timestamp,
          'INTERPRETATION',
          `"${interpretation}"`,
          '"Clinical interpretation"'
        ].join(',') + '\n';
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