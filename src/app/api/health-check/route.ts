import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Health check started')
    
    // For build-time safety, return a simple health status
    // Database and authentication checks will be handled at runtime
    const healthStatus = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      message: 'Health check endpoint is ready',
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    }
    
    console.log('✅ Health check completed:', healthStatus)
    
    return NextResponse.json(healthStatus)
  } catch (error) {
    console.error('❌ Health check failed:', error)
    return NextResponse.json({ 
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
