import { NextRequest, NextResponse } from 'next/server'
import { getWorkflowFromDatabase } from '@/lib/queries'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workflowId = searchParams.get('id')
    
    if (!workflowId) {
      return NextResponse.json({ error: 'Workflow ID is required' }, { status: 400 })
    }
    
    const result = await getWorkflowFromDatabase(workflowId)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        workflow: result.workflow 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('❌ Error in test-workflow API:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
