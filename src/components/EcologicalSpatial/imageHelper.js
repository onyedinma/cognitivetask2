/**
 * Helper functions for working with ecological spatial images
 */
import { ecologicalImages } from '../../assets';
import { fixImagePath } from '../../utils/imageUtils';

/**
 * Get all ecological spatial image paths with proper formatting
 */
export const getScenePaths = () => {
  return Object.values(ecologicalImages).map(path => fixImagePath(path));
};

/**
 * Get a specific ecological scene by index
 * @param {number} index - Index of the scene to get
 * @returns {string} - Path to the scene image
 */
export const getSceneByIndex = (index) => {
  const scenes = Object.values(ecologicalImages);
  const scene = scenes[index % scenes.length] || scenes[0];
  return fixImagePath(scene);
};

/**
 * Get a random ecological scene
 * @returns {string} - Path to a random scene image
 */
export const getRandomScene = () => {
  const scenes = Object.values(ecologicalImages);
  const randomIndex = Math.floor(Math.random() * scenes.length);
  return fixImagePath(scenes[randomIndex]);
};

// Export the scene paths for direct access
export const scenePaths = getScenePaths();

export default {
  getScenePaths,
  getSceneByIndex,
  getRandomScene,
  scenePaths
}; 