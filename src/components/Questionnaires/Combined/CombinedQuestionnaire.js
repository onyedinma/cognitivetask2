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
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

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
    // Validate all questionnaires have been completed
    if (!aceiqResults || !sesResults || !mfqResults || !sdqResults) {
      alert('Error: Missing questionnaire data. Please complete all questionnaires first.');
      return;
    }

    // Validate structure of questionnaire results
    const validateQuestionnaire = (results, name) => {
      // Make sure we have a results object
      if (!results) {
        console.error(`${name} questionnaire results object is null or undefined`);
        return false;
      }
      
      // Set totalScore to 0 if not present or not a number
      if (typeof results.totalScore !== 'number') {
        console.warn(`${name} questionnaire has invalid totalScore (${results.totalScore}), using default 0`);
        results.totalScore = 0;
      }
      
      // Check for questions array, create empty one if not present
      if (!results.questions || !Array.isArray(results.questions)) {
        console.warn(`${name} questionnaire missing questions array, creating empty array`);
        results.questions = [];
      }
      
      return true;
    };
    
    // Make sure all questionnaires have valid data structures
    validateQuestionnaire(aceiqResults, 'ACEIQ');
    validateQuestionnaire(sesResults, 'SES');
    validateQuestionnaire(mfqResults, 'MFQ');
    validateQuestionnaire(sdqResults, 'SDQ');
    
    setIsExporting(true);
    setExportSuccess(false);
    
    try {
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
          escapeCSVField('Failed to extract demographic data: ' + error.message), 
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
      csvData.push([escapeCSVField('Questionnaire'), escapeCSVField('Question ID'), escapeCSVField('Score'), escapeCSVField('Score Type'), escapeCSVField('Section'), escapeCSVField('Response'), escapeCSVField('Scoring Formula'), escapeCSVField('Question Text')]);
      
      try {
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
          
          // Define scoring formulas for each question type
          const scoringFormulas = {
            binary: 'Yes = 2, No = 1, Refused = -9',
            frequency4: 'Many times = 4, A few times = 3, Once = 2, Never = 1, Refused = -9',
            frequency5: 'Always = 1, Most of the time = 2, Sometimes = 3, Rarely = 4, Never = 5, Refused = -9'
          };
          
          // Map of question IDs to their text content
          const questionTexts = {
            'parentsUnderstandProblems': 'Did your parents/guardians understand your problems and worries?',
            'parentsKnowFreeTime': 'Did your parents/guardians really know what you were doing with your free time?',
            'notEnoughFood': 'Did you or your family not have enough food?',
            'parentsDrunkOrDrugs': 'Were your parents/guardians too drunk or intoxicated by drugs to take care of you?',
            'notSentToSchool': 'Were you not sent to school, or did you stop going to school?',
            'alcoholicHouseholdMember': 'Did you live with a household member who was a problem drinker, alcoholic, or misused street or prescription drugs?',
            'mentallyIllHouseholdMember': 'Did you live with a household member who was depressed, mentally ill, or suicidal?',
            'imprisonedHouseholdMember': 'Did you live with a household member who was ever sent to jail or prison?',
            'parentsSeparated': 'Were your parents ever separated or divorced?',
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
            'bullied': 'Were you bullied?',
            'physicalFight': 'Were you in a physical fight?',
            'witnessedBeating': 'Did you see or hear someone being beaten up in real life?',
            'witnessedStabbingOrShooting': 'Did you see or hear someone being stabbed or shot in real life?',
            'witnessedThreatenedWithWeapon': 'Did you see or hear someone being threatened with a knife or gun in real life?'
          };
  
          aceiqResults.questions.forEach(q => {
            try {
              // Make sure we have a valid question object
              if (!q || typeof q !== 'object') return;
              
              // Make sure the question has an id
              const id = q.id || 'unknown';
              
              // Determine score type if not already set
              let scoreType = q.type || aceiqQuestionTypes[id] || 'Frequency (1-4)';
              
              // Determine section
              let section = '';
              if (frequencyType5Questions.includes(id)) {
                section = 'Relationship with Parents';
              } else if (['notEnoughFood', 'parentsDrunkOrDrugs', 'notSentToSchool'].includes(id)) {
                section = 'Neglect';
              } else if (yesNoQuestions.includes(id) || 
                        ['witnessedVerbalAbuse', 'witnessedPhysicalAbuse', 'witnessedWeaponAbuse'].includes(id)) {
                section = 'Family Environment';
              } else if (['verbalAbuse', 'threatenedAbandonment', 'physicalAbuse', 'weaponAbuse', 
                          'sexualTouching', 'sexualFondling', 'attemptedSexualIntercourse', 'completedSexualIntercourse'].includes(id)) {
                section = 'Direct Abuse';
              } else if (['bullied', 'physicalFight'].includes(id)) {
                section = 'Peer Violence';
              } else if (communityViolenceQuestions.includes(id)) {
                section = 'Community Violence';
              }
              
              // Ensure score is a number
              const score = typeof q.score === 'number' ? q.score : 0;
              
              // Format score for REFUSED responses
              const formattedScore = formatRefusedResponse(score);
              
              // Include original response if available
              const response = aceiqResults.formData && aceiqResults.formData[id] ? 
                             formatRefusedResponse(aceiqResults.formData[id]) : 
                             (q.response ? formatRefusedResponse(q.response) : '');
              
              // Determine the scoring formula for this question
              let formula = '';
              if (yesNoQuestions.includes(id)) {
                formula = scoringFormulas.binary;
              } else if (frequencyType5Questions.includes(id)) {
                formula = scoringFormulas.frequency5;
              } else {
                formula = scoringFormulas.frequency4;
              }
              
              // Get question text if available
              const questionText = questionTexts[id] || '';
              
              csvData.push([
                escapeCSVField('ACEIQ'), 
                escapeCSVField(id), 
                escapeCSVField(formattedScore),
                escapeCSVField(scoreType),
                escapeCSVField(section),
                escapeCSVField(response),
                escapeCSVField(formula),
                escapeCSVField(questionText)
              ]);
            } catch (error) {
              console.error('Error processing ACEIQ question:', error);
              csvData.push([
                escapeCSVField('ACEIQ'), 
                escapeCSVField(q.id || 'unknown'), 
                escapeCSVField('ERROR'),
                escapeCSVField('Error processing question'),
                escapeCSVField(''),
                escapeCSVField(''),
                escapeCSVField(''),
                escapeCSVField(error.message)
              ]);
            }
          });
          
          // Add total score row with error handling
          const totalScore = typeof aceiqResults.totalScore === 'number' ? aceiqResults.totalScore : 0;
          
          // Add scoring explanation
          csvData.push([]);
          csvData.push([
            escapeCSVField('ACEIQ'), 
            escapeCSVField('SCORING_INFO'),
            '',
            escapeCSVField('Relationship with Parents'),
            escapeCSVField('Protective Factors'),
            '',
            escapeCSVField('Reverse scored: 6 - original score'),
            escapeCSVField('Higher scores on these items indicate LESS protection')
          ]);
          
          csvData.push([
            escapeCSVField('ACEIQ'), 
            escapeCSVField('SCORING_INFO'),
            '',
            escapeCSVField('Risk Factors'),
            escapeCSVField('All other sections'),
            '',
            escapeCSVField('Direct scoring'),
            escapeCSVField('Higher scores indicate MORE adversity')
          ]);
          
          csvData.push([escapeCSVField('ACEIQ'), escapeCSVField('TOTAL'), escapeCSVField(totalScore), escapeCSVField('Sum of all items'), escapeCSVField('Overall ACE-IQ Score'), '', escapeCSVField('Sum of all scored items'), escapeCSVField('Higher total score indicates more childhood adversity')]);
        }
      } catch (error) {
        console.error('Error processing ACEIQ results:', error);
        csvData.push([
          escapeCSVField('ACEIQ'), 
          escapeCSVField('ERROR'), 
          escapeCSVField(''),
          escapeCSVField('Error processing ACEIQ section'),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(error.message)
        ]);
      }
      
      // Blank row between questionnaires
      csvData.push([]);
      csvData.push([]);
      
      // SES section
      csvData.push([escapeCSVField('===== SOCIOECONOMIC STATUS QUESTIONNAIRE (SES) =====')]);
      csvData.push([escapeCSVField('Questionnaire'), escapeCSVField('Question ID'), escapeCSVField('Score'), escapeCSVField('Score Type'), escapeCSVField('Section'), escapeCSVField('Response'), escapeCSVField('Scoring Formula'), escapeCSVField('Question Text')]);
      
      try {
        if (sesResults.questions && Array.isArray(sesResults.questions)) {
          // Define SES question texts
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
          
          // Define SES scoring formulas
          const sesScoringFormulas = {
            'standard': 'Higher values = Higher socioeconomic status (1-5)',
            'reverse': 'Lower values = Higher socioeconomic status (5-1)'
          };
          
          sesResults.questions.forEach(q => {
            try {
              // Ensure we have a valid question object
              if (!q || typeof q !== 'object') return;
              
              // Make sure the question has an id
              const id = q.id || 'unknown';
              
              // Determine score type - only struggledFinancially is reverse scored
              const scoreType = q.type || (id === 'struggledFinancially' ? 'Reverse scored' : 'Standard scored');
              
              // Ensure score is a number
              const score = typeof q.score === 'number' ? q.score : 0;
              
              // Format score for REFUSED responses
              const formattedScore = formatRefusedResponse(score);
              
              // Include original response if available
              const response = q.response ? formatRefusedResponse(q.response) : '';
              
              // Get question text
              const questionText = sesQuestionTexts[id] || '';
              
              // Get scoring formula
              const formula = id === 'struggledFinancially' ? sesScoringFormulas.reverse : sesScoringFormulas.standard;
              
              // Determine section
              const section = 'Socioeconomic Status';
              
              csvData.push([
                escapeCSVField('SES'), 
                escapeCSVField(id), 
                escapeCSVField(formattedScore), 
                escapeCSVField(scoreType),
                escapeCSVField(section),
                escapeCSVField(response),
                escapeCSVField(formula),
                escapeCSVField(questionText)
              ]);
            } catch (error) {
              console.error('Error processing SES question:', error);
              csvData.push([
                escapeCSVField('SES'), 
                escapeCSVField(q.id || 'unknown'), 
                escapeCSVField('ERROR'),
                escapeCSVField('Error processing question'),
                escapeCSVField(''),
                escapeCSVField(''),
                escapeCSVField(''),
                escapeCSVField(error.message)
              ]);
            }
          });
          
          // Add total score row with error handling
          const totalScore = typeof sesResults.totalScore === 'number' ? sesResults.totalScore : 0;
          csvData.push([escapeCSVField('SES'), escapeCSVField('TOTAL'), escapeCSVField(totalScore), escapeCSVField('Sum of all items'), escapeCSVField('Overall SES Score'), '', escapeCSVField('Sum of all scored items'), escapeCSVField('Higher total score indicates higher socioeconomic status')]);
        }
      } catch (error) {
        console.error('Error processing SES results:', error);
        csvData.push([
          escapeCSVField('SES'), 
          escapeCSVField('ERROR'), 
          escapeCSVField(''),
          escapeCSVField('Error processing SES section'),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(error.message)
        ]);
      }
      
      // Blank row between questionnaires
      csvData.push([]);
      csvData.push([]);
      
      // MFQ section
      csvData.push([escapeCSVField('===== MOOD AND FEELINGS QUESTIONNAIRE (MFQ) =====')]);
      csvData.push([escapeCSVField('Questionnaire'), escapeCSVField('Question ID'), escapeCSVField('Score'), escapeCSVField('Score Type'), escapeCSVField('Section'), escapeCSVField('Response'), escapeCSVField('Scoring Formula'), escapeCSVField('Question Text')]);
      
      try {
        if (mfqResults.questions && Array.isArray(mfqResults.questions)) {
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
          
          mfqResults.questions.forEach(q => {
            try {
              // Ensure we have a valid question object
              if (!q || typeof q !== 'object') return;
              
              // Make sure the question has an id
              const id = q.id || 'unknown';
              
              // Ensure score is a number
              const score = typeof q.score === 'number' ? q.score : 0;
              
              // Format score for REFUSED responses
              const formattedScore = formatRefusedResponse(score);
              
              // Include original response if available
              const response = q.response ? formatRefusedResponse(q.response) : '';
              
              // Get question text
              const questionText = mfqQuestionTexts[id] || '';
              
              // All MFQ items are in the same section
              const section = 'Depression Symptoms';
              
              csvData.push([
                escapeCSVField('MFQ'), 
                escapeCSVField(id), 
                escapeCSVField(formattedScore), 
                escapeCSVField(q.type || 'Standard scored'),
                escapeCSVField(section),
                escapeCSVField(response),
                escapeCSVField(mfqScoringFormula),
                escapeCSVField(questionText)
              ]);
            } catch (error) {
              console.error('Error processing MFQ question:', error);
              csvData.push([
                escapeCSVField('MFQ'), 
                escapeCSVField(q.id || 'unknown'), 
                escapeCSVField('ERROR'),
                escapeCSVField('Error processing question'),
                escapeCSVField(''),
                escapeCSVField(''),
                escapeCSVField(''),
                escapeCSVField(error.message)
              ]);
            }
          });
          
          // Add total score row with error handling
          const totalScore = typeof mfqResults.totalScore === 'number' ? mfqResults.totalScore : 0;
          csvData.push([escapeCSVField('MFQ'), escapeCSVField('TOTAL'), escapeCSVField(totalScore), escapeCSVField('Sum of all items'), escapeCSVField('Overall Depression Score'), '', escapeCSVField('Sum of all scored items'), escapeCSVField('Higher total indicates more depressive symptoms')]);
          
          // Add interpretation row
          if (mfqResults.interpretation) {
            csvData.push([escapeCSVField('MFQ'), escapeCSVField('INTERPRETATION'), escapeCSVField(mfqResults.interpretation), escapeCSVField('Clinical interpretation'), '', '', '', '']);
          }
        }
      } catch (error) {
        console.error('Error processing MFQ results:', error);
        csvData.push([
          escapeCSVField('MFQ'), 
          escapeCSVField('ERROR'), 
          escapeCSVField(''),
          escapeCSVField('Error processing MFQ section'),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(error.message)
        ]);
      }
      
      // Blank row between questionnaires
      csvData.push([]);
      csvData.push([]);
      
      // SDQ section
      csvData.push([escapeCSVField('===== STRENGTHS AND DIFFICULTIES QUESTIONNAIRE (SDQ) =====')]);
      csvData.push([escapeCSVField('Questionnaire'), escapeCSVField('Question ID'), escapeCSVField('Score'), escapeCSVField('Score Type'), escapeCSVField('Section'), escapeCSVField('Response'), escapeCSVField('Scoring Formula'), escapeCSVField('Question Text')]);
      
      try {
        if (sdqResults.questions && Array.isArray(sdqResults.questions)) {
          // Define SDQ question texts
          const sdqQuestionTexts = {
            // Emotional symptoms items
            'emotional1': 'I get a lot of headaches, stomach-aches or sickness',
            'emotional2': 'I worry a lot',
            'emotional3': 'I am often unhappy, down-hearted or tearful',
            'emotional4': 'I am nervous in new situations. I easily lose confidence',
            'emotional5': 'I have many fears, I am easily scared',
            
            // Conduct problems items
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
            'prosocial5': 'I often volunteer to help others (parents, teachers, children)'
          };
          
          // Define SDQ scoring formulas
          const sdqScoringFormulas = {
            'standard': 'Not true = 0, Somewhat true = 1, Certainly true = 2, Refused = -9',
            'reverse': 'Not true = 2, Somewhat true = 1, Certainly true = 0, Refused = -9'
          };
          
          sdqResults.questions.forEach(q => {
            try {
              // Ensure we have a valid question object
              if (!q || typeof q !== 'object') return;
              
              // Make sure the question has an id
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
              
              // Include original response if available
              const response = q.response ? formatRefusedResponse(q.response) : '';
              
              // Get question text
              const questionText = sdqQuestionTexts[id] || '';
              
              csvData.push([
                escapeCSVField('SDQ'), 
                escapeCSVField(id), 
                escapeCSVField(formattedScore), 
                escapeCSVField(scoreType),
                escapeCSVField(section),
                escapeCSVField(response),
                escapeCSVField(formula),
                escapeCSVField(questionText)
              ]);
            } catch (error) {
              console.error('Error processing SDQ question:', error);
              csvData.push([
                escapeCSVField('SDQ'), 
                escapeCSVField(q.id || 'unknown'), 
                escapeCSVField('ERROR'),
                escapeCSVField('Error processing question'),
                escapeCSVField(''),
                escapeCSVField(''),
                escapeCSVField(''),
                escapeCSVField(error.message)
              ]);
            }
          });
          
          // Add a separator before summary scores
          csvData.push([]);
          csvData.push([escapeCSVField('===== SDQ SUMMARY SCORES =====')]);
          csvData.push([escapeCSVField('Scale'), escapeCSVField('Score'), escapeCSVField('Category'), escapeCSVField('Score Type'), escapeCSVField('Interpretation')]);
          
          // Include subscale scores with categories
          try {
            if (sdqResults.scores) {
              // Format scores for REFUSED responses - handle missing scores gracefully
              const scores = sdqResults.scores;
              const formattedEmotional = formatRefusedResponse(scores.emotional);
              const formattedConduct = formatRefusedResponse(scores.conduct);
              const formattedHyperactivity = formatRefusedResponse(scores.hyperactivity);
              const formattedPeer = formatRefusedResponse(scores.peer);
              const formattedProsocial = formatRefusedResponse(scores.prosocial);
              const formattedTotalDifficulties = formatRefusedResponse(scores.totalDifficulties);
              const formattedExternalizing = formatRefusedResponse(scores.externalizing);
              const formattedInternalizing = formatRefusedResponse(scores.internalizing);
              
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('EMOTIONAL_PROBLEMS'), escapeCSVField(formattedEmotional), escapeCSVField('Subscale total'), '']);
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('EMOTIONAL_CATEGORY'), escapeCSVField(scores.emotionalCategory || 'Unknown'), escapeCSVField('Clinical category'), '']);
              
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('CONDUCT_PROBLEMS'), escapeCSVField(formattedConduct), escapeCSVField('Subscale total'), '']);
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('CONDUCT_CATEGORY'), escapeCSVField(scores.conductCategory || 'Unknown'), escapeCSVField('Clinical category'), '']);
              
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('HYPERACTIVITY'), escapeCSVField(formattedHyperactivity), escapeCSVField('Subscale total'), '']);
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('HYPERACTIVITY_CATEGORY'), escapeCSVField(scores.hyperactivityCategory || 'Unknown'), escapeCSVField('Clinical category'), '']);
              
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('PEER_PROBLEMS'), escapeCSVField(formattedPeer), escapeCSVField('Subscale total'), '']);
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('PEER_CATEGORY'), escapeCSVField(scores.peerCategory || 'Unknown'), escapeCSVField('Clinical category'), '']);
              
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('PROSOCIAL'), escapeCSVField(formattedProsocial), escapeCSVField('Subscale total (higher is better)'), '']);
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('PROSOCIAL_CATEGORY'), escapeCSVField(scores.prosocialCategory || 'Unknown'), escapeCSVField('Clinical category'), '']);
              
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('TOTAL_DIFFICULTIES'), escapeCSVField(formattedTotalDifficulties), escapeCSVField('Sum of problem subscales'), '']);
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('TOTAL_CATEGORY'), escapeCSVField(scores.totalDifficultiesCategory || 'Unknown'), escapeCSVField('Clinical category'), '']);
              
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('EXTERNALIZING'), escapeCSVField(formattedExternalizing), escapeCSVField('Conduct + Hyperactivity'), '']);
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('INTERNALIZING'), escapeCSVField(formattedInternalizing), escapeCSVField('Emotional + Peer'), '']);
            }
            
            // Interpretation
            if (sdqResults.interpretation) {
              csvData.push([escapeCSVField('SDQ'), escapeCSVField('INTERPRETATION'), escapeCSVField(sdqResults.interpretation), '', '']);
            }
          } catch (error) {
            console.error('Error processing SDQ scores:', error);
            csvData.push([
              escapeCSVField('SDQ'), 
              escapeCSVField('SCORES_ERROR'), 
              escapeCSVField(''),
              escapeCSVField('Error processing scores'),
              escapeCSVField(''),
              escapeCSVField(''),
              escapeCSVField(''),
              escapeCSVField(error.message)
            ]);
          }
        }
      } catch (error) {
        console.error('Error processing SDQ results:', error);
        csvData.push([
          escapeCSVField('SDQ'), 
          escapeCSVField('ERROR'), 
          escapeCSVField(''),
          escapeCSVField('Error processing SDQ section'),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(''),
          escapeCSVField(error.message)
        ]);
      }
      
      // Create the CSV content from the data
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      
      // Export to CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      // Include timestamp in filename for uniqueness
      const formattedDate = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
      link.setAttribute('download', `questionnaire_results_${studentId}_${formattedDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setExportSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setExportSuccess(false);
        }, 3000);
      }, 100);
    } catch (error) {
      console.error('Error generating CSV export:', error);
      alert(`Export failed: ${error.message}. Please try again or contact support.`);
      setIsExporting(false);
    }
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