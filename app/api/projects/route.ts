import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    const {
      department,
      title,
      description,
      leaderInfo,
    } = body

    // Insert the project into the database
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          department,
          title,
          description,
          leader_info: leaderInfo,
          status: 'pending',
          created_at: new Date().toISOString(),
        }
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ message: 'Project submitted successfully', data })
  } catch (error) {
    console.error('Error submitting project:', error)
    return NextResponse.json(
      { error: 'Error submitting project' },
      { status: 500 }
    )
  }
} 