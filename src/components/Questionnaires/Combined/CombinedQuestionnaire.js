import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import ACEIQQuestionnaire from '../ACEIQ/ACEIQQuestionnaire';
import SESQuestionnaire from '../SES/SESQuestionnaire';
import MFQQuestionnaire from '../MFQ/MFQQuestionnaire';
import SDQQuestionnaire from '../SDQ/SDQQuestionnaire';
import './Combined.css';

// Define question texts maps that are used in multiple functions
// SES question texts
const sesQuestionTexts = {
  'parentsEducation': 'What is the highest level of education your parents or guardians have completed?',
  'parentsOccupation': 'What is your parents\' or guardians\' current occupation?',
  'householdIncome': 'What is your household\'s approximate annual income?',
  'livingConditions': 'How would you describe your living conditions?',
  'struggledFinancially': 'In the past year, how often has your family struggled financially?',
  'accessToResources': 'How would you rate your access to resources like healthcare, education, and other services?',
  'moneyForHome': 'When growing up, your family had enough money to afford the kind of home you all needed',
  'moneyForClothing': 'When growing up, your family had enough money to afford the kind of clothing you all needed',
  'moneyForFood': 'When growing up, your family had enough money to afford the kind of food that you all needed',
  'moneyForMedicalCare': 'When growing up, your family had enough money to afford the kind of medical care that you all needed',
  'feltRichComparedToSchool': 'When growing up, I felt well-off (rich, wealthy) compared to other kids in my school',
  'feltRichComparedToNeighborhood': 'When growing up, I felt well-off (rich, wealthy) compared to other kids in my neighborhood'
};

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
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Handle completion of ACEIQ questionnaire
  const handleAceiqComplete = (results) => {
    // Make sure we store the complete formData with all responses
    if (results && !results.formData && results.questions) {
      console.warn('Adding missing formData to ACEIQ results');
      results.formData = results.questions.reduce((obj, q) => {
        obj[q.id] = q.response || (results.formData ? results.formData[q.id] : null);
        return obj;
      }, {});
    }
    
    setAceiqResults(results);
    setAceiqCompleted(true);
    
    // Check if results is null (user clicked "Continue" without submitting)
    if (!results) {
      setCurrentQuestionnaire('SES');
      return;
    }
    
    // Save full results including all individual responses to localStorage
    try {
      const storedData = JSON.parse(localStorage.getItem('aceiqResults') || '[]');
      localStorage.setItem('aceiqResults', JSON.stringify([...storedData, results]));
    } catch (error) {
      console.error('Error saving ACEIQ results to localStorage', error);
    }
    
    // Move to next questionnaire
    setCurrentQuestionnaire('SES');
  };
  
  // Handle completion of SES questionnaire
  const handleSesComplete = (results) => {
    // Make sure we store the complete formData with all responses
    if (results && !results.formData && results.questions) {
      console.warn('Adding missing formData to SES results');
      results.formData = results.questions.reduce((obj, q) => {
        // Store both the response and the score
        obj[q.id] = {
          response: q.response || null,
          score: q.score || 0
        };
        return obj;
      }, {});
    }
    
    // If questions array is missing but formData exists, reconstruct questions
    if (results && results.formData && (!results.questions || !Array.isArray(results.questions) || results.questions.length === 0)) {
      console.warn('Reconstructing questions array for SES results');
      results.questions = Object.entries(results.formData).map(([id, data]) => ({
        id,
        response: data.response || null,
        score: data.score || 0
      }));
    }
    
    console.log('Processed SES Results:', results);
    setSesResults(results);
    setSesCompleted(true);
    
    // Check if results is null (user clicked "Continue" without submitting)
    if (!results) {
      setCurrentQuestionnaire('MFQ');
      return;
    }
    
    // Save full results including all individual responses to localStorage
    try {
      const storedData = JSON.parse(localStorage.getItem('sesResults') || '[]');
      localStorage.setItem('sesResults', JSON.stringify([...storedData, results]));
    } catch (error) {
      console.error('Error saving SES results to localStorage', error);
    }
    
    // Move to next questionnaire
    setCurrentQuestionnaire('MFQ');
  };

  // Handle completion of MFQ questionnaire
  const handleMfqComplete = (results) => {
    // Make sure we store the complete formData with all responses
    if (results && !results.formData && results.questions) {
      console.warn('Adding missing formData to MFQ results');
      results.formData = results.questions.reduce((obj, q) => {
        obj[q.id] = q.response || (results.formData ? results.formData[q.id] : null);
        return obj;
      }, {});
    }
    
    // If questions array is missing but formData exists, reconstruct questions
    if (results && results.formData && (!results.questions || !Array.isArray(results.questions) || results.questions.length === 0)) {
      console.warn('Reconstructing questions array for MFQ results');
      results.questions = Object.entries(results.formData).map(([id, response]) => ({
        id,
        response,
        score: typeof response === 'number' ? response : 0
      }));
    }
    
    console.log('Processed MFQ Results:', results);
    setMfqResults(results);
    setMfqCompleted(true);
    
    // Check if results is null (user clicked "Continue" without submitting)
    if (!results) {
      setCurrentQuestionnaire('SDQ');
      return;
    }
    
    // Save full results including all individual responses to localStorage
    try {
      const storedData = JSON.parse(localStorage.getItem('mfqResults') || '[]');
      localStorage.setItem('mfqResults', JSON.stringify([...storedData, results]));
    } catch (error) {
      console.error('Error saving MFQ results to localStorage', error);
    }
    
    // Move to next questionnaire
    setCurrentQuestionnaire('SDQ');
  };

  // Handle completion of SDQ questionnaire
  const handleSdqComplete = (results) => {
    // Make sure we store the complete formData with all responses
    if (results && !results.formData && results.questions) {
      console.warn('Adding missing formData to SDQ results');
      results.formData = results.questions.reduce((obj, q) => {
        obj[q.id] = q.response || (results.formData ? results.formData[q.id] : null);
        return obj;
      }, {});
    }
    
    // If questions array is missing but formData exists, reconstruct questions
    if (results && results.formData && (!results.questions || !Array.isArray(results.questions) || results.questions.length === 0)) {
      console.warn('Reconstructing questions array for SDQ results');
      results.questions = Object.entries(results.formData).map(([id, response]) => ({
        id,
        response,
        score: typeof response === 'number' ? response : 0
      }));
    }
    
    console.log('Processed SDQ Results:', results);
    setSdqResults(results);
    setSdqCompleted(true);
    
    // Check if results is null (user clicked "Continue" without submitting)
    if (!results) {
      setQuestionnairesCompleted(true);
      return;
    }
    
    // Save full results including all individual responses to localStorage
    try {
      const storedData = JSON.parse(localStorage.getItem('sdqResults') || '[]');
      localStorage.setItem('sdqResults', JSON.stringify([...storedData, results]));
    } catch (error) {
      console.error('Error saving SDQ results to localStorage', error);
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

  // Utility function to ensure questionnaire results have required structure
  const ensureQuestionsAndFormData = (results, questionnaireName) => {
    if (!results) return results;
    
    let modified = {...results};
    console.log(`Processing ${questionnaireName} data:`, modified);
    
    // Make sure formData exists
    if (!modified.formData && modified.questions && Array.isArray(modified.questions)) {
      console.warn(`Adding missing formData to ${questionnaireName} results for export`);
      modified.formData = modified.questions.reduce((obj, q) => {
        if (q && q.id) {
          obj[q.id] = q.response || null;
        }
        return obj;
      }, {});
    }
    
    // Make sure questions array exists
    if (modified.formData && (!modified.questions || !Array.isArray(modified.questions) || modified.questions.length === 0)) {
      console.warn(`Reconstructing questions array for ${questionnaireName} results for export`);
      
      // Special handling for ACEIQ
      if (questionnaireName === 'ACEIQ') {
        modified.questions = Object.entries(modified.formData).map(([id, response]) => {
          // Try to determine if this is a yes/no question or frequency question based on response
          let score = 0;
          
          if (response === 'Yes') {
            score = 2;
          } else if (response === 'No') {
            score = 1;
          } else if (response === 'Never') {
            score = 1;
          } else if (response === 'Once') {
            score = 2;
          } else if (response === 'A few times') {
            score = 3;
          } else if (response === 'Many times') {
            score = 4;
          } else if (typeof response === 'number') {
            score = response;
          }
          
          return {
            id,
            response,
            score
          };
        });
      } 
      // Special handling for MFQ
      else if (questionnaireName === 'MFQ') {
        modified.questions = Object.entries(modified.formData).map(([id, response]) => {
          let score = 0;
          
          if (response === 'Not true') {
            score = 0;
          } else if (response === 'Sometimes') {
            score = 1;
          } else if (response === 'True') {
            score = 2;
          } else if (response === 'Refused') {
            score = -9;
          } else if (typeof response === 'number') {
            score = response;
          }
          
          return {
            id,
            response,
            score
          };
        });
      }
      // Special handling for SDQ
      else if (questionnaireName === 'SDQ') {
        modified.questions = Object.entries(modified.formData).map(([id, response]) => {
          let score = 0;
          
          // Determine if this is a reverse-scored item
          const isReversed = ['conduct2', 'hyperactivity4', 'hyperactivity5', 'peer2', 'peer3',
                             'q7', 'q11', 'q14', 'q21', 'q25'].includes(id);
          
          if (response === 'Not true') {
            score = isReversed ? 2 : 0;
          } else if (response === 'Somewhat true') {
            score = 1;
          } else if (response === 'Certainly true') {
            score = isReversed ? 0 : 2;
          } else if (response === 'Refused') {
            score = -9;
          } else if (typeof response === 'number') {
            score = response;
          }
          
          return {
            id,
            response,
            score
          };
        });
      }
      else {
        // Default handling for other questionnaires
        modified.questions = Object.entries(modified.formData).map(([id, response]) => ({
          id,
          response,
          score: typeof response === 'number' ? response : 0
        }));
      }
    }
    
    // For MFQ and SDQ specifically, make sure we populate response from formData if needed
    if ((questionnaireName === 'MFQ' || questionnaireName === 'SDQ' || questionnaireName === 'ACEIQ') && modified.questions) {
      modified.questions = modified.questions.map(q => {
        if (!q.response && modified.formData && modified.formData[q.id]) {
          return { ...q, response: modified.formData[q.id] };
        }
        return q;
      });
    }
    
    return modified;
  };

  // Export all questionnaire results as Excel file
  const exportToExcel = () => {
    // Validate all questionnaires have been completed
    if (!aceiqResults || !sesResults || !mfqResults || !sdqResults) {
      alert('Error: Missing questionnaire data. Please complete all questionnaires first.');
      return;
    }
    
    // Ensure all questionnaires have the required structure
    const processedAceiqResults = ensureQuestionsAndFormData(aceiqResults, 'ACEIQ');
    const processedSesResults = ensureQuestionsAndFormData(sesResults, 'SES');
    const processedMfqResults = ensureQuestionsAndFormData(mfqResults, 'MFQ');
    const processedSdqResults = ensureQuestionsAndFormData(sdqResults, 'SDQ');
    
    setIsExporting(true);
    setExportSuccess(false);
    
    try {
    const studentId = localStorage.getItem('studentId') || 'unknown';
    const timestamp = new Date().toISOString();
    
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Initialize worksheet arrays
      let metadataSheet = [
        ['COGNITIVE TASKS QUESTIONNAIRE RESULTS'],
        ['Student ID:', studentId],
        ['Export Date:', timestamp],
        [''],
        ['DEMOGRAPHIC INFORMATION'],
        ['Category', 'Value', 'Source']
      ];
      
      let aceiqSheet = [
        ['ADVERSE CHILDHOOD EXPERIENCES QUESTIONNAIRE (ACE-IQ)'],
        [''],
        ['Questionnaire', 'Question ID', 'Score', 'Score Type', 'Section', 'Response', 'Scoring Formula', 'Question Text']
      ];
      
      let sesSheet = [
        ['SOCIOECONOMIC STATUS QUESTIONNAIRE (SES)'],
        [''],
        ['Questionnaire', 'Question ID', 'Score', 'Score Type', 'Section', 'Response', 'Scoring Formula', 'Question Text']
      ];
      
      let mfqSheet = [
        ['MOOD AND FEELINGS QUESTIONNAIRE (MFQ)'],
        [''],
        ['Questionnaire', 'Question ID', 'Score', 'Score Type', 'Section', 'Response', 'Scoring Formula', 'Question Text']
      ];
      
      let sdqSheet = [
        ['STRENGTHS AND DIFFICULTIES QUESTIONNAIRE (SDQ)'],
        [''],
        ['Questionnaire', 'Question ID', 'Score', 'Score Type', 'Section', 'Response', 'Scoring Formula', 'Question Text']
      ];
      
      // Create and add metadata worksheet
      const metadataWs = XLSX.utils.aoa_to_sheet(metadataSheet);
      XLSX.utils.book_append_sheet(workbook, metadataWs, 'Demographics');
      
      // Process SES results
      try {
        if (processedSesResults.questions && Array.isArray(processedSesResults.questions)) {
          console.log('Debug SES results:', processedSesResults);
          
          // Try to access data from the original form submission if needed
          if (!processedSesResults.questions.some(q => q.response)) {
            console.log('No responses found in SES questions. Checking original results...');
            if (sesResults && sesResults.formData) {
              console.log('Found formData in original SES results:', sesResults.formData);
              processedSesResults.formData = sesResults.formData;
              processedSesResults.questions = processedSesResults.questions.map(q => {
                if (sesResults.formData[q.id]) {
                  return { ...q, response: sesResults.formData[q.id] };
                }
                return q;
              });
            }
          }
          
          processedSesResults.questions.forEach(q => {
            // Log each question to debug
            console.log('Processing SES question:', q.id, 'Response:', q.response);
            
            // Get response text
            let responseText = '';
            if (q.response && typeof q.response === 'object' && q.response.label) {
              responseText = q.response.label;
            } else if (typeof q.response === 'string') {
              responseText = q.response;
            } else if (typeof q.response === 'number') {
              responseText = q.response.toString();
            } else if (processedSesResults.formData && processedSesResults.formData[q.id]) {
              // Try to get response from formData if not found in the question object
              const formResponse = processedSesResults.formData[q.id];
              if (typeof formResponse === 'string') {
                responseText = formResponse;
              } else if (typeof formResponse === 'object' && formResponse.label) {
                responseText = formResponse.label;
              } else if (typeof formResponse === 'object' && formResponse.response) {
                responseText = formResponse.response;
              } else if (typeof formResponse === 'number') {
                responseText = formResponse.toString();
              }
            }
            
            // If still no response, try to infer it from the score
            if (!responseText && q.score !== undefined) {
              // For SES Likert scale questions
              if (q.id === 'struggledFinancially') {
                // Reverse scored
                if (q.score === 5) responseText = 'Never True';
                else if (q.score === 4) responseText = 'Rarely True';
                else if (q.score === 3) responseText = 'Sometimes True';
                else if (q.score === 2) responseText = 'Often True';
                else if (q.score === 1) responseText = 'Very Often True';
                else if (q.score === -9) responseText = 'Refused';
              } else if (q.id.startsWith('moneyFor') || q.id.startsWith('feltRich')) {
                // Agreement Likert
                if (q.score === 1) responseText = 'Never True';
                else if (q.score === 2) responseText = 'Rarely True';
                else if (q.score === 3) responseText = 'Sometimes True';
                else if (q.score === 4) responseText = 'Often True';
                else if (q.score === 5) responseText = 'Very Often True';
                else if (q.score === -9) responseText = 'Refused';
              } else {
                // Standard scale
                if (q.score === 1) responseText = 'Very low';
                else if (q.score === 2) responseText = 'Low';
                else if (q.score === 3) responseText = 'Average';
                else if (q.score === 4) responseText = 'High';
                else if (q.score === 5) responseText = 'Very high';
                else if (q.score === -9) responseText = 'Refused';
              }
            }
            
            // Format response
            const formattedResponse = formatRefusedResponse(responseText) || 'No data';
            
            // Determine scoring formula based on question ID
            let scoringFormula = '';
            
            // Only 'struggledFinancially' is reverse scored in SES
            if (q.id === 'struggledFinancially') {
              scoringFormula = 'Never True = 5, Rarely True = 4, Sometimes True = 3, Often True = 2, Very Often True = 1, Refused = -9';
            } 
            // For Likert scale questions (moneyFor* and feltRich* questions)
            else if (q.id.startsWith('moneyFor') || q.id.startsWith('feltRich')) {
              scoringFormula = 'Never True = 1, Rarely True = 2, Sometimes True = 3, Often True = 4, Very Often True = 5, Refused = -9';
            }
            // For other standard Likert scales (frequency and quality questions)
            else {
              scoringFormula = 'Very low = 1, Low = 2, Average = 3, High = 4, Very high = 5, Refused = -9';
            }
            
          csvData.push([
              'SES',
              q.id,
              q.score !== undefined ? q.score : '',
              q.id === 'struggledFinancially' ? 'Reverse scored' : 'Standard scored',
              'Socioeconomic Status',
              formattedResponse,
              scoringFormula,
              sesQuestionTexts[q.id] || ''
            ]);
          });
          
          // Add total score row
          const totalScore = typeof processedSesResults.totalScore === 'number' ? processedSesResults.totalScore : 0;
          sesSheet.push([]);
          sesSheet.push([
            'SES', 
            'TOTAL', 
            totalScore, 
            'Sum of all items', 
            'Overall SES Score', 
            '', 
            'Sum of all scored items', 
            'Higher total score indicates higher socioeconomic status'
          ]);
        }
      } catch (error) {
        console.error('Error processing SES results:', error);
        sesSheet.push([
          'SES', 
          'ERROR', 
          '',
          'Error processing SES section',
          '',
          '',
          '',
          error.message
        ]);
      }
      
      // Create and add the SES worksheet
      const sesWs = XLSX.utils.aoa_to_sheet(sesSheet);
      XLSX.utils.book_append_sheet(workbook, sesWs, 'SES');
      
      // Process MFQ results
      try {
        if (processedMfqResults.questions && Array.isArray(processedMfqResults.questions)) {
          // Define MFQ question texts
          const mfqQuestionTexts = {
            'q1': 'I felt miserable or unhappy',
            'q2': 'I didn\'t enjoy anything at all',
            'q3': 'I felt so tired I just sat around and did nothing',
            'q4': 'I was very restless',
            'q5': 'I felt I was no good anymore',
            'q6': 'I cried a lot',
            'q7': 'I found it hard to think properly or concentrate',
            'q8': 'I hated myself',
            'q9': 'I was a bad person',
            'q10': 'I felt lonely',
            'q11': 'I thought nobody really loved me',
            'q12': 'I thought I could never be as good as other kids',
            'q13': 'I did everything wrong',
            'felt_miserable': 'I felt miserable or unhappy',
            'didnt_enjoy': 'I didn\'t enjoy anything at all',
            'tired_easily': 'I was very tired, and had no energy',
            'restless': 'I was very restless',
            'felt_worthless': 'I felt I was no good anymore',
            'cried_a_lot': 'I cried a lot',
            'concentration_difficult': 'I found it hard to think properly or concentrate',
            'hated_self': 'I hated myself',
            'bad_person': 'I was a bad person',
            'felt_lonely': 'I felt lonely',
            'nobody_loved': 'Nobody really loved me',
            'was_not_good': 'I was not as good as other people',
            'did_wrong_things': 'I did everything wrong',
          };
          
          // Define MFQ scoring formula - all items scored the same way
          const mfqScoringFormula = 'Not true = 0, Sometimes = 1, True = 2, Refused = -9';
          
          processedMfqResults.questions.forEach(q => {
            try {
              if (!q || typeof q !== 'object') return;
              const id = q.id || 'unknown';
              // Ensure score is a number
              const score = typeof q.score === 'number' ? q.score : 0;
              
        // Format score for REFUSED responses
              const formattedScore = formatRefusedResponse(score);
              
              // Get the actual response text
              let responseText = '';
              if (q.response && typeof q.response === 'object' && q.response.label) {
                responseText = q.response.label;
              } else if (typeof q.response === 'string') {
                responseText = q.response;
              }
              const formattedResponse = formatRefusedResponse(responseText);
              
              // Get question text
              const questionText = mfqQuestionTexts[id] || '';
              
              // All MFQ items are in the same section
              const section = 'Depression Symptoms';
              
              mfqSheet.push([
                'MFQ',
                id,
                formattedScore,
                q.type || 'Standard scored',
                section,
                formattedResponse,
                mfqScoringFormula,
                questionText
              ]);
            } catch (error) {
              console.error('Error processing MFQ question:', error);
              mfqSheet.push([
                'MFQ',
                q.id || 'unknown',
                'ERROR',
                'Error processing question',
                '',
                '',
                '',
                error.message
              ]);
            }
          });
          
          // Add total score row
          const totalScore = typeof processedMfqResults.totalScore === 'number' ? processedMfqResults.totalScore : 0;
          mfqSheet.push([]);
          mfqSheet.push([
            'MFQ',
            'TOTAL',
            totalScore,
            'Sum of all items',
            'Overall Depression Score',
            '',
            'Sum of all scored items',
            'Higher total indicates more depressive symptoms'
          ]);
      
      // Add interpretation row
          if (processedMfqResults.interpretation) {
            mfqSheet.push([
              'MFQ',
              'INTERPRETATION',
              processedMfqResults.interpretation,
              'Clinical interpretation',
              '',
              '',
              '',
              ''
            ]);
          }
        }
      } catch (error) {
        console.error('Error processing MFQ results:', error);
        mfqSheet.push([
          'MFQ',
          'ERROR',
          '',
          'Error processing MFQ section',
          '',
          '',
          '',
          error.message
        ]);
      }
      
      // Create and add the MFQ worksheet
      const mfqWs = XLSX.utils.aoa_to_sheet(mfqSheet);
      XLSX.utils.book_append_sheet(workbook, mfqWs, 'MFQ');
      
      // Process SDQ results
      try {
        if (processedSdqResults.questions && Array.isArray(processedSdqResults.questions)) {
          // Define SDQ question texts
          const sdqQuestionTexts = {
            'emotional1': 'I get a lot of headaches, stomach-aches or sickness',
            'emotional2': 'I worry a lot',
            'emotional3': 'I am often unhappy, depressed or tearful',
            'emotional4': 'I am nervous in new situations. I easily lose confidence',
            'emotional5': 'I have many fears, I am easily scared',
            
            // Conduct items
            'conduct1': 'I get very angry and often lose my temper',
            'conduct2': 'I usually do as I am told',
            'conduct3': 'I fight a lot. I can make other people do what I want',
            'conduct4': 'I am often accused of lying or cheating',
            'conduct5': 'I take things that are not mine from home, school or elsewhere',
            
            // Hyperactivity items
            'hyperactivity1': 'I am restless, I cannot stay still for long',
            'hyperactivity2': 'I am constantly fidgeting or squirming',
            'hyperactivity3': 'I am easily distracted, I find it difficult to concentrate',
            'hyperactivity4': 'I think before I do things',
            'hyperactivity5': 'I finish the work I\'m doing. My attention is good',
            
            // Peer problems items
            'peer1': 'I am usually on my own. I generally play alone or keep to myself',
            'peer2': 'I have one good friend or more',
            'peer3': 'Other people my age generally like me',
            'peer4': 'Other children or young people pick on me or bully me',
            'peer5': 'I get on better with adults than with people my own age',
            
            // Prosocial items
            'prosocial1': 'I try to be nice to other people. I care about their feelings',
            'prosocial2': 'I usually share with others (food, games, pens etc.)',
            'prosocial3': 'I am helpful if someone is hurt, upset or feeling ill',
            'prosocial4': 'I am kind to younger children',
            'prosocial5': 'I often volunteer to help others (parents, teachers, children)',
            
            // For backwards compatibility with older SDQ format
            'q1': 'I try to be nice to other people. I care about their feelings',
            'q2': 'I am restless, I cannot stay still for long',
            'q3': 'I get a lot of headaches, stomach-aches or sickness',
            'q4': 'I usually share with others, for example CDs, games, food',
            'q5': 'I get very angry and often lose my temper',
            'q6': 'I would rather be alone than with people of my age',
            'q7': 'I usually do as I am told',
            'q8': 'I worry a lot',
            'q9': 'I am helpful if someone is hurt, upset or feeling ill',
            'q10': 'I am constantly fidgeting or squirming',
            'q11': 'I have one good friend or more',
            'q12': 'I fight a lot. I can make other people do what I want',
            'q13': 'I am often unhappy, depressed or tearful',
            'q14': 'Other people my age generally like me',
            'q15': 'I am easily distracted, I find it difficult to concentrate',
            'q16': 'I am nervous in new situations. I easily lose confidence',
            'q17': 'I am kind to younger children',
            'q18': 'I am often accused of lying or cheating',
            'q19': 'Other children or young people pick on me or bully me',
            'q20': 'I often offer to help others (parents, teachers, children)',
            'q21': 'I think before I do things',
            'q22': 'I take things that are not mine from home, school or elsewhere',
            'q23': 'I get along better with adults than with people my own age',
            'q24': 'I have many fears, I am easily scared',
            'q25': 'I finish the work I\'m doing. My attention is good'
          };
          
          // Define SDQ scoring formulas
          const sdqScoringFormulas = {
            'standard': 'Not true = 0, Somewhat true = 1, Certainly true = 2, Refused = -9',
            'reverse': 'Not true = 2, Somewhat true = 1, Certainly true = 0, Refused = -9'
          };
          
          processedSdqResults.questions.forEach(q => {
            try {
              if (!q || typeof q !== 'object') return;
              const id = q.id || 'unknown';
              
        // Determine if question is reverse scored based on subscale and item
        let scoreType = q.type || 'Standard scored';
              
              // Get section based on question ID
              let section = '';
              if (id.startsWith('emotional')) {
                section = 'Emotional Symptoms';
              } else if (id.startsWith('conduct')) {
                section = 'Conduct Problems';
              } else if (id.startsWith('hyperactivity')) {
                section = 'Hyperactivity/Inattention';
              } else if (id.startsWith('peer')) {
                section = 'Peer Relationship Problems';
              } else if (id.startsWith('prosocial')) {
                section = 'Prosocial Behavior';
              }
              
              // Ensure score is a number
              const score = typeof q.score === 'number' ? q.score : 0;
              
              // Determine scoring formula and score type
              let formula = sdqScoringFormulas.standard;
        
        // Prosocial items are reverse scored relative to problems
              if (id.startsWith('prosocial')) {
          scoreType = 'Prosocial item (higher is better)';
        }
        // Specific reverse scored items in the difficulties subscales
              else if (['conduct2', 'hyperactivity4', 'hyperactivity5', 'peer2', 'peer3'].includes(id)) {
          scoreType = 'Reverse scored';
                formula = sdqScoringFormulas.reverse;
        }
        
        // Format score for REFUSED responses
              const formattedScore = formatRefusedResponse(score);
              
              // Get the actual response text
              let responseText = '';
              if (q.response && typeof q.response === 'object' && q.response.label) {
                responseText = q.response.label;
              } else if (typeof q.response === 'string') {
                responseText = q.response;
              }
              const formattedResponse = formatRefusedResponse(responseText);
              
              // Get question text
              const questionText = sdqQuestionTexts[id] || '';
              
              sdqSheet.push([
                'SDQ',
                id,
                formattedScore,
                scoreType,
                section,
                formattedResponse,
                formula,
                questionText
              ]);
    } catch (error) {
              console.error('Error processing SDQ question:', error);
              sdqSheet.push([
                'SDQ',
                q.id || 'unknown',
                'ERROR',
                'Error processing question',
                '',
                '',
                '',
                error.message
              ]);
            }
          });
          
          // Add SDQ summary scores
          sdqSheet.push([]);
          sdqSheet.push([escapeCSVField('===== SDQ SUMMARY SCORES =====')]);
          sdqSheet.push([escapeCSVField('Scale'), escapeCSVField('Score'), escapeCSVField('Category'), escapeCSVField('Score Type'), escapeCSVField('Interpretation')]);
      
      // Include subscale scores with categories
          try {
            if (processedSdqResults.scores) {
              // Format scores for REFUSED responses - handle missing scores gracefully
              const scores = processedSdqResults.scores;
              const formattedEmotional = formatRefusedResponse(scores.emotional);
              const formattedConduct = formatRefusedResponse(scores.conduct);
              const formattedHyperactivity = formatRefusedResponse(scores.hyperactivity);
              const formattedPeer = formatRefusedResponse(scores.peer);
              const formattedProsocial = formatRefusedResponse(scores.prosocial);
              const formattedTotalDifficulties = formatRefusedResponse(scores.totalDifficulties);
              const formattedExternalizing = formatRefusedResponse(scores.externalizing);
              const formattedInternalizing = formatRefusedResponse(scores.internalizing);
              
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('EMOTIONAL_PROBLEMS'), escapeCSVField(formattedEmotional), escapeCSVField('Subscale total'), '']);
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('EMOTIONAL_CATEGORY'), escapeCSVField(scores.emotionalCategory || 'Unknown'), escapeCSVField('Clinical category'), '']);
              
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('CONDUCT_PROBLEMS'), escapeCSVField(formattedConduct), escapeCSVField('Subscale total'), '']);
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('CONDUCT_CATEGORY'), escapeCSVField(scores.conductCategory || 'Unknown'), escapeCSVField('Clinical category'), '']);
              
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('HYPERACTIVITY'), escapeCSVField(formattedHyperactivity), escapeCSVField('Subscale total'), '']);
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('HYPERACTIVITY_CATEGORY'), escapeCSVField(scores.hyperactivityCategory || 'Unknown'), escapeCSVField('Clinical category'), '']);
              
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('PEER_PROBLEMS'), escapeCSVField(formattedPeer), escapeCSVField('Subscale total'), '']);
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('PEER_CATEGORY'), escapeCSVField(scores.peerCategory || 'Unknown'), escapeCSVField('Clinical category'), '']);
              
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('PROSOCIAL'), escapeCSVField(formattedProsocial), escapeCSVField('Subscale total (higher is better)'), '']);
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('PROSOCIAL_CATEGORY'), escapeCSVField(scores.prosocialCategory || 'Unknown'), escapeCSVField('Clinical category'), '']);
              
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('TOTAL_DIFFICULTIES'), escapeCSVField(formattedTotalDifficulties), escapeCSVField('Sum of problem subscales'), '']);
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('TOTAL_CATEGORY'), escapeCSVField(scores.totalDifficultiesCategory || 'Unknown'), escapeCSVField('Clinical category'), '']);
              
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('EXTERNALIZING'), escapeCSVField(formattedExternalizing), escapeCSVField('Conduct + Hyperactivity'), '']);
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('INTERNALIZING'), escapeCSVField(formattedInternalizing), escapeCSVField('Emotional + Peer'), '']);
      }
      
      // Interpretation
      if (sdqResults.interpretation) {
              sdqSheet.push([escapeCSVField('SDQ'), escapeCSVField('INTERPRETATION'), escapeCSVField(sdqResults.interpretation), '', '']);
            }
          } catch (error) {
            console.error('Error processing SDQ scores:', error);
            sdqSheet.push([
              escapeCSVField('SDQ'), 
              escapeCSVField('SCORES_ERROR'), 
              escapeCSVField(''),
              escapeCSVField('Error processing scores'),
              escapeCSVField(error.message)
            ]);
          }
        }
      } catch (error) {
        console.error('Error processing SDQ results:', error);
        // Initialize csvData if it doesn't exist yet
        let csvData = [];
    csvData.push([
          'SDQ',
          'ERROR',
          '',
          'Error processing SDQ section',
          '',
          '',
          '',
          error.message
        ]);
      }
    } catch (error) {
      console.error('Error processing SDQ results:', error);
      // Initialize csvData if it doesn't exist yet
      let csvData = [];
    csvData.push([
        'SDQ',
        'ERROR',
        '',
        'Error processing SDQ section',
        '',
        '',
        '',
        error.message
      ]);
    }
    
    // Create the CSV content from the data
    const csvData = []; // Initialize a new array for CSV data
    
    // Add headers and SDQ data
    csvData.push(['STRENGTHS AND DIFFICULTIES QUESTIONNAIRE (SDQ)']);
    csvData.push(['']);
    csvData.push(['Questionnaire', 'Question ID', 'Score', 'Score Type', 'Section', 'Response', 'Scoring Formula', 'Question Text']);
    
    // ... process SDQ questions and add to csvData ...
    
    // Convert CSV data to string
    const csvString = csvData.map(row => row.join(',')).join('\n');
    
    // Function to validate the CSV structure against expected format
    const validateCSVFormat = () => {
      // Check for key sections that should be present
      const expectedSections = [
        'COGNITIVE TASKS QUESTIONNAIRE RESULTS',
        'DEMOGRAPHIC INFORMATION',
        '===== ADVERSE CHILDHOOD EXPERIENCES QUESTIONNAIRE (ACE-IQ) =====',
        '===== SOCIOECONOMIC STATUS QUESTIONNAIRE (SES) =====',
        '===== MOOD AND FEELINGS QUESTIONNAIRE (MFQ) =====',
        '===== STRENGTHS AND DIFFICULTIES QUESTIONNAIRE (SDQ) =====',
        '===== SDQ SUMMARY SCORES ====='
      ];
      
      // Check if all expected sections are present
      const missingSection = expectedSections.find(section => 
        !csvString.includes(escapeCSVField(section))
      );
      
      if (missingSection) {
        console.warn(`CSV validation: Missing section "${missingSection}"`);
        return false;
      }
      
      // Check if the demographic information section has the right format
      if (!csvString.includes(`${escapeCSVField('Category')},${escapeCSVField('Value')},${escapeCSVField('Source')}`)) {
        console.warn('CSV validation: Demographic section header missing or malformed');
        return false;
      }
      
      // Check if the questionnaire data has the right format
      const standardColumns = `${escapeCSVField('Questionnaire')},${escapeCSVField('Question ID')},${escapeCSVField('Score')},${escapeCSVField('Score Type')},${escapeCSVField('Section')},${escapeCSVField('Response')},${escapeCSVField('Scoring Formula')},${escapeCSVField('Question Text')}`;
      
      if (!csvString.includes(standardColumns)) {
        console.warn('CSV validation: Standard questionnaire columns missing or malformed');
        return false;
      }
      
      // Check if the SDQ summary scores section has the right format
      if (!csvString.includes(`${escapeCSVField('Scale')},${escapeCSVField('Score')},${escapeCSVField('Category')},${escapeCSVField('Score Type')}`)) {
        console.warn('CSV validation: SDQ summary scores header missing or malformed');
        return false;
      }
      
      console.log('CSV validation: All sections present and properly formatted');
      return true;
    };
    
    // Run validation and log results
    const isValidFormat = validateCSVFormat();
    
    // Create and download the CSV file
    try {
      const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      
      // Create filename with date and participant ID
      const currentDate = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
      const userStudentId = localStorage.getItem('studentId') || 'unknown';
      const fileName = `questionnaire_results_${userStudentId}_${currentDate}.csv`;
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      
      // Download file
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      setIsExporting(false);
      setExportSuccess(true);
      
      // Show alert with success message that includes validation result
      if (isValidFormat) {
        alert(`Export successful! Results saved to ${fileName}\n\nThe CSV format matches the expected structure.`);
      } else {
        alert(`Export completed with warnings. Results saved to ${fileName}\n\nThe CSV format may not match the expected structure. Check console for details.`);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setIsExporting(false);
      alert(`Error exporting CSV: ${error.message}`);
    }
  };

  // Export all questionnaire results as a single CSV
  const exportCombinedResults = () => {
    // Validate all questionnaires have been completed
    if (!aceiqResults || !sesResults || !mfqResults || !sdqResults) {
      alert('Error: Missing questionnaire data. Please complete all questionnaires first.');
      return;
    }

    // Print all results to debug
    console.log('ACEIQ Raw Results:', aceiqResults);
    console.log('SES Raw Results:', sesResults);
    console.log('MFQ Raw Results:', mfqResults);
    console.log('SDQ Raw Results:', sdqResults);

    // Ensure all questionnaires have the required structure
    const processedAceiqResults = ensureQuestionsAndFormData(aceiqResults, 'ACEIQ');
    const processedSesResults = ensureQuestionsAndFormData(sesResults, 'SES');
    const processedMfqResults = ensureQuestionsAndFormData(mfqResults, 'MFQ');
    const processedSdqResults = ensureQuestionsAndFormData(sdqResults, 'SDQ');
    
    // Perform extra validation to make sure responses are available
    let foundEmptyResponses = false;
    
    if (processedAceiqResults.questions.some(q => !q.response)) {
      console.warn('Some ACEIQ questions have no responses:', 
                  processedAceiqResults.questions.filter(q => !q.response).map(q => q.id).join(', '));
      foundEmptyResponses = true;
    }
    
    if (foundEmptyResponses) {
      console.warn('Some questions have missing responses. Export may be incomplete.');
    }
    
    setIsExporting(true);
    setExportSuccess(false);
    
    // Define studentId variable at function scope so it's available everywhere in this function
    const studentId = localStorage.getItem('studentId') || 'unknown';
    
    try {
      const csvData = [];
      const timestamp = new Date().toISOString();
      
      // Create CSV content
      csvData.push(['COGNITIVE TASKS QUESTIONNAIRE RESULTS']);
      csvData.push(['Student ID:', studentId]);
      csvData.push(['Export Date:', timestamp]);
      csvData.push([]);
      
      // Define question texts for each questionnaire
      
      // ACE-IQ question texts
      const aceiqQuestionTexts = {
        'living_with_parents': 'Did you live with both your parents growing up?',
        'parents_separated': 'Were your parents separated or divorced?',
        'household_member_jail': 'Did a household member go to jail or prison?',
        'witness_abuse': 'Did you see or hear a parent or household member being yelled at, screamed at, sworn at, insulted or humiliated?',
        'feel_unloved': 'Did you feel that no one in your family loved you or thought you were important or special?',
        'go_hungry': 'Did you not have enough to eat, had to wear dirty clothes, or had no one to protect you?',
        'lived_with_alcoholic': 'Did you live with a household member who was a problem drinker or alcoholic, or misused street or prescription drugs?',
        'mentally_ill_household': 'Was a household member depressed or mentally ill, or did a household member attempt suicide?',
        'bullied': 'Were you bullied?',
        'physical_violence': 'Were you physically beaten or threatened by a parent or adult?',
        'community_violence': 'Did you see or hear someone being beaten up, stabbed, shot, or killed in real life?',
        'collective_violence': 'Were you forced to go and live in another place due to any of these events?',
        // Add all other possible ACEIQ question IDs
        'parentsUnderstandProblems': 'Did your parents/guardians understand your problems and worries?',
        'parentsKnowFreeTime': 'Did your parents/guardians really know what you were doing with your free time?',
        'notEnoughFood': 'Did you or your family not have enough food?',
        'parentsDrunkOrDrugs': 'Were your parents/guardians too drunk or intoxicated by drugs to take care of you?',
        'notSentToSchool': 'Were you not sent to school, or did you stop going to school?',
        'alcoholicHouseholdMember': 'Did you live with a household member who was a problem drinker, alcoholic, or misused street or prescription drugs?',
        'mentallyIllHouseholdMember': 'Did you live with a household member who was depressed, mentally ill, or suicidal?',
        'imprisonedHouseholdMember': 'Did you live with a household member who was ever sent to jail or prison?',
        'parentDied': 'Did your parent/guardian die?',
        'witnessedVerbalAbuse': 'Did you see or hear a parent or household member in your home being yelled at, screamed at, sworn at, insulted, or humiliated?',
        'witnessedPhysicalAbuse': 'Did you see or hear a parent or household member in your home being slapped, kicked, punched, or beaten up?',
        'witnessedWeaponAbuse': 'Did you see or hear a parent or household member in your home being hit or cut with an object, such as a stick (or cane), bottle, club, knife, whip, etc.?',
        'verbalAbuse': 'Did a parent, guardian, or other household member yell, scream, or swear at you, insult or humiliate you?',
        'threatenedAbandonment': 'Did a parent, guardian, or other household member threaten to, or actually, abandon you or throw you out of the house?',
        'physicalAbuse': 'Did a parent, guardian, or other household member spank, slap, kick, punch, or beat you up?',
        'weaponAbuse': 'Did a parent, guardian, or other household member hit or cut you with an object, such as a stick (or cane), bottle, club, knife, whip, etc.?',
        'sexualTouching': 'Did someone touch or fondle you in a sexual way when you did not want them to?',
        'sexualFondling': 'Did someone make you touch their body in a sexual way when you did not want them to?',
        'attemptedSexualIntercourse': 'Did someone attempt oral, anal, or vaginal intercourse with you when you did not want them to?',
        'completedSexualIntercourse': 'Did someone actually have oral, anal, or vaginal intercourse with you when you did not want them to?',
        'physicalFight': 'Were you in a physical fight?',
        'witnessedBeating': 'Did you see or hear someone being beaten up in real life?',
        'witnessedStabbingOrShooting': 'Did you see or hear someone being stabbed or shot in real life?',
        'witnessedThreatenedWithWeapon': 'Did you see or hear someone being threatened with a knife or gun in real life?',
        'bullyingTypes': 'What types of bullying did you experience?'
      };
      
      // SES question texts 
      const sesQuestionTexts = {
        'parentsEducation': 'What is the highest level of education your parents or guardians have completed?',
        'parentsOccupation': 'What is your parents\' or guardians\' current occupation?',
        'householdIncome': 'What is your household\'s approximate annual income?',
        'livingConditions': 'How would you describe your living conditions?',
        'struggledFinancially': 'In the past year, how often has your family struggled financially?',
        'accessToResources': 'How would you rate your access to resources like healthcare, education, and other services?',
        'moneyForHome': 'When growing up, your family had enough money to afford the kind of home you all needed',
        'moneyForClothing': 'When growing up, your family had enough money to afford the kind of clothing you all needed',
        'moneyForFood': 'When growing up, your family had enough money to afford the kind of food that you all needed',
        'moneyForMedicalCare': 'When growing up, your family had enough money to afford the kind of medical care that you all needed',
        'feltRichComparedToSchool': 'When growing up, I felt well-off (rich, wealthy) compared to other kids in my school',
        'feltRichComparedToNeighborhood': 'When growing up, I felt well-off (rich, wealthy) compared to other kids in my neighborhood'
      };
      
      // MFQ question texts
      const mfqQuestionTexts = {
        'q1': 'I felt miserable or unhappy',
        'q2': 'I didn\'t enjoy anything at all',
        'q3': 'I felt so tired I just sat around and did nothing',
        'q4': 'I was very restless',
        'q5': 'I felt I was no good anymore',
        'q6': 'I cried a lot',
        'q7': 'I found it hard to think properly or concentrate',
        'q8': 'I hated myself',
        'q9': 'I was a bad person',
        'q10': 'I felt lonely',
        'q11': 'I thought nobody really loved me',
        'q12': 'I thought I could never be as good as other kids',
        'q13': 'I did everything wrong',
        'felt_miserable': 'I felt miserable or unhappy',
        'didnt_enjoy': 'I didn\'t enjoy anything at all',
        'tired_easily': 'I was very tired, and had no energy',
        'restless': 'I was very restless',
        'felt_worthless': 'I felt I was no good anymore',
        'cried_a_lot': 'I cried a lot',
        'concentration_difficult': 'I found it hard to think properly or concentrate',
        'hated_self': 'I hated myself',
        'bad_person': 'I was a bad person',
        'felt_lonely': 'I felt lonely',
        'nobody_loved': 'Nobody really loved me',
        'was_not_good': 'I was not as good as other people',
        'did_wrong_things': 'I did everything wrong',
      };
      
      // SDQ question texts
      const sdqQuestionTexts = {
        'emotional1': 'I get a lot of headaches, stomach-aches or sickness',
        'emotional2': 'I worry a lot',
        'emotional3': 'I am often unhappy, depressed or tearful',
        'emotional4': 'I am nervous in new situations. I easily lose confidence',
        'emotional5': 'I have many fears, I am easily scared',
        'conduct1': 'I get very angry and often lose my temper',
        'conduct2': 'I usually do as I am told',
        'conduct3': 'I fight a lot. I can make other people do what I want',
        'conduct4': 'I am often accused of lying or cheating',
        'conduct5': 'I take things that are not mine from home, school or elsewhere',
        'hyperactivity1': 'I am restless, I cannot stay still for long',
        'hyperactivity2': 'I am constantly fidgeting or squirming',
        'hyperactivity3': 'I am easily distracted, I find it difficult to concentrate',
        'hyperactivity4': 'I think before I do things',
        'hyperactivity5': 'I finish the work I\'m doing. My attention is good',
        'peer1': 'I am usually on my own. I generally play alone or keep to myself',
        'peer2': 'I have one good friend or more',
        'peer3': 'Other people my age generally like me',
        'peer4': 'Other children or young people pick on me or bully me',
        'peer5': 'I get on better with adults than with people my own age',
        'prosocial1': 'I try to be nice to other people. I care about their feelings',
        'prosocial2': 'I usually share with others (food, games, pens etc.)',
        'prosocial3': 'I am helpful if someone is hurt, upset or feeling ill',
        'prosocial4': 'I am kind to younger children',
        'prosocial5': 'I often volunteer to help others (parents, teachers, children)',
        'q1': 'I try to be nice to other people. I care about their feelings',
        'q2': 'I am restless, I cannot stay still for long',
        'q3': 'I get a lot of headaches, stomach-aches or sickness',
        'q4': 'I usually share with others, for example CDs, games, food',
        'q5': 'I get very angry and often lose my temper',
        'q6': 'I would rather be alone than with people of my age',
        'q7': 'I usually do as I am told',
        'q8': 'I worry a lot',
        'q9': 'I am helpful if someone is hurt, upset or feeling ill',
        'q10': 'I am constantly fidgeting or squirming',
        'q11': 'I have one good friend or more',
        'q12': 'I fight a lot. I can make other people do what I want',
        'q13': 'I am often unhappy, depressed or tearful',
        'q14': 'Other people my age generally like me',
        'q15': 'I am easily distracted, I find it difficult to concentrate',
        'q16': 'I am nervous in new situations. I easily lose confidence',
        'q17': 'I am kind to younger children',
        'q18': 'I am often accused of lying or cheating',
        'q19': 'Other children or young people pick on me or bully me',
        'q20': 'I often offer to help others (parents, teachers, children)',
        'q21': 'I think before I do things',
        'q22': 'I take things that are not mine from home, school or elsewhere',
        'q23': 'I get along better with adults than with people my own age',
        'q24': 'I have many fears, I am easily scared',
        'q25': 'I finish the work I\'m doing. My attention is good'
      };
      
      // Column headers
      const headers = ['Questionnaire', 'Question ID', 'Score', 'Score Type', 'Section', 'Response', 'Scoring Formula', 'Question Text'];
      
      // Add questionnaire data
      // ACE-IQ section
      csvData.push(['===== ADVERSE CHILDHOOD EXPERIENCES QUESTIONNAIRE (ACE-IQ) =====']);
      csvData.push(headers);
      
      if (processedAceiqResults.questions && Array.isArray(processedAceiqResults.questions)) {
        console.log('Debug ACEIQ results:', processedAceiqResults);
        
        // Try to directly access data from the original form submission
        if (!processedAceiqResults.questions.some(q => q.response)) {
          console.log('No responses found in questions. Checking original results...');
          if (aceiqResults && aceiqResults.formData) {
            console.log('Found formData in original results:', aceiqResults.formData);
            // Copy data from original results if needed
            processedAceiqResults.formData = aceiqResults.formData;
            processedAceiqResults.questions = processedAceiqResults.questions.map(q => {
              if (aceiqResults.formData[q.id]) {
                return { ...q, response: aceiqResults.formData[q.id] };
              }
              return q;
            });
          }
        }
        
        processedAceiqResults.questions.forEach(q => {
          // Log each question to debug
          console.log('Processing ACEIQ question:', q.id, 'Response:', q.response);
          
          // Determine scoring formula based on question type
          let scoringFormula = '';
          if (q.id === 'bullied' || q.id === 'household_member_jail' || q.id === 'parents_separated' ||
              q.id === 'living_with_parents' || q.id === 'mentally_ill_household' || q.id === 'lived_with_alcoholic' ||
              q.id === 'alcoholicHouseholdMember' || q.id === 'mentallyIllHouseholdMember' || 
              q.id === 'imprisonedHouseholdMember' || q.id === 'parentsSeparated' || q.id === 'parentDied') {
            scoringFormula = 'Yes = 2, No = 1, Refused = -9';
          } else if (q.id === 'witness_abuse' || q.id === 'physical_violence' || q.id === 'community_violence' || 
                     q.id === 'collective_violence' || q.id === 'notEnoughFood' || q.id === 'parentsDrunkOrDrugs' ||
                     q.id === 'notSentToSchool' || q.id === 'witnessedVerbalAbuse' || q.id === 'witnessedPhysicalAbuse' ||
                     q.id === 'witnessedWeaponAbuse' || q.id === 'verbalAbuse' || q.id === 'threatenedAbandonment' ||
                     q.id === 'physicalAbuse' || q.id === 'weaponAbuse' || q.id === 'sexualTouching' ||
                     q.id === 'sexualFondling' || q.id === 'attemptedSexualIntercourse' || q.id === 'completedSexualIntercourse' ||
                     q.id === 'physicalFight' || q.id === 'witnessedBeating' || q.id === 'witnessedStabbingOrShooting' ||
                     q.id === 'witnessedThreatenedWithWeapon') {
            scoringFormula = 'Many times = 4, A few times = 3, Once = 2, Never = 1, Refused = -9';
          } else if (q.id === 'feel_unloved' || q.id === 'go_hungry') {
            scoringFormula = 'Always = 5, Most of the time = 4, Sometimes = 3, Rarely = 2, Never = 1, Refused = -9';
          } else if (q.id === 'parentsUnderstandProblems' || q.id === 'parentsKnowFreeTime') {
            scoringFormula = 'Always = 1, Most of the time = 2, Sometimes = 3, Rarely = 4, Never = 5, Refused = -9';
          } else if (q.id === 'bullyingTypes') {
            scoringFormula = 'Each type = 1, Never bullied = 0, Refused = -9';
          }
          
          // Determine section based on question ID
          let section = 'Adverse Experiences';
          
          if (['parentsUnderstandProblems', 'parentsKnowFreeTime'].includes(q.id)) {
          section = 'Relationship with Parents';
          } else if (['notEnoughFood', 'parentsDrunkOrDrugs', 'notSentToSchool', 'go_hungry'].includes(q.id)) {
          section = 'Neglect';
          } else if (['alcoholicHouseholdMember', 'mentallyIllHouseholdMember', 'imprisonedHouseholdMember', 
                       'parentsSeparated', 'parentDied', 'witnessedVerbalAbuse', 'witnessedPhysicalAbuse', 
                       'witnessedWeaponAbuse', 'lived_with_alcoholic', 'mentally_ill_household', 
                       'household_member_jail', 'parents_separated', 'witness_abuse'].includes(q.id)) {
          section = 'Family Environment';
        } else if (['verbalAbuse', 'threatenedAbandonment', 'physicalAbuse', 'weaponAbuse', 
                       'sexualTouching', 'sexualFondling', 'attemptedSexualIntercourse', 
                       'completedSexualIntercourse', 'physical_violence', 'feel_unloved'].includes(q.id)) {
          section = 'Direct Abuse';
          } else if (['bullied', 'bullyingTypes', 'physicalFight'].includes(q.id)) {
          section = 'Peer Violence';
          } else if (['witnessedBeating', 'witnessedStabbingOrShooting', 'witnessedThreatenedWithWeapon',
                       'community_violence', 'collective_violence'].includes(q.id)) {
          section = 'Community Violence';
        }
        
          // Get response text
          let responseText = '';
          if (q.response && typeof q.response === 'object' && q.response.label) {
            responseText = q.response.label;
          } else if (typeof q.response === 'string') {
            responseText = q.response;
          } else if (typeof q.response === 'number') {
            responseText = q.response.toString();
          } else if (processedAceiqResults.formData && processedAceiqResults.formData[q.id]) {
            // Try to get response from formData if not found in the question object
            const formResponse = processedAceiqResults.formData[q.id];
            if (typeof formResponse === 'string') {
              responseText = formResponse;
            } else if (typeof formResponse === 'object' && formResponse.label) {
              responseText = formResponse.label;
            } else if (typeof formResponse === 'number') {
              responseText = formResponse.toString();
            }
          }
          
          // If still no response, try to infer it from the score
          if (!responseText && q.score !== undefined) {
            // For binary (yes/no) questions
            if (q.score === 2 && (q.id.includes('bullied') || q.id.includes('jail') || q.id.includes('separated'))) {
              responseText = 'Yes';
            } else if (q.score === 1 && (q.id.includes('bullied') || q.id.includes('jail') || q.id.includes('separated'))) {
              responseText = 'No';
            }
            // For frequency questions
            else if (q.score === 1) {
              responseText = 'Never';
            } else if (q.score === 2) {
              responseText = 'Once';
            } else if (q.score === 3) {
              responseText = 'A few times';
            } else if (q.score === 4) {
              responseText = 'Many times';
            }
          }
          
          // If still no response, use a fallback
          if (!responseText) {
            responseText = 'No data';
            console.warn(`No response found for ACEIQ question: ${q.id}`);
          }
          
          // Format response
          const formattedResponse = formatRefusedResponse(responseText);
        
        csvData.push([
            'ACEIQ',
            q.id,
            q.score !== undefined ? q.score : '',
            q.type || 'Standard',
            section,
            formattedResponse || 'No data',
            scoringFormula,
            aceiqQuestionTexts[q.id] || ''
        ]);
      });
      
        // Add total score row
        if (processedAceiqResults.totalScore !== undefined) {
          csvData.push([]);
          csvData.push([
            'ACEIQ',
            'TOTAL',
            processedAceiqResults.totalScore,
            'Sum of all items',
            'Overall ACE Score',
            '',
            'Sum of all scored items',
            'Higher total indicates more adverse childhood experiences'
          ]);
        }
      }
      
      // SES section
    csvData.push([]);
      csvData.push(['===== SOCIOECONOMIC STATUS QUESTIONNAIRE (SES) =====']);
      csvData.push(headers);
      
      if (processedSesResults.questions && Array.isArray(processedSesResults.questions)) {
        console.log('Debug SES results:', processedSesResults);
        
        // Try to access data from the original form submission if needed
        if (!processedSesResults.questions.some(q => q.response)) {
          console.log('No responses found in SES questions. Checking original results...');
          if (sesResults && sesResults.formData) {
            console.log('Found formData in original SES results:', sesResults.formData);
            processedSesResults.formData = sesResults.formData;
            processedSesResults.questions = processedSesResults.questions.map(q => {
              if (sesResults.formData[q.id]) {
                return { ...q, response: sesResults.formData[q.id] };
              }
              return q;
            });
          }
        }
        
        processedSesResults.questions.forEach(q => {
          // Log each question to debug
          console.log('Processing SES question:', q.id, 'Response:', q.response);
          
          // Get response text
          let responseText = '';
          if (q.response && typeof q.response === 'object' && q.response.label) {
            responseText = q.response.label;
          } else if (typeof q.response === 'string') {
            responseText = q.response;
          } else if (typeof q.response === 'number') {
            responseText = q.response.toString();
          } else if (processedSesResults.formData && processedSesResults.formData[q.id]) {
            // Try to get response from formData if not found in the question object
            const formResponse = processedSesResults.formData[q.id];
            if (typeof formResponse === 'string') {
              responseText = formResponse;
            } else if (typeof formResponse === 'object' && formResponse.label) {
              responseText = formResponse.label;
            } else if (typeof formResponse === 'object' && formResponse.response) {
              responseText = formResponse.response;
            } else if (typeof formResponse === 'number') {
              responseText = formResponse.toString();
            }
          }
          
          // If still no response, try to infer it from the score
          if (!responseText && q.score !== undefined) {
            // For SES Likert scale questions
            if (q.id === 'struggledFinancially') {
              // Reverse scored
              if (q.score === 5) responseText = 'Never True';
              else if (q.score === 4) responseText = 'Rarely True';
              else if (q.score === 3) responseText = 'Sometimes True';
              else if (q.score === 2) responseText = 'Often True';
              else if (q.score === 1) responseText = 'Very Often True';
              else if (q.score === -9) responseText = 'Refused';
            } else if (q.id.startsWith('moneyFor') || q.id.startsWith('feltRich')) {
              // Agreement Likert
              if (q.score === 1) responseText = 'Never True';
              else if (q.score === 2) responseText = 'Rarely True';
              else if (q.score === 3) responseText = 'Sometimes True';
              else if (q.score === 4) responseText = 'Often True';
              else if (q.score === 5) responseText = 'Very Often True';
              else if (q.score === -9) responseText = 'Refused';
            } else {
              // Standard scale
              if (q.score === 1) responseText = 'Very low';
              else if (q.score === 2) responseText = 'Low';
              else if (q.score === 3) responseText = 'Average';
              else if (q.score === 4) responseText = 'High';
              else if (q.score === 5) responseText = 'Very high';
              else if (q.score === -9) responseText = 'Refused';
            }
          }
          
          // Format response
          const formattedResponse = formatRefusedResponse(responseText) || 'No data';
          
          // Determine scoring formula based on question ID
          let scoringFormula = '';
          
          // Only 'struggledFinancially' is reverse scored in SES
          if (q.id === 'struggledFinancially') {
            scoringFormula = 'Never True = 5, Rarely True = 4, Sometimes True = 3, Often True = 2, Very Often True = 1, Refused = -9';
          } 
          // For Likert scale questions (moneyFor* and feltRich* questions)
          else if (q.id.startsWith('moneyFor') || q.id.startsWith('feltRich')) {
            scoringFormula = 'Never True = 1, Rarely True = 2, Sometimes True = 3, Often True = 4, Very Often True = 5, Refused = -9';
          }
          // For other standard Likert scales (frequency and quality questions)
          else {
            scoringFormula = 'Very low = 1, Low = 2, Average = 3, High = 4, Very high = 5, Refused = -9';
          }
        
        csvData.push([
            'SES',
            q.id,
            q.score !== undefined ? q.score : '',
            q.id === 'struggledFinancially' ? 'Reverse scored' : 'Standard scored',
            'Socioeconomic Status',
            formattedResponse,
            scoringFormula,
            sesQuestionTexts[q.id] || ''
        ]);
      });
      }
      
      // MFQ section
    csvData.push([]);
      csvData.push(['===== MOOD AND FEELINGS QUESTIONNAIRE (MFQ) =====']);
      csvData.push(headers);
      
      if (processedMfqResults.questions && Array.isArray(processedMfqResults.questions)) {
        console.log('Debug MFQ results:', processedMfqResults);
        
        // Try to access data from the original form submission if needed
        if (!processedMfqResults.questions.some(q => q.response)) {
          console.log('No responses found in MFQ questions. Checking original results...');
          if (mfqResults && mfqResults.formData) {
            console.log('Found formData in original MFQ results:', mfqResults.formData);
            processedMfqResults.formData = mfqResults.formData;
            processedMfqResults.questions = processedMfqResults.questions.map(q => {
              if (mfqResults.formData[q.id]) {
                return { ...q, response: mfqResults.formData[q.id] };
              }
              return q;
            });
          }
        }
        
        processedMfqResults.questions.forEach(q => {
          // Log each question to debug
          console.log('Processing MFQ question:', q.id, 'Response:', q.response);
          
          // Get response text
          let responseText = '';
          if (q.response && typeof q.response === 'object' && q.response.label) {
            responseText = q.response.label;
          } else if (typeof q.response === 'string') {
            responseText = q.response;
          } else if (typeof q.response === 'number') {
            responseText = q.response.toString();
          } else if (processedMfqResults.formData && processedMfqResults.formData[q.id]) {
            // Try to get response from formData if not found in the question object
            const formResponse = processedMfqResults.formData[q.id];
            if (typeof formResponse === 'string') {
              responseText = formResponse;
            } else if (typeof formResponse === 'object' && formResponse.label) {
              responseText = formResponse.label;
            } else if (typeof formResponse === 'number') {
              responseText = formResponse.toString();
            }
          }
          
          // If still no response, try to infer it from the score
          if (!responseText && q.score !== undefined) {
            // For MFQ questions with known scoring
            if (q.score === 0) {
              responseText = 'Not true';
            } else if (q.score === 1) {
              responseText = 'Sometimes';
            } else if (q.score === 2) {
              responseText = 'True';
            } else if (q.score === -9) {
              responseText = 'Refused';
            }
          }
          
          // Format response
          const formattedResponse = formatRefusedResponse(responseText) || 'No data';
        
        csvData.push([
            'MFQ',
            q.id,
            q.score !== undefined ? q.score : '',
            q.type || 'Standard',
            'Depression Symptoms',
            formattedResponse,
            'Not true = 0, Sometimes = 1, True = 2, Refused = -9',
            mfqQuestionTexts[q.id] || ''
        ]);
      });
      }
      
      // SDQ section
      csvData.push([]);
      csvData.push(['===== STRENGTHS AND DIFFICULTIES QUESTIONNAIRE (SDQ) =====']);
      csvData.push(headers);
      
      if (processedSdqResults.questions && Array.isArray(processedSdqResults.questions)) {
        console.log('Debug SDQ results:', processedSdqResults);
        
        // Try to access data from the original form submission if needed
        if (!processedSdqResults.questions.some(q => q.response)) {
          console.log('No responses found in SDQ questions. Checking original results...');
          if (sdqResults && sdqResults.formData) {
            console.log('Found formData in original SDQ results:', sdqResults.formData);
            processedSdqResults.formData = sdqResults.formData;
            processedSdqResults.questions = processedSdqResults.questions.map(q => {
              if (sdqResults.formData[q.id]) {
                return { ...q, response: sdqResults.formData[q.id] };
              }
              return q;
            });
          }
        }
        
        processedSdqResults.questions.forEach(q => {
          // Log each question to debug
          console.log('Processing SDQ question:', q.id, 'Response:', q.response);
          
          // Determine section based on question ID
          let section = '';
          if (q.id.startsWith('emotional') || q.id === 'q3' || q.id === 'q8' || q.id === 'q13' || q.id === 'q16' || q.id === 'q24') {
            section = 'Emotional Symptoms';
          } else if (q.id.startsWith('conduct') || q.id === 'q5' || q.id === 'q7' || q.id === 'q12' || q.id === 'q18' || q.id === 'q22') {
            section = 'Conduct Problems';
          } else if (q.id.startsWith('hyperactivity') || q.id === 'q2' || q.id === 'q10' || q.id === 'q15' || q.id === 'q21' || q.id === 'q25') {
            section = 'Hyperactivity/Inattention';
          } else if (q.id.startsWith('peer') || q.id === 'q6' || q.id === 'q11' || q.id === 'q14' || q.id === 'q19' || q.id === 'q23') {
            section = 'Peer Relationship Problems';
          } else if (q.id.startsWith('prosocial') || q.id === 'q1' || q.id === 'q4' || q.id === 'q9' || q.id === 'q17' || q.id === 'q20') {
            section = 'Prosocial Behavior';
          }
          
          // Get response text
          let responseText = '';
          if (q.response && typeof q.response === 'object' && q.response.label) {
            responseText = q.response.label;
          } else if (typeof q.response === 'string') {
            responseText = q.response;
          } else if (typeof q.response === 'number') {
            responseText = q.response.toString();
          } else if (processedSdqResults.formData && processedSdqResults.formData[q.id]) {
            // Try to get response from formData if not found in the question object
            const formResponse = processedSdqResults.formData[q.id];
            if (typeof formResponse === 'string') {
              responseText = formResponse;
            } else if (typeof formResponse === 'object' && formResponse.label) {
              responseText = formResponse.label;
            } else if (typeof formResponse === 'number') {
              responseText = formResponse.toString();
            }
          }
          
          // If still no response, try to infer it from the score
          if (!responseText && q.score !== undefined) {
            // Most SDQ items are scored: Not true = 0, Somewhat true = 1, Certainly true = 2
            // Some items are reverse scored
            const isReversed = ['conduct2', 'hyperactivity4', 'hyperactivity5', 'peer2', 'peer3',
                               'q7', 'q11', 'q14', 'q21', 'q25'].includes(q.id);
            
            if (isReversed) {
              if (q.score === 2) responseText = 'Not true';
              else if (q.score === 1) responseText = 'Somewhat true';
              else if (q.score === 0) responseText = 'Certainly true';
              else if (q.score === -9) responseText = 'Refused';
            } else {
              if (q.score === 0) responseText = 'Not true';
              else if (q.score === 1) responseText = 'Somewhat true';
              else if (q.score === 2) responseText = 'Certainly true';
              else if (q.score === -9) responseText = 'Refused';
            }
          }
          
          // Format response
          const formattedResponse = formatRefusedResponse(responseText) || 'No data';
          
          // Determine scoring formula
          let scoringFormula = 'Not true = 0, Somewhat true = 1, Certainly true = 2, Refused = -9';
          if (['conduct2', 'hyperactivity4', 'hyperactivity5', 'peer2', 'peer3'].includes(q.id) ||
              ['q7', 'q11', 'q14', 'q21', 'q25'].includes(q.id)) {
            scoringFormula = 'Not true = 2, Somewhat true = 1, Certainly true = 0, Refused = -9';
          }
          
          csvData.push([
            'SDQ',
            q.id,
            q.score !== undefined ? q.score : '',
            q.id.startsWith('prosocial') ? 'Prosocial item (higher is better)' : 
              (scoringFormula.includes('Not true = 2') ? 'Reverse scored' : 'Standard scored'),
            section,
            formattedResponse,
            scoringFormula,
            sdqQuestionTexts[q.id] || ''
          ]);
        });
        
        // Add SDQ summary scores
        if (processedSdqResults.scores) {
          csvData.push([]);
          csvData.push(['===== SDQ SUMMARY SCORES =====']);
          csvData.push(['Scale', 'Score', 'Category', 'Score Type', 'Interpretation']);
          
          const scores = processedSdqResults.scores;
          csvData.push(['SDQ', scores.emotional, scores.emotionalCategory || '', 'Emotional Problems Subscale', '']);
          csvData.push(['SDQ', scores.conduct, scores.conductCategory || '', 'Conduct Problems Subscale', '']);
          csvData.push(['SDQ', scores.hyperactivity, scores.hyperactivityCategory || '', 'Hyperactivity Subscale', '']);
          csvData.push(['SDQ', scores.peer, scores.peerCategory || '', 'Peer Problems Subscale', '']);
          csvData.push(['SDQ', scores.prosocial, scores.prosocialCategory || '', 'Prosocial Behavior Subscale', '']);
          csvData.push(['SDQ', scores.totalDifficulties, scores.totalDifficultiesCategory || '', 'Total Difficulties', '']);
          csvData.push(['SDQ', scores.externalizing, '', 'Externalizing (Conduct + Hyperactivity)', '']);
          csvData.push(['SDQ', scores.internalizing, '', 'Internalizing (Emotional + Peer)', '']);
        }
      }
      
      // Convert to CSV string
      const csvContent = csvData.map(row => row.map(cell => 
        typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : 
        (cell === null || cell === undefined ? '""' : `"${String(cell).replace(/"/g, '""')}"`))
      .join(',')).join('\n');
      
      // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
      link.setAttribute('download', `questionnaire_results_${studentId}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
      
      setIsExporting(false);
      setExportSuccess(true);
      alert('CSV export successful!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setIsExporting(false);
      alert(`Error exporting CSV: ${error.message}`);
    }
  };

  // Render the current questionnaire or completion screen
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
              disabled={isExporting}
              style={{
                fontSize: '1.2rem',
                padding: '14px 28px',
                fontWeight: 'bold',
                backgroundColor: isExporting ? '#cccccc' : exportSuccess ? '#2ecc71' : '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isExporting ? 'default' : 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                margin: '20px auto',
                display: 'block',
                minWidth: '300px',
                transition: 'all 0.3s ease'
              }}
            >
              {isExporting ? 'Preparing Download...' : exportSuccess ? 'Download Complete!' : 'Download Combined Results (CSV)'}
            </button>
            
            <button 
              className="form-button" 
              onClick={exportToExcel}
              disabled={isExporting}
              style={{
                fontSize: '1.2rem',
                padding: '14px 28px',
                fontWeight: 'bold',
                backgroundColor: isExporting ? '#cccccc' : exportSuccess ? '#2ecc71' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isExporting ? 'default' : 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                margin: '20px auto',
                display: 'block',
                minWidth: '300px',
                transition: 'all 0.3s ease'
              }}
            >
              {isExporting ? 'Preparing Download...' : exportSuccess ? 'Download Complete!' : 'Download Combined Results (Excel)'}
            </button>
            
            {isExporting && (
              <div style={{ textAlign: 'center', color: '#3498db', marginTop: '10px' }}>
                <p>Preparing your data for download. This may take a moment...</p>
              </div>
            )}
            
            {exportSuccess && (
              <div style={{ textAlign: 'center', color: '#2ecc71', marginTop: '10px' }}>
                <p>Download completed successfully! Check your downloads folder.</p>
              </div>
            )}
            
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