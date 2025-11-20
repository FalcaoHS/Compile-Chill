"use client"

import { useState } from "react"
import { GoogleLoginButton } from "./GoogleLoginButton"
import { LoginButton } from "@/components/LoginButton"
import { EmailLoginForm } from "./EmailLoginForm"
import Link from "next/link"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [showEmailForm, setShowEmailForm] = useState(false)

  if (!isOpen) return null

  const handleEmailLoginSuccess = () => {
    onClose()
    // Reload to update session
    window.location.reload()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
        aria-modal="true"
        role="dialog"
      >
        <div
          className="bg-page-secondary border border-border rounded-lg p-8 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text">Entrar</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text transition-colors"
            aria-label="Fechar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {!showEmailForm ? (
          <>
            <div className="flex flex-col gap-4 mb-6">
              <GoogleLoginButton variant="prominent" />
              <LoginButton variant="prominent" />
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-page-secondary text-text-secondary">
                  ou
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowEmailForm(true)}
              className="
                w-full px-4 py-2 rounded-lg
                font-medium text-sm
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2
                border border-border bg-page text-text
                hover:bg-page-secondary
                focus:ring-primary
                active:scale-95
              "
            >
              Entrar com Email e Senha
            </button>

            <p className="text-xs text-text-secondary text-center mt-6">
              Não tem conta?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary-hover underline"
                onClick={onClose}
              >
                Criar conta
              </Link>
            </p>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowEmailForm(false)}
              className="
                mb-4 text-sm text-text-secondary hover:text-text
                flex items-center gap-2
                transition-colors
              "
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Voltar
            </button>
            <EmailLoginForm onSuccess={handleEmailLoginSuccess} />
          </>
        )}
        </div>
      </div>
    </>
  )
}

