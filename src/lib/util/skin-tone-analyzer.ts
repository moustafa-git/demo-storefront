// Skin tone analysis utility
// This can be enhanced with AI services like Google Cloud Vision API, Azure Computer Vision, or custom ML models

export interface SkinToneResult {
  skinToneId: string
  confidence: number
  dominantColors: string[]
  undertone?: 'warm' | 'cool' | 'neutral' | 'olive'
  customColor?: string
}

export interface SkinToneOption {
  id: string
  name: string
  color: string
  description: string
  undertone: 'warm' | 'cool' | 'neutral' | 'olive'
}

export const SKIN_TONE_OPTIONS: SkinToneOption[] = [
  // Fitzpatrick Type I - Very Fair
  { id: "fitzpatrick-1a", name: "Very Fair - Type I", color: "#FFE5D4", description: "Very fair skin, always burns, never tans", undertone: 'cool' },
  { id: "fitzpatrick-1b", name: "Very Fair - Warm", color: "#FFDCC4", description: "Very fair skin with warm undertones", undertone: 'warm' },
  { id: "fitzpatrick-1c", name: "Very Fair - Neutral", color: "#FFE0C8", description: "Very fair skin with neutral undertones", undertone: 'neutral' },

  // Fitzpatrick Type II - Fair
  { id: "fitzpatrick-2a", name: "Fair - Cool", color: "#F4D4C3", description: "Fair skin that burns easily, tans minimally", undertone: 'cool' },
  { id: "fitzpatrick-2b", name: "Fair - Warm", color: "#F0C8A8", description: "Fair skin with golden undertones", undertone: 'warm' },
  { id: "fitzpatrick-2c", name: "Fair - Neutral", color: "#F2CEB3", description: "Fair skin with balanced undertones", undertone: 'neutral' },
  { id: "fitzpatrick-2d", name: "Fair - Olive", color: "#E8C4A0", description: "Fair skin with olive undertones", undertone: 'olive' },

  // Fitzpatrick Type III - Medium
  { id: "fitzpatrick-3a", name: "Medium - Cool", color: "#E8B894", description: "Medium skin that sometimes burns, tans gradually", undertone: 'cool' },
  { id: "fitzpatrick-3b", name: "Medium - Warm", color: "#E0A878", description: "Medium skin with warm golden undertones", undertone: 'warm' },
  { id: "fitzpatrick-3c", name: "Medium - Neutral", color: "#E4B086", description: "Medium skin with neutral undertones", undertone: 'neutral' },
  { id: "fitzpatrick-3d", name: "Medium - Olive", color: "#D8A670", description: "Medium skin with olive undertones", undertone: 'olive' },
  { id: "fitzpatrick-3e", name: "Medium - Beige", color: "#D4A67C", description: "Medium skin with beige undertones", undertone: 'warm' },

  // Fitzpatrick Type IV - Medium Dark
  { id: "fitzpatrick-4a", name: "Medium Dark - Cool", color: "#C88B5A", description: "Medium dark skin that rarely burns, tans easily", undertone: 'cool' },
  { id: "fitzpatrick-4b", name: "Medium Dark - Warm", color: "#C07A4A", description: "Medium dark skin with warm undertones", undertone: 'warm' },
  { id: "fitzpatrick-4c", name: "Medium Dark - Neutral", color: "#C48252", description: "Medium dark skin with neutral undertones", undertone: 'neutral' },
  { id: "fitzpatrick-4d", name: "Medium Dark - Olive", color: "#B87242", description: "Medium dark skin with olive undertones", undertone: 'olive' },
  { id: "fitzpatrick-4e", name: "Medium Dark - Golden", color: "#BE7A4A", description: "Medium dark skin with golden undertones", undertone: 'warm' },

  // Fitzpatrick Type V - Dark
  { id: "fitzpatrick-5a", name: "Dark - Cool", color: "#A05A2C", description: "Dark skin that very rarely burns, tans very easily", undertone: 'cool' },
  { id: "fitzpatrick-5b", name: "Dark - Warm", color: "#964A1C", description: "Dark skin with warm undertones", undertone: 'warm' },
  { id: "fitzpatrick-5c", name: "Dark - Neutral", color: "#9B5224", description: "Dark skin with neutral undertones", undertone: 'neutral' },
  { id: "fitzpatrick-5d", name: "Dark - Olive", color: "#8E4214", description: "Dark skin with olive undertones", undertone: 'olive' },
  { id: "fitzpatrick-5e", name: "Dark - Golden", color: "#945224", description: "Dark skin with golden undertones", undertone: 'warm' },

  // Fitzpatrick Type VI - Very Dark
  { id: "fitzpatrick-6a", name: "Very Dark - Cool", color: "#5D2E1A", description: "Very dark skin that never burns, always tans", undertone: 'cool' },
  { id: "fitzpatrick-6b", name: "Very Dark - Warm", color: "#54240A", description: "Very dark skin with warm undertones", undertone: 'warm' },
  { id: "fitzpatrick-6c", name: "Very Dark - Neutral", color: "#592912", description: "Very dark skin with neutral undertones", undertone: 'neutral' },
  { id: "fitzpatrick-6d", name: "Very Dark - Olive", color: "#4C1E02", description: "Very dark skin with olive undertones", undertone: 'olive' },

  // Von Luschan Scale Variations
  { id: "von-luschan-1", name: "Von Luschan 1", color: "#FFF5F0", description: "Extremely fair skin", undertone: 'cool' },
  { id: "von-luschan-2", name: "Von Luschan 2", color: "#FFE8D6", description: "Very fair skin", undertone: 'warm' },
  { id: "von-luschan-3", name: "Von Luschan 3", color: "#FFDCC4", description: "Fair skin", undertone: 'neutral' },
  { id: "von-luschan-4", name: "Von Luschan 4", color: "#F4D4C3", description: "Light skin", undertone: 'warm' },
  { id: "von-luschan-5", name: "Von Luschan 5", color: "#E8B894", description: "Medium light skin", undertone: 'neutral' },
  { id: "von-luschan-6", name: "Von Luschan 6", color: "#D4A67C", description: "Medium skin", undertone: 'warm' },
  { id: "von-luschan-7", name: "Von Luschan 7", color: "#C88B5A", description: "Medium dark skin", undertone: 'olive' },
  { id: "von-luschan-8", name: "Von Luschan 8", color: "#A05A2C", description: "Dark skin", undertone: 'warm' },
  { id: "von-luschan-9", name: "Von Luschan 9", color: "#8B4513", description: "Very dark skin", undertone: 'cool' },
  { id: "von-luschan-10", name: "Von Luschan 10", color: "#5D2E1A", description: "Extremely dark skin", undertone: 'neutral' },

  // Regional Variations
  { id: "nordic-fair", name: "Nordic Fair", color: "#FFF0E6", description: "Very fair skin common in Nordic regions", undertone: 'cool' },
  { id: "celtic-fair", name: "Celtic Fair", color: "#FFE8D6", description: "Fair skin with freckles, common in Celtic regions", undertone: 'warm' },
  { id: "mediterranean-olive", name: "Mediterranean Olive", color: "#D4A67C", description: "Medium skin with olive undertones", undertone: 'olive' },
  { id: "south-asian-golden", name: "South Asian Golden", color: "#C07A4A", description: "Medium dark skin with golden undertones", undertone: 'warm' },
  { id: "east-asian-fair", name: "East Asian Fair", color: "#F0C8A8", description: "Fair skin common in East Asian regions", undertone: 'neutral' },
  { id: "southeast-asian-golden", name: "Southeast Asian Golden", color: "#BE7A4A", description: "Medium skin with golden undertones", undertone: 'warm' },
  { id: "middle-eastern-olive", name: "Middle Eastern Olive", color: "#B87242", description: "Medium skin with olive undertones", undertone: 'olive' },
  { id: "north-african-golden", name: "North African Golden", color: "#C07A4A", description: "Medium dark skin with golden undertones", undertone: 'warm' },
  { id: "sub-saharan-dark", name: "Sub-Saharan Dark", color: "#8E4214", description: "Dark skin common in Sub-Saharan Africa", undertone: 'cool' },
  { id: "melanesian-dark", name: "Melanesian Dark", color: "#54240A", description: "Very dark skin common in Melanesia", undertone: 'warm' },

  // Undertone Variations
  { id: "cool-pink", name: "Cool Pink", color: "#FFE0C8", description: "Fair skin with cool pink undertones", undertone: 'cool' },
  { id: "warm-peach", name: "Warm Peach", color: "#F0C8A8", description: "Fair skin with warm peach undertones", undertone: 'warm' },
  { id: "neutral-beige", name: "Neutral Beige", color: "#F2CEB3", description: "Fair skin with neutral beige undertones", undertone: 'neutral' },
  { id: "olive-golden", name: "Olive Golden", color: "#D8A670", description: "Medium skin with olive-golden undertones", undertone: 'olive' },
  { id: "warm-golden", name: "Warm Golden", color: "#E0A878", description: "Medium skin with warm golden undertones", undertone: 'warm' },
  { id: "cool-ash", name: "Cool Ash", color: "#E8B894", description: "Medium skin with cool ash undertones", undertone: 'cool' },
  { id: "neutral-taupe", name: "Neutral Taupe", color: "#E4B086", description: "Medium skin with neutral taupe undertones", undertone: 'neutral' },
  { id: "warm-amber", name: "Warm Amber", color: "#C07A4A", description: "Medium dark skin with warm amber undertones", undertone: 'warm' },
  { id: "cool-charcoal", name: "Cool Charcoal", color: "#A05A2C", description: "Dark skin with cool charcoal undertones", undertone: 'cool' },
  { id: "neutral-ebony", name: "Neutral Ebony", color: "#9B5224", description: "Dark skin with neutral ebony undertones", undertone: 'neutral' },
  { id: "warm-mahogany", name: "Warm Mahogany", color: "#964A1C", description: "Dark skin with warm mahogany undertones", undertone: 'warm' },
  { id: "cool-jet", name: "Cool Jet", color: "#5D2E1A", description: "Very dark skin with cool jet undertones", undertone: 'cool' },
  { id: "neutral-obsidian", name: "Neutral Obsidian", color: "#592912", description: "Very dark skin with neutral obsidian undertones", undertone: 'neutral' },
  { id: "warm-ebony", name: "Warm Ebony", color: "#54240A", description: "Very dark skin with warm ebony undertones", undertone: 'warm' },

  // Special Variations
  { id: "albinism", name: "Albinism", color: "#FFF8F0", description: "Very light skin due to albinism", undertone: 'cool' },
  { id: "vitiligo-light", name: "Vitiligo Light", color: "#FFE8D6", description: "Light skin with vitiligo patches", undertone: 'neutral' },
  { id: "vitiligo-medium", name: "Vitiligo Medium", color: "#D4A67C", description: "Medium skin with vitiligo patches", undertone: 'neutral' },
  { id: "vitiligo-dark", name: "Vitiligo Dark", color: "#8E4214", description: "Dark skin with vitiligo patches", undertone: 'neutral' },
  { id: "freckled-fair", name: "Freckled Fair", color: "#FFE0C8", description: "Fair skin with prominent freckles", undertone: 'warm' },
  { id: "freckled-medium", name: "Freckled Medium", color: "#E8B894", description: "Medium skin with prominent freckles", undertone: 'warm' },
  { id: "sun-damaged-light", name: "Sun Damaged Light", color: "#F4D4C3", description: "Light skin with sun damage", undertone: 'warm' },
  { id: "sun-damaged-medium", name: "Sun Damaged Medium", color: "#C88B5A", description: "Medium skin with sun damage", undertone: 'warm' },
  { id: "sun-damaged-dark", name: "Sun Damaged Dark", color: "#A05A2C", description: "Dark skin with sun damage", undertone: 'warm' },

  // Mixed Heritage Variations
  { id: "mixed-light", name: "Mixed Light", color: "#F0C8A8", description: "Light skin with mixed heritage", undertone: 'neutral' },
  { id: "mixed-medium", name: "Mixed Medium", color: "#D4A67C", description: "Medium skin with mixed heritage", undertone: 'neutral' },
  { id: "mixed-dark", name: "Mixed Dark", color: "#C07A4A", description: "Medium dark skin with mixed heritage", undertone: 'neutral' },
  { id: "mixed-very-dark", name: "Mixed Very Dark", color: "#8E4214", description: "Dark skin with mixed heritage", undertone: 'neutral' },

  // Age-Related Variations
  { id: "mature-light", name: "Mature Light", color: "#F4D4C3", description: "Light skin showing signs of aging", undertone: 'neutral' },
  { id: "mature-medium", name: "Mature Medium", color: "#D4A67C", description: "Medium skin showing signs of aging", undertone: 'neutral' },
  { id: "mature-dark", name: "Mature Dark", color: "#A05A2C", description: "Dark skin showing signs of aging", undertone: 'neutral' },

  // Seasonal Variations
  { id: "winter-light", name: "Winter Light", color: "#FFE0C8", description: "Light skin in winter (less sun exposure)", undertone: 'cool' },
  { id: "summer-light", name: "Summer Light", color: "#F0C8A8", description: "Light skin in summer (more sun exposure)", undertone: 'warm' },
  { id: "winter-medium", name: "Winter Medium", color: "#E8B894", description: "Medium skin in winter", undertone: 'neutral' },
  { id: "summer-medium", name: "Summer Medium", color: "#D4A67C", description: "Medium skin in summer", undertone: 'warm' },
  { id: "winter-dark", name: "Winter Dark", color: "#A05A2C", description: "Dark skin in winter", undertone: 'cool' },
  { id: "summer-dark", name: "Summer Dark", color: "#8E4214", description: "Dark skin in summer", undertone: 'warm' },

  // Professional Makeup Industry Standards
  { id: "foundation-ivory", name: "Foundation Ivory", color: "#FFF0E6", description: "Very light foundation shade", undertone: 'cool' },
  { id: "foundation-porcelain", name: "Foundation Porcelain", color: "#FFE8D6", description: "Light foundation shade", undertone: 'neutral' },
  { id: "foundation-alabaster", name: "Foundation Alabaster", color: "#FFE0C8", description: "Fair foundation shade", undertone: 'warm' },
  { id: "foundation-vanilla", name: "Foundation Vanilla", color: "#F4D4C3", description: "Light foundation shade", undertone: 'warm' },
  { id: "foundation-bisque", name: "Foundation Bisque", color: "#E8B894", description: "Medium light foundation shade", undertone: 'neutral' },
  { id: "foundation-sand", name: "Foundation Sand", color: "#D4A67C", description: "Medium foundation shade", undertone: 'warm' },
  { id: "foundation-tan", name: "Foundation Tan", color: "#C88B5A", description: "Medium dark foundation shade", undertone: 'warm' },
  { id: "foundation-caramel", name: "Foundation Caramel", color: "#A05A2C", description: "Dark foundation shade", undertone: 'warm' },
  { id: "foundation-mocha", name: "Foundation Mocha", color: "#8E4214", description: "Very dark foundation shade", undertone: 'cool' },
  { id: "foundation-expresso", name: "Foundation Expresso", color: "#5D2E1A", description: "Darkest foundation shade", undertone: 'neutral' },

  // Ultra-Specific Variations
  { id: "ultra-fair-rosy", name: "Ultra Fair Rosy", color: "#FFF5F0", description: "Extremely fair skin with rosy undertones", undertone: 'cool' },
  { id: "ultra-fair-creamy", name: "Ultra Fair Creamy", color: "#FFF8F0", description: "Extremely fair skin with creamy undertones", undertone: 'neutral' },
  { id: "ultra-dark-blue", name: "Ultra Dark Blue", color: "#4C1E02", description: "Very dark skin with blue undertones", undertone: 'cool' },
  { id: "ultra-dark-red", name: "Ultra Dark Red", color: "#54240A", description: "Very dark skin with red undertones", undertone: 'warm' },

  // Custom Skin Tone (for AI-analyzed or user-defined skin tones)
  { id: "custom", name: "Custom Skin Tone", color: "#D4A67C", description: "Your unique skin tone", undertone: 'neutral' },
]

