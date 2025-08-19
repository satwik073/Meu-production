import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // For build-time safety, return a simple response
    // Google API operations will be handled at runtime
    console.log('✅ Drive endpoint ready')
    
    return Response.json(
      {
        message: 'Drive endpoint is ready',
        timestamp: new Date().toISOString()
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return Response.json(
      {
        message: 'Drive endpoint error',
      },
      {
        status: 500,
      }
    )
  }
}
