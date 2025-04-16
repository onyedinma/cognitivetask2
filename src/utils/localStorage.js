// Utility function to set localStorage items and dispatch a custom event
export const setLocalStorageItem = (key, value) => {
  localStorage.setItem(key, value);
  // Dispatch custom event for same-tab changes
  window.dispatchEvent(new Event('localStorageChange'));
};

// Utility function to clear localStorage and dispatch a custom event
export const clearLocalStorage = () => {
  localStorage.clear();
  // Dispatch custom event for same-tab changes
  window.dispatchEvent(new Event('localStorageChange'));
}; 