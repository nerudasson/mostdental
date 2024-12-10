export async function validateAndProcessImage(file: File): Promise<{ 
  valid: boolean; 
  error?: string;
  processedFile?: File;
}> {
  // Check if file is actually an image
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File is not an image' };
  }

  try {
    // Create a new promise that resolves with the image data
    const imageLoadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = URL.createObjectURL(file);
    });

    // Wait for image to load
    await imageLoadPromise;

    // If we get here, the image is valid
    // You could add additional processing here if needed
    // For example, resizing, compression, etc.

    return { valid: true, processedFile: file };
  } catch (error) {
    return { valid: false, error: 'Invalid or corrupted image file' };
  }
}