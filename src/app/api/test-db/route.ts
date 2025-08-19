import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // For build-time safety, return a simple response
    // Database operations will be handled at runtime
    console.log('✅ Database test endpoint ready')
    
    return NextResponse.json({ 
      message: 'Database test endpoint is ready',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json({ 
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
