/**
 * Asset paths for use in components
 * This ensures the build process includes these files
 */

// Object span images
export const objectImages = {
  object1: './images/objects/object1.svg',
  object2: './images/objects/object2.svg'
};

// Ecological spatial images
export const ecologicalImages = {
  scene1: './images/ecological/scene1.svg',
  scene2: './images/ecological/scene2.svg',
  scene3: './images/ecological/scene3.svg'
};

// Helper function to get random object image
export const getRandomObjectImage = () => {
  const keys = Object.keys(objectImages);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return objectImages[randomKey];
};

// Helper function to get random ecological image
export const getRandomEcologicalImage = () => {
  const keys = Object.keys(ecologicalImages);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return ecologicalImages[randomKey];
};

// Get base URL for assets based on environment
export const getBaseUrl = () => {
  // Check if we're in production (Netlify)
  const isProduction = process.env.NODE_ENV === 'production';
  // Get the base URL for the current environment
  const baseUrl = isProduction 
    ? window.location.origin 
    : '';
  return baseUrl;
};

// Get full URL for an image
export const getFullImageUrl = (relativePath) => {
  // Remove leading slash if present
  const path = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  // Remove leading ./ if present
  const cleanPath = path.startsWith('./') ? path.slice(2) : path;
  return `${getBaseUrl()}/${cleanPath}`;
};

// Export all images
export const allImages = {
  ...objectImages,
  ...ecologicalImages
};

export default allImages; 