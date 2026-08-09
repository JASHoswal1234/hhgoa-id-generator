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
 * Convert HEIC to JPEG using canvas (fallback)
 * In production, you might want to use a library like heic2any
 */
export async function convertHEICToJPEG(file: File): Promise<File> {
  // For now, attempt to load directly - modern browsers may support HEIC
  try {
    const img = await loadImage(file)
    
    // Create canvas and convert to JPEG
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')
    
    ctx.drawImage(img, 0, 0)
    
    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Blob conversion failed')),
        'image/jpeg',
        0.95
      )
    })
    
    return new File([blob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' })
  } catch (error) {
    console.error('HEIC conversion failed:', error)
    throw new Error('HEIC format not supported. Please use JPG or PNG.')
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
