import React, { useState, useEffect } from 'react';
import './LoadingStyles.css';

/**
 * Component for preloading images
 * @param {Object} props Component props
 * @param {Array} props.images Array of image URLs to preload
 * @param {Function} props.onLoaded Callback when images are loaded
 * @param {Boolean} props.showLoading Whether to show loading state during preload
 * @param {ReactNode} props.children Child components to render after loading
 */
const ImagePreloader = ({ images = [], onLoaded, showLoading = true, children }) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    if (!images || images.length === 0) {
      setLoaded(true);
      if (onLoaded) onLoaded();
      return;
    }
    
    let loadedCount = 0;
    const totalImages = images.length;
    
    // Create an array to hold all image elements
    const imageElements = [];
    
    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setLoaded(true);
        if (onLoaded) onLoaded();
      }
    };
    
    // Preload all images
    images.forEach((src, index) => {
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Count even if error - don't block rendering
      img.src = src;
      imageElements.push(img);
    });
    
    return () => {
      // Clean up - remove references to prevent memory leaks
      imageElements.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [images, onLoaded]);
  
  if (!loaded && showLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading images...</p>
        <div className="image-preloader">
          {images.map((src, index) => (
            <img key={index} src={src} alt="" />
          ))}
        </div>
      </div>
    );
  }
  
  return children;
};

export default ImagePreloader; 