/**
 * Utility functions for working with images in the application
 */

/**
 * Adds cache-busting parameters to image URLs to prevent caching issues
 * @param {string} url The original image URL
 * @returns {string} The URL with cache-busting parameter
 */
export const getNoCacheUrl = (url) => {
  if (!url) return url;
  const timestamp = new Date().getTime();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${timestamp}`;
};

/**
 * Creates an array of all object images used in object span tasks
 * @returns {Array} Array of image URLs
 */
export const getObjectSpanImages = () => {
  try {
    // Try to import images directly as a module
    const objectImagesContext = require.context('../assets/objects', false, /\.(png|jpg|jpeg|svg)$/);
    return objectImagesContext.keys().map(key => objectImagesContext(key));
  } catch (e) {
    console.warn('Warning: Object span images not found:', e.message);
    return [];
  }
};

/**
 * Creates an array of all ecological spatial images
 * @returns {Array} Array of image URLs
 */
export const getEcologicalSpatialImages = () => {
  try {
    const ecoSpatialImagesContext = require.context('../assets/ecological', false, /\.(png|jpg|jpeg|svg)$/);
    return ecoSpatialImagesContext.keys().map(key => ecoSpatialImagesContext(key));
  } catch (e) {
    console.warn('Warning: Ecological spatial images not found:', e.message);
    return [];
  }
};

/**
 * Get all image paths from public directory for preloading
 * @returns {Array} Array of image URLs from public directory
 */
export const getPublicImages = () => {
  // These need to be hardcoded as webpack can't dynamically require from public directory
  const publicImages = [
    '/images/objects/object1.png',
    '/images/objects/object2.png',
    '/images/ecological/scene1.jpg',
    // Add more image paths as needed
  ];
  
  // Filter out any images that don't exist (to prevent console errors)
  return publicImages.filter(path => {
    try {
      // This is just a simple test - it won't actually preload the image
      const img = new Image();
      img.src = path;
      return true;
    } catch (e) {
      return false;
    }
  });
};

/**
 * Get all image paths from assets for preloading
 * @returns {Array} Array of all image URLs to be preloaded
 */
export const getAllGameImages = () => {
  // Start with empty array to prevent errors
  const allImages = [];
  
  // Try to add object span images
  try {
    const objectImages = getObjectSpanImages();
    if (objectImages && objectImages.length) {
      allImages.push(...objectImages);
    }
  } catch (e) {
    console.warn('Error loading object span images:', e);
  }
  
  // Try to add ecological spatial images
  try {
    const ecoImages = getEcologicalSpatialImages();
    if (ecoImages && ecoImages.length) {
      allImages.push(...ecoImages);
    }
  } catch (e) {
    console.warn('Error loading ecological spatial images:', e);
  }
  
  // Add public images as fallback
  const publicImages = getPublicImages();
  if (publicImages && publicImages.length) {
    allImages.push(...publicImages);
  }
  
  return allImages;
};

/**
 * Preload an array of images by creating Image objects
 * @param {Array} imageSources Array of image URLs to preload
 * @returns {Promise} Promise that resolves when all images are loaded
 */
export const preloadImages = (imageSources) => {
  if (!imageSources || !imageSources.length) {
    return Promise.resolve();
  }

  const promises = imageSources.map(src => {
    return new Promise((resolve) => {
      if (!src) {
        resolve(); // Skip null/undefined sources
        return;
      }
      
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`);
        resolve(); // Resolve anyway to not block loading
      };
      img.src = src;
    });
  });

  return Promise.all(promises);
};

/**
 * Import all images from a specific directory
 * @param {Function} requireContext Webpack require.context function
 * @returns {Object} Object with all imported images
 */
export const importAllImages = (requireContext) => {
  if (!requireContext || !requireContext.keys) {
    return {};
  }
  
  let images = {};
  try {
    requireContext.keys().forEach((item) => {
      const key = item.replace('./', '');
      images[key] = requireContext(item);
    });
  } catch (e) {
    console.warn('Error importing images:', e);
  }
  return images;
};

const imageUtils = {
  getNoCacheUrl,
  getObjectSpanImages,
  getEcologicalSpatialImages,
  getAllGameImages,
  preloadImages,
  importAllImages
};

export default imageUtils; 