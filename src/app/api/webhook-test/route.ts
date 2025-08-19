import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('🔍 Webhook Test - Received body:', body)
    
    const { id, email_addresses, first_name, image_url } = body?.data || {}

    if (!id) {
      console.error('❌ No user ID found in webhook data')
      return new NextResponse('No user ID found', { status: 400 })
    }

    const email = email_addresses?.[0]?.email_address
    console.log('✅ Webhook Test - User ID:', id, 'Email:', email)

    if (!email) {
      console.error('❌ No email found for user:', id)
      return new NextResponse('No email found', { status: 400 })
    }

    // For build-time safety, we'll just return success without database operations
    // Database operations will be handled at runtime
    console.log('✅ Webhook test processed successfully')
    return new NextResponse('Webhook test processed successfully', {
      status: 200,
    })
  } catch (error) {
    console.error('❌ Error in webhook test:', error)
    return new NextResponse('Error processing webhook test', { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook test endpoint is working',
    timestamp: new Date().toISOString()
  })
}
