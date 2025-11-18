/**
 * Toast Component
 * 
 * Simple toast notification system with theme-aware styling.
 */

"use client"

import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const duration = toast.duration || 5000 // Default 5 seconds
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, duration)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  const typeStyles = {
    success: 'bg-green-500/20 border-green-500 text-green-400',
    error: 'bg-red-500/20 border-red-500 text-red-400',
    warning: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    info: 'bg-blue-500/20 border-blue-500 text-blue-400',
  }

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        px-4 py-3 rounded-lg border
        ${typeStyles[toast.type]}
        shadow-lg backdrop-blur-sm
        animate-slide-up-light
        max-w-sm
      `}
      style={{ pointerEvents: 'auto' }}
    >
      <p className="text-sm font-theme">{toast.message}</p>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" style={{ pointerEvents: 'none' }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}

// Global toast manager
let toastListeners: Array<(toasts: Toast[]) => void> = []
let toastQueue: Toast[] = []

function notifyListeners() {
  toastListeners.forEach(listener => listener([...toastQueue]))
}

export function showToast(message: string, type: ToastType = 'info', duration?: number) {
  const id = `toast-${Date.now()}-${Math.random()}`
  const toast: Toast = { id, message, type, duration }
  
  toastQueue.push(toast)
  notifyListeners()
  
  return id
}

export function removeToast(id: string) {
  toastQueue = toastQueue.filter(t => t.id !== id)
  notifyListeners()
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToasts(newToasts)
    }
    
    toastListeners.push(listener)
    setToasts([...toastQueue])
    
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener)
    }
  }, [])

  const closeToast = (id: string) => {
    removeToast(id)
  }

  return { toasts, closeToast }
}

