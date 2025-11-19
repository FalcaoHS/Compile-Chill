"use client"

import { SignupForm } from "@/components/auth/SignupForm"
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton"
import { LoginButton } from "@/components/LoginButton"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-page py-16 px-4">
      <div className="w-full max-w-md">
        <div className="bg-page-secondary border border-border rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text mb-2">
              Criar Conta
            </h1>
            <p className="text-sm text-text-secondary">
              Escolha uma forma de se cadastrar
            </p>
          </div>

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

          <SignupForm />

          <div className="mt-6 text-center">
            <p className="text-xs text-text-secondary">
              Ao criar uma conta, você concorda com nossos{" "}
              <Link
                href="/termos"
                className="text-primary hover:text-primary-hover underline"
              >
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link
                href="/privacidade"
                className="text-primary hover:text-primary-hover underline"
              >
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