// Advanced skin tone analysis using native browser APIs
export const analyzeSkinTone = async (imageData: string): Promise<SkinToneResult> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        // Create canvas for analysis
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        // Get image data for analysis
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Sample points for skin tone analysis (focus on center area)
        const samplePoints = getSamplePoints(canvas.width, canvas.height)
        const skinColors: string[] = []
        const colorCounts: { [key: string]: number } = {}

        // Analyze each sample point
        samplePoints.forEach(point => {
          const index = (point.y * canvas.width + point.x) * 4
          const r = data[index]
          const g = data[index + 1]
          const b = data[index + 2]
          
          // Check if pixel is likely skin tone
          if (isLikelySkinTone(r, g, b)) {
            const color = rgbToHex(r, g, b)
            skinColors.push(color)
            colorCounts[color] = (colorCounts[color] || 0) + 1
          }
        })

        if (skinColors.length === 0) {
          // If no skin colors detected, use the center pixel
          const centerX = Math.floor(canvas.width / 2)
          const centerY = Math.floor(canvas.height / 2)
          const index = (centerY * canvas.width + centerX) * 4
          const r = data[index]
          const g = data[index + 1]
          const b = data[index + 2]
          const hexColor = rgbToHex(r, g, b)
          
          resolve({
            skinToneId: 'custom',
            confidence: 0.8,
            dominantColors: [hexColor],
            undertone: determineUndertone(r, g, b),
            customColor: hexColor
          })
          return
        }

        // Find dominant skin colors
        const sortedColors = Object.entries(colorCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([color]) => color)

        // Find the closest matching skin tone
        const bestMatch = findClosestSkinTone(sortedColors)
        
        // If the match is not very close, create a custom skin tone
        if (bestMatch.confidence < 0.7) {
          const primarySkinColor = sortedColors[0]
          resolve({
            skinToneId: 'custom',
            confidence: 0.9,
            dominantColors: sortedColors,
            undertone: determineUndertoneFromHex(primarySkinColor),
            customColor: primarySkinColor
          })
        } else {
          resolve({
            skinToneId: bestMatch.id,
            confidence: bestMatch.confidence,
            dominantColors: sortedColors,
            undertone: bestMatch.undertone
          })
        }
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageData
  })
}

