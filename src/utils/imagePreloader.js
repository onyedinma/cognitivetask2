import React, { useEffect } from 'react';

/**
 * Utility for preloading images to ensure faster loading
 */

// Preload a single image and return a promise
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

// Preload multiple images and return a promise that resolves
// when all images are loaded
export const preloadImages = (sources) => {
  return Promise.all(sources.map(src => preloadImage(src)));
};

// Preload all images within a directory (requires importing images)
export const preloadImagesFromImports = (importedImages) => {
  const imagePromises = Object.values(importedImages).map(src => preloadImage(src));
  return Promise.all(imagePromises);
};

// Helper to add image preloading to any component
export const useImagePreloader = (imageSources, callback) => {
  useEffect(() => {
    let isMounted = true;
    
    const preloadAllImages = async () => {
      try {
        await preloadImages(imageSources);
        if (isMounted && callback) {
          callback();
        }
      } catch (error) {
        console.error('Failed to preload images:', error);
        if (isMounted && callback) {
          callback(); // Still call the callback even if some images fail to load
        }
      }
    };
    
    preloadAllImages();
    
    return () => {
      isMounted = false;
    };
  }, [imageSources, callback]);
};

// Helper to generate image preload tags for the head
export const generateImagePreloadTags = (imageSources) => {
  return imageSources.map((src, index) => (
    <link key={`preload-${index}`} rel="preload" as="image" href={src} />
  ));
};

export default {
  preloadImage,
  preloadImages,
  preloadImagesFromImports,
  useImagePreloader,
  generateImagePreloadTags
}; 