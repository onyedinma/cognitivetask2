import React, { useEffect, useState } from 'react';
import './LoadingStyles.css';

/**
 * Global image preloader component
 * Preloads all game images when the app starts
 */
const GlobalImageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let isMounted = true;
    let imageElements = [];
    
    const loadImages = async () => {
      try {
        // Define the counting images (hardcoded since we can't use require.context with public folder)
        const imageFiles = [
          '/counting/5dollar.jpg',
          '/counting/bus.jpg',
          '/counting/face.jpg'
        ];
        
        const totalImages = imageFiles.length;
        
        if (totalImages === 0) {
          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }
        
        let loadedCount = 0;
        
        const handleImageLoad = () => {
          if (!isMounted) return;
          
          loadedCount++;
          const newProgress = Math.round((loadedCount / totalImages) * 100);
          setProgress(newProgress);
          
          if (loadedCount === totalImages) {
            setIsLoading(false);
          }
        };
        
        // Preload images
        imageFiles.forEach(imagePath => {
          const img = new Image();
          img.onload = handleImageLoad;
          img.onerror = () => {
            console.warn(`Failed to load image: ${imagePath}`);
            handleImageLoad();
          };
          img.src = imagePath;
          imageElements.push(img);
        });
        
        // Set a timeout to ensure loading doesn't hang indefinitely
        setTimeout(() => {
          if (isMounted && loadedCount < totalImages) {
            console.warn(`Only loaded ${loadedCount} of ${totalImages} images. Proceeding anyway.`);
            setIsLoading(false);
          }
        }, 5000);
        
      } catch (error) {
        console.error('Error in image preloading:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadImages();
    
    return () => {
      isMounted = false;
      // Clean up image references
      imageElements.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
      imageElements = [];
    };
  }, []);
  
  if (!isLoading) {
    return null;
  }
  
  return (
    <div className="fullpage-loading">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading resources... {progress}%</p>
    </div>
  );
};

export default GlobalImageLoader; 