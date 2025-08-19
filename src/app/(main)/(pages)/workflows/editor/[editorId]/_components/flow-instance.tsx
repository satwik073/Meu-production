'use client'
import { Button } from '@/components/ui/button'
import { useNodeConnections } from '@/providers/connections-provider'
import { useEditor } from '@/providers/editor-provider'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import {
  onCreateNodesEdges,
  onFlowPublish,
} from '../_actions/workflow-connections'
import { toast } from 'sonner'

type Props = {
  children: React.ReactNode
  edges: any[]
  nodes: any[]
}

const FlowInstance = ({ children, edges, nodes }: Props) => {
  const pathname = usePathname()
  const [isFlow, setIsFlow] = useState([])
  const { nodeConnection } = useNodeConnections()
  const { state } = useEditor()

  const onFlowAutomation = useCallback(async () => {
    console.log('🔍 Saving workflow with data:', {
      flowId: pathname.split('/').pop()!,
      elements: state.editor.elements,
      edges,
      isFlow
    })
    
    const flow = await onCreateNodesEdges(
      pathname.split('/').pop()!,
      JSON.stringify(state.editor.elements),
      JSON.stringify(edges),
      JSON.stringify(isFlow)
    )

    console.log('🔍 Save response:', flow)
    if (flow) toast.message(flow.message)
  }, [state.editor.elements, edges, isFlow, pathname])

  const onPublishWorkflow = useCallback(async () => {
    const response = await onFlowPublish(pathname.split('/').pop()!, true)
    if (response) toast.message(response)
  }, [pathname])

  const onAutomateFlow = async () => {
    const flows: any = []
    const connectedEdges = edges.map((edge) => edge.target)
    
    console.log('🔍 Analyzing flow:', { 
      connectedEdges, 
      elements: state.editor.elements,
      edges 
    })
    
    connectedEdges.map((target) => {
      state.editor.elements.map((node) => {
        if (node.id === target) {
          flows.push(node.type)
        }
      })
    })

    console.log('🔍 Detected flows:', flows)
    setIsFlow(flows)
  }

  useEffect(() => {
    onAutomateFlow()
  }, [edges, state.editor.elements])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 p-4">
        <Button
          onClick={onFlowAutomation}
          disabled={state.editor.elements.length === 0}
        >
          Save
        </Button>
        <Button
          disabled={isFlow.length < 1}
          onClick={onPublishWorkflow}
        >
          Publish
        </Button>
      </div>
      {children}
    </div>
  )
}

export default FlowInstance
