// Export all images from the counting directory
export const allImages = {
  counting: require.context('./counting', false, /\.(png|jpe?g|svg)$/),
};

export default allImages; 