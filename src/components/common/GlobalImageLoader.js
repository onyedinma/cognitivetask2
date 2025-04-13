import React, { useEffect, useState } from 'react';
import { getAllGameImages } from '../../utils/imageUtils';
import { allImages } from '../../assets';
import './LoadingStyles.css';

/**
 * Global image preloader component
 * Preloads all game images when the app starts
 * Can be placed in App.js to ensure images are loaded before components need them
 */
const GlobalImageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Get all images to preload
    let images = [];
    try {
      // Get images from both utils and asset file for maximum compatibility
      images = [
        ...getAllGameImages(),
        ...Object.values(allImages)
      ];
      
      // Remove duplicates
      images = [...new Set(images)];
    } catch (error) {
      console.error('Error getting game images:', error);
      // Continue without images rather than failing completely
    }
    
    const totalImages = images.length;
    let loadedCount = 0;
    
    // Set a minimum loading time to prevent flash
    const minLoadingTime = 1000;
    const startTime = Date.now();
    
    // If no images found, finish loading after minimum time
    if (totalImages === 0) {
      console.log('No images found to preload.');
      setTimeout(() => {
        setIsLoading(false);
      }, minLoadingTime);
      return;
    }
    
    const imageElements = [];
    
    const finishLoading = () => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minLoadingTime) {
        // Wait until minimum loading time has passed
        setTimeout(() => {
          setIsLoading(false);
        }, minLoadingTime - elapsedTime);
      } else {
        setIsLoading(false);
      }
    };
    
    const handleImageLoad = () => {
      loadedCount++;
      const newProgress = Math.round((loadedCount / totalImages) * 100);
      setProgress(newProgress);
      
      if (loadedCount === totalImages) {
        finishLoading();
      }
    };
    
    // Preload all images
    images.forEach(src => {
      if (!src) {
        // Skip invalid image sources
        handleImageLoad();
        return;
      }
      
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        handleImageLoad(); // Count error as loaded to not block
      };
      img.src = src;
      imageElements.push(img);
    });
    
    // Set a timeout to ensure loading doesn't hang indefinitely
    const timeoutId = setTimeout(() => {
      if (loadedCount < totalImages) {
        console.warn(`Only loaded ${loadedCount} of ${totalImages} images. Proceeding anyway.`);
        finishLoading();
      }
    }, 5000); // 5 second timeout
    
    return () => {
      clearTimeout(timeoutId);
      
      // Clean up image references
      imageElements.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);
  
  // Only show loading spinner for 2+ seconds to avoid flash of loading UI
  if (!isLoading) {
    return null; // Don't render anything once loading is complete
  }
  
  return (
    <div className="fullpage-loading">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading resources... {progress}%</p>
    </div>
  );
};

export default GlobalImageLoader; 