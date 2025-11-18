/**
 * ToastProvider Component
 * 
 * Provides toast notifications globally.
 */

"use client"

import { ToastContainer, useToast } from "./Toast"

export function ToastProvider() {
  const { toasts, closeToast } = useToast()
  
  return <ToastContainer toasts={toasts} onClose={closeToast} />
}

