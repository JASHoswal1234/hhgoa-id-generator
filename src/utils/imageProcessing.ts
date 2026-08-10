/**
 * Image Processing Utilities
 * 
 * Handles:
 * - HEIC conversion
 * - Image loading
 * - Canvas rendering
 * - Format conversion
 */

/**
 * Load an image file and return as HTMLImageElement
 */
export async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Check if file is HEIC format
 */
export function isHEIC(file: File): boolean {
  return file.type === 'image/heic' || 
         file.type === 'image/heif' || 
         file.name.toLowerCase().endsWith('.heic') ||
         file.name.toLowerCase().endsWith('.heif')
}

/**
 * Convert HEIC to JPEG using heic2any library
 */
export async function convertHEICToJPEG(file: File): Promise<File> {
  try {
    // Dynamically import heic2any to avoid loading it for JPG/PNG uploads
    const heic2any = await import('heic2any')
    
    // Convert HEIC to JPEG
    const convertedBlob = await heic2any.default({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.92
    })
    
    // heic2any can return Blob or Blob[], normalize to single Blob
    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
    
    if (!blob) {
      throw new Error('Conversion failed to produce a valid image')
    }
    
    // Create a new File from the converted Blob
    const fileName = file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg')
    return new File([blob], fileName, { type: 'image/jpeg' })
  } catch (error) {
    console.error('HEIC conversion failed:', error)
    throw new Error('Couldn\'t process this HEIC photo. Please try another image.')
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif']
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (!validTypes.includes(file.type) && !isHEIC(file)) {
    return { valid: false, error: 'Please upload a JPG, PNG, or HEIC image.' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image too large. Maximum size is 10MB.' }
  }
  
  return { valid: true }
}

/**
 * Get optimal crop dimensions for photo in card
 */
export function getPhotoCropDimensions(
  imgWidth: number,
  imgHeight: number,
  targetWidth: number,
  targetHeight: number
): { x: number; y: number; width: number; height: number; scale: number } {
  const imgAspect = imgWidth / imgHeight
  const targetAspect = targetWidth / targetHeight
  
  let scale: number
  let width: number
  let height: number
  
  if (imgAspect > targetAspect) {
    // Image is wider - fit to height
    scale = targetHeight / imgHeight
    width = imgWidth * scale
    height = targetHeight
  } else {
    // Image is taller - fit to width
    scale = targetWidth / imgWidth
    width = targetWidth
    height = imgHeight * scale
  }
  
  // Center the crop
  const x = (targetWidth - width) / 2
  const y = (targetHeight - height) / 2
  
  return { x, y, width, height, scale }
}
