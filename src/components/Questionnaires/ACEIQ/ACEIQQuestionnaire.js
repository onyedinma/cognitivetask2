import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ACEIQ.css';
import { 
  NeglectSection, 
  FamilyEnvironmentSection,
  DirectAbuseSection,
  PeerViolenceSection,
  CommunityViolenceSection,
  TestSection
} from './ACEIQSections';

/**
 * Adverse Childhood Experiences International Questionnaire (ACE-IQ)
 */
const ACEIQQuestionnaire = ({ onComplete }) => {
  const navigate = useNavigate();
  
  // State for form sections
  const [currentSection, setCurrentSection] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [scores, setScores] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(true); // Default to true for simplified validation
  
  // Define scoring values - updated to match the new scoring system
  const scoringValues = {
    frequency5: {
      "Always": 1,
      "Most of the time": 2,
      "Sometimes": 3,
      "Rarely": 4,
      "Never": 5,
      "Refused": -9
    },
    frequency4: {
      // Community Violence questions scoring:
      // Many times = 4, A few times = 3, Once = 2, Never = 1, Refused = -9
      "Never": 1,
      "Once": 2,
      "A few times": 3,
      "Many times": 4,
      "Refused": -9
    },
    yesNo: {
      "Yes": 2,
      "No": 1,
      "Refused": -9
    },
    // Add scoring for bullying types
    bullyingTypes: {
      "Never bullied": 0,
      "Physical": 1,
      "Race": 1,
      "Religion": 1,
      "Sexual": 1,
      "Exclusion": 1,
      "Appearance": 1,
      "Other": 1,
      "Refused": -9
    }
  };
  
  // Determine the appropriate questionnaire structure based on questions and scoring
  const yesNoQuestions = [
    'alcoholicHouseholdMember', 'mentallyIllHouseholdMember', 
    'imprisonedHouseholdMember', 'parentsSeparated', 'parentDied'
  ];
  
  const frequencyType4Questions = [
    'notEnoughFood', 'parentsDrunkOrDrugs', 'notSentToSchool',
    'witnessedVerbalAbuse', 'witnessedPhysicalAbuse', 'witnessedWeaponAbuse',
    'verbalAbuse', 'threatenedAbandonment', 'bullied',
    'physicalAbuse', 'weaponAbuse', 
    'sexualTouching', 'sexualFondling', 'attemptedSexualIntercourse', 'completedSexualIntercourse',
    'physicalFight', 'witnessedBeating', 'witnessedStabbingOrShooting', 'witnessedThreatenedWithWeapon'
  ];
  
  const frequencyType5Questions = [
    'parentsUnderstandProblems', 'parentsKnowFreeTime'
  ];
  
  // Map question IDs to their types for the combined CSV export
  const getQuestionScoreType = (questionId) => {
    if (yesNoQuestions.includes(questionId)) {
      return 'Binary (1-2)';
    } else if (frequencyType4Questions.includes(questionId)) {
      return 'Frequency (1-4)';
    } else if (frequencyType5Questions.includes(questionId)) {
      return 'Protection (1-5)';
    }
    return '';
  };
  
  // State for form data
  const [formData, setFormData] = useState({
    // Demographic information
    sex: '',
    birthDate: '',
    age: '',
    ethnicity: '',
    
    // Relationship with parents/guardians
    parentsUnderstandProblems: '',
    parentsKnowFreeTime: '',
    
    // Family environment and neglect
    notEnoughFood: '',
    parentsDrunkOrDrugs: '',
    notSentToSchool: '',
    
    // Household dysfunction
    alcoholicHouseholdMember: '',
    mentallyIllHouseholdMember: '',
    imprisonedHouseholdMember: '',
    parentsSeparated: '',
    parentDied: '',
    
    // Witnessing abuse
    witnessedVerbalAbuse: '',
    witnessedPhysicalAbuse: '',
    witnessedWeaponAbuse: '',
    
    // Direct abuse
    verbalAbuse: '',
    threatenedAbandonment: '',
    physicalAbuse: '',
    weaponAbuse: '',
    sexualTouching: '',
    sexualFondling: '',
    attemptedSexualIntercourse: '',
    completedSexualIntercourse: '',
    
    // Peer violence
    bullied: '',
    bullyingTypes: '',
    physicalFight: '',
    
    // Community violence
    witnessedBeating: '',
    witnessedStabbingOrShooting: '',
    witnessedThreatenedWithWeapon: ''
  });
  
  // Calculate scores when form data changes
  useEffect(() => {
    calculateScores();
  }, [formData]);
  
  // Calculate age from birth date
  useEffect(() => {
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred yet this year
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setFormData(prevData => ({
        ...prevData,
        age: age.toString()
      }));
    }
  }, [formData.birthDate]);
  
  // Calculate scores based on responses
  const calculateScores = () => {
    const newScores = {};
    let newTotalScore = 0;
    
    // Calculate scores for frequency type 5 questions (reversed since these are positive items)
    frequencyType5Questions.forEach(question => {
      if (formData[question] && formData[question] !== '') {
        // Get the original score
        const originalScore = scoringValues.frequency5[formData[question]];
        
        // Apply reverse scoring: 6 - original score (to convert 5->1, 4->2, 3->3, 2->4, 1->5)
        const reversedScore = (originalScore > 0) ? (6 - originalScore) : originalScore;
        
        newScores[question] = reversedScore;
        if (reversedScore > 0) newTotalScore += reversedScore;
      }
    });
    
    // Calculate scores for frequency type 4 questions
    frequencyType4Questions.forEach(question => {
      if (formData[question] && formData[question] !== '') {
        const score = scoringValues.frequency4[formData[question]];
        newScores[question] = score;
        if (score > 0) newTotalScore += score;
      }
    });
    
    // Calculate scores for yes/no questions
    yesNoQuestions.forEach(question => {
      if (formData[question] && formData[question] !== '') {
        const score = scoringValues.yesNo[formData[question]];
        newScores[question] = score;
        if (score > 0) newTotalScore += score;
      }
    });
    
    // Calculate scores for bullying types
    if (formData.bullyingTypes && formData.bullyingTypes !== '') {
      const bullyingTypesArray = formData.bullyingTypes.split(',');
      let bullyingTypeScore = 0;
      
      console.log("DEBUG calculateScores - bullyingTypes raw value:", formData.bullyingTypes);
      console.log("DEBUG calculateScores - bullyingTypesArray:", bullyingTypesArray);
      
      // Special handling for "Never bullied" and "Refused"
      if (bullyingTypesArray.includes("Refused")) {
        bullyingTypeScore = -9;
        console.log("DEBUG calculateScores - 'Refused' selected, score set to -9");
      } else if (bullyingTypesArray.includes("Never bullied")) {
        bullyingTypeScore = 0;
        console.log("DEBUG calculateScores - 'Never bullied' selected, score set to 0");
      } else {
        // Count the number of selected bullying types
        bullyingTypeScore = bullyingTypesArray.length;
        console.log(`DEBUG calculateScores - ${bullyingTypesArray.length} bullying types selected, score = ${bullyingTypeScore}`);
      }
      
      console.log("DEBUG calculateScores - Final bullyingTypeScore:", bullyingTypeScore);
      newScores.bullyingTypes = bullyingTypeScore;
      
      if (bullyingTypeScore > 0 || bullyingTypeScore === -9) {
        newTotalScore += bullyingTypeScore;
        console.log(`DEBUG calculateScores - Added ${bullyingTypeScore} to total score, new total: ${newTotalScore}`);
      }
    }
    
    setScores(newScores);
    setTotalScore(newTotalScore);
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle navigation between sections
  const nextSection = () => {
    // Add more detailed logging
    console.log(`Moving to section ${currentSection + 1} of ${sections.length}`);
    console.log('Current section name:', getSectionName(currentSection));
    console.log('Next section name:', getSectionName(currentSection + 1));
    console.log('Sections length:', sections.length);
    
    // Normal transition for all sections
    // Ensure we never exceed the available sections
    const nextIndex = Math.min(currentSection + 1, sections.length - 1);
    
    // Set the next section index directly
    setCurrentSection(nextIndex);
    
    // Force scroll to top
    window.scrollTo(0, 0);
    
    // Double check we're at the right section
    setTimeout(() => {
      console.log('After transition - current section:', nextIndex);
      console.log('After transition - section name:', getSectionName(nextIndex));
    }, 100);
  };
  
  // Handle going back to previous section
  const prevSection = () => {
    console.log(`Moving back to section ${currentSection - 1} of ${sections.length}`);
    setCurrentSection(prev => Math.max(prev - 1, 0)); // Ensure we don't go below 0
    window.scrollTo(0, 0);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // IMPORTANT: Explicitly check if we're on the Test Section (should be the very last section)
    console.log(`Submitting form from section ${currentSection} of ${sections.length}, section name: ${getSectionName(currentSection)}`);
    
    // If we're not on the last section (Test Section), go to next section instead of submitting
    if (currentSection !== 7) {
      console.warn("Form submitted before reaching the final section. Navigating to the next section instead.");
      nextSection();
      return;
    }
    
    // At this point, we should be on the Test Section (the last section)
    console.log("Processing final form submission from Test Section");
    
    // Check if all questions are answered
    if (!allQuestionsAnswered) {
      setValidationError(true);
      window.scrollTo(0, 0); // Scroll to top to show error
      return;
    }
    
    // Calculate total score based on all responses
    const totalScore = calculateTotalScore(formData);
    
    // Prepare structured questions array for combined export - with proper bullying scores
    const questionsArray = questions.map(question => {
      const response = formData[question.id];
      let score = 0;
      
      // Special handling for bullying types question
      if (question.id === 'bullyingTypes') {
        if (formData.bullyingTypes) {
          const bullyingTypesArray = formData.bullyingTypes.split(',');
          
          if (bullyingTypesArray.includes("Refused")) {
            score = -9;
          } else if (bullyingTypesArray.includes("Never bullied")) {
            score = 0;
          } else {
            // Sum up 1 point for each selected bullying type
            score = bullyingTypesArray.length;
          }
        }
      }
      // Check if this is a yes/no question
      else if (yesNoQuestions.includes(question.id)) {
        score = response ? scoringValues.yesNo[response] || 0 : 0;
      } 
      // Check if this is a frequency4 question
      else if (frequencyType4Questions.includes(question.id)) {
        score = response ? scoringValues.frequency4[response] || 0 : 0;
      }
      // Handle frequency5 questions with different scoring
      else if (frequencyType5Questions.includes(question.id)) {
        score = response ? scoringValues.frequency5[response] || 0 : 0;
      }
      
      // Get the score type
      const scoreType = getQuestionScoreType(question.id);
                      
      return {
        id: question.id,
        response: response,
        score: score,
        type: scoreType
      };
    });
    
    // Save form data
    const studentId = localStorage.getItem('studentId') || 'unknown';
    const timestamp = new Date().toISOString();
    
    // Extract demographic information
    const demographics = {
      sex: formData.sex || '',
      age: formData.age || '',
      birthDate: formData.birthDate || '',
      ethnicity: formData.ethnicity || '',
    };
    
    const results = {
      studentId,
      timestamp,
      totalScore,
      questions: questionsArray,
      demographics, // Add demographics as a dedicated section
      formData     // Keep full form data as well for reference
    };
    
    // Log results
    console.log('ACE-IQ Questionnaire Results:', results);
    
    // Save to localStorage
    const storedResults = JSON.parse(localStorage.getItem('aceiqResults') || '[]');
    localStorage.setItem('aceiqResults', JSON.stringify([...storedResults, results]));
    
    setFormSubmitted(true);
    
    // If onComplete callback is provided, use it
    if (onComplete) {
      onComplete(results);
    }
  };
  
  // Helper function to get question text
  const getQuestionText = (questionId) => {
    // Map question IDs to their text
    const questionTextMap = {
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
    
    return questionTextMap[questionId] || `Question: ${questionId}`;
  };
  
  // Return to main menu
  const returnToMenu = () => {
    // Add a check to prevent accidental completion
    if (onComplete && formSubmitted) {
      console.log("Calling onComplete with results");
      onComplete(null);
    } else if (!formSubmitted) {
      console.warn("Attempted to return to menu before form submission");
      // If debugging, allow skipping back to menu anyway
      if (window.confirm("Form not submitted. Return to menu anyway?")) {
        if (onComplete) onComplete(null);
        else navigate('/');
      }
    } else {
      navigate('/');
    }
  };
  
  // Export results as CSV
  const exportToCSV = () => {
    setExportingCSV(true);
    
    try {
      // Get participant ID and timestamp
      const studentId = localStorage.getItem('studentId') || 'unknown';
      const timestamp = new Date().toISOString();
      
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
      
      // Create CSV header row with expanded fields
      let csvContent = 'StudentID,Timestamp,Section,QuestionID,QuestionText,Response,Score,ScoreType,ScoringFormula,PossibleResponses\n';
      
      // Add row for each question with expanded information
      questions.forEach(question => {
        const response = formData[question.id];
        const questionText = question.text;
        let score = 0;
        let scoreType = '';
        let section = '';
        let scoringFormula = '';
        let possibleResponses = '';
        
        // Determine section
        if (['parentsUnderstandProblems', 'parentsKnowFreeTime'].includes(question.id)) {
          section = 'Relationship with Parents';
        } else if (['notEnoughFood', 'parentsDrunkOrDrugs', 'notSentToSchool'].includes(question.id)) {
          section = 'Neglect';
        } else if (['alcoholicHouseholdMember', 'mentallyIllHouseholdMember', 'imprisonedHouseholdMember', 'parentsSeparated', 'parentDied', 
                    'witnessedVerbalAbuse', 'witnessedPhysicalAbuse', 'witnessedWeaponAbuse'].includes(question.id)) {
          section = 'Family Environment';
        } else if (['verbalAbuse', 'threatenedAbandonment', 'physicalAbuse', 'weaponAbuse', 
                    'sexualTouching', 'sexualFondling', 'attemptedSexualIntercourse', 'completedSexualIntercourse'].includes(question.id)) {
          section = 'Direct Abuse';
        } else if (['bullied', 'bullyingTypes', 'physicalFight'].includes(question.id)) {
          section = 'Peer Violence';
        } else if (['witnessedBeating', 'witnessedStabbingOrShooting', 'witnessedThreatenedWithWeapon'].includes(question.id)) {
          section = 'Community Violence';
        }
        
        // Check if this is a yes/no question
        if (yesNoQuestions.includes(question.id)) {
          score = response ? scoringValues.yesNo[response] || 0 : 0;
          scoreType = 'Binary (1-2)';
          scoringFormula = 'Yes = 2, No = 1, Refused = -9';
          possibleResponses = 'Yes, No, Refused';
        } 
        // Check if this is a frequency4 question
        else if (frequencyType4Questions.includes(question.id)) {
          score = response ? scoringValues.frequency4[response] || 0 : 0;
          
          // Special label for community violence questions
          if (['witnessedBeating', 'witnessedStabbingOrShooting', 'witnessedThreatenedWithWeapon'].includes(question.id)) {
            scoreType = 'Community Violence (1-4)';
          } else {
            scoreType = 'Frequency (1-4)';
          }
          
          scoringFormula = 'Many times = 4, A few times = 3, Once = 2, Never = 1, Refused = -9';
          possibleResponses = 'Many times, A few times, Once, Never, Refused';
        }
        // Handle frequency5 questions with different scoring
        else if (frequencyType5Questions.includes(question.id)) {
          score = response ? scoringValues.frequency5[response] || 0 : 0;
          scoreType = 'Protection (1-5)';
          scoringFormula = 'Always = 1, Most of the time = 2, Sometimes = 3, Rarely = 4, Never = 5, Refused = -9';
          possibleResponses = 'Always, Most of the time, Sometimes, Rarely, Never, Refused';
        }
        // Handle bullying types specially
        else if (question.id === 'bullyingTypes') {
          // Get the bullying types array
          const bullyingTypesArray = response ? response.split(',') : [];
          
          // Calculate the score based on the selected types
          if (bullyingTypesArray.includes("Never bullied")) {
            score = 0;
          } else if (bullyingTypesArray.includes("Refused")) {
            score = -9;
          } else {
            // Sum the scores for all selected types
            score = bullyingTypesArray.reduce((sum, type) => {
              return sum + (scoringValues.bullyingTypes[type] || 0);
            }, 0);
          }
          
          scoreType = 'Bullying Types (Multiple Selection)';
          scoringFormula = 'Each type = 1, Never bullied = 0, Refused = -9';
          possibleResponses = 'Never bullied, Physical, Race, Religion, Sexual, Exclusion, Appearance, Other, Refused';
          
          // Special handling for the response display in CSV
          if (response) {
            csvContent += [
              escapeCSVField(studentId),
              escapeCSVField(timestamp),
              escapeCSVField(section),
              escapeCSVField(question.id),
              escapeCSVField(questionText),
              escapeCSVField(response || 'Not Answered'),
              score, // Numeric value, no escaping needed
              escapeCSVField(scoreType),
              escapeCSVField(scoringFormula),
              escapeCSVField(possibleResponses)
            ].join(',') + '\n';
            
            // Add a row for each selected bullying type for clarity
            bullyingTypesArray.forEach(type => {
              csvContent += [
                escapeCSVField(studentId),
                escapeCSVField(timestamp),
                escapeCSVField(`${section} - Detail`),
                escapeCSVField(`${question.id}_${type.replace(/\s+/g, '')}`),
                escapeCSVField(`Bullying Type: ${type}`),
                escapeCSVField('Selected'),
                scoringValues.bullyingTypes[type] || 0,
                escapeCSVField('Bullying Type Selection'),
                escapeCSVField(scoringFormula),
                escapeCSVField('Selected, Not Selected')
              ].join(',') + '\n';
            });
            
            // Skip the default row addition at the end of the loop
            return;
          }
        }
        
        csvContent += [
          escapeCSVField(studentId),
          escapeCSVField(timestamp),
          escapeCSVField(section),
          escapeCSVField(question.id),
          escapeCSVField(questionText),
          escapeCSVField(response || 'Not Answered'),
          score, // Numeric value, no escaping needed
          escapeCSVField(scoreType),
          escapeCSVField(scoringFormula),
          escapeCSVField(possibleResponses)
        ].join(',') + '\n';
      });
      
      // Add section-specific scoring information
      csvContent += '\n';
      csvContent += [
        escapeCSVField(studentId),
        escapeCSVField(timestamp),
        escapeCSVField('Scoring Information'),
        escapeCSVField('SECTION_INFO'),
        escapeCSVField('Relationship with Parents - Protective Factors'),
        escapeCSVField(''),
        '', // No score for this row
        escapeCSVField('Protective Factors'),
        escapeCSVField('Reverse scoring: 6 - original score'),
        escapeCSVField('')
      ].join(',') + '\n';
      
      csvContent += [
        escapeCSVField(studentId),
        escapeCSVField(timestamp),
        escapeCSVField('Scoring Information'),
        escapeCSVField('SECTION_INFO'),
        escapeCSVField('Neglect, Family Environment, Direct Abuse, Peer Violence'),
        escapeCSVField(''),
        '', // No score for this row
        escapeCSVField('Risk Factors'),
        escapeCSVField('Higher scores indicate greater exposure to adverse events'),
        escapeCSVField('')
      ].join(',') + '\n';
      
      csvContent += [
        escapeCSVField(studentId),
        escapeCSVField(timestamp),
        escapeCSVField('Scoring Information'),
        escapeCSVField('SECTION_INFO'),
        escapeCSVField('Community Violence'),
        escapeCSVField(''),
        '', // No score for this row
        escapeCSVField('Community Risk Factors'),
        escapeCSVField('Higher scores indicate greater exposure to community violence'),
        escapeCSVField('')
      ].join(',') + '\n\n';
      
      // Add total score row
      csvContent += [
        escapeCSVField(studentId),
        escapeCSVField(timestamp),
        escapeCSVField('Summary'),
        escapeCSVField('TOTAL_SCORE'),
        escapeCSVField('Total ACE-IQ Score'),
        escapeCSVField(''),
        calculateTotalScore(formData),
        escapeCSVField('Sum of all items'),
        escapeCSVField('Sum of all question scores, higher total indicates more adversity'),
        escapeCSVField('')
      ].join(',') + '\n\n';
      
      // Add demographic info section header
      csvContent += [
        escapeCSVField(studentId),
        escapeCSVField(timestamp),
        escapeCSVField('Demographics'),
        escapeCSVField('SECTION_HEADER'),
        escapeCSVField('Demographic Information'),
        escapeCSVField(''),
        '',
        escapeCSVField(''),
        escapeCSVField(''),
        escapeCSVField('')
      ].join(',') + '\n';
      
      // Add demographic info with proper escaping
      csvContent += [
        escapeCSVField(studentId),
        escapeCSVField(timestamp),
        escapeCSVField('Demographics'),
        escapeCSVField('sex'),
        escapeCSVField('Sex'),
        escapeCSVField(formData.sex || 'Not Answered'),
        '', // No score for demographic fields
        escapeCSVField(''),
        escapeCSVField(''),
        escapeCSVField('Male, Female')
      ].join(',') + '\n';
      
      csvContent += [
        escapeCSVField(studentId),
        escapeCSVField(timestamp),
        escapeCSVField('Demographics'),
        escapeCSVField('age'),
        escapeCSVField('Age'),
        escapeCSVField(formData.age || 'Not Answered'),
        '', // No score for demographic fields
        escapeCSVField(''),
        escapeCSVField(''),
        escapeCSVField('')
      ].join(',') + '\n';
      
      csvContent += [
        escapeCSVField(studentId),
        escapeCSVField(timestamp),
        escapeCSVField('Demographics'),
        escapeCSVField('birthDate'),
        escapeCSVField('Birth Date'),
        escapeCSVField(formData.birthDate || 'Not Answered'),
        '', // No score for demographic fields
        escapeCSVField(''),
        escapeCSVField(''),
        escapeCSVField('')
      ].join(',') + '\n';
      
      csvContent += [
        escapeCSVField(studentId),
        escapeCSVField(timestamp),
        escapeCSVField('Demographics'),
        escapeCSVField('ethnicity'),
        escapeCSVField('Ethnicity'),
        escapeCSVField(formData.ethnicity || 'Not Answered'),
        '', // No score for demographic fields
        escapeCSVField(''),
        escapeCSVField(''),
        escapeCSVField('')
      ].join(',') + '\n';
      
      // Create downloadable link
      const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `aceiq_results_${studentId}_${new Date().toISOString().slice(0, 10)}.csv`);
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

  // Export results as JSON
  const exportJSON = () => {
    const studentId = localStorage.getItem('studentId') || 'unknown';
    const timestamp = new Date().toISOString();
    
    const dataStr = JSON.stringify({
      studentId,
      timestamp,
      formData,
      scores,
      totalScore
    }, null, 2);
    
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `aceiq_results_${studentId}_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Define the sections of the questionnaire
  const sections = [
    // Section 0: Demographic Information
    <section key="demographics" className="questionnaire-section demographics-section">
      <div className="section-header demographics-header">
        <h2 className="questionnaire-section-title">DEMOGRAPHIC INFORMATION</h2>
        <div className="section-icon">👤</div>
      </div>
      
      <div className="demographics-container">
        <div className="question-item compact">
          <div className="question-text">
            <span className="question-number">0.1</span>
            Sex
          </div>
          <div className="radio-options horizontal">
            <div className="radio-option">
              <input 
                type="radio" 
                id="sex-male" 
                name="sex" 
                value="Male" 
                checked={formData.sex === "Male"}
                onChange={handleChange}
              />
              <label htmlFor="sex-male">Male</label>
            </div>
            <div className="radio-option">
              <input 
                type="radio" 
                id="sex-female" 
                name="sex" 
                value="Female" 
                checked={formData.sex === "Female"}
                onChange={handleChange}
              />
              <label htmlFor="sex-female">Female</label>
            </div>
          </div>
        </div>
        
        <div className="question-item compact">
          <div className="question-text">
            <span className="question-number">0.2</span>
            Date of birth
          </div>
          <div className="date-input-container">
            <input 
              type="date" 
              name="birthDate" 
              value={formData.birthDate}
              onChange={handleChange}
              className="date-picker"
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
            />
          </div>
        </div>
        
        <div className="question-item compact">
          <div className="question-text">
            <span className="question-number">0.3</span>
            Age
          </div>
          <div className="input-container">
            <input 
              type="text" 
              name="age" 
              value={formData.age}
              readOnly
              className="text-input age-input calculated"
              placeholder="Auto-calculated"
            />
          </div>
        </div>
        
        <div className="question-item compact">
          <div className="question-text">
            <span className="question-number">0.4</span>
            Ethnic/racial group or cultural background
          </div>
          <div className="input-container">
            <input 
              type="text" 
              name="ethnicity" 
              value={formData.ethnicity}
              onChange={handleChange}
              className="text-input ethnicity-input"
              placeholder="Enter your ethnicity"
            />
          </div>
        </div>
      </div>
    </section>,
    
    // Section 1: Relationship with Parents/Guardians
    <section key="parents" className="questionnaire-section parents-section">
      <div className="section-header parents-header">
        <h2 className="questionnaire-section-title">RELATIONSHIP WITH PARENTS/GUARDIANS</h2>
        <div className="section-icon">👪</div>
      </div>
      <div className="question-description">
        When you were growing up, during the first 18 years of your life...
      </div>
      
      <div className="question-item">
        <div className="question-text">
          <span className="question-number">1.1</span>
          Did your parents/guardians understand your problems and worries?
        </div>
        <div className="radio-options frequency-scale">
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsUnderstand-always" 
              name="parentsUnderstandProblems" 
              value="Always" 
              checked={formData.parentsUnderstandProblems === "Always"}
              onChange={handleChange}
            />
            <label htmlFor="parentsUnderstand-always">Always</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsUnderstand-mostOfTime" 
              name="parentsUnderstandProblems" 
              value="Most of the time" 
              checked={formData.parentsUnderstandProblems === "Most of the time"}
              onChange={handleChange}
            />
            <label htmlFor="parentsUnderstand-mostOfTime">Most of the time</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsUnderstand-sometimes" 
              name="parentsUnderstandProblems" 
              value="Sometimes" 
              checked={formData.parentsUnderstandProblems === "Sometimes"}
              onChange={handleChange}
            />
            <label htmlFor="parentsUnderstand-sometimes">Sometimes</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsUnderstand-rarely" 
              name="parentsUnderstandProblems" 
              value="Rarely" 
              checked={formData.parentsUnderstandProblems === "Rarely"}
              onChange={handleChange}
            />
            <label htmlFor="parentsUnderstand-rarely">Rarely</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsUnderstand-never" 
              name="parentsUnderstandProblems" 
              value="Never" 
              checked={formData.parentsUnderstandProblems === "Never"}
              onChange={handleChange}
            />
            <label htmlFor="parentsUnderstand-never">Never</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsUnderstand-refused" 
              name="parentsUnderstandProblems" 
              value="Refused" 
              checked={formData.parentsUnderstandProblems === "Refused"}
              onChange={handleChange}
            />
            <label htmlFor="parentsUnderstand-refused">Refused</label>
          </div>
        </div>
      </div>
      
      <div className="question-item">
        <div className="question-text">
          <span className="question-number">1.2</span>
          Did your parents/guardians really know what you were doing with your free time when you were not at school or work?
        </div>
        <div className="radio-options frequency-scale">
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsKnow-always" 
              name="parentsKnowFreeTime" 
              value="Always" 
              checked={formData.parentsKnowFreeTime === "Always"}
              onChange={handleChange}
            />
            <label htmlFor="parentsKnow-always">Always</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsKnow-mostOfTime" 
              name="parentsKnowFreeTime" 
              value="Most of the time" 
              checked={formData.parentsKnowFreeTime === "Most of the time"}
              onChange={handleChange}
            />
            <label htmlFor="parentsKnow-mostOfTime">Most of the time</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsKnow-sometimes" 
              name="parentsKnowFreeTime" 
              value="Sometimes" 
              checked={formData.parentsKnowFreeTime === "Sometimes"}
              onChange={handleChange}
            />
            <label htmlFor="parentsKnow-sometimes">Sometimes</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsKnow-rarely" 
              name="parentsKnowFreeTime" 
              value="Rarely" 
              checked={formData.parentsKnowFreeTime === "Rarely"}
              onChange={handleChange}
            />
            <label htmlFor="parentsKnow-rarely">Rarely</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsKnow-never" 
              name="parentsKnowFreeTime" 
              value="Never" 
              checked={formData.parentsKnowFreeTime === "Never"}
              onChange={handleChange}
            />
            <label htmlFor="parentsKnow-never">Never</label>
          </div>
          <div className="radio-option">
            <input 
              type="radio" 
              id="parentsKnow-refused" 
              name="parentsKnowFreeTime" 
              value="Refused" 
              checked={formData.parentsKnowFreeTime === "Refused"}
              onChange={handleChange}
            />
            <label htmlFor="parentsKnow-refused">Refused</label>
          </div>
        </div>
      </div>
    </section>,
    
    // Sections imported from ACEIQSections.js with custom wrappers
    <section key="neglect" className="questionnaire-section neglect-section">
      <div className="section-header neglect-header">
        <h2 className="questionnaire-section-title">NEGLECT</h2>
        <div className="section-icon">⚠️</div>
      </div>
      <NeglectSection formData={formData} handleChange={handleChange} />
    </section>,
    
    <section key="family" className="questionnaire-section family-section">
      <div className="section-header family-header">
        <h2 className="questionnaire-section-title">FAMILY ENVIRONMENT</h2>
        <div className="section-icon">🏠</div>
      </div>
      <FamilyEnvironmentSection formData={formData} handleChange={handleChange} />
    </section>,
    
    <section key="direct-abuse" className="questionnaire-section abuse-section">
      <div className="section-header abuse-header">
        <h2 className="questionnaire-section-title">DIRECT ABUSE</h2>
        <div className="section-icon">🛑</div>
      </div>
      <DirectAbuseSection formData={formData} handleChange={handleChange} />
    </section>,
    
    <section key="peer-violence" className="questionnaire-section peer-section">
      <div className="section-header peer-header">
        <h2 className="questionnaire-section-title">PEER VIOLENCE</h2>
        <div className="section-icon">👥</div>
      </div>
      <PeerViolenceSection formData={formData} handleChange={handleChange} />
    </section>,
    
    // Section 6: Community Violence
    <section key="community-violence" className="questionnaire-section community-section">
      <div className="section-header community-header">
        <h2 className="questionnaire-section-title">COMMUNITY VIOLENCE</h2>
        <div className="section-icon">🏙️</div>
      </div>
      <CommunityViolenceSection formData={formData} handleChange={handleChange} />
    </section>,
    
    // Section 7: Test Section
    <section key="test" className="questionnaire-section test-section">
      <div className="section-header test-header">
        <h2 className="questionnaire-section-title">TEST SECTION</h2>
        <div className="section-icon">🧪</div>
      </div>
      <TestSection />
    </section>
  ];
  
  // Questions array - contains all questions we want to track scores for
  const questions = [
    { id: 'parentsUnderstandProblems', text: 'Did your parents/guardians understand your problems and worries?' },
    { id: 'parentsKnowFreeTime', text: 'Did your parents/guardians really know what you were doing with your free time?' },
    { id: 'notEnoughFood', text: 'Did you or your family not have enough food?' },
    { id: 'parentsDrunkOrDrugs', text: 'Were your parents/guardians too drunk or intoxicated by drugs to take care of you?' },
    { id: 'notSentToSchool', text: 'Were you not sent to school, or did you stop going to school?' },
    { id: 'alcoholicHouseholdMember', text: 'Did you live with a household member who was a problem drinker, alcoholic, or misused street or prescription drugs?' },
    { id: 'mentallyIllHouseholdMember', text: 'Did you live with a household member who was depressed, mentally ill, or suicidal?' },
    { id: 'imprisonedHouseholdMember', text: 'Did you live with a household member who was ever sent to jail or prison?' },
    { id: 'parentsSeparated', text: 'Were your parents ever separated or divorced?' },
    { id: 'parentDied', text: 'Did your parent/guardian die?' },
    { id: 'witnessedVerbalAbuse', text: 'Did you see or hear a parent or household member in your home being yelled at, screamed at, sworn at, insulted, or humiliated?' },
    { id: 'witnessedPhysicalAbuse', text: 'Did you see or hear a parent or household member in your home being slapped, kicked, punched, or beaten up?' },
    { id: 'witnessedWeaponAbuse', text: 'Did you see or hear a parent or household member in your home being hit or cut with an object, such as a stick (or cane), bottle, club, knife, whip, etc.?' },
    { id: 'verbalAbuse', text: 'Did a parent, guardian, or other household member yell, scream, or swear at you, insult or humiliate you?' },
    { id: 'threatenedAbandonment', text: 'Did a parent, guardian, or other household member threaten to, or actually, abandon you or throw you out of the house?' },
    { id: 'physicalAbuse', text: 'Did a parent, guardian, or other household member spank, slap, kick, punch, or beat you up?' },
    { id: 'weaponAbuse', text: 'Did a parent, guardian, or other household member hit or cut you with an object, such as a stick (or cane), bottle, club, knife, whip, etc.?' },
    { id: 'sexualTouching', text: 'Did someone touch or fondle you in a sexual way when you did not want them to?' },
    { id: 'sexualFondling', text: 'Did someone make you touch their body in a sexual way when you did not want them to?' },
    { id: 'attemptedSexualIntercourse', text: 'Did someone attempt oral, anal, or vaginal intercourse with you when you did not want them to?' },
    { id: 'completedSexualIntercourse', text: 'Did someone actually have oral, anal, or vaginal intercourse with you when you did not want them to?' },
    { id: 'bullied', text: 'Were you bullied?' },
    { id: 'bullyingTypes', text: 'How were you bullied? (Select all that apply)' },
    { id: 'physicalFight', text: 'Were you in a physical fight?' },
    // Community Violence questions (Section 6)
    { id: 'witnessedBeating', text: 'Did you see or hear someone being beaten up in real life?' },
    { id: 'witnessedStabbingOrShooting', text: 'Did you see or hear someone being stabbed or shot in real life?' },
    { id: 'witnessedThreatenedWithWeapon', text: 'Did you see or hear someone being threatened with a knife or gun in real life?' }
  ];

  // Calculate total score based on all responses
  const calculateTotalScore = (data) => {
    let totalScore = 0;
    
    // Calculate scores for yes/no questions
    yesNoQuestions.forEach(questionId => {
      if (data[questionId] && data[questionId] !== "Refused") {
        totalScore += scoringValues.yesNo[data[questionId]] || 0;
      }
    });
    
    // Calculate scores for frequency4 questions
    frequencyType4Questions.forEach(questionId => {
      if (data[questionId] && data[questionId] !== "Refused") {
        totalScore += scoringValues.frequency4[data[questionId]] || 0;
      }
    });
    
    // Calculate scores for frequency5 questions
    frequencyType5Questions.forEach(questionId => {
      if (data[questionId] && data[questionId] !== "Refused") {
        // Use the scores directly from the scoring values
        totalScore += scoringValues.frequency5[data[questionId]] || 0;
      }
    });
    
    // Calculate scores for bullying types
    if (data.bullyingTypes && data.bullyingTypes !== '') {
      const bullyingTypesArray = data.bullyingTypes.split(',');
      let bullyingTypeScore = 0;
      
      console.log("DEBUG calculateTotalScore - bullyingTypes raw value:", data.bullyingTypes);
      console.log("DEBUG calculateTotalScore - bullyingTypesArray:", bullyingTypesArray);
      
      // Special handling for "Never bullied" and "Refused"
      if (bullyingTypesArray.includes("Refused")) {
        bullyingTypeScore = -9;
        console.log("DEBUG calculateTotalScore - 'Refused' selected, score set to -9");
      } else if (bullyingTypesArray.includes("Never bullied")) {
        bullyingTypeScore = 0;
        console.log("DEBUG calculateTotalScore - 'Never bullied' selected, score set to 0");
      } else {
        // Count the number of selected bullying types
        bullyingTypeScore = bullyingTypesArray.length;
        console.log(`DEBUG calculateTotalScore - ${bullyingTypesArray.length} bullying types selected, score = ${bullyingTypeScore}`);
      }
      
      console.log("DEBUG calculateTotalScore - Final bullyingTypeScore:", bullyingTypeScore);
      
      if (bullyingTypeScore > 0 || bullyingTypeScore === -9) {
        totalScore += bullyingTypeScore;
        console.log(`DEBUG calculateTotalScore - Added ${bullyingTypeScore} to total score, new total: ${totalScore}`);
      }
    }
    
    return totalScore;
  };

  // Function to count the number of "Yes" responses (for backward compatibility)
  const countYesResponses = (data) => {
    return calculateTotalScore(data);
  };
  
  // Render the form
  return (
    <div className="task-screen">
      {!formSubmitted ? (
        <div className="questionnaire-container">
          <h1 className="questionnaire-title">Adverse Childhood Experiences International Questionnaire (ACE-IQ)</h1>
          
          {/* Debug info - will only show in browser console */}
          <div style={{display: 'none'}}>
            {console.log('Current section:', currentSection)}
            {console.log('Number of sections:', sections.length)}
            {console.log('Sections array:', sections.map((_, i) => getSectionName(i)))}
          </div>
          
          {/* Add section progress indicator */}
          <div className="section-progress">
            <div className="section-progress-text">
              Section {currentSection + 1} of {sections.length} - {getSectionName(currentSection)}
            </div>
            
            <div className="section-progress-bar">
              <div 
                className="section-progress-fill" 
                style={{ 
                  width: `${((currentSection + 1) / sections.length) * 100}%`,
                  backgroundColor: getProgressBarColor(currentSection)
                }}
              ></div>
            </div>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            console.log("Form submit intercepted");
            
            // If on the Test Section, call handleSubmit to process submission
            if (getSectionName(currentSection) === "Test Section") {
              console.log("On Test Section, proceeding with submission");
              handleSubmit(e);
              return;
            }
            
            // For any other section, just navigate to the next section
            console.log("Not on Test Section, navigating to next section");
            nextSection();
          }}>
            <div className="section-container" style={{ background: getSectionBackground(currentSection) }}>
              {sections[currentSection]}
            </div>
            
            <div className="form-buttons">
              {currentSection > 0 && (
                <button 
                  type="button" 
                  className="form-button back" 
                  onClick={prevSection}
                >
                  Previous
                </button>
              )}
              
              {/* Only show Submit button on the absolute last section (Test Section) */}
              {getSectionName(currentSection) !== "Test Section" ? (
                <button 
                  type="button" 
                  className="form-button next" 
                  onClick={nextSection}
                  data-next-section={currentSection + 1}
                >
                  Next {currentSection === sections.length - 2 ? "(Test Section)" : `(${sections.length - currentSection - 1} more sections)`}
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="form-button submit"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="questionnaire-container">
          <h1 className="questionnaire-title">Thank You</h1>
          <p>Your responses have been recorded.</p>
          
          <div className="score-summary">
            <h2>Questionnaire Score Summary</h2>
            <p className="total-score">Total Score: <span>{totalScore}</span></p>
            <p className="score-explanation">
              Higher scores indicate more adverse childhood experiences.
            </p>
            <p className="note" style={{ color: '#3498db', marginTop: '10px', fontStyle: 'italic' }}>
              A combined CSV file with all questionnaire results will be available for download 
              after completing all questionnaires.
            </p>
          </div>
          
          <div className="form-actions">
            <button
              className="form-button export"
              onClick={exportJSON}
            >
              Export Results as JSON
            </button>
            
            <button
              className="form-button export"
              onClick={exportToCSV}
              disabled={exportingCSV}
            >
              {exportingCSV ? "Exporting..." : "Export Results as CSV"}
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

export default ACEIQQuestionnaire; 

// Helper function to get section name from index
const getSectionName = (index) => {
  const sectionNames = [
    "Demographics",
    "Parents/Guardians", 
    "Neglect",
    "Family Environment",
    "Direct Abuse",
    "Peer Violence",
    "Community Violence",
    "Test Section"
  ];
  
  return sectionNames[index] || "";
};

// Helper function for section styling
const getSectionBackground = (sectionIndex) => {
  const backgrounds = [
    'linear-gradient(to bottom, #e8f4f8, #ffffff)', // Demographics 
    'linear-gradient(to bottom, #f0f8e8, #ffffff)', // Parents
    'linear-gradient(to bottom, #fff8e8, #ffffff)', // Neglect
    'linear-gradient(to bottom, #f8e8f4, #ffffff)', // Family 
    'linear-gradient(to bottom, #f8e8e8, #ffffff)', // Abuse
    'linear-gradient(to bottom, #e8e8f8, #ffffff)', // Peer
    'linear-gradient(to bottom, #f0e8f8, #ffffff)', // Community
    'linear-gradient(to bottom, #e8f8ff, #ffffff)'  // Test
  ];
  
  return backgrounds[sectionIndex] || backgrounds[0];
};

// Helper function for progress bar color
const getProgressBarColor = (sectionIndex) => {
  const colors = [
    '#3498db', // Demographics - Blue
    '#2ecc71', // Parents - Green
    '#f1c40f', // Neglect - Yellow
    '#9b59b6', // Family - Purple
    '#e74c3c', // Abuse - Red
    '#34495e', // Peer - Dark Blue
    '#1abc9c', // Community - Turquoise
    '#95a5a6'  // Test - Gray
  ];
  
  return colors[sectionIndex] || colors[0];
}; 