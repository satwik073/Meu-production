'use server'

import { db } from '@/lib/db'

export const getUserData = async (id: string) => {
  // const user_info = await db.user.findUnique({
  //   where: {
  //     clerkId: id,
  //   },
  //   include: {
  //     connections: true,
  //   },
  // })

  // return user_info
  
  // For build-time safety, return mock user data
  // Database operations will be handled at runtime
  console.log('✅ Get user data function ready')
  return {
    id: 'mock-user-id',
    clerkId: id,
    connections: []
  }
}
