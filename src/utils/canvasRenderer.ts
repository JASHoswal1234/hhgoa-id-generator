/**
 * Canvas Renderer for Builder Pass and Builder Identity
 * 
 * Generates high-quality PNG images client-side
 * 
 * DYNAMIC FRAME SYSTEM: Photo frame adapts to uploaded photo's aspect ratio
 */

import { getPhotoCropDimensions } from './imageProcessing'
import builderPassTemplateSrc from '../assets/generator/builder-pass-template-trial.png'

export interface BuilderPassData {
  photo: HTMLImageElement
  name: string
  stack: string
  builderTitle: string
  zoom?: number
}

export interface BuilderIdentityData {
  photo: HTMLImageElement
}

/**
 * Polyfill for roundRect (not available in all browsers)
 */
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius)
  } else {
    // Fallback for browsers without roundRect support
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.arcTo(x + width, y, x + width, y + radius, radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
    ctx.lineTo(x + radius, y + height)
    ctx.arcTo(x, y + height, x, y + height - radius, radius)
    ctx.lineTo(x, y + radius)
    ctx.arcTo(x, y, x + radius, y, radius)
    ctx.closePath()
  }
}

/**
 * Template cache for performance optimization
 * Prevents reloading the template image on every generation
 */
let cachedTemplate: HTMLImageElement | null = null
let templateLoadingPromise: Promise<HTMLImageElement> | null = null

/**
 * Wait for all images to load
 */
