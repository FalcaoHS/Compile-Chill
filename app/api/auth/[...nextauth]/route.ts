import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

const { handlers } = NextAuth(authConfig)

export const { GET, POST } = handlers

