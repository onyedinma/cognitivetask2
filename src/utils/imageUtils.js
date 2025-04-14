/**
 * Utility functions for working with images in the application
 */
import { getBaseUrl, objectImages, ecologicalImages } from '../assets';

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
 * Fix the path for Netlify deployment
 * @param {string} relativePath The relative path to an image
 * @returns {string} The corrected path
 */
export const fixImagePath = (relativePath) => {
  if (!relativePath) return '';
  
  // Remove leading / if present
  let path = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  // Remove leading ./ if present
  path = path.startsWith('./') ? path.slice(2) : path;
  
  // Add the base URL for production environments
  const baseUrl = getBaseUrl();
  return `${baseUrl}/${path}`;
};

/**
 * Get all image paths from public directory for preloading
 * @returns {Array} Array of image URLs from public directory
 */
export const getPublicImages = () => {
  // Convert object values to arrays
  const objectPaths = Object.values(objectImages).map(fixImagePath);
  const ecologicalPaths = Object.values(ecologicalImages).map(fixImagePath);
  
  return [...objectPaths, ...ecologicalPaths];
};

/**
 * Creates an array of all object images used in object span tasks
 * @returns {Array} Array of image URLs
 */
export const getObjectSpanImages = () => {
  return Object.values(objectImages).map(fixImagePath);
};

/**
 * Creates an array of all ecological spatial images
 * @returns {Array} Array of image URLs
 */
export const getEcologicalSpatialImages = () => {
  return Object.values(ecologicalImages).map(fixImagePath);
};

/**
 * Get all image paths for preloading
 * @returns {Array} Array of all image URLs to be preloaded
 */
export const getAllGameImages = () => {
  // Simply return all public images with fixed paths
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
      img.onerror = (error) => {
        console.warn(`Failed to preload image: ${src}`, error);
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
  importAllImages,
  fixImagePath
};

export default imageUtils; 