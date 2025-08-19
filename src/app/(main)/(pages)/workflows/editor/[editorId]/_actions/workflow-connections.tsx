'use server'

import { db } from '@/lib/db'

export const onCreateNodesEdges = async (
  flowId: string,
  nodes: string,
  edges: string,
  flowPath: string
) => {
  try {
    console.log('🔍 Saving workflow data:', { flowId, nodes, edges, flowPath })
    
    const flow = await db.workflows.update({
      where: {
        id: flowId,
      },
      data: {
        nodes,
        edges,
        flowPath: flowPath,
      },
    })

    console.log('✅ Workflow saved successfully:', flow)
    if (flow) return { message: 'flow saved' }
    return { message: 'Failed to save workflow' }
  } catch (error) {
    console.error('❌ Error saving workflow:', error)
    return { message: 'Error saving workflow' }
  }
}

export const onFlowPublish = async (workflowId: string, state: boolean) => {
  console.log(state)
  const published = await db.workflows.update({
    where: {
      id: workflowId,
    },
    data: {
      publish: state,
    },
  })

  if (published.publish) return 'Workflow published'
  return 'Workflow unpublished'
}
