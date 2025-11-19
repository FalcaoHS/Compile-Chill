/**
 * Avatar image utilities
 * 
 * Handles conversion of images to base64 format for storage in database.
 * Validates file size, type, and converts to data URI format.
 */

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB in bytes
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"]

/**
 * Validate image file type
 * 
 * @param file - The file to validate
 * @returns true if file type is allowed, false otherwise
 */
export function validateImageType(file: File): boolean {
  if (!file || !file.type) {
    return false
  }

  return ALLOWED_TYPES.includes(file.type.toLowerCase())
}

/**
 * Validate image file size
 * 
 * @param file - The file to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateImageSize(file: File): {
  isValid: boolean
  error?: string
} {
  if (!file) {
    return {
      isValid: false,
      error: "Arquivo é obrigatório",
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Imagem muito grande. Tamanho máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }
  }

  return { isValid: true }
}

/**
 * Convert image file to base64 data URI
 * 
 * @param file - The image file to convert
 * @returns Promise resolving to base64 data URI string (format: data:image/[type];base64,[data])
 * @throws Error if conversion fails
 */
export function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!validateImageType(file)) {
      reject(
        new Error(
          `Tipo de arquivo inválido. Tipos permitidos: ${ALLOWED_EXTENSIONS.join(", ")}`
        )
      )
      return
    }

    // Validate file size
    const sizeValidation = validateImageSize(file)
    if (!sizeValidation.isValid) {
      reject(new Error(sizeValidation.error || "Invalid file size"))
      return
    }

    // Read file as data URL (base64)
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result
      if (typeof result === "string") {
        resolve(result) // Already in format: data:image/[type];base64,[data]
      } else {
        reject(new Error("Failed to convert image to base64"))
      }
    }

    reader.onerror = () => {
      reject(new Error("Erro ao ler arquivo de imagem"))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Convert image URL to base64 data URI (for Google photos, etc.)
 * 
 * @param imageUrl - The URL of the image to convert
 * @returns Promise resolving to base64 data URI string
 * @throws Error if conversion fails
 */
export async function convertImageUrlToBase64(
  imageUrl: string
): Promise<string> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const blob = await response.blob()

    // Validate blob type
    if (!ALLOWED_TYPES.includes(blob.type)) {
      throw new Error(
        `Tipo de imagem inválido. Tipos permitidos: ${ALLOWED_EXTENSIONS.join(", ")}`
      )
    }

    // Validate blob size
    if (blob.size > MAX_FILE_SIZE) {
      throw new Error(
        `Imagem muito grande. Tamanho máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`
      )
    }

    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        if (typeof result === "string") {
          resolve(result)
        } else {
          reject(new Error("Failed to convert image to base64"))
        }
      }
      reader.onerror = () => {
        reject(new Error("Erro ao converter imagem para base64"))
      }
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("❌ [AVATAR] Failed to convert image URL to base64:", error)
    throw error instanceof Error
      ? error
      : new Error("Failed to convert image URL to base64")
  }
}

/**
 * Extract image type from base64 data URI
 * 
 * @param base64DataUri - The base64 data URI
 * @returns The image MIME type (e.g., "image/png") or null if invalid
 */
export function getImageTypeFromBase64(
  base64DataUri: string
): string | null {
  if (!base64DataUri || !base64DataUri.startsWith("data:image/")) {
    return null
  }

  const match = base64DataUri.match(/^data:image\/([^;]+)/)
  return match ? `image/${match[1]}` : null
}

