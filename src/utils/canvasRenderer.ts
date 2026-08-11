/**
 * Canvas Renderer for Builder Pass and Builder Identity
 * 
 * Generates high-quality PNG images client-side
 */

import { getPhotoCropDimensions } from './imageProcessing'
import builderPassTemplateSrc from '../assets/generator/builder-pass-template.png'

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
 * Generate unique Builder ID
 */
function generateBuilderId(): string {
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
 */
export async function renderBuilderPass(
  data: BuilderPassData,
  _logoSrc?: string
): Promise<HTMLCanvasElement> {
  // Load the finalized template FIRST
  const template = await loadAssetImage(builderPassTemplateSrc)
  
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
  
  // Photo area - INNER bounds only (excluding the frame border/shadow)
  // The yellow shadow/frame is part of the template - photo goes INSIDE
  // Using exact pixel measurements from template inspection
  const photoArea = {
  x: width * 0.352,
  y: height * 0.252,
  width: width * 0.29,
  height: height * 0.30,
}
  
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
  
  // LAYER 2: Draw user photo ONLY inside photo area with clipping
  // Use TRUE object-cover behavior - scale to fill, crop excess
  const zoom = data.zoom || 1
  
  // Calculate dimensions to FILL the frame completely (object-cover)
  const photoAspect = data.photo.width / data.photo.height
  const frameAspect = photoArea.width / photoArea.height
  
  let renderWidth, renderHeight
  
  if (photoAspect > frameAspect) {
    // Photo is wider than frame - fit to HEIGHT, crop width
    renderHeight = photoArea.height * zoom
    renderWidth = renderHeight * photoAspect
  } else {
    // Photo is taller than frame - fit to WIDTH, crop height
    renderWidth = photoArea.width * zoom
    renderHeight = renderWidth / photoAspect
  }
  
  // Center the photo in the frame
  const renderX = photoArea.x + (photoArea.width - renderWidth) / 2
  const renderY = photoArea.y + (photoArea.height - renderHeight) / 2
  
  // Apply clipping path BEFORE drawing
  ctx.save()
  ctx.beginPath()
  
  // Create rounded rectangle clipping path
  const radius = width * 0.012
  const px = photoArea.x
  const py = photoArea.y
  const pw = photoArea.width
  const ph = photoArea.height
  
  ctx.moveTo(px + radius, py)
  ctx.lineTo(px + pw - radius, py)
  ctx.arcTo(px + pw, py, px + pw, py + radius, radius)
  ctx.lineTo(px + pw, py + ph - radius)
  ctx.arcTo(px + pw, py + ph, px + pw - radius, py + ph, radius)
  ctx.lineTo(px + radius, py + ph)
  ctx.arcTo(px, py + ph, px, py + ph - radius, radius)
  ctx.lineTo(px, py + radius)
  ctx.arcTo(px, py, px + radius, py, radius)
  ctx.closePath()
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
  
  // LAYER 3: Draw name
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
  
  // LAYER 4: Draw role
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
  
  // LAYER 5: Draw Builder ID
  const builderId = generateBuilderId()
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
