import React from 'react';

// Section 2: Neglect
export const NeglectSection = ({ formData, handleChange }) => (
  <>
    <div className="question-description">
      When you were growing up, during the first 18 years of your life...
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">2.1</span>
        How often did your parents/guardians not give you enough food even when they could easily have done so?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="notEnoughFood-manyTimes" 
            name="notEnoughFood" 
            value="Many times" 
            checked={formData.notEnoughFood === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="notEnoughFood-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notEnoughFood-fewTimes" 
            name="notEnoughFood" 
            value="A few times" 
            checked={formData.notEnoughFood === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="notEnoughFood-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notEnoughFood-once" 
            name="notEnoughFood" 
            value="Once" 
            checked={formData.notEnoughFood === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="notEnoughFood-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notEnoughFood-never" 
            name="notEnoughFood" 
            value="Never" 
            checked={formData.notEnoughFood === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="notEnoughFood-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notEnoughFood-refused" 
            name="notEnoughFood" 
            value="Refused" 
            checked={formData.notEnoughFood === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="notEnoughFood-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">2.2</span>
        Were your parents/guardians too drunk or intoxicated by drugs to take care of you?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsDrunk-manyTimes" 
            name="parentsDrunkOrDrugs" 
            value="Many times" 
            checked={formData.parentsDrunkOrDrugs === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="parentsDrunk-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsDrunk-fewTimes" 
            name="parentsDrunkOrDrugs" 
            value="A few times" 
            checked={formData.parentsDrunkOrDrugs === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="parentsDrunk-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsDrunk-once" 
            name="parentsDrunkOrDrugs" 
            value="Once" 
            checked={formData.parentsDrunkOrDrugs === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="parentsDrunk-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsDrunk-never" 
            name="parentsDrunkOrDrugs" 
            value="Never" 
            checked={formData.parentsDrunkOrDrugs === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="parentsDrunk-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsDrunk-refused" 
            name="parentsDrunkOrDrugs" 
            value="Refused" 
            checked={formData.parentsDrunkOrDrugs === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="parentsDrunk-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">2.3</span>
        How often did your parents/guardians not send you to school even when it was available?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="notSentToSchool-manyTimes" 
            name="notSentToSchool" 
            value="Many times" 
            checked={formData.notSentToSchool === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="notSentToSchool-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notSentToSchool-fewTimes" 
            name="notSentToSchool" 
            value="A few times" 
            checked={formData.notSentToSchool === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="notSentToSchool-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notSentToSchool-once" 
            name="notSentToSchool" 
            value="Once" 
            checked={formData.notSentToSchool === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="notSentToSchool-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notSentToSchool-never" 
            name="notSentToSchool" 
            value="Never" 
            checked={formData.notSentToSchool === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="notSentToSchool-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="notSentToSchool-refused" 
            name="notSentToSchool" 
            value="Refused" 
            checked={formData.notSentToSchool === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="notSentToSchool-refused">Refused</label>
        </div>
      </div>
    </div>
  </>
);

// Section 3: Family Environment
export const FamilyEnvironmentSection = ({ formData, handleChange }) => (
  <>
    <div className="question-description">
      When you were growing up, during the first 18 years of your life...
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.1</span>
        Did you live with a household member who was a problem drinker or alcoholic, or misused street or prescription drugs?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="alcoholicMember-yes" 
            name="alcoholicHouseholdMember" 
            value="Yes" 
            checked={formData.alcoholicHouseholdMember === "Yes"}
            onChange={handleChange}
          />
          <label htmlFor="alcoholicMember-yes">Yes</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="alcoholicMember-no" 
            name="alcoholicHouseholdMember" 
            value="No" 
            checked={formData.alcoholicHouseholdMember === "No"}
            onChange={handleChange}
          />
          <label htmlFor="alcoholicMember-no">No</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="alcoholicMember-refused" 
            name="alcoholicHouseholdMember" 
            value="Refused" 
            checked={formData.alcoholicHouseholdMember === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="alcoholicMember-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.2</span>
        Did you live with a household member who was depressed, mentally ill or suicidal?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="mentallyIllMember-yes" 
            name="mentallyIllHouseholdMember" 
            value="Yes" 
            checked={formData.mentallyIllHouseholdMember === "Yes"}
            onChange={handleChange}
          />
          <label htmlFor="mentallyIllMember-yes">Yes</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="mentallyIllMember-no" 
            name="mentallyIllHouseholdMember" 
            value="No" 
            checked={formData.mentallyIllHouseholdMember === "No"}
            onChange={handleChange}
          />
          <label htmlFor="mentallyIllMember-no">No</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="mentallyIllMember-refused" 
            name="mentallyIllHouseholdMember" 
            value="Refused" 
            checked={formData.mentallyIllHouseholdMember === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="mentallyIllMember-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.3</span>
        Did you live with a household member who was ever sent to jail or prison?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="imprisonedMember-yes" 
            name="imprisonedHouseholdMember" 
            value="Yes" 
            checked={formData.imprisonedHouseholdMember === "Yes"}
            onChange={handleChange}
          />
          <label htmlFor="imprisonedMember-yes">Yes</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="imprisonedMember-no" 
            name="imprisonedHouseholdMember" 
            value="No" 
            checked={formData.imprisonedHouseholdMember === "No"}
            onChange={handleChange}
          />
          <label htmlFor="imprisonedMember-no">No</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="imprisonedMember-refused" 
            name="imprisonedHouseholdMember" 
            value="Refused" 
            checked={formData.imprisonedHouseholdMember === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="imprisonedMember-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.4</span>
        Were your parents ever separated or divorced?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsSeparated-yes" 
            name="parentsSeparated" 
            value="Yes" 
            checked={formData.parentsSeparated === "Yes"}
            onChange={handleChange}
          />
          <label htmlFor="parentsSeparated-yes">Yes</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsSeparated-no" 
            name="parentsSeparated" 
            value="No" 
            checked={formData.parentsSeparated === "No"}
            onChange={handleChange}
          />
          <label htmlFor="parentsSeparated-no">No</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentsSeparated-refused" 
            name="parentsSeparated" 
            value="Refused" 
            checked={formData.parentsSeparated === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="parentsSeparated-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.5</span>
        Did your mother, father or guardian die?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentDied-yes" 
            name="parentDied" 
            value="Yes" 
            checked={formData.parentDied === "Yes"}
            onChange={handleChange}
          />
          <label htmlFor="parentDied-yes">Yes</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentDied-no" 
            name="parentDied" 
            value="No" 
            checked={formData.parentDied === "No"}
            onChange={handleChange}
          />
          <label htmlFor="parentDied-no">No</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="parentDied-refused" 
            name="parentDied" 
            value="Refused" 
            checked={formData.parentDied === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="parentDied-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-description">
      These next questions are about certain things you may actually have heard or seen IN YOUR HOME. These are things that may have been done to another household member but not necessarily to you.
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.6</span>
        Did you see or hear a parent or household member in your home being yelled at, screamed at, sworn at, insulted or humiliated?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedVerbalAbuse-manyTimes" 
            name="witnessedVerbalAbuse" 
            value="Many times" 
            checked={formData.witnessedVerbalAbuse === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedVerbalAbuse-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedVerbalAbuse-fewTimes" 
            name="witnessedVerbalAbuse" 
            value="A few times" 
            checked={formData.witnessedVerbalAbuse === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedVerbalAbuse-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedVerbalAbuse-once" 
            name="witnessedVerbalAbuse" 
            value="Once" 
            checked={formData.witnessedVerbalAbuse === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedVerbalAbuse-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedVerbalAbuse-never" 
            name="witnessedVerbalAbuse" 
            value="Never" 
            checked={formData.witnessedVerbalAbuse === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedVerbalAbuse-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedVerbalAbuse-refused" 
            name="witnessedVerbalAbuse" 
            value="Refused" 
            checked={formData.witnessedVerbalAbuse === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedVerbalAbuse-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.7</span>
        Did you see or hear a parent or household member in your home being slapped, kicked, punched or beaten up?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedPhysicalAbuse-manyTimes" 
            name="witnessedPhysicalAbuse" 
            value="Many times" 
            checked={formData.witnessedPhysicalAbuse === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedPhysicalAbuse-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedPhysicalAbuse-fewTimes" 
            name="witnessedPhysicalAbuse" 
            value="A few times" 
            checked={formData.witnessedPhysicalAbuse === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedPhysicalAbuse-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedPhysicalAbuse-once" 
            name="witnessedPhysicalAbuse" 
            value="Once" 
            checked={formData.witnessedPhysicalAbuse === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedPhysicalAbuse-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedPhysicalAbuse-never" 
            name="witnessedPhysicalAbuse" 
            value="Never" 
            checked={formData.witnessedPhysicalAbuse === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedPhysicalAbuse-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedPhysicalAbuse-refused" 
            name="witnessedPhysicalAbuse" 
            value="Refused" 
            checked={formData.witnessedPhysicalAbuse === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedPhysicalAbuse-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">3.8</span>
        Did you see or hear a parent or household member in your home being hit or cut with an object, such as a stick (or cane), bottle, club, knife, whip etc.?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedWeaponAbuse-manyTimes" 
            name="witnessedWeaponAbuse" 
            value="Many times" 
            checked={formData.witnessedWeaponAbuse === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedWeaponAbuse-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedWeaponAbuse-fewTimes" 
            name="witnessedWeaponAbuse" 
            value="A few times" 
            checked={formData.witnessedWeaponAbuse === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedWeaponAbuse-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedWeaponAbuse-once" 
            name="witnessedWeaponAbuse" 
            value="Once" 
            checked={formData.witnessedWeaponAbuse === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedWeaponAbuse-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedWeaponAbuse-never" 
            name="witnessedWeaponAbuse" 
            value="Never" 
            checked={formData.witnessedWeaponAbuse === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedWeaponAbuse-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedWeaponAbuse-refused" 
            name="witnessedWeaponAbuse" 
            value="Refused" 
            checked={formData.witnessedWeaponAbuse === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedWeaponAbuse-refused">Refused</label>
        </div>
      </div>
    </div>
  </>
);

// Section 4: Direct Abuse
export const DirectAbuseSection = ({ formData, handleChange }) => (
  <>
    <div className="question-description">
      When you were growing up, during the first 18 years of your life...
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">4.1</span>
        Did a parent, guardian or other household member yell, scream or swear at you, insult or humiliate you?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="verbalAbuse-manyTimes" 
            name="verbalAbuse" 
            value="Many times" 
            checked={formData.verbalAbuse === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="verbalAbuse-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="verbalAbuse-fewTimes" 
            name="verbalAbuse" 
            value="A few times" 
            checked={formData.verbalAbuse === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="verbalAbuse-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="verbalAbuse-once" 
            name="verbalAbuse" 
            value="Once" 
            checked={formData.verbalAbuse === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="verbalAbuse-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="verbalAbuse-never" 
            name="verbalAbuse" 
            value="Never" 
            checked={formData.verbalAbuse === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="verbalAbuse-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="verbalAbuse-refused" 
            name="verbalAbuse" 
            value="Refused" 
            checked={formData.verbalAbuse === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="verbalAbuse-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">4.2</span>
        Did a parent, guardian or other household member threaten to, or actually, abandon you or throw you out of the house?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="threatenedAbandonment-manyTimes" 
            name="threatenedAbandonment" 
            value="Many times" 
            checked={formData.threatenedAbandonment === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="threatenedAbandonment-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="threatenedAbandonment-fewTimes" 
            name="threatenedAbandonment" 
            value="A few times" 
            checked={formData.threatenedAbandonment === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="threatenedAbandonment-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="threatenedAbandonment-once" 
            name="threatenedAbandonment" 
            value="Once" 
            checked={formData.threatenedAbandonment === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="threatenedAbandonment-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="threatenedAbandonment-never" 
            name="threatenedAbandonment" 
            value="Never" 
            checked={formData.threatenedAbandonment === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="threatenedAbandonment-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="threatenedAbandonment-refused" 
            name="threatenedAbandonment" 
            value="Refused" 
            checked={formData.threatenedAbandonment === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="threatenedAbandonment-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">4.3</span>
        Did a parent, guardian or other household member spank, slap, kick, punch or beat you up?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="physicalAbuse-manyTimes" 
            name="physicalAbuse" 
            value="Many times" 
            checked={formData.physicalAbuse === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="physicalAbuse-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="physicalAbuse-fewTimes" 
            name="physicalAbuse" 
            value="A few times" 
            checked={formData.physicalAbuse === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="physicalAbuse-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="physicalAbuse-once" 
            name="physicalAbuse" 
            value="Once" 
            checked={formData.physicalAbuse === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="physicalAbuse-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="physicalAbuse-never" 
            name="physicalAbuse" 
            value="Never" 
            checked={formData.physicalAbuse === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="physicalAbuse-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="physicalAbuse-refused" 
            name="physicalAbuse" 
            value="Refused" 
            checked={formData.physicalAbuse === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="physicalAbuse-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">4.4</span>
        Did a parent, guardian or other household member hit or cut you with an object, such as a stick (or cane), bottle, club, knife, whip etc?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="weaponAbuse-manyTimes" 
            name="weaponAbuse" 
            value="Many times" 
            checked={formData.weaponAbuse === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="weaponAbuse-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="weaponAbuse-fewTimes" 
            name="weaponAbuse" 
            value="A few times" 
            checked={formData.weaponAbuse === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="weaponAbuse-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="weaponAbuse-once" 
            name="weaponAbuse" 
            value="Once" 
            checked={formData.weaponAbuse === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="weaponAbuse-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="weaponAbuse-never" 
            name="weaponAbuse" 
            value="Never" 
            checked={formData.weaponAbuse === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="weaponAbuse-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="weaponAbuse-refused" 
            name="weaponAbuse" 
            value="Refused" 
            checked={formData.weaponAbuse === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="weaponAbuse-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">4.5</span>
        Did someone touch or fondle you in a sexual way when you did not want them to?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="sexualTouching-manyTimes" 
            name="sexualTouching" 
            value="Many times" 
            checked={formData.sexualTouching === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="sexualTouching-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="sexualTouching-fewTimes" 
            name="sexualTouching" 
            value="A few times" 
            checked={formData.sexualTouching === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="sexualTouching-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="sexualTouching-once" 
            name="sexualTouching" 
            value="Once" 
            checked={formData.sexualTouching === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="sexualTouching-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="sexualTouching-never" 
            name="sexualTouching" 
            value="Never" 
            checked={formData.sexualTouching === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="sexualTouching-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="sexualTouching-refused" 
            name="sexualTouching" 
            value="Refused" 
            checked={formData.sexualTouching === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="sexualTouching-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">4.6</span>
        Did someone make you touch their body in a sexual way when you did not want them to?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="sexualFondling-manyTimes" 
            name="sexualFondling" 
            value="Many times" 
            checked={formData.sexualFondling === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="sexualFondling-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="sexualFondling-fewTimes" 
            name="sexualFondling" 
            value="A few times" 
            checked={formData.sexualFondling === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="sexualFondling-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="sexualFondling-once" 
            name="sexualFondling" 
            value="Once" 
            checked={formData.sexualFondling === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="sexualFondling-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="sexualFondling-never" 
            name="sexualFondling" 
            value="Never" 
            checked={formData.sexualFondling === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="sexualFondling-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="sexualFondling-refused" 
            name="sexualFondling" 
            value="Refused" 
            checked={formData.sexualFondling === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="sexualFondling-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">4.7</span>
        Did someone attempt oral, anal, or vaginal intercourse with you when you did not want them to?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="attemptedSexualIntercourse-manyTimes" 
            name="attemptedSexualIntercourse" 
            value="Many times" 
            checked={formData.attemptedSexualIntercourse === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="attemptedSexualIntercourse-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="attemptedSexualIntercourse-fewTimes" 
            name="attemptedSexualIntercourse" 
            value="A few times" 
            checked={formData.attemptedSexualIntercourse === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="attemptedSexualIntercourse-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="attemptedSexualIntercourse-once" 
            name="attemptedSexualIntercourse" 
            value="Once" 
            checked={formData.attemptedSexualIntercourse === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="attemptedSexualIntercourse-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="attemptedSexualIntercourse-never" 
            name="attemptedSexualIntercourse" 
            value="Never" 
            checked={formData.attemptedSexualIntercourse === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="attemptedSexualIntercourse-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="attemptedSexualIntercourse-refused" 
            name="attemptedSexualIntercourse" 
            value="Refused" 
            checked={formData.attemptedSexualIntercourse === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="attemptedSexualIntercourse-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">4.8</span>
        Did someone actually have oral, anal, or vaginal intercourse with you when you did not want them to?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="completedSexualIntercourse-manyTimes" 
            name="completedSexualIntercourse" 
            value="Many times" 
            checked={formData.completedSexualIntercourse === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="completedSexualIntercourse-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="completedSexualIntercourse-fewTimes" 
            name="completedSexualIntercourse" 
            value="A few times" 
            checked={formData.completedSexualIntercourse === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="completedSexualIntercourse-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="completedSexualIntercourse-once" 
            name="completedSexualIntercourse" 
            value="Once" 
            checked={formData.completedSexualIntercourse === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="completedSexualIntercourse-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="completedSexualIntercourse-never" 
            name="completedSexualIntercourse" 
            value="Never" 
            checked={formData.completedSexualIntercourse === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="completedSexualIntercourse-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="completedSexualIntercourse-refused" 
            name="completedSexualIntercourse" 
            value="Refused" 
            checked={formData.completedSexualIntercourse === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="completedSexualIntercourse-refused">Refused</label>
        </div>
      </div>
    </div>
  </>
);

// Section 5: Peer Violence
export const PeerViolenceSection = ({ formData, handleChange }) => {
  // Custom handler for bullying type checkboxes
  const handleBullyingTypeChange = (e) => {
    const { name, value, checked } = e.target;
    
    // Get current selections as array
    const currentSelections = formData.bullyingTypes ? formData.bullyingTypes.split(',') : [];
    
    // If "Never bullied" or "Refused" is checked, clear all other selections
    if ((value === "Never bullied" || value === "Refused") && checked) {
      handleChange({
        target: {
          name: "bullyingTypes",
          value: value
        }
      });
      return;
    }
    
    // If any other option is checked, remove "Never bullied" and "Refused"
    let newSelections = [...currentSelections];
    
    if (checked) {
      // Add the value if it's not already in the selections
      if (!newSelections.includes(value)) {
        // Remove "Never bullied" and "Refused" if they exist
        newSelections = newSelections.filter(item => item !== "Never bullied" && item !== "Refused");
        newSelections.push(value);
      }
    } else {
      // Remove the value
      newSelections = newSelections.filter(item => item !== value);
    }
    
    // Update the form data
    handleChange({
      target: {
        name: "bullyingTypes",
        value: newSelections.join(',')
      }
    });
  };
  
  // Helper to check if a bullying type is selected
  const isBullyingTypeSelected = (value) => {
    const currentSelections = formData.bullyingTypes ? formData.bullyingTypes.split(',') : [];
    return currentSelections.includes(value);
  };
  
  // Helper to check if a bullying type should be disabled
  const isBullyingTypeDisabled = (value) => {
    const currentSelections = formData.bullyingTypes ? formData.bullyingTypes.split(',') : [];
    
    // If this is "Never bullied" or "Refused", disable if any other option is selected
    if (value === "Never bullied" || value === "Refused") {
      const otherSelections = currentSelections.filter(item => 
        item !== "Never bullied" && item !== "Refused");
      return otherSelections.length > 0;
    }
    
    // If this is any other option, disable if "Never bullied" or "Refused" is selected
    return currentSelections.includes("Never bullied") || currentSelections.includes("Refused");
  };
  
  return (
  <>
    <div className="question-description">
      When you were growing up, during the first 18 years of your life...
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">5.1</span>
        How often were you bullied?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="bullied-manyTimes" 
            name="bullied" 
            value="Many times" 
            checked={formData.bullied === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="bullied-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="bullied-fewTimes" 
            name="bullied" 
            value="A few times" 
            checked={formData.bullied === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="bullied-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="bullied-once" 
            name="bullied" 
            value="Once" 
            checked={formData.bullied === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="bullied-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="bullied-never" 
            name="bullied" 
            value="Never" 
            checked={formData.bullied === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="bullied-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="bullied-refused" 
            name="bullied" 
            value="Refused" 
            checked={formData.bullied === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="bullied-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">5.2</span>
        How were you bullied? (Select all that apply)
      </div>
      <div className="checkbox-options vertical bullying-types">
        <div className="checkbox-option">
          <input 
            type="checkbox" 
            id="bullyingType-never" 
            name="bullyingType-never" 
            value="Never bullied" 
            checked={isBullyingTypeSelected("Never bullied")}
            onChange={handleBullyingTypeChange}
            disabled={isBullyingTypeDisabled("Never bullied")}
          />
          <label htmlFor="bullyingType-never" style={{
            opacity: isBullyingTypeDisabled("Never bullied") ? 0.5 : 1
          }}>Never bullied</label>
        </div>
        <div className="checkbox-option">
          <input 
            type="checkbox" 
            id="bullyingType-physical" 
            name="bullyingType-physical" 
            value="Physical" 
            checked={isBullyingTypeSelected("Physical")}
            onChange={handleBullyingTypeChange}
            disabled={isBullyingTypeDisabled("Physical")}
          />
          <label htmlFor="bullyingType-physical" style={{
            opacity: isBullyingTypeDisabled("Physical") ? 0.5 : 1
          }}>I was hit, kicked, pushed, shoved around, or locked indoors</label>
        </div>
        <div className="checkbox-option">
          <input 
            type="checkbox" 
            id="bullyingType-race" 
            name="bullyingType-race" 
            value="Race" 
            checked={isBullyingTypeSelected("Race")}
            onChange={handleBullyingTypeChange}
            disabled={isBullyingTypeDisabled("Race")}
          />
          <label htmlFor="bullyingType-race" style={{
            opacity: isBullyingTypeDisabled("Race") ? 0.5 : 1
          }}>I was made fun of because of my race, nationality or colour</label>
        </div>
        <div className="checkbox-option">
          <input 
            type="checkbox" 
            id="bullyingType-religion" 
            name="bullyingType-religion" 
            value="Religion" 
            checked={isBullyingTypeSelected("Religion")}
            onChange={handleBullyingTypeChange}
            disabled={isBullyingTypeDisabled("Religion")}
          />
          <label htmlFor="bullyingType-religion" style={{
            opacity: isBullyingTypeDisabled("Religion") ? 0.5 : 1
          }}>I was made fun of because of my religion</label>
        </div>
        <div className="checkbox-option">
          <input 
            type="checkbox" 
            id="bullyingType-sexual" 
            name="bullyingType-sexual" 
            value="Sexual" 
            checked={isBullyingTypeSelected("Sexual")}
            onChange={handleBullyingTypeChange}
            disabled={isBullyingTypeDisabled("Sexual")}
          />
          <label htmlFor="bullyingType-sexual" style={{
            opacity: isBullyingTypeDisabled("Sexual") ? 0.5 : 1
          }}>I was made fun of with sexual jokes, comments, or gestures</label>
        </div>
        <div className="checkbox-option">
          <input 
            type="checkbox" 
            id="bullyingType-exclusion" 
            name="bullyingType-exclusion" 
            value="Exclusion" 
            checked={isBullyingTypeSelected("Exclusion")}
            onChange={handleBullyingTypeChange}
            disabled={isBullyingTypeDisabled("Exclusion")}
          />
          <label htmlFor="bullyingType-exclusion" style={{
            opacity: isBullyingTypeDisabled("Exclusion") ? 0.5 : 1
          }}>I was left out of activities on purpose or completely ignored</label>
        </div>
        <div className="checkbox-option">
          <input 
            type="checkbox" 
            id="bullyingType-appearance" 
            name="bullyingType-appearance" 
            value="Appearance" 
            checked={isBullyingTypeSelected("Appearance")}
            onChange={handleBullyingTypeChange}
            disabled={isBullyingTypeDisabled("Appearance")}
          />
          <label htmlFor="bullyingType-appearance" style={{
            opacity: isBullyingTypeDisabled("Appearance") ? 0.5 : 1
          }}>I was made fun of because of how my body or face looked</label>
        </div>
        <div className="checkbox-option">
          <input 
            type="checkbox" 
            id="bullyingType-other" 
            name="bullyingType-other" 
            value="Other" 
            checked={isBullyingTypeSelected("Other")}
            onChange={handleBullyingTypeChange}
            disabled={isBullyingTypeDisabled("Other")}
          />
          <label htmlFor="bullyingType-other" style={{
            opacity: isBullyingTypeDisabled("Other") ? 0.5 : 1
          }}>I was bullied in some other way</label>
        </div>
        <div className="checkbox-option">
          <input 
            type="checkbox" 
            id="bullyingType-refused" 
            name="bullyingType-refused" 
            value="Refused" 
            checked={isBullyingTypeSelected("Refused")}
            onChange={handleBullyingTypeChange}
            disabled={isBullyingTypeDisabled("Refused")}
          />
          <label htmlFor="bullyingType-refused" style={{
            opacity: isBullyingTypeDisabled("Refused") ? 0.5 : 1
          }}>Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-description">
      This next question is about PHYSICAL FIGHTS. A physical fight occurs when two young people of about the same strength or power choose to fight each other.
      
      When you were growing up, during the first 18 years of your life...
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">5.3</span>
        How often were you in a physical fight?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="physicalFight-manyTimes" 
            name="physicalFight" 
            value="Many times" 
            checked={formData.physicalFight === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="physicalFight-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="physicalFight-fewTimes" 
            name="physicalFight" 
            value="A few times" 
            checked={formData.physicalFight === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="physicalFight-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="physicalFight-once" 
            name="physicalFight" 
            value="Once" 
            checked={formData.physicalFight === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="physicalFight-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="physicalFight-never" 
            name="physicalFight" 
            value="Never" 
            checked={formData.physicalFight === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="physicalFight-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="physicalFight-refused" 
            name="physicalFight" 
            value="Refused" 
            checked={formData.physicalFight === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="physicalFight-refused">Refused</label>
        </div>
      </div>
    </div>
  </>
  );
};

// Section 6: Community Violence
export const CommunityViolenceSection = ({ formData, handleChange }) => (
  <>
    <div className="question-description">
      These next questions are about how often, when you were a child, YOU may have seen or heard certain things in your NEIGHBOURHOOD OR COMMUNITY (not in your home or on TV, movies, or the radio).
      
      When you were growing up, during the first 18 years of your life...
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">6.1</span>
        Did you see or hear someone being beaten up in real life?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedBeating-manyTimes" 
            name="witnessedBeating" 
            value="Many times" 
            checked={formData.witnessedBeating === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedBeating-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedBeating-fewTimes" 
            name="witnessedBeating" 
            value="A few times" 
            checked={formData.witnessedBeating === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedBeating-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedBeating-once" 
            name="witnessedBeating" 
            value="Once" 
            checked={formData.witnessedBeating === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedBeating-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedBeating-never" 
            name="witnessedBeating" 
            value="Never" 
            checked={formData.witnessedBeating === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedBeating-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedBeating-refused" 
            name="witnessedBeating" 
            value="Refused" 
            checked={formData.witnessedBeating === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedBeating-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">6.2</span>
        Did you see or hear someone being stabbed or shot?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedStabbingOrShooting-manyTimes" 
            name="witnessedStabbingOrShooting" 
            value="Many times" 
            checked={formData.witnessedStabbingOrShooting === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedStabbingOrShooting-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedStabbingOrShooting-fewTimes" 
            name="witnessedStabbingOrShooting" 
            value="A few times" 
            checked={formData.witnessedStabbingOrShooting === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedStabbingOrShooting-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedStabbingOrShooting-once" 
            name="witnessedStabbingOrShooting" 
            value="Once" 
            checked={formData.witnessedStabbingOrShooting === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedStabbingOrShooting-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedStabbingOrShooting-never" 
            name="witnessedStabbingOrShooting" 
            value="Never" 
            checked={formData.witnessedStabbingOrShooting === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedStabbingOrShooting-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedStabbingOrShooting-refused" 
            name="witnessedStabbingOrShooting" 
            value="Refused" 
            checked={formData.witnessedStabbingOrShooting === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedStabbingOrShooting-refused">Refused</label>
        </div>
      </div>
    </div>
    
    <div className="question-item">
      <div className="question-text">
        <span className="question-number">6.3</span>
        Did you see or hear someone being threatened with a knife or gun in real life?
      </div>
      <div className="radio-options frequency-scale">
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedThreatenedWithWeapon-manyTimes" 
            name="witnessedThreatenedWithWeapon" 
            value="Many times" 
            checked={formData.witnessedThreatenedWithWeapon === "Many times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedThreatenedWithWeapon-manyTimes">Many times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedThreatenedWithWeapon-fewTimes" 
            name="witnessedThreatenedWithWeapon" 
            value="A few times" 
            checked={formData.witnessedThreatenedWithWeapon === "A few times"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedThreatenedWithWeapon-fewTimes">A few times</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedThreatenedWithWeapon-once" 
            name="witnessedThreatenedWithWeapon" 
            value="Once" 
            checked={formData.witnessedThreatenedWithWeapon === "Once"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedThreatenedWithWeapon-once">Once</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedThreatenedWithWeapon-never" 
            name="witnessedThreatenedWithWeapon" 
            value="Never" 
            checked={formData.witnessedThreatenedWithWeapon === "Never"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedThreatenedWithWeapon-never">Never</label>
        </div>
        <div className="radio-option">
          <input 
            type="radio" 
            id="witnessedThreatenedWithWeapon-refused" 
            name="witnessedThreatenedWithWeapon" 
            value="Refused" 
            checked={formData.witnessedThreatenedWithWeapon === "Refused"}
            onChange={handleChange}
          />
          <label htmlFor="witnessedThreatenedWithWeapon-refused">Refused</label>
        </div>
      </div>
    </div>
  </>
);

// Test section - blank screen that won't be captured in export
export const TestSection = ({ formData, handleChange }) => (
  <>
    <div className="question-description">
      <h2>Test Section</h2>
      <p>This is a blank test section that will not be captured in the CSV export file.</p>
    </div>
  </>
); 