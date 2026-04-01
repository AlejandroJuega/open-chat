import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  const now = new Date()
  const messageDate = new Date(date)
  
  const diff = now - messageDate
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return 'Hoy'
  } else if (days === 1) {
    return 'Ayer'
  } else if (days < 7) {
    return `Hace ${days} días`
  } else {
    return messageDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    })
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
