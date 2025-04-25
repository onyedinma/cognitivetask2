import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ACEIQ.css';
import { 
  NeglectSection, 
  FamilyEnvironmentSection,
  DirectAbuseSection,
  PeerViolenceSection,
  CommunityViolenceSection
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
  
  // Scoring definitions
  const scoringValues = {
    frequency5: {
      "Always": 0,
      "Most of the time": 0,
      "Sometimes": 1,
      "Rarely": 1,
      "Never": 1,
      "Refused": -9
    },
    frequency4: {
      "Many times": 3,
      "A few times": 2,
      "Once": 1,
      "Never": 0,
      "Refused": -9
    },
    yesNo: {
      "Yes": 1,
      "No": 0,
      "Refused": -9
    }
  };
  
  // Group questions by scoring type
  const frequencyType5Questions = [
    'parentsUnderstandProblems',
    'parentsKnowFreeTime'
  ];
  
  const frequencyType4Questions = [
    'notEnoughFood',
    'parentsDrunkOrDrugs',
    'notSentToSchool',
    'witnessedVerbalAbuse',
    'witnessedPhysicalAbuse',
    'witnessedWeaponAbuse',
    'verbalAbuse',
    'threatenedAbandonment',
    'physicalAbuse',
    'weaponAbuse',
    'sexualTouching',
    'sexualFondling',
    'attemptedSexualIntercourse',
    'completedSexualIntercourse',
    'bullied',
    'physicalFight',
    'witnessedBeating',
    'witnessedStabbingOrShooting',
    'witnessedThreatenedWithWeapon'
  ];
  
  const yesNoQuestions = [
    'alcoholicHouseholdMember',
    'mentallyIllHouseholdMember',
    'imprisonedHouseholdMember',
    'parentsSeparated',
    'parentDied'
  ];
  
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
    bullyingType: '',
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
    setCurrentSection(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const prevSection = () => {
    setCurrentSection(prev => prev - 1);
    window.scrollTo(0, 0);
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
    
    // Calculate total score based on all responses
    const totalScore = calculateTotalScore(formData);
    
    // Prepare structured questions array for combined export - only scores, not responses
    const questionsArray = questions.map(question => {
      const response = formData[question.id];
      let score = 0;
      
      // Check if this is a yes/no question
      if (yesNoQuestions.includes(question.id)) {
        score = response ? scoringValues.yesNo[response] || 0 : 0;
      } 
      // Check if this is a frequency4 question
      else if (frequencyType4Questions.includes(question.id)) {
        score = response ? scoringValues.frequency4[response] || 0 : 0;
      }
      // Handle frequency5 questions (with reverse scoring)
      else if (frequencyType5Questions.includes(question.id)) {
        // These questions are about positive experiences, so they need to be reverse scored
        // "Always" should be the lowest score (1) and "Never" should be the highest (5)
        if (response) {
          // Reverse the score: 6 minus the normal score
          // (converts 5→1, 4→2, 3→3, 2→4, 1→5, with "Refused" handled separately)
          score = response === "Refused" ? 0 : (6 - (scoringValues.frequency5[response] || 0));
        }
      }
      
      // Determine the score type
      let scoreType = yesNoQuestions.includes(question.id) ? 'Binary' : 
                      frequencyType4Questions.includes(question.id) ? '0-3 scale' : 
                      frequencyType5Questions.includes(question.id) ? 'Reverse scored (Protective factor)' : '';
                      
      return {
        id: question.id,
        score: score,
        type: scoreType
      };
    });
    
    // Save form data
    const studentId = localStorage.getItem('studentId') || 'unknown';
    const timestamp = new Date().toISOString();
    const results = {
      studentId,
      timestamp,
      totalScore,
      questions: questionsArray
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
    if (onComplete) {
      onComplete(null);
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
      
      // Create CSV header row - include score only, not responses
      let csvContent = 'StudentID,Timestamp,QuestionID,Score,Score Type\n';
      
      // Map question IDs to their types for the CSV
      const questionTypes = {};
      frequencyType5Questions.forEach(id => questionTypes[id] = 'Reverse scored (Protective factor)');
      frequencyType4Questions.forEach(id => questionTypes[id] = '0-3 scale');
      yesNoQuestions.forEach(id => questionTypes[id] = 'Binary');
      
      // Add row for each question with score only, not response
      questions.forEach(question => {
        const response = formData[question.id];
        let score = 0;
        
        // Check if this is a yes/no question
        if (yesNoQuestions.includes(question.id)) {
          score = response ? scoringValues.yesNo[response] || 0 : 0;
        } 
        // Check if this is a frequency4 question
        else if (frequencyType4Questions.includes(question.id)) {
          score = response ? scoringValues.frequency4[response] || 0 : 0;
        }
        // Handle frequency5 questions (protective factors)
        else if (frequencyType5Questions.includes(question.id)) {
          score = response ? scoringValues.frequency5[response] || 0 : 0;
        }
        
        csvContent += [
          studentId,
          timestamp,
          question.id,
          score,
          `"${questionTypes[question.id] || ''}"`
        ].join(',') + '\n';
      });
      
      // Add total score row
      csvContent += [
        studentId,
        timestamp,
        'TOTAL',
        calculateTotalScore(formData),
        '"Sum of all items"'
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
    <section key="demographics" className="questionnaire-section">
      <h2 className="questionnaire-section-title">DEMOGRAPHIC INFORMATION</h2>
      
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
    <section key="parents" className="questionnaire-section">
      <h2 className="questionnaire-section-title">RELATIONSHIP WITH PARENTS/GUARDIANS</h2>
      <div className="question-description">
        When you were growing up, during the first 18 years of your life...
      </div>
      
      <div className="question-item">
        <div className="question-text">
          <span className="question-number">1.1</span>
          Did your parents/guardians understand your problems and worries?
        </div>
        <div className="radio-options">
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
        <div className="radio-options">
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
    
    // Sections imported from ACEIQSections.js
    <NeglectSection key="neglect" formData={formData} handleChange={handleChange} />,
    <FamilyEnvironmentSection key="family" formData={formData} handleChange={handleChange} />,
    <DirectAbuseSection key="direct-abuse" formData={formData} handleChange={handleChange} />,
    <PeerViolenceSection key="peer-violence" formData={formData} handleChange={handleChange} />,
    <CommunityViolenceSection key="community-violence" formData={formData} handleChange={handleChange} />
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
    { id: 'physicalFight', text: 'Were you in a physical fight?' },
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
    
    // Calculate scores for frequency5 questions (protective factors)
    frequencyType5Questions.forEach(questionId => {
      if (data[questionId] && data[questionId] !== "Refused") {
        totalScore += scoringValues.frequency5[data[questionId]] || 0;
      }
    });
    
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
          
          <form onSubmit={handleSubmit}>
            {sections[currentSection]}
            
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
              
              {currentSection < sections.length - 1 ? (
                <button 
                  type="button" 
                  className="form-button next" 
                  onClick={nextSection}
                >
                  Next
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