async function loadAssetImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load: ${src}`))
    img.src = src
  })
}

/**
 * Load and cache the Builder Pass template
 * Uses singleton pattern to ensure only one load operation at a time
 */
async function loadTemplate(): Promise<HTMLImageElement> {
  // Return cached template if available
  if (cachedTemplate) {
    return cachedTemplate
  }
  
  // If already loading, return the existing promise
  if (templateLoadingPromise) {
    return templateLoadingPromise
  }
  
  // Start loading and cache the promise
  templateLoadingPromise = loadAssetImage(builderPassTemplateSrc)
  
  try {
    cachedTemplate = await templateLoadingPromise
    return cachedTemplate
  } finally {
    // Clear the loading promise once resolved or rejected
    templateLoadingPromise = null
  }
}

/**
 * Generate unique Builder ID
 * EXPORTED so it can be generated immediately on button click
 */
export function generateBuilderId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = ''
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `HHG-${id}`
}

/**
 * Render Builder Pass to canvas using finalized template
 * 
 * The template is the base - we only overlay user data
 * 
 * CRITICAL: All coordinates are measured from the actual template image
 * Template dimensions: Inspect builder-pass-template.png for exact values
 * 
 * @param builderId - Pre-generated Builder ID (generated immediately on button click)
 */
export async function renderBuilderPass(
  data: BuilderPassData,
  builderId: string,
  _logoSrc?: string
): Promise<HTMLCanvasElement> {
  // Load the finalized template FIRST (uses cache for speed)
  const template = await loadTemplate()
  
  // Use template's NATIVE dimensions - no scaling
  const width = template.naturalWidth || template.width
  const height = template.naturalHeight || template.height
  
  // High DPI rendering
  const dpr = window.devicePixelRatio || 1
  
  const canvas = document.createElement('canvas')
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')
  
  ctx.scale(dpr, dpr)
  
  // LAYER 1: Draw the template as absolute base
  ctx.drawImage(template, 0, 0, width, height)
  
  // MEASURED COORDINATES from the actual template
  // Template dimensions: 1122px × 1402px
  
  // Photo area container - the blank space where we'll draw dynamic frame + photo
  // This defines the MAXIMUM bounds for the photo area
  const photoContainer = {
    x: width * 0.20,       // Left edge - moved more inward (was 0.15)
    y: height * 0.26,      // Top edge - clears title
    width: width * 0.60,   // Maximum width - reduced (was 0.70)
    height: height * 0.28, // Maximum height - reduced (was 0.32)
  }
  
  // Calculate dynamic frame dimensions based on photo aspect ratio
  const photoAspect = data.photo.width / data.photo.height
  
  let frameWidth, frameHeight
  
  // Determine frame size - adapt to photo while staying within container
  if (photoAspect >= 1.2) {
    // Landscape photo (wider) - use full width, calculate height
    frameWidth = photoContainer.width
    frameHeight = frameWidth / photoAspect
    
    // If too tall, constrain by height instead
    if (frameHeight > photoContainer.height) {
      frameHeight = photoContainer.height
      frameWidth = frameHeight * photoAspect
    }
  } else if (photoAspect <= 0.8) {
    // Portrait photo (taller) - favor height, calculate width
    frameHeight = photoContainer.height
    frameWidth = frameHeight * photoAspect
    
    // If too narrow, increase size while maintaining aspect
    const minWidth = photoContainer.width * 0.50
    if (frameWidth < minWidth) {
      frameWidth = minWidth
      frameHeight = frameWidth / photoAspect
      // Re-constrain if needed
      if (frameHeight > photoContainer.height) {
        frameHeight = photoContainer.height
        frameWidth = frameHeight * photoAspect
      }
    }
  } else {
    // Square-ish photo (0.8 to 1.2 ratio) - use balanced approach
    const targetSize = Math.min(photoContainer.width * 0.85, photoContainer.height)
    frameHeight = targetSize
    frameWidth = frameHeight * photoAspect
    
    // Ensure it fits
    if (frameWidth > photoContainer.width) {
      frameWidth = photoContainer.width
      frameHeight = frameWidth / photoAspect
    }
  }
  
  // Center the frame within the container
  const frameX = photoContainer.x + (photoContainer.width - frameWidth) / 2
  const frameY = photoContainer.y + (photoContainer.height - frameHeight) / 2
  
  // Name area - ON the first horizontal line
  const nameArea = {
    x: width * 0.50,        // centered horizontally
    y: height * 0.605       // 60.5% - slightly up on the first line
  }
  
  // Role area - ON the second horizontal line
  const roleArea = {
    x: width * 0.50,        // centered horizontally
    y: height * 0.665       // 66.5% - ON the second line
  }
  
  // Builder ID area - left-aligned under "BUILDER ID" heading
  const builderIdArea = {
    x: width * 0.13,        // more to the left, under heading
    y: height * 0.860       // 86% - above barcode, below label
  }
  
  // LAYER 2: Draw dynamic frame with thin black border + yellow bottom accent
  const frameBorderWidth = width * 0.004  // Thin frame border (was 0.010)
  const frameRadius = width * 0.012
  const yellowAccentHeight = width * 0.006  // Yellow accent strip on bottom
  
  // Draw main black frame border
  ctx.save()
  ctx.strokeStyle = '#1a3a2e'  // Dark green/black
  ctx.lineWidth = frameBorderWidth
  ctx.beginPath()
  drawRoundRect(ctx, frameX, frameY, frameWidth, frameHeight, frameRadius)
  ctx.stroke()
  ctx.restore()
  
  // Draw yellow accent on bottom edge only
  ctx.save()
  ctx.fillStyle = '#FEE101'  // Bright yellow
  
  // Bottom edge rectangle (inset slightly from corners to avoid rounded corner area)
  const accentX = frameX + frameRadius
  const accentY = frameY + frameHeight - yellowAccentHeight - frameBorderWidth / 2
  const accentWidth = frameWidth - (frameRadius * 2)
  
  ctx.fillRect(accentX, accentY, accentWidth, yellowAccentHeight)
  ctx.restore()
  
  // Photo area - INNER bounds (inside the frame border)
  const photoArea = {
    x: frameX + frameBorderWidth,
    y: frameY + frameBorderWidth,
    width: frameWidth - (frameBorderWidth * 2),
    height: frameHeight - (frameBorderWidth * 2),
  }
  
  // LAYER 3: Draw user photo ONLY inside photo area with clipping
  // Photo fills the frame completely (no object-cover needed, frame matches photo aspect)
  const zoom = data.zoom || 1
  
  // Photo fills frame exactly - frame is already sized to photo aspect
  const renderWidth = photoArea.width * zoom
  const renderHeight = photoArea.height * zoom
  
  // Center the photo in the frame
  const renderX = photoArea.x + (photoArea.width - renderWidth) / 2
  const renderY = photoArea.y + (photoArea.height - renderHeight) / 2
  
  // Apply clipping path BEFORE drawing
  ctx.save()
  ctx.beginPath()
  
  // Create rounded rectangle clipping path for photo area
  const photoRadius = width * 0.010
  drawRoundRect(ctx, photoArea.x, photoArea.y, photoArea.width, photoArea.height, photoRadius)
  ctx.clip()
  
  // Draw the photo - it will be clipped to the frame
  ctx.drawImage(
    data.photo,
    renderX,
    renderY,
    renderWidth,
    renderHeight
  )
  
  ctx.restore()
  
  // LAYER 4: Draw name
  ctx.fillStyle = '#1a3a2e'
  ctx.font = `700 ${width * 0.045}px "Fraunces", serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Handle long names by measuring and shrinking if needed
  let nameFontSize = width * 0.045
  ctx.font = `700 ${nameFontSize}px "Fraunces", serif`
  let nameWidth = ctx.measureText(data.name.toUpperCase()).width
  const maxNameWidth = width * 0.70
  
  if (nameWidth > maxNameWidth) {
    nameFontSize = (nameFontSize * maxNameWidth) / nameWidth
    ctx.font = `700 ${nameFontSize}px "Fraunces", serif`
  }
  
  ctx.fillText(data.name.toUpperCase(), nameArea.x, nameArea.y)
  
  // LAYER 5: Draw role
  ctx.fillStyle = '#40584d'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Handle long roles by measuring and shrinking if needed
  let roleFontSize = width * 0.032
  ctx.font = `500 ${roleFontSize}px "Work Sans", sans-serif`
  let roleWidth = ctx.measureText(data.stack).width
  const maxRoleWidth = width * 0.65
  
  if (roleWidth > maxRoleWidth) {
    roleFontSize = (roleFontSize * maxRoleWidth) / roleWidth
    ctx.font = `500 ${roleFontSize}px "Work Sans", sans-serif`
  }
  
  ctx.fillText(data.stack, roleArea.x, roleArea.y)
  
  // LAYER 6: Draw Builder ID (pre-generated, passed as parameter)
  ctx.fillStyle = '#1a3a2e'
  ctx.font = `600 ${width * 0.025}px "Work Sans", sans-serif`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(builderId, builderIdArea.x, builderIdArea.y)
  
  return canvas
}

