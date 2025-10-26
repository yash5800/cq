import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SESSION_KEY = "interview_hub_session"
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export function getSessionId() {
  const stored = sessionStorage.getItem(SESSION_KEY)
  console.log("Stored session:", stored)
  const now = Date.now()

  if (stored) {
    const { id, createdAt } = JSON.parse(stored)
    if (now - createdAt < SESSION_DURATION) {
      console.log("Existing valid session:", id)
      return id // still valid
    }
  }

  // expired or missing → create new session
  const newSessionId = `session_${now}_${Math.random().toString(36).substr(2, 9)}`
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ id: newSessionId, createdAt: now })
  )

  return newSessionId
}

