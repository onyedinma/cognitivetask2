import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

// Global image loader for preloading images
import GlobalImageLoader from './components/common/GlobalImageLoader';

// Task components
import Home from './components/Home';
import ParticipantInfo from './components/ParticipantInfo';
import ObjectSpanTask from './components/ObjectSpan/ObjectSpanTask';
import ForwardObjectSpan from './components/ObjectSpan/ForwardObjectSpan';
import BackwardObjectSpan from './components/ObjectSpan/BackwardObjectSpan';
import ObjectSpanPractice from './components/ObjectSpan/ObjectSpanPractice';
import ObjectSpanMainTask from './components/ObjectSpan/ObjectSpanMainTask';
import DigitSpanTask from './components/DigitSpan/DigitSpanTask';
import ForwardDigitSpan from './components/DigitSpan/ForwardDigitSpan';
import BackwardDigitSpan from './components/DigitSpan/BackwardDigitSpan';
import DigitSpanPractice from './components/DigitSpan/DigitSpanPractice';
import DigitSpanMainTask from './components/DigitSpan/DigitSpanMainTask';
import ShapeCountingTask from './components/ShapeCounting/ShapeCountingTask';
import ShapeCountingInstructions from './components/ShapeCounting/ShapeCountingInstructions';
import ShapeCountingPractice from './components/ShapeCounting/ShapeCountingPractice';
import ShapeCountingMainTask from './components/ShapeCounting/ShapeCountingMainTask';
import CountingGameTask from './components/CountingGame/CountingGameTask';
import CountingGameInstructions from './components/CountingGame/CountingGameInstructions';
import CountingGamePractice from './components/CountingGame/CountingGamePractice';
import CountingGameMainTask from './components/CountingGame/CountingGameMainTask';
import SpatialMemoryTask from './components/SpatialMemory/SpatialMemoryTask';
import SpatialMemoryPractice from './components/SpatialMemory/SpatialMemoryPractice';
import SpatialMemoryMainTask from './components/SpatialMemory/SpatialMemoryMainTask';
import EcologicalSpatialTask from './components/EcologicalSpatial/EcologicalSpatialTask';
import EcologicalSpatialPractice from './components/EcologicalSpatial/EcologicalSpatialPractice';
import EcologicalSpatialMainTask from './components/EcologicalSpatial/EcologicalSpatialMainTask';
import { 
  EcologicalDeductiveReasoningTask, 
  EcologicalDeductiveReasoningPractice, 
  EcologicalDeductiveReasoningMainTask 
} from './components/EcologicalDeductiveReasoning';
import DeductiveReasoningTask from './components/DeductiveReasoning/DeductiveReasoningTask';
import DeductiveReasoningPractice from './components/DeductiveReasoning/DeductiveReasoningPractice';
import DeductiveReasoningMainTask from './components/DeductiveReasoning/DeductiveReasoningMainTask';
// Questionnaire component
import CombinedQuestionnaire from './components/Questionnaires/Combined/CombinedQuestionnaire';

// Fullscreen components
import { FullscreenProvider } from './components/FullscreenProvider';
import FullscreenPrompt from './components/FullscreenPrompt';
import FullscreenWarning from './components/FullscreenWarning';

// Protected Route component to ensure participant info is entered
function RequireParticipantInfo({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const checkAuthorization = useCallback(() => {
    const studentId = localStorage.getItem('studentId');
    const counterBalance = localStorage.getItem('counterBalance');
    
    if (studentId && counterBalance) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
    
    setIsChecking(false);
  }, []);
  
  useEffect(() => {
    // Initial check
    checkAuthorization();
    
    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'studentId' || e.key === 'counterBalance') {
        checkAuthorization();
      }
    };
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab changes
    const handleLocalStorageChange = () => {
      checkAuthorization();
    };
    
    window.addEventListener('localStorageChange', handleLocalStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleLocalStorageChange);
    };
  }, [checkAuthorization]);
  
  // Show nothing while checking
  if (isChecking) {
    return null;
  }
  
  // Only redirect if we're not already on the participant-info page
  if (!isAuthorized && location.pathname !== '/participant-info') {
    return <Navigate to="/participant-info" replace />;
  }
  
  return children;
}

