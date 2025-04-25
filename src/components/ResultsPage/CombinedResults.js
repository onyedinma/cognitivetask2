import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './CombinedResults.css';

// Individual result components
import MFQResults from './MFQResults';
import SDQResults from './SDQResults';
import SESResults from './SESResults';

// Main combined results component
const CombinedResults = ({ studentId }) => {
  // State for results
  const [mfqResults, setMfqResults] = useState([]);
  const [sdqResults, setSdqResults] = useState([]);
  const [sesResults, setSesResults] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load results from localStorage on component mount
  useEffect(() => {
    try {
      // Get all results from localStorage
      const mfq = JSON.parse(localStorage.getItem('mfqResults') || '[]');
      const sdq = JSON.parse(localStorage.getItem('sdqResults') || '[]');
      const ses = JSON.parse(localStorage.getItem('sesResults') || '[]');
      
      // Filter by student ID if provided
      const filteredMfq = studentId ? mfq.filter(r => r.studentId === studentId) : mfq;
      const filteredSdq = studentId ? sdq.filter(r => r.studentId === studentId) : sdq;
      const filteredSes = studentId ? ses.filter(r => r.studentId === studentId) : ses;
      
      // Set state with results
      setMfqResults(filteredMfq);
      setSdqResults(filteredSdq);
      setSesResults(filteredSes);
      setLoading(false);
    } catch (error) {
      console.error('Error loading results:', error);
      setLoading(false);
    }
  }, [studentId]);

  // Handle no results
  if (!loading && mfqResults.length === 0 && sdqResults.length === 0 && sesResults.length === 0) {
    return (
      <div className="no-results">
        <h2>No Results Found</h2>
        <p>No assessment results found for {studentId ? `student ID: ${studentId}` : 'any students'}.</p>
      </div>
    );
  }

  return (
    <div className="combined-results">
      <h1>Assessment Results {studentId && <span>(Student ID: {studentId})</span>}</h1>
      
      <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
        <TabList>
          <Tab>Summary</Tab>
          <Tab>MFQ {mfqResults.length > 0 && <span className="count">({mfqResults.length})</span>}</Tab>
          <Tab>SDQ {sdqResults.length > 0 && <span className="count">({sdqResults.length})</span>}</Tab>
          <Tab>SES {sesResults.length > 0 && <span className="count">({sesResults.length})</span>}</Tab>
        </TabList>

        {/* Summary tab */}
        <TabPanel>
          <div className="summary-panel">
            <h2>Assessment Summary</h2>
            {loading ? (
              <p>Loading results...</p>
            ) : (
              <>
                <div className="summary-counts">
                  <div className="count-box">
                    <h3>MFQ</h3>
                    <div className="count">{mfqResults.length}</div>
                    <div className="assessment-type">Mood and Feelings</div>
                  </div>
                  <div className="count-box">
                    <h3>SDQ</h3>
                    <div className="count">{sdqResults.length}</div>
                    <div className="assessment-type">Strengths and Difficulties</div>
                  </div>
                  <div className="count-box">
                    <h3>SES</h3>
                    <div className="count">{sesResults.length}</div>
                    <div className="assessment-type">Socioeconomic Status</div>
                  </div>
                </div>

                {mfqResults.length > 0 && (
                  <div className="latest-result">
                    <h3>Latest MFQ Result</h3>
                    <MFQResults results={[mfqResults[mfqResults.length - 1]]} showDetails={false} />
                  </div>
                )}
                
                {sdqResults.length > 0 && (
                  <div className="latest-result">
                    <h3>Latest SDQ Result</h3>
                    <SDQResults results={[sdqResults[sdqResults.length - 1]]} showDetails={false} />
                  </div>
                )}
              </>
            )}
          </div>
        </TabPanel>

        {/* MFQ tab */}
        <TabPanel>
          <div className="questionnaire-panel">
            <h2>Mood and Feelings Questionnaire Results</h2>
            {mfqResults.length === 0 ? (
              <p>No MFQ results available.</p>
            ) : (
              <MFQResults results={mfqResults} showDetails={true} />
            )}
          </div>
        </TabPanel>

        {/* SDQ tab */}
        <TabPanel>
          <div className="questionnaire-panel">
            <h2>Strengths and Difficulties Questionnaire Results</h2>
            {sdqResults.length === 0 ? (
              <p>No SDQ results available.</p>
            ) : (
              <SDQResults results={sdqResults} showDetails={true} />
            )}
          </div>
        </TabPanel>

        {/* SES tab */}
        <TabPanel>
          <div className="questionnaire-panel">
            <h2>Socioeconomic Status Questionnaire Results</h2>
            {sesResults.length === 0 ? (
              <p>No SES results available.</p>
            ) : (
              <SESResults results={sesResults} showDetails={true} />
            )}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default CombinedResults; 