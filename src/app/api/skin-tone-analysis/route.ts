import { NextRequest, NextResponse } from 'next/server'
import { analyzeSkinTone } from '@lib/util/skin-tone-analyzer'

export async function POST(request: NextRequest) {
  try {
    const { image, analysisType } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      )
    }

    if (analysisType !== 'skin_tone') {
      return NextResponse.json(
        { error: 'Invalid analysis type' },
        { status: 400 }
      )
    }

    // Analyze the skin tone
    const result = await analyzeSkinTone(image)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Skin tone analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
} 