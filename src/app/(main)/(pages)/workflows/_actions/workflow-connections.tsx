'use server'
import { Option } from '@/components/ui/multiple-selector'
import { db, ensureDbConnection } from '@/lib/db'
import { auth, currentUser } from '@clerk/nextjs'

export const getGoogleListener = async () => {
  try {
    await ensureDbConnection()
    const { userId } = auth()
    console.log('userId:', userId)

    if (userId) {
      const listener = await db.user.findUnique({
        where: {
          clerkId: userId,
        },
        select: {
          googleResourceId: true,
        },
      })

      if (listener) return listener
    }
  } catch (error) {
    console.error('❌ Error getting Google listener:', error)
    return null
  }
}

export const onFlowPublish = async (workflowId: string, state: boolean) => {
  try {
    await ensureDbConnection()
    const response = await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        publish: state,
      },
    })

    if (response) return { message: 'workflow published' }
    return { message: 'Oops! try again' }
  } catch (error) {
    console.error('❌ Error publishing workflow:', error)
    return { message: 'Error publishing workflow' }
  }
}

export const onCreateNodeTemplate = async (
  type: string,
  content: string,
  workflowId: string,
  accessToken?: string,
  notionDbId?: string,
  channels?: Option[]
) => {
  try {
    await ensureDbConnection()
    
    if (type === 'Discord') {
      const response = await db.workflows.update({
        where: {
          id: workflowId,
        },
        data: {
          discordTemplate: content,
        },
      })

      if (response) return 'Discord template saved'
    }

    if (type === 'Slack') {
      if (channels && channels.length > 0) {
        const channelList = await db.workflows.findUnique({
          where: {
            id: workflowId,
          },
          select: {
            slackChannels: true,
          },
        })

        //remove duplicates before insert
        const NonDuplicated = channelList?.slackChannels?.filter(
          (channel) => channel !== channels![0].value
        ) || []

        for (const channel of NonDuplicated) {
          await db.workflows.update({
            where: {
              id: workflowId,
            },
            data: {
              slackChannels: {
                push: channel,
              },
            },
          })
        }

        return 'Slack template saved'
      }
      
      for (const channel of channels || []) {
        await db.workflows.update({
          where: {
            id: workflowId,
          },
          data: {
            slackChannels: {
              push: channel.value,
            },
          },
        })
      }
      return 'Slack template saved'
    }

    if (type === 'Notion') {
      const response = await db.workflows.update({
        where: {
          id: workflowId,
        },
        data: {
          notionTemplate: content,
          notionAccessToken: accessToken,
          notionDbId: notionDbId,
        },
      })

      if (response) return 'Notion template saved'
    }
  } catch (error) {
    console.error('❌ Error creating node template:', error)
    return 'Error saving template'
  }
}

export const onGetWorkflows = async () => {
  try {
    await ensureDbConnection()
    const user = await currentUser()
    if (user) {
      console.log('🔍 Getting workflows for user:', user.id)
      
      const workflow = await db.workflows.findMany({
        where: {
          userId: user.id,
        },
      })

      console.log('🔍 Retrieved workflows:', workflow)
      if (workflow) return workflow
    }
    return []
  } catch (error) {
    console.error('❌ Error getting workflows:', error)
    return []
  }
}

export const onCreateWorkflow = async (name: string, description: string) => {
  try {
    await ensureDbConnection()
    const user = await currentUser()

    if (user) {
      console.log('🔍 Creating workflow for user:', user.id)
      
      //create new workflow
      const workflow = await db.workflows.create({
        data: {
          userId: user.id,
          name,
          description,
        },
      })

      console.log('✅ Workflow created successfully:', workflow)
      if (workflow) return { message: 'workflow created', workflowId: workflow.id }
      return { message: 'Oops! try again' }
    }
    return { message: 'User not found' }
  } catch (error) {
    console.error('❌ Error creating workflow:', error)
    return { message: 'Error creating workflow' }
  }
}

export const onGetNodesEdges = async (flowId: string) => {
  try {
    await ensureDbConnection()
    const nodesEdges = await db.workflows.findUnique({
      where: {
        id: flowId,
      },
      select: {
        nodes: true,
        edges: true,
      },
    })
    
    console.log('🔍 Retrieved workflow data:', { flowId, nodesEdges })
    
    // Return the data even if nodes or edges are null/empty
    return nodesEdges || { nodes: null, edges: null }
  } catch (error) {
    console.error('❌ Error getting nodes and edges:', error)
    return { nodes: null, edges: null }
  }
}
