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

  // Helper function to properly escape CSV field values
  const escapeCSVField = (value) => {
    if (value === null || value === undefined) {
      return '""';
    }
    
    // Convert to string if not already
    const stringValue = String(value);
    
    // Replace any double quotes with two double quotes (proper CSV escaping)
    const escapedValue = stringValue.replace(/"/g, '""');
    
    // Always wrap in quotes to safely handle commas, newlines, etc.
    return `"${escapedValue}"`;
  };

  // Format REFUSED responses for the CSV export
  const formatRefusedResponse = (value) => {
    // For numeric values, check if it's -9 (conventional missing data code)
    if (typeof value === 'number') {
      return value === -9 ? "REFUSED" : value;
    }
    
    // For string values, handle 'Refused' or other formats
    if (typeof value === 'string') {
      if (value === 'Refused' || value === 'REFUSED' || value === '-9') {
        return "REFUSED";
      }
    }
    
    return value;
  };

  // Export all questionnaire results as a single CSV
  const exportCombinedResults = () => {
    if (!aceiqResults || !sesResults || !mfqResults || !sdqResults) return;
    
    const csvData = [];
    const studentId = localStorage.getItem('studentId') || 'unknown';
    const timestamp = new Date().toISOString();
    
    // Add file header
    csvData.push([escapeCSVField('COGNITIVE TASKS QUESTIONNAIRE RESULTS')]);
    csvData.push([escapeCSVField('Student ID:'), escapeCSVField(studentId)]);
    csvData.push([escapeCSVField('Export Date:'), escapeCSVField(timestamp)]);
    csvData.push([]);  // Blank row
    
    // ===== DEMOGRAPHIC INFORMATION SECTION =====
    // This section will stand out in the CSV file with clear formatting
    csvData.push([escapeCSVField('=========================================')]);
    csvData.push([escapeCSVField('========== DEMOGRAPHIC INFORMATION ==========')]);
    csvData.push([escapeCSVField('=========================================')]);
    
    // Add demographic headers
    csvData.push([escapeCSVField('Category'), escapeCSVField('Value'), escapeCSVField('Source')]);
    
    // Get demographic information from ACEIQ results, which contains sex, age, ethnicity data
    // Extract demographic data from aceiqResults if available
    try {
      // First check for the dedicated demographics object (new format)
      if (aceiqResults && aceiqResults.demographics) {
        const demographics = aceiqResults.demographics;
        
        // Add each demographic field
        Object.entries(demographics).forEach(([key, value]) => {
          if (value) { // Only add if there's a value
            const fieldName = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter
            // Format REFUSED responses
            const formattedValue = formatRefusedResponse(value);
            csvData.push([
              escapeCSVField(fieldName), 
              escapeCSVField(formattedValue), 
              escapeCSVField('ACE-IQ')
            ]);
          }
        });
      }
      // Fall back to checking formData if demographics object isn't available
      else if (aceiqResults && aceiqResults.formData) {
        // Sex
        if (aceiqResults.formData.sex) {
          // Format REFUSED responses
          const formattedSex = formatRefusedResponse(aceiqResults.formData.sex);
          csvData.push([
            escapeCSVField('Sex'), 
            escapeCSVField(formattedSex), 
            escapeCSVField('ACE-IQ')
          ]);
        }
        
        // Age
        if (aceiqResults.formData.age) {
          // Format REFUSED responses
          const formattedAge = formatRefusedResponse(aceiqResults.formData.age);
          csvData.push([
            escapeCSVField('Age'), 
            escapeCSVField(formattedAge), 
            escapeCSVField('ACE-IQ')
          ]);
        }
        
        // Birth Date
        if (aceiqResults.formData.birthDate) {
          // Format REFUSED responses
          const formattedBirthDate = formatRefusedResponse(aceiqResults.formData.birthDate);
          csvData.push([
            escapeCSVField('Birth Date'), 
            escapeCSVField(formattedBirthDate), 
            escapeCSVField('ACE-IQ')
          ]);
        }
        
        // Ethnicity
        if (aceiqResults.formData.ethnicity) {
          // Format REFUSED responses
          const formattedEthnicity = formatRefusedResponse(aceiqResults.formData.ethnicity);
          csvData.push([
            escapeCSVField('Ethnicity'), 
            escapeCSVField(formattedEthnicity), 
            escapeCSVField('ACE-IQ')
          ]);
        }
      } else {
        // Extract from direct properties if neither demographics nor formData is available
        const demoProperties = ['sex', 'age', 'birthDate', 'ethnicity'];
        demoProperties.forEach(prop => {
          if (aceiqResults && aceiqResults[prop]) {
            // Format REFUSED responses
            const formattedValue = formatRefusedResponse(aceiqResults[prop]);
            csvData.push([
              escapeCSVField(prop.charAt(0).toUpperCase() + prop.slice(1)), // Capitalize first letter
              escapeCSVField(formattedValue),
              escapeCSVField('ACE-IQ')
            ]);
          }
        });
      }
    } catch (error) {
      console.error('Error extracting demographic data:', error);
      csvData.push([
        escapeCSVField('Error'), 
        escapeCSVField('Failed to extract demographic data'), 
        escapeCSVField('System')
      ]);
    }
    
    // Add additional demographic information
    csvData.push([
      escapeCSVField('Participant ID'), 
      escapeCSVField(studentId), 
      escapeCSVField('System')
    ]);
    csvData.push([
      escapeCSVField('Testing Date'), 
      escapeCSVField(new Date().toLocaleDateString()), 
      escapeCSVField('System')
    ]);
    
    // Add blank separator rows
    csvData.push([]);
    csvData.push([]);
    
    // ACEIQ section
    csvData.push([escapeCSVField('===== ADVERSE CHILDHOOD EXPERIENCES QUESTIONNAIRE (ACE-IQ) =====')]);
    csvData.push([escapeCSVField('Questionnaire'), escapeCSVField('Question ID'), escapeCSVField('Score'), escapeCSVField('Score Type'), escapeCSVField('Section'), escapeCSVField('Response')]);
    
    if (aceiqResults.questions && Array.isArray(aceiqResults.questions)) {
      // Map question IDs to their types for the CSV
      const aceiqQuestionTypes = {};
      
      // These arrays should match the ones in ACEIQQuestionnaire.js
      const frequencyType5Questions = ['parentsUnderstandProblems', 'parentsKnowFreeTime'];
      const yesNoQuestions = [
        'alcoholicHouseholdMember', 'mentallyIllHouseholdMember', 
        'imprisonedHouseholdMember', 'parentsSeparated', 'parentDied'
      ];
      
      // Community violence questions
      const communityViolenceQuestions = [
        'witnessedBeating', 'witnessedStabbingOrShooting', 'witnessedThreatenedWithWeapon'
      ];
      
      // All other questions are frequency4 type
      
      frequencyType5Questions.forEach(id => aceiqQuestionTypes[id] = 'Reverse scored (Protective factor)');
      yesNoQuestions.forEach(id => aceiqQuestionTypes[id] = 'Binary');
      communityViolenceQuestions.forEach(id => aceiqQuestionTypes[id] = 'Community Violence (1-4)');
      
      aceiqResults.questions.forEach(q => {
        // Determine score type if not already set
        let scoreType = q.type || aceiqQuestionTypes[q.id] || 'Frequency (1-4)';
        
        // Determine section
        let section = '';
        if (frequencyType5Questions.includes(q.id)) {
          section = 'Relationship with Parents';
        } else if (['notEnoughFood', 'parentsDrunkOrDrugs', 'notSentToSchool'].includes(q.id)) {
          section = 'Neglect';
        } else if (yesNoQuestions.includes(q.id) || 
                  ['witnessedVerbalAbuse', 'witnessedPhysicalAbuse', 'witnessedWeaponAbuse'].includes(q.id)) {
          section = 'Family Environment';
        } else if (['verbalAbuse', 'threatenedAbandonment', 'physicalAbuse', 'weaponAbuse', 
                    'sexualTouching', 'sexualFondling', 'attemptedSexualIntercourse', 'completedSexualIntercourse'].includes(q.id)) {
          section = 'Direct Abuse';
        } else if (['bullied', 'physicalFight'].includes(q.id)) {
          section = 'Peer Violence';
        } else if (communityViolenceQuestions.includes(q.id)) {
          section = 'Community Violence';
        }
        
        // Format score for REFUSED responses
        const formattedScore = formatRefusedResponse(q.score);
        
        // Include original response if available
        const response = q.response ? formatRefusedResponse(q.response) : '';
        
        csvData.push([
          escapeCSVField('ACEIQ'), 
          escapeCSVField(q.id), 
          escapeCSVField(formattedScore),
          escapeCSVField(scoreType),
          escapeCSVField(section),
          escapeCSVField(response)
        ]);
      });
      
      csvData.push([escapeCSVField('ACEIQ'), escapeCSVField('TOTAL'), escapeCSVField(aceiqResults.totalScore), escapeCSVField('Sum of all items'), '', '']);
    }
    
    // Blank row between questionnaires
    csvData.push([]);
    csvData.push([]);
    
    // SES section
    csvData.push([escapeCSVField('===== SOCIOECONOMIC STATUS QUESTIONNAIRE (SES) =====')]);
    csvData.push([escapeCSVField('Questionnaire'), escapeCSVField('Question ID'), escapeCSVField('Score'), escapeCSVField('Score Type'), escapeCSVField('Response')]);
    
    if (sesResults.questions && Array.isArray(sesResults.questions)) {
      sesResults.questions.forEach(q => {
        // Determine score type - only struggledFinancially is reverse scored
        const scoreType = q.type || (q.id === 'struggledFinancially' ? 'Reverse scored' : 'Standard scored');
        
        // Format score for REFUSED responses
        const formattedScore = formatRefusedResponse(q.score);
        
        // Include original response if available
        const response = q.response ? formatRefusedResponse(q.response) : '';
        
        csvData.push([
          escapeCSVField('SES'), 
          escapeCSVField(q.id), 
          escapeCSVField(formattedScore), 
          escapeCSVField(scoreType), 
          escapeCSVField(response)
        ]);
      });
      csvData.push([escapeCSVField('SES'), escapeCSVField('TOTAL'), escapeCSVField(sesResults.totalScore), escapeCSVField('Sum of all items'), '']);
    }
    
    // Blank row between questionnaires
    csvData.push([]);
    csvData.push([]);
    
    // MFQ section
    csvData.push([escapeCSVField('===== MOOD AND FEELINGS QUESTIONNAIRE (MFQ) =====')]);
    csvData.push([escapeCSVField('Questionnaire'), escapeCSVField('Question ID'), escapeCSVField('Score'), escapeCSVField('Score Type'), escapeCSVField('Response')]);
    
    if (mfqResults.questions && Array.isArray(mfqResults.questions)) {
      mfqResults.questions.forEach(q => {
        // Format score for REFUSED responses
        const formattedScore = formatRefusedResponse(q.score);
        
        // Include original response if available
        const response = q.response ? formatRefusedResponse(q.response) : '';
        
        csvData.push([
          escapeCSVField('MFQ'), 
          escapeCSVField(q.id), 
          escapeCSVField(formattedScore), 
          escapeCSVField(q.type || 'Standard scored'), 
          escapeCSVField(response)
        ]);
      });
      csvData.push([escapeCSVField('MFQ'), escapeCSVField('TOTAL'), escapeCSVField(mfqResults.totalScore), escapeCSVField('Sum of all items'), '']);
      
      // Add interpretation row
      if (mfqResults.interpretation) {
        csvData.push([escapeCSVField('MFQ'), escapeCSVField('INTERPRETATION'), escapeCSVField(mfqResults.interpretation), escapeCSVField('Clinical interpretation'), '']);
      }
    }
    
    // Blank row between questionnaires
    csvData.push([]);
    csvData.push([]);
    
    // SDQ section
    csvData.push([escapeCSVField('===== STRENGTHS AND DIFFICULTIES QUESTIONNAIRE (SDQ) =====')]);
    csvData.push([escapeCSVField('Questionnaire'), escapeCSVField('Question ID'), escapeCSVField('Score'), escapeCSVField('Score Type'), escapeCSVField('Response')]);
    
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
        
        // Format score for REFUSED responses
        const formattedScore = formatRefusedResponse(q.score);
        
        // Include original response if available
        const response = q.response ? formatRefusedResponse(q.response) : '';
        
        csvData.push([
          escapeCSVField('SDQ'), 
          escapeCSVField(q.id), 
          escapeCSVField(formattedScore), 
          escapeCSVField(scoreType), 
          escapeCSVField(response)
        ]);
      });
      
      // Add a separator before summary scores
      csvData.push([]);
      csvData.push([escapeCSVField('===== SDQ SUMMARY SCORES =====')]);
      csvData.push([escapeCSVField('Scale'), escapeCSVField('Score'), escapeCSVField('Category'), '', '']);
      
      // Include subscale scores with categories
      if (sdqResults.scores) {
        // Format scores for REFUSED responses
        const formattedEmotional = formatRefusedResponse(sdqResults.scores.emotional);
        const formattedConduct = formatRefusedResponse(sdqResults.scores.conduct);
        const formattedHyperactivity = formatRefusedResponse(sdqResults.scores.hyperactivity);
        const formattedPeer = formatRefusedResponse(sdqResults.scores.peer);
        const formattedProsocial = formatRefusedResponse(sdqResults.scores.prosocial);
        const formattedTotalDifficulties = formatRefusedResponse(sdqResults.scores.totalDifficulties);
        const formattedExternalizing = formatRefusedResponse(sdqResults.scores.externalizing);
        const formattedInternalizing = formatRefusedResponse(sdqResults.scores.internalizing);
        
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('EMOTIONAL_PROBLEMS'), escapeCSVField(formattedEmotional), escapeCSVField('Subscale total'), '']);
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('EMOTIONAL_CATEGORY'), escapeCSVField(sdqResults.scores.emotionalCategory), escapeCSVField('Clinical category'), '']);
        
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('CONDUCT_PROBLEMS'), escapeCSVField(formattedConduct), escapeCSVField('Subscale total'), '']);
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('CONDUCT_CATEGORY'), escapeCSVField(sdqResults.scores.conductCategory), escapeCSVField('Clinical category'), '']);
        
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('HYPERACTIVITY'), escapeCSVField(formattedHyperactivity), escapeCSVField('Subscale total'), '']);
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('HYPERACTIVITY_CATEGORY'), escapeCSVField(sdqResults.scores.hyperactivityCategory), escapeCSVField('Clinical category'), '']);
        
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('PEER_PROBLEMS'), escapeCSVField(formattedPeer), escapeCSVField('Subscale total'), '']);
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('PEER_CATEGORY'), escapeCSVField(sdqResults.scores.peerCategory), escapeCSVField('Clinical category'), '']);
        
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('PROSOCIAL'), escapeCSVField(formattedProsocial), escapeCSVField('Subscale total (higher is better)'), '']);
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('PROSOCIAL_CATEGORY'), escapeCSVField(sdqResults.scores.prosocialCategory), escapeCSVField('Clinical category'), '']);
        
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('TOTAL_DIFFICULTIES'), escapeCSVField(formattedTotalDifficulties), escapeCSVField('Sum of problem subscales'), '']);
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('TOTAL_CATEGORY'), escapeCSVField(sdqResults.scores.totalDifficultiesCategory), escapeCSVField('Clinical category'), '']);
        
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('EXTERNALIZING'), escapeCSVField(formattedExternalizing), escapeCSVField('Conduct + Hyperactivity'), '']);
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('INTERNALIZING'), escapeCSVField(formattedInternalizing), escapeCSVField('Emotional + Peer'), '']);
      }
      
      // Interpretation
      if (sdqResults.interpretation) {
        csvData.push([escapeCSVField('SDQ'), escapeCSVField('INTERPRETATION'), escapeCSVField(sdqResults.interpretation), '', '']);
      }
    }
    
    // Create the CSV content from the data
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    
    // Export to CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
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