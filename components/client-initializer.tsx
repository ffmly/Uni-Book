"use client"

import { useEffect } from 'react'
import { initializeDefaultData } from '@/lib/local-storage'

export default function ClientInitializer() {
  useEffect(() => {
    initializeDefaultData()
  }, [])
  
  return null
} 