// src/utils/placeholderImages.js
// This file can be used if you don't have actual images yet

export const createPlaceholderDataURL = (text, width, height, backgroundColor, textColor) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = backgroundColor || '#1e3c72';
    ctx.fillRect(0, 0, width, height);
    
    // Add text
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = textColor || '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width/2, height/2);
    
    return canvas.toDataURL('image/png');
  };
  
  // Example usage:
  // import { createPlaceholderDataURL } from '../utils/placeholderImages';
  // const eventLogo = createPlaceholderDataURL('EVENT LOGO', 200, 60, '#1e3c72', '#ffffff');