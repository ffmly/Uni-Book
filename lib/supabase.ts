import { createClient } from '@supabase/supabase-js'

// Log environment variables (without exposing sensitive data)
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set')
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set')

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Create Supabase client with options
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'uni-book'
      }
    }
  }
)

// Test the connection immediately with timeout
const connectionTest = async () => {
  try {
    console.log('Testing Supabase connection...')
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      console.log('✅ Supabase REST API is accessible')
    } else {
      console.error('❌ Supabase REST API returned error:', response.status, response.statusText)
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('❌ Connection timeout - Supabase server might be down or unreachable')
    } else {
      console.error('❌ Error testing Supabase connection:', error)
    }
  }
}

connectionTest() 