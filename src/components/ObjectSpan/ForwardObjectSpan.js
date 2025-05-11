import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TASK_CONFIG } from '../../config';
import './ObjectSpan.css';

const ForwardObjectSpan = () => {
  const navigate = useNavigate();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Preload the images used in the examples and all object images
  useEffect(() => {
    const allImages = [
      '/images/Bread.png',
      '/images/Car.png',
      '/images/Books.png',
      '/images/Bag.png',
      '/images/Chair.png',
      '/images/Computer.png',
      '/images/Money.png',
      '/images/Pot.png',
      '/images/Shoes.png'
    ];
    
    let loadedCount = 0;
    const totalImages = allImages.length;
    
    const preloadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
          resolve(); // Resolve anyway to not block other images
        };
      });
    };

    const loadAllImages = async () => {
      try {
        await Promise.all(allImages.map(src => preloadImage(src)));
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesLoaded(true); // Continue anyway
      }
    };

    loadAllImages();
  }, []);

  const startPractice = () => {
    navigate('/object-span/forward/practice');
  };

  // Show loading screen if images are not loaded
  if (!imagesLoaded) {
    return (
      <div className="task-screen">
        <div className="loading-container">
          <h2>Loading Images...</h2>
          <div className="loading-bar">
            <div 
              className="loading-progress" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p>{loadingProgress}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-screen">
      <h1>Forward Object Span Task</h1>
      
      <div className="task-instructions">
        <p>In this task, you will be shown a series of objects one at a time.</p>
        <p>Your task is to remember and recall the objects in the <strong>SAME ORDER</strong> as they appeared.</p>
        <p>For example, if you see: bread → car → books</p>
        <p>You should type: "bread car books"</p>
        <p>You will start with practice trials to help you understand the task.</p>
      </div>

      <div className="example-objects">
        <img src="/images/Bread.png" alt="Bread" className="example-object" />
        <div className="arrow">→</div>
        <img src="/images/Car.png" alt="Car" className="example-object" />
        <div className="arrow">→</div>
        <img src="/images/Books.png" alt="Books" className="example-object" />
      </div>

      <button onClick={startPractice} className="start-button">
        Start Practice
      </button>
    </div>
  );
};

export default ForwardObjectSpan; 