/**
 * MultiTabInitializer Component
 * 
 * Initializes the multi-tab protection system on the client side.
 * This component should be placed high in the component tree,
 * for example, within the Providers component.
 */

"use client"

import { useEffect } from "react"
import { initMultiTabProtection, cleanupMultiTabProtection } from "@/lib/performance/multi-tab"

export function MultiTabInitializer() {
  useEffect(() => {
    initMultiTabProtection()
    
    return () => {
      cleanupMultiTabProtection()
    }
  }, [])

  return null
}