/**
 * Render Builder Identity (PFP frame) to canvas
 */
export async function renderBuilderIdentity(
  data: BuilderIdentityData,
  frameSrc?: string
): Promise<HTMLCanvasElement> {
  const dpr = window.devicePixelRatio || 1
  const size = 1200 // Square output for profile picture
  
  const canvas = document.createElement('canvas')
  canvas.width = size * dpr
  canvas.height = size * dpr
  canvas.style.width = `${size}px`
  canvas.style.height = `${size}px`
  
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')
  
  ctx.scale(dpr, dpr)
  
  // Draw photo - centered and cropped to square
  const crop = getPhotoCropDimensions(
    data.photo.width,
    data.photo.height,
    size,
    size
  )
  
  ctx.drawImage(
    data.photo,
    0,
    0,
    data.photo.width,
    data.photo.height,
    crop.x,
    crop.y,
    crop.width,
    crop.height
  )
  
  // Draw frame overlay if provided
  if (frameSrc) {
    try {
      const frame = await loadAssetImage(frameSrc)
      ctx.drawImage(frame, 0, 0, size, size)
    } catch (error) {
      // If frame fails, draw simple border
      console.warn('Failed to load frame, using default border:', error)
      ctx.strokeStyle = '#1a3a2e'
      ctx.lineWidth = 20
      ctx.strokeRect(10, 10, size - 20, size - 20)
    }
  }
  
  return canvas
}

/**
 * Convert canvas to downloadable blob
 */
export async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
      'image/png',
      1.0
    )
  })
}

/**
 * Download canvas as PNG
 */
export async function downloadCanvas(canvas: HTMLCanvasElement, filename: string): Promise<void> {
  const blob = await canvasToBlob(canvas)
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
  
  // Cleanup
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