// Helper functions for skin tone analysis
const getSamplePoints = (width: number, height: number) => {
  const points: { x: number, y: number }[] = []
  
  // Sample from center area (likely face) with multiple sampling strategies
  const centerX = width / 2
  const centerY = height / 2
  
  // Strategy 1: Circular sampling around center (face area)
  const faceRadius = Math.min(width, height) * 0.25
  for (let i = 0; i < 800; i++) {
    const angle = Math.random() * 2 * Math.PI
    const radius = Math.random() * faceRadius
    const x = Math.floor(centerX + radius * Math.cos(angle))
    const y = Math.floor(centerY + radius * Math.sin(angle))
    
    if (x >= 0 && x < width && y >= 0 && y < height) {
      points.push({ x, y })
    }
  }
  
  // Strategy 2: Grid sampling in upper center (likely face/neck area)
  const gridStartX = Math.max(0, centerX - width * 0.3)
  const gridEndX = Math.min(width, centerX + width * 0.3)
  const gridStartY = Math.max(0, centerY - height * 0.4)
  const gridEndY = Math.min(height, centerY + height * 0.2)
  
  const gridStep = Math.max(5, Math.min(width, height) / 50)
  
  for (let x = gridStartX; x < gridEndX; x += gridStep) {
    for (let y = gridStartY; y < gridEndY; y += gridStep) {
      if (Math.random() < 0.3) { // 30% chance to sample each grid point
        points.push({ x: Math.floor(x), y: Math.floor(y) })
      }
    }
  }
  
  // Strategy 3: Random sampling across entire image (fallback)
  for (let i = 0; i < 200; i++) {
    const x = Math.floor(Math.random() * width)
    const y = Math.floor(Math.random() * height)
    points.push({ x, y })
  }
  
  return points
}

