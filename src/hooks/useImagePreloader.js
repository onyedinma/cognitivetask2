import { useState, useEffect } from 'react';

/**
 * Custom hook for preloading images
 * @param {Array} imageSources Array of image URLs to preload
 * @returns {Object} Object containing loading state and error
 */
const useImagePreloader = (imageSources = []) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imagesError, setImagesError] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Reset states when image sources change
    setImagesLoaded(false);
    setImagesError(false);
    setProgress(0);
    
    // If no images to preload, set as loaded
    if (!imageSources || imageSources.length === 0) {
      setImagesLoaded(true);
      setProgress(100);
      return;
    }
    
    let isMounted = true;
    let loadedCount = 0;
    const totalImages = imageSources.length;
    const imageElements = [];
    
    const handleImageLoad = () => {
      if (!isMounted) return;
      
      loadedCount++;
      const newProgress = Math.round((loadedCount / totalImages) * 100);
      setProgress(newProgress);
      
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };
    
    const handleImageError = (error) => {
      console.error('Error preloading image:', error);
      handleImageLoad(); // Count errors as loaded to prevent blocking
      if (isMounted) {
        setImagesError(true);
      }
    };
    
    // Create an image element for each source to preload
    imageSources.forEach(src => {
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      img.src = src;
      imageElements.push(img);
    });
    
    return () => {
      isMounted = false;
      
      // Clean up to prevent memory leaks
      imageElements.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [imageSources]);
  
  return { imagesLoaded, imagesError, progress };
};

export default useImagePreloader; 