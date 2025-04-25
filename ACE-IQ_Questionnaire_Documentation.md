# Adverse Childhood Experiences International Questionnaire (ACE-IQ) Documentation

## Overview

The Adverse Childhood Experiences International Questionnaire (ACE-IQ) is a standardized assessment tool designed to measure various types of childhood adversity across multiple domains. This implementation is a digital version of the questionnaire, allowing for efficient data collection, automatic scoring, and data export.

## Questionnaire Structure

The ACE-IQ is organized into seven main sections:

### 1. Demographic Information
- Sex (Male/Female)
- Date of birth
- Age (auto-calculated)
- Ethnic/racial group or cultural background

### 2. Relationship with Parents/Guardians
Questions about parental understanding and knowledge during the first 18 years of life.
- 1.1: Did your parents/guardians understand your problems and worries?
- 1.2: Did your parents/guardians really know what you were doing with your free time when you were not at school or work?

### 3. Neglect
Questions about basic needs not being met during childhood.
- 2.1: How often did your parents/guardians not give you enough food even when they could easily have done so?
- 2.2: Were your parents/guardians too drunk or intoxicated by drugs to take care of you?
- 2.3: How often did your parents/guardians not send you to school even when it was available?

### 4. Family Environment
Questions about household dysfunction and witnessing abuse.
- 3.1: Did you live with a household member who was a problem drinker or alcoholic, or misused street or prescription drugs?
- 3.2: Did you live with a household member who was depressed, mentally ill or suicidal?
- 3.3: Did you live with a household member who was ever sent to jail or prison?
- 3.4: Were your parents ever separated or divorced?
- 3.5: Did your mother, father or guardian die?
- 3.6: Did you see or hear a parent or household member in your home being yelled at, screamed at, sworn at, insulted or humiliated?
- 3.7: Did you see or hear a parent or household member in your home being slapped, kicked, punched or beaten up?
- 3.8: Did you see or hear a parent or household member in your home being hit or cut with an object, such as a stick (or cane), bottle, club, knife, whip etc.?

### 5. Direct Abuse
Questions about personal experiences of abuse.
- 4.1: Did a parent, guardian or other household member yell, scream or swear at you, insult or humiliate you?
- 4.2: Did a parent, guardian or other household member threaten to, or actually, abandon you or throw you out of the house?
- 4.3: Did a parent, guardian or other household member spank, slap, kick, punch or beat you up?
- 4.4: Did a parent, guardian or other household member hit or cut you with an object, such as a stick (or cane), bottle, club, knife, whip etc?
- 4.5: Did someone touch or fondle you in a sexual way when you did not want them to?
- 4.6: Did someone make you touch their body in a sexual way when you did not want them to?
- 4.7: Did someone attempt oral, anal, or vaginal intercourse with you when you did not want them to?
- 4.8: Did someone actually have oral, anal, or vaginal intercourse with you when you did not want them to?

### 6. Peer Violence
Questions about experiences with bullying and physical fights.
- 5.1: How often were you bullied?
- 5.2: How were you bullied most often? (categorical question, not scored)
- 5.3: How often were you in a physical fight?

### 7. Witnessing Community Violence
Questions about witnessing violence in the community.
- 6.1: Did you see or hear someone being beaten up in real life?
- 6.2: Did you see or hear someone being stabbed or shot?
- 6.3: Did you see or hear someone being threatened with a knife or gun in real life?

## Response Options and Scoring System

The ACE-IQ uses three different response scales depending on the question type:

### 1. Binary Yes/No Questions (Questions 3.1-3.5)
- **Response Options**: Yes, No, Refused
- **Scoring**: Yes = 2, No = 1, Refused = -9
- **Score Type**: Binary (1-2)

### 2. Frequency Type 4 Questions (Most event-based questions)
- **Response Options**: Many times, A few times, Once, Never, Refused
- **Scoring**: Never = 1, Once = 2, A few times = 3, Many times = 4, Refused = 0
- **Score Type**: Frequency (1-4)
- **Applicable Questions**: All neglect, witnessed abuse, direct abuse, bullying, physical fights, and community violence questions

### 3. Frequency Type 5 Questions (Protective factor questions 1.1-1.2)
- **Response Options**: Always, Most of the time, Sometimes, Rarely, Never, Refused
- **Scoring**: Always = 1, Most of the time = 2, Sometimes = 3, Rarely = 4, Never = 5, Refused = -9
- **Score Type**: Protection (1-5)

### Non-Scored Items
- Demographic information (Section 0)
- Bullying type question (5.2)

## Total Score Calculation

The total ACE-IQ score is calculated as the sum of all scored items, with higher scores indicating more adverse childhood experiences. The score calculation follows these steps:

1. For each Yes/No question, add the appropriate score value (1-2)
2. For each Frequency Type 4 question, add the appropriate score value (1-4)
3. For each Frequency Type 5 question, add the appropriate score value (1-5)
4. Items with "Refused" responses are excluded from the score calculation

## Data Export

The questionnaire provides two export formats:

### CSV Export
The CSV export includes the following columns:
- StudentID: The participant's ID
- Timestamp: When the questionnaire was completed
- Section: Which section the question belongs to
- QuestionID: The internal identifier for the question
- QuestionText: The full text of the question
- Score: The numerical score for the response
- ScoreType: The type of scoring used (Binary, Frequency, or Protection)
- Response: The actual response given by the participant

### JSON Export
The JSON export includes:
- studentId: The participant's ID
- timestamp: When the questionnaire was completed
- formData: All raw responses to all questions
- scores: The calculated scores for each question
- totalScore: The total ACE-IQ score

## Implementation Notes

### React Component Structure
The questionnaire is implemented as a React component with the following key features:
- State management using React hooks
- Multi-section navigation with Previous/Next buttons
- Automatic age calculation based on birth date
- Real-time score calculation
- Form validation
- Export functionality

### Question Categorization
Questions are categorized into three scoring types:
```javascript
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
```

### Scoring Values
The scoring values are defined as follows:
```javascript
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
    "Never": 1,
    "Once": 2,
    "A few times": 3,
    "Many times": 4,
    "Refused": 0
  },
  yesNo: {
    "Yes": 2,
    "No": 1,
    "Refused": -9
  }
};
```

## References and Resources

For more information on the ACE-IQ, refer to the following resources:
- World Health Organization (WHO) ACE-IQ guidelines
- Research studies validating the ACE-IQ in various populations
- Clinical implications of ACE scores 