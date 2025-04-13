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
 * Get all image paths from public directory for preloading
 * @returns {Array} Array of image URLs from public directory
 */
export const getPublicImages = () => {
  // These need to be hardcoded as webpack can't dynamically require from public directory
  const publicImages = [
    '/images/objects/object1.svg',
    '/images/objects/object2.svg',
    '/images/ecological/scene1.svg'
  ];
  
  return publicImages;
};

/**
 * Creates an array of all object images used in object span tasks
 * @returns {Array} Array of image URLs
 */
export const getObjectSpanImages = () => {
  // Use public directory images instead of trying to import from assets
  return [
    '/images/objects/object1.svg',
    '/images/objects/object2.svg'
  ];
};

/**
 * Creates an array of all ecological spatial images
 * @returns {Array} Array of image URLs
 */
export const getEcologicalSpatialImages = () => {
  // Use public directory images instead of trying to import from assets
  return [
    '/images/ecological/scene1.svg'
  ];
};

/**
 * Get all image paths from assets for preloading
 * @returns {Array} Array of all image URLs to be preloaded
 */
export const getAllGameImages = () => {
  // Simply return all public images
  return getPublicImages();
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