function TaskWrapper({ children }) {
  return (
    <>
      <FullscreenPrompt />
      <FullscreenWarning />
      {children}
    </>
  );
}

function App() {
  // Use a relative path instead of absolute path for basename
  // This works with the homepage: "." setting in package.json
  const basename = '';
  
  return (
    <FullscreenProvider>
      <Router 
        basename={basename}
        future={{ 
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="App">
          <RequireParticipantInfo>
            <GlobalImageLoader />
          </RequireParticipantInfo>
          <Routes>
            {/* Participant Info Route */}
            <Route path="/participant-info" element={<ParticipantInfo />} />
            
            {/* Home Route with Protection */}
            <Route path="/" element={
              <RequireParticipantInfo>
                <Home />
              </RequireParticipantInfo>
            } />
            
            {/* Object Span Task Routes - All Protected */}
            <Route path="/object-span" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <ObjectSpanTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Forward Object Span */}
            <Route path="/object-span/forward" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <ForwardObjectSpan />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Backward Object Span */}
            <Route path="/object-span/backward" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <BackwardObjectSpan />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Object Span Practice */}
            <Route path="/object-span/:direction/practice" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <ObjectSpanPractice />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Object Span Main Task */}
            <Route path="/object-span/:direction/task" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <ObjectSpanMainTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Digit Span Task Routes - All Protected */}
            <Route path="/digit-span" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <DigitSpanTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Forward Digit Span */}
            <Route path="/digit-span/forward" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <ForwardDigitSpan />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Backward Digit Span */}
            <Route path="/digit-span/backward" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <BackwardDigitSpan />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Digit Span Practice */}
            <Route path="/digit-span/:direction/practice" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <DigitSpanPractice />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Digit Span Main Task */}
            <Route path="/digit-span/:direction/task" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <DigitSpanMainTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Shape Counting Routes */}
            <Route path="/shape-counting" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <ShapeCountingTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/shape-counting/instructions" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <ShapeCountingInstructions />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/shape-counting/practice" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <ShapeCountingPractice />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/shape-counting/task" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <ShapeCountingMainTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Counting Game Routes (Ecological Shape Counting) */}
            <Route path="/counting-game" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <CountingGameTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/counting-game/instructions" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <CountingGameInstructions />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/counting-game/practice" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <CountingGamePractice />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/counting-game/task" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <CountingGameMainTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Spatial Memory Task Routes */}
            <Route path="/spatial-memory" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <SpatialMemoryTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/spatial-memory/practice" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <SpatialMemoryPractice />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/spatial-memory/task" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <SpatialMemoryMainTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Restore Ecological Spatial Memory Routes */}
            <Route path="/ecological-spatial" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <EcologicalSpatialTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/ecological-spatial/practice" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <EcologicalSpatialPractice />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/ecological-spatial/task" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <EcologicalSpatialMainTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Keep Ecological Deductive Reasoning Task */}
            <Route path="/ecological-deductive" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <EcologicalDeductiveReasoningTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/ecological-deductive/practice" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <EcologicalDeductiveReasoningPractice />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/ecological-deductive/task" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <EcologicalDeductiveReasoningMainTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Deductive Reasoning Task Routes */}
            <Route path="/deductive-reasoning" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <DeductiveReasoningTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/deductive-reasoning/practice" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <DeductiveReasoningPractice />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            <Route path="/deductive-reasoning/task" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <DeductiveReasoningMainTask />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Questionnaire Route */}
            <Route path="/combined-questionnaire" element={
              <RequireParticipantInfo>
                <TaskWrapper>
                  <CombinedQuestionnaire />
                </TaskWrapper>
              </RequireParticipantInfo>
            } />
            
            {/* Fallback route - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </FullscreenProvider>
  );
}

export default App;
