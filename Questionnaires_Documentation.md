# Questionnaires Documentation

This documentation covers all questionnaires implemented in the system, including their purpose, structure, scoring systems, and implementation details.

## Table of Contents

1. [Adverse Childhood Experiences International Questionnaire (ACE-IQ)](#adverse-childhood-experiences-international-questionnaire-ace-iq)
2. [Strengths and Difficulties Questionnaire (SDQ)](#strengths-and-difficulties-questionnaire-sdq)
3. [Mood and Feelings Questionnaire (MFQ)](#mood-and-feelings-questionnaire-mfq)
4. [Socioeconomic Status Questionnaire (SES)](#socioeconomic-status-questionnaire-ses)
5. [Combined Questionnaire Implementation](#combined-questionnaire-implementation)

---

## Adverse Childhood Experiences International Questionnaire (ACE-IQ)

### Overview

The Adverse Childhood Experiences International Questionnaire (ACE-IQ) is a standardized assessment tool designed to measure various types of childhood adversity across multiple domains. This implementation is a digital version of the questionnaire, allowing for efficient data collection, automatic scoring, and data export.

### Questionnaire Structure

The ACE-IQ is organized into seven main sections:

#### 1. Demographic Information
- Sex (Male/Female)
- Date of birth
- Age (auto-calculated)
- Ethnic/racial group or cultural background

#### 2. Relationship with Parents/Guardians
Questions about parental understanding and knowledge during the first 18 years of life.
- 1.1: Did your parents/guardians understand your problems and worries?
- 1.2: Did your parents/guardians really know what you were doing with your free time when you were not at school or work?

#### 3. Neglect
Questions about basic needs not being met during childhood.
- 2.1: How often did your parents/guardians not give you enough food even when they could easily have done so?
- 2.2: Were your parents/guardians too drunk or intoxicated by drugs to take care of you?
- 2.3: How often did your parents/guardians not send you to school even when it was available?

#### 4. Family Environment
Questions about household dysfunction and witnessing abuse.
- 3.1: Did you live with a household member who was a problem drinker or alcoholic, or misused street or prescription drugs?
- 3.2: Did you live with a household member who was depressed, mentally ill or suicidal?
- 3.3: Did you live with a household member who was ever sent to jail or prison?
- 3.4: Were your parents ever separated or divorced?
- 3.5: Did your mother, father or guardian die?
- 3.6: Did you see or hear a parent or household member in your home being yelled at, screamed at, sworn at, insulted or humiliated?
- 3.7: Did you see or hear a parent or household member in your home being slapped, kicked, punched or beaten up?
- 3.8: Did you see or hear a parent or household member in your home being hit or cut with an object, such as a stick (or cane), bottle, club, knife, whip etc.?

#### 5. Direct Abuse
Questions about personal experiences of abuse.
- 4.1: Did a parent, guardian or other household member yell, scream or swear at you, insult or humiliate you?
- 4.2: Did a parent, guardian or other household member threaten to, or actually, abandon you or throw you out of the house?
- 4.3: Did a parent, guardian or other household member spank, slap, kick, punch or beat you up?
- 4.4: Did a parent, guardian or other household member hit or cut you with an object, such as a stick (or cane), bottle, club, knife, whip etc?
- 4.5: Did someone touch or fondle you in a sexual way when you did not want them to?
- 4.6: Did someone make you touch their body in a sexual way when you did not want them to?
- 4.7: Did someone attempt oral, anal, or vaginal intercourse with you when you did not want them to?
- 4.8: Did someone actually have oral, anal, or vaginal intercourse with you when you did not want them to?

#### 6. Peer Violence
Questions about experiences with bullying and physical fights.
- 5.1: How often were you bullied?
- 5.2: How were you bullied most often? (categorical question, not scored)
- 5.3: How often were you in a physical fight?

#### 7. Witnessing Community Violence
Questions about witnessing violence in the community.
- 6.1: Did you see or hear someone being beaten up in real life?
- 6.2: Did you see or hear someone being stabbed or shot?
- 6.3: Did you see or hear someone being threatened with a knife or gun in real life?

### Response Options and Scoring System

The ACE-IQ uses three different response scales depending on the question type:

#### 1. Binary Yes/No Questions (Questions 3.1-3.5)
- **Response Options**: Yes, No, Refused
- **Scoring**: Yes = 2, No = 1, Refused = -9
- **Score Type**: Binary (1-2)

#### 2. Frequency Type 4 Questions (Most event-based questions)
- **Response Options**: Many times, A few times, Once, Never, Refused
- **Scoring**: Never = 1, Once = 2, A few times = 3, Many times = 4, Refused = 0
- **Score Type**: Frequency (1-4)
- **Applicable Questions**: All neglect, witnessed abuse, direct abuse, bullying, physical fights, and community violence questions

#### 3. Frequency Type 5 Questions (Protective factor questions 1.1-1.2)
- **Response Options**: Always, Most of the time, Sometimes, Rarely, Never, Refused
- **Scoring**: Always = 1, Most of the time = 2, Sometimes = 3, Rarely = 4, Never = 5, Refused = -9
- **Score Type**: Protection (1-5)

#### Non-Scored Items
- Demographic information (Section 0)
- Bullying type question (5.2)

### Total Score Calculation

The total ACE-IQ score is calculated as the sum of all scored items, with higher scores indicating more adverse childhood experiences. The score calculation follows these steps:

1. For each Yes/No question, add the appropriate score value (1-2)
2. For each Frequency Type 4 question, add the appropriate score value (1-4)
3. For each Frequency Type 5 question, add the appropriate score value (1-5)
4. Items with "Refused" responses are excluded from the score calculation

---

## Strengths and Difficulties Questionnaire (SDQ)

### Overview

The Strengths and Difficulties Questionnaire (SDQ) is a brief behavioral screening questionnaire for children and adolescents. It assesses emotional symptoms, conduct problems, hyperactivity/inattention, peer relationship problems, and prosocial behavior.

### Questionnaire Structure

The SDQ consists of 25 items divided into 5 scales:

#### 1. Emotional Symptoms Scale (5 items)
- Often complains of headaches/stomach aches/sickness
- Many worries or often seems worried
- Often unhappy, depressed or tearful
- Nervous or clingy in new situations, easily loses confidence
- Many fears, easily scared

#### 2. Conduct Problems Scale (5 items)
- Often has temper tantrums or hot tempers
- Generally well behaved, usually does what adults request (reverse scored)
- Often fights with other children or bullies them
- Often lies or cheats
- Steals from home, school or elsewhere

#### 3. Hyperactivity/Inattention Scale (5 items)
- Restless, overactive, cannot stay still for long
- Constantly fidgeting or squirming
- Easily distracted, concentration wanders
- Thinks things out before acting (reverse scored)
- Good attention span, sees tasks through to the end (reverse scored)

#### 4. Peer Problems Scale (5 items)
- Rather solitary, prefers to play alone
- Has at least one good friend (reverse scored)
- Generally liked by other children (reverse scored)
- Picked on or bullied by other children
- Gets along better with adults than with other children

#### 5. Prosocial Behavior Scale (5 items)
- Considerate of other people's feelings
- Shares readily with other children
- Helpful if someone is hurt, upset or feeling ill
- Kind to younger children
- Often volunteers to help others

### Response Options and Scoring System

All SDQ items use the same 3-point Likert scale:

- **Response Options**: Not True (0), Somewhat True (1), Certainly True (2)
- **Reverse Scoring**: For negatively worded items, the scoring is reversed: Not True (2), Somewhat True (1), Certainly True (0)
- **Reversed Items**: 
  - Conduct: "Generally well behaved"
  - Hyperactivity: "Thinks things out", "Good attention span"
  - Peer: "Has at least one good friend", "Generally liked by other children"

### Subscales and Total Scores

1. **Individual Scale Scores**: Sum of the 5 items in each scale (range: 0-10)
2. **Total Difficulties Score**: Sum of all scales except the Prosocial scale (range: 0-40)
3. **Externalizing Score**: Sum of Conduct and Hyperactivity scales
4. **Internalizing Score**: Sum of Emotional and Peer Problems scales

### Clinical Cutoffs

The following cutoff scores are used to determine the clinical significance of the scores:

| Scale | Normal | Borderline | Abnormal |
|-------|--------|------------|----------|
| Emotional | 0-3 | 4 | 5-10 |
| Conduct | 0-2 | 3 | 4-10 |
| Hyperactivity | 0-5 | 6 | 7-10 |
| Peer Problems | 0-2 | 3 | 4-10 |
| Prosocial | 6-10 | 5 | 0-4 |
| Total Difficulties | 0-13 | 14-16 | 17-40 |

---

## Mood and Feelings Questionnaire (MFQ)

### Overview

The Mood and Feelings Questionnaire (MFQ) - Short Version is a 13-item self-report measure designed to detect depression in children and adolescents. It assesses the presence of depressive symptoms over the past two weeks.

### Questionnaire Structure

The MFQ-Short consists of 13 statements related to depressive symptoms:

1. I felt miserable or unhappy
2. I didn't enjoy anything at all
3. I felt so tired I just sat around and did nothing
4. I was very restless
5. I felt I was no good anymore
6. I cried a lot
7. I found it hard to think properly or concentrate
8. I hated myself
9. I was a bad person
10. I felt lonely
11. I thought nobody really loved me
12. I thought I could never be as good as other kids
13. I did everything wrong

### Response Options and Scoring System

The MFQ uses a 3-point scale for all items:

- **Response Options**: 
  - Not True (0) - This was not true about you
  - Sometimes (1) - This was sometimes true about you
  - True (2) - This was true about you most of the time

- **Scoring**: All items are scored in the same direction, with higher scores indicating more severe depressive symptoms
  - Not True = 0
  - Sometimes = 1
  - True = 2

### Total Score and Interpretation

- **Total Score Calculation**: Sum of all 13 items (range: 0-26)
- **Clinical Interpretation**:
  - 0-5: Likely no depression
  - 6-12: Mild to moderate depression
  - 13+: Possible clinical depression (flag for review)

- **Clinical Cutoff**: A score ≥ 12 is considered the clinical cutoff for possible depression

---

## Socioeconomic Status Questionnaire (SES)

### Overview

The Socioeconomic Status (SES) Questionnaire assesses childhood socioeconomic status through questions about financial resources and subjective perceptions of wealth during development.

### Questionnaire Structure

The SES questionnaire consists of 7 items related to childhood experiences:

1. When growing up, your family had enough money to afford the kind of home you all needed
2. When growing up, your family had enough money to afford the kind of clothing you all needed
3. When growing up, your family had enough money to afford the kind of food that you all needed
4. When growing up, your family had enough money to afford the kind of medical care that you all needed
5. When growing up, I felt well-off (rich, wealthy) compared to other kids in my school
6. When growing up, I felt well-off (rich, wealthy) compared to other kids in my neighborhood
7. When growing up, your family struggled to make ends meet (get by financially) [reverse scored]

### Response Options and Scoring System

The SES questionnaire uses a 5-point Likert scale:

- **Response Options**:
  - Never True (1)
  - Rarely True (2)
  - Sometimes True (3)
  - Often True (4)
  - Very Often True (5)

- **Standard Scoring**: For items 1-6, the score directly corresponds to the response value (1-5)
- **Reverse Scoring**: For item 7 ("struggled financially"), the scoring is reversed:
  - Never True = 5
  - Rarely True = 4
  - Sometimes True = 3
  - Often True = 2
  - Very Often True = 1

### Total Score and Interpretation

- **Total Score Calculation**: Sum of all 7 items after applying reverse scoring (range: 7-35)
- **Interpretation**: Higher scores indicate higher socioeconomic status during childhood
  - No specific clinical cutoffs are defined
  - Scores can be compared relatively within the sample

---

## Combined Questionnaire Implementation

### Overview

The Combined Questionnaire is a workflow that administers all four questionnaires (ACE-IQ, SES, MFQ, and SDQ) in sequence, allowing participants to complete them all in one session. This approach ensures comprehensive data collection and enables integrated analysis.

### Implementation Features

1. **Sequential Administration**: Questionnaires are presented in a fixed order: ACE-IQ → SES → MFQ → SDQ
2. **Progress Tracking**: The system tracks completion status for each questionnaire
3. **Results Summary**: After completing each questionnaire, a summary of scores is displayed
4. **Integrated CSV Export**: Upon completion of all questionnaires, results can be exported as a single comprehensive CSV file

### CSV Export Format

The combined CSV export includes:

1. **Header Information**:
   - Student ID
   - Export timestamp
   - Section headers for each questionnaire

2. **For Each Questionnaire**:
   - Question ID
   - Score
   - Score Type (e.g., Standard, Reverse, Binary)
   - Total scores
   - Clinical interpretations (where applicable)

3. **SDQ Detailed Results**:
   - Subscale scores
   - Clinical categories
   - Composite scores (Externalizing, Internalizing)

### Usage Context

The Combined Questionnaire is designed for research and clinical contexts where comprehensive assessment of childhood experiences, socioeconomic status, mood, and behavioral strengths/difficulties is needed. The sequential format reduces participant burden while ensuring complete data collection. 