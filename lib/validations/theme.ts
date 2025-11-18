import { z } from "zod"
import { isValidTheme } from "@/lib/themes"

/**
 * Zod schema for theme update validation
 */
export const themeUpdateSchema = z.object({
  theme: z
    .string()
    .min(1, "Tema é obrigatório")
    .refine(
      (theme) => isValidTheme(theme),
      {
        message: "Tema inválido. Os temas disponíveis são: cyber, pixel, neon, terminal, blueprint",
      }
    ),
})

export type ThemeUpdateInput = z.infer<typeof themeUpdateSchema>

