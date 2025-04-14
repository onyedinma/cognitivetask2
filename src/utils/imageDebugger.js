/**
 * Utility for debugging image loading issues
 */
import { getObjectSpanImages, getEcologicalSpatialImages, fixImagePath } from './imageUtils';
import { allImages } from '../assets';

/**
 * Test all image paths and report which ones load successfully and which fail
 * @returns {Promise} A promise that resolves when all tests are complete
 */
export const testAllImagePaths = () => {
  console.log('DEBUGGING: Testing all image paths...');
  
  // Collect all image paths
  const imagePaths = [
    ...getObjectSpanImages(),
    ...getEcologicalSpatialImages(),
    ...Object.values(allImages).map(path => fixImagePath(path))
  ];
  
  // Remove duplicates
  const uniquePaths = [...new Set(imagePaths)];
  
  console.log(`DEBUGGING: Testing ${uniquePaths.length} unique image paths`);
  
  return Promise.all(uniquePaths.map(path => {
    return new Promise(resolve => {
      const img = new Image();
      
      img.onload = () => {
        console.log(`DEBUGGING: ✅ Image loaded successfully: ${path}`);
        resolve({ path, success: true });
      };
      
      img.onerror = () => {
        console.error(`DEBUGGING: ❌ Failed to load image: ${path}`);
        resolve({ path, success: false });
      };
      
      img.src = path;
    });
  })).then(results => {
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    console.log(`DEBUGGING: Image loading test complete: ${successCount} succeeded, ${failCount} failed`);
    return results;
  });
};

// Function to log out all image paths for debugging
export const logAllImagePaths = () => {
  const objectImages = getObjectSpanImages();
  const ecoImages = getEcologicalSpatialImages();
  const assetImages = Object.values(allImages).map(path => fixImagePath(path));
  
  console.log('DEBUGGING: Object span images:', objectImages);
  console.log('DEBUGGING: Ecological spatial images:', ecoImages);
  console.log('DEBUGGING: Asset images:', assetImages);
  
  return {
    objectImages,
    ecoImages,
    assetImages,
    allPaths: [...objectImages, ...ecoImages, ...assetImages]
  };
};

// Add to window for debugging in the browser console
if (typeof window !== 'undefined') {
  window.imageDebugger = {
    testAllImagePaths,
    logAllImagePaths
  };
}

export default {
  testAllImagePaths,
  logAllImagePaths
}; 