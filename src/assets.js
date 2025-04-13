/**
 * Asset paths for use in components
 * This ensures the build process includes these files
 */

// Object span images
export const objectImages = {
  object1: '/images/objects/object1.svg',
  object2: '/images/objects/object2.svg'
};

// Ecological spatial images
export const ecologicalImages = {
  scene1: '/images/ecological/scene1.svg'
};

// Helper function to get random object image
export const getRandomObjectImage = () => {
  const keys = Object.keys(objectImages);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return objectImages[randomKey];
};

// Export all images
export const allImages = {
  ...objectImages,
  ...ecologicalImages
};

export default allImages; 