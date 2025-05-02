import React from 'react';
import { TASK_CONFIG } from '../../config';
import './ObjectReference.css';

/**
 * Object Reference Component
 * Displays a visual reference guide for all objects and their names
 * Allows clicking objects to add them to the input field
 */
const ObjectReference = ({ onObjectClick }) => {
  const objects = Object.values(TASK_CONFIG.objectSpan.objectMapping);

  const handleObjectClick = (objectName) => {
    if (onObjectClick) {
      onObjectClick(objectName);
    }
  };

  return (
    <div className="object-reference-guide">
      <h3>Click objects to add them to your answer:</h3>
      <div className="object-reference-grid">
        {objects.map((obj) => (
          <div 
            key={obj.name} 
            className="object-reference-item"
            onClick={() => handleObjectClick(obj.name)}
            role="button"
            tabIndex={0}
          >
            <img src={obj.image} alt={obj.name} className="reference-image" />
            <span className="object-name">{obj.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObjectReference; 