const isLikelySkinTone = (r: number, g: number, b: number): boolean => {
  // Enhanced skin tone detection algorithm
  // Based on comprehensive skin tone research and color theory
  
  // Check if red is dominant (typical for skin)
  if (r < g || r < b) return false
  
  // Check if values are in reasonable skin tone range
  if (r < 80 || r > 255) return false
  if (g < 40 || g > 220) return false
  if (b < 20 || b > 180) return false
  
  // Check for reasonable ratios (skin tones have specific RGB relationships)
  const redGreenRatio = r / g
  const redBlueRatio = r / b
  const greenBlueRatio = g / b
  
  // Enhanced skin tone ratio checks
  if (redGreenRatio < 1.05 || redGreenRatio > 3.0) return false
  if (redBlueRatio < 1.3 || redBlueRatio > 5.0) return false
  
  // Additional checks for more accurate detection
  // Skin tones should have reasonable saturation
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const saturation = (max - min) / max
  
  if (saturation < 0.1 || saturation > 0.8) return false
  
  // Check for reasonable brightness
  const brightness = (r + g + b) / 3
  if (brightness < 40 || brightness > 220) return false
  
  return true
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

const hexToRgb = (hex: string): { r: number, g: number, b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

const colorDistance = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  // Calculate Euclidean distance in RGB space
  const dr = rgb1.r - rgb2.r
  const dg = rgb1.g - rgb2.g
  const db = rgb1.b - rgb2.b
  
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

const findClosestSkinTone = (skinColors: string[]): { id: string, confidence: number, undertone: 'warm' | 'cool' | 'neutral' | 'olive' } => {
  let bestMatch = SKIN_TONE_OPTIONS[0]
  let bestDistance = Infinity
  let totalDistance = 0
  
  // Calculate average distance to each skin tone option
  SKIN_TONE_OPTIONS.forEach(tone => {
    let totalToneDistance = 0
    skinColors.forEach(color => {
      totalToneDistance += colorDistance(color, tone.color)
    })
    const avgDistance = totalToneDistance / skinColors.length
    
    if (avgDistance < bestDistance) {
      bestDistance = avgDistance
      bestMatch = tone
    }
    
    totalDistance += avgDistance
  })
  
  // Calculate confidence based on how close the match is
  const avgDistance = totalDistance / SKIN_TONE_OPTIONS.length
  const confidence = Math.max(0.5, Math.min(0.95, 1 - (bestDistance / avgDistance)))
  
  return {
    id: bestMatch.id,
    confidence,
    undertone: bestMatch.undertone
  }
}

// Determine undertone from RGB values
const determineUndertone = (r: number, g: number, b: number): 'warm' | 'cool' | 'neutral' | 'olive' => {
  // Calculate ratios for undertone determination
  const redGreenRatio = r / g
  const redBlueRatio = r / b
  const greenBlueRatio = g / b
  
  // Warm undertones typically have higher red values
  if (redGreenRatio > 1.3 && redBlueRatio > 2.0) {
    return 'warm'
  }
  
  // Cool undertones typically have more balanced ratios
  if (redGreenRatio < 1.1 && redBlueRatio < 1.8) {
    return 'cool'
  }
  
  // Olive undertones have higher green values
  if (greenBlueRatio > 1.2 && redGreenRatio < 1.2) {
    return 'olive'
  }
  
  // Neutral undertones have balanced ratios
  return 'neutral'
}

// Determine undertone from hex color
const determineUndertoneFromHex = (hexColor: string): 'warm' | 'cool' | 'neutral' | 'olive' => {
  const rgb = hexToRgb(hexColor)
  return determineUndertone(rgb.r, rgb.g, rgb.b)
}

// Dynamic ColorThief import for browser compatibility
const getColorThief = async () => {
  if (typeof window !== 'undefined') {
    const ColorThief = (await import('colorthief')).default
    return ColorThief
  }
  return null
}

// Enhanced AI-powered analysis (for future implementation)
export const analyzeSkinToneWithAI = async (imageData: string): Promise<SkinToneResult> => {
  // This would integrate with AI services like:
  // - Google Cloud Vision API
  // - Azure Computer Vision
  // - AWS Rekognition
  // - Custom ML model
  
  try {
    // Example API call structure:
    /*
    const response = await fetch('/api/skin-tone-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageData,
        analysisType: 'skin_tone'
      })
    })
    
    const result = await response.json()
    return result
    */
    
    // For now, use the real analysis algorithm
    return analyzeSkinTone(imageData)
  } catch (error) {
    console.error('AI analysis failed, falling back to basic analysis:', error)
    return analyzeSkinTone(imageData)
  }
}

// Get skin tone by ID
export const getSkinToneById = (id: string): SkinToneOption | undefined => {
  return SKIN_TONE_OPTIONS.find(tone => tone.id === id)
}

// Get recommended clothing colors based on skin tone
export const getRecommendedColors = (skinToneId: string): string[] => {
  const tone = getSkinToneById(skinToneId)
  if (!tone) return []
  
  const colorRecommendations: Record<string, string[]> = {
    'very-light': ['#000000', '#2C3E50', '#8E44AD', '#E74C3C', '#F39C12'],
    'light': ['#34495E', '#8E44AD', '#E67E22', '#D35400', '#C0392B'],
    'medium-light': ['#2C3E50', '#8E44AD', '#E67E22', '#F39C12', '#F1C40F'],
    'medium': ['#34495E', '#8E44AD', '#E74C3C', '#F39C12', '#F1C40F'],
    'medium-dark': ['#ECF0F1', '#BDC3C7', '#95A5A6', '#7F8C8D', '#34495E'],
    'dark': ['#ECF0F1', '#BDC3C7', '#95A5A6', '#F1C40F', '#F39C12'],
    'very-dark': ['#ECF0F1', '#BDC3C7', '#95A5A6', '#F1C40F', '#E67E22'],
  }
  
  return colorRecommendations[skinToneId] || []
}

// Validate skin tone ID
export const isValidSkinTone = (id: string): boolean => {
  return SKIN_TONE_OPTIONS.some(tone => tone.id === id)
} 