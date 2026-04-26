'use client'

const AVATAR_KEY = 'mh_user_avatar'

/**
 * Retrieve the user's custom avatar data URL from localStorage.
 * Returns null if no custom avatar is stored.
 */
export function getUserAvatar(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(AVATAR_KEY)
  } catch {
    return null
  }
}

/**
 * Save a custom avatar data URL to localStorage.
 */
export function saveUserAvatar(dataUrl: string): void {
  localStorage.setItem(AVATAR_KEY, dataUrl)
  window.dispatchEvent(new CustomEvent('mh_avatar_changed'))
}

/**
 * Remove the custom avatar.
 */
export function removeUserAvatar(): void {
  localStorage.removeItem(AVATAR_KEY)
  window.dispatchEvent(new CustomEvent('mh_avatar_changed'))
}

/**
 * Convert an avatar image file to a resized base64 data URL.
 * Crops to a square and resizes to 256x256.
 */
export function avatarFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new window.Image()
      img.onload = () => {
        const SIZE = 256
        const canvas = document.createElement('canvas')
        canvas.width = SIZE
        canvas.height = SIZE
        const ctx = canvas.getContext('2d')!

        // Crop to center square
        const min = Math.min(img.width, img.height)
        const sx = (img.width - min) / 2
        const sy = (img.height - min) / 2
        ctx.drawImage(img, sx, sy, min, min, 0, 0, SIZE, SIZE)

        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
