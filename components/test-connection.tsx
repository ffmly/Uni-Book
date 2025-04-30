"use client"

import { useEffect, useState } from "react"
import { createClient } from '@supabase/supabase-js'

// Create a new Supabase client with the provided credentials
const supabase = createClient(
  'https://cqvkshscjzxmdfuadbhp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxdmtzaHNjanp4bWRmdWFkYmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMjE2NjcsImV4cCI6MjA1OTU5NzY2N30.BgCEHg1nUusxuXVZ6JwL2hA_nMiFP_X-2tTf93yTZl8'
)

export default function TestConnection() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Testing...")
  const [tableStatus, setTableStatus] = useState<string>("Testing...")
  const [policyStatus, setPolicyStatus] = useState<string>("Testing...")
  const [errorDetails, setErrorDetails] = useState<string>("")
  const [testData, setTestData] = useState<any>(null)
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    async function testConnection() {
      if (!mounted || isTesting) return
      setIsTesting(true)

      try {
        console.log("=== Starting Supabase Connection Test ===")
        
        // Test 1: Check Supabase connection and auth
        console.log("1. Testing Supabase connection and auth...")
        
        // Add timeout for auth check
        const authPromise = supabase.auth.getSession()
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.error("❌ Auth check timed out")
            setConnectionStatus("❌ Auth check timed out - Check your connection")
            setIsTesting(false)
          }
        }, 10000)

        const { data: { session }, error: authError } = await authPromise
        clearTimeout(timeoutId)
        
        if (!mounted) return

        if (authError) {
          console.error("❌ Auth error:", authError)
          setConnectionStatus(`❌ Auth Error: ${authError.message}`)
          setIsTesting(false)
          return
        }

        if (!session) {
          console.error("❌ No active session")
          setConnectionStatus("❌ No active session - Please sign in")
          setIsTesting(false)
          return
        }

        console.log("✅ Auth session:", {
          userId: session.user.id,
          email: session.user.email,
          expiresAt: session.expires_at
        })
        setConnectionStatus("✅ Connected to Supabase")

        // Test 2: Check projects table with retry logic
        console.log("2. Testing projects table access...")
        let retryCount = 0
        const maxRetries = 3
        
        while (retryCount < maxRetries) {
          try {
            // Add timeout for table access
            const tablePromise = supabase
              .from('projects')
              .select('id, title, description, owner_id')
              .limit(1)
            
            timeoutId = setTimeout(() => {
              if (mounted) {
                console.error(`❌ Table access timed out (attempt ${retryCount + 1})`)
                setTableStatus("❌ Table access timed out - Check your connection")
                setIsTesting(false)
              }
            }, 10000)

            const { data: projects, error: projectsError } = await tablePromise
            clearTimeout(timeoutId)
            
            if (!mounted) return

            if (projectsError) {
              console.error(`❌ Projects table error (attempt ${retryCount + 1}):`, projectsError)
              setTableStatus(`❌ Table Error: ${projectsError.message}`)
              setErrorDetails(`Code: ${projectsError.code}, Details: ${projectsError.details}, Hint: ${projectsError.hint}`)
              
              if (projectsError.code === '42501') { // Permission denied
                console.log("Permission denied - checking RLS policies...")
                const { data: policies } = await supabase.rpc('get_table_policies', { table_name: 'projects' })
                console.log("Current policies:", policies)
              }
              
              retryCount++
              if (retryCount < maxRetries) {
                console.log(`Retrying... (${retryCount}/${maxRetries})`)
                await new Promise(resolve => setTimeout(resolve, 1000))
                continue
              }
            } else {
              console.log("✅ Projects table accessible, data:", projects)
              setTableStatus("✅ Projects table accessible")
              setTestData(projects)
              setErrorDetails("")
              break
            }
          } catch (error) {
            console.error(`❌ Unexpected error during table access (attempt ${retryCount + 1}):`, error)
            retryCount++
            if (retryCount < maxRetries) {
              console.log(`Retrying... (${retryCount}/${maxRetries})`)
              await new Promise(resolve => setTimeout(resolve, 1000))
              continue
            }
          }
        }

        // Test 3: Try to insert a test project
        console.log("3. Testing project insertion...")
        const testProject = {
          title: 'test_project',
          description: 'testing project insertion',
          department: 'engineering',
          status: 'pending_review',
          owner_id: session.user.id
        }

        // Add timeout for project insertion
        const insertPromise = supabase
          .from('projects')
          .insert(testProject)
          .select()
          .single()

        timeoutId = setTimeout(() => {
          if (mounted) {
            console.error("❌ Project insertion timed out")
            setPolicyStatus("❌ Project insertion timed out - Check your connection")
            setIsTesting(false)
          }
        }, 10000)

        const { data: insertedProject, error: insertError } = await insertPromise
        clearTimeout(timeoutId)

        if (!mounted) return

        if (insertError) {
          console.error("❌ Project insertion error:", insertError)
          setPolicyStatus(`❌ Insert Error: ${insertError.message}`)
          setErrorDetails(prev => prev + `\nInsert Error: ${insertError.message}`)
        } else {
          console.log("✅ Project inserted successfully:", insertedProject)
          setPolicyStatus("✅ RLS policies working")
          
          // Clean up test data
          const { error: deleteError } = await supabase
            .from('projects')
            .delete()
            .eq('id', insertedProject.id)
          
          if (deleteError) {
            console.error("❌ Cleanup error:", deleteError)
          } else {
            console.log("✅ Test data cleaned up")
          }
        }

        console.log("=== Supabase Connection Test Complete ===")
      } catch (error) {
        if (!mounted) return
        console.error("❌ Unexpected error during connection test:", error)
        setConnectionStatus("❌ Unexpected error during test")
        if (error instanceof Error) {
          setErrorDetails(error.message)
        }
      } finally {
        if (mounted) {
          setIsTesting(false)
        }
      }
    }

    testConnection()

    return () => {
      mounted = false
      clearTimeout(timeoutId)
    }
  }, [isTesting])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Supabase Connection Test</h1>
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Connection Status</h2>
          <p>{connectionStatus}</p>
        </div>
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Table Access</h2>
          <p>{tableStatus}</p>
          {testData && (
            <div className="mt-2 p-2 bg-gray-50 rounded">
              <h3 className="font-medium">Test Data:</h3>
              <pre className="text-sm overflow-auto">{JSON.stringify(testData, null, 2)}</pre>
            </div>
          )}
        </div>
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">RLS Policies</h2>
          <p>{policyStatus}</p>
        </div>
        {errorDetails && (
          <div className="p-4 border rounded bg-red-50">
            <h2 className="font-semibold mb-2 text-red-700">Error Details</h2>
            <pre className="text-sm text-red-600 whitespace-pre-wrap">{errorDetails}</pre>
          </div>
        )}
      </div>
    </div>
  )
} 