import { computed, ref, shallowRef } from 'vue'

export const memberComponents = shallowRef([])
const expiry = ref(null)
export const signedIn = computed(() => expiry.value !== null)
let expiryTimer
let initialSession

function clearSession() {
  clearTimeout(expiryTimer)
  expiry.value = null
  memberComponents.value = []
}

async function updateSession({ expiresAt }) {
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    clearSession()
    return
  }

  const { default: entries } = await import('./customizeRegistry')
  clearTimeout(expiryTimer)
  memberComponents.value = entries
  expiry.value = expiresAt
  expiryTimer = setTimeout(clearSession, Math.max(0, expiresAt - Date.now()))
}

async function sessionRequest(options) {
  const response = await fetch('/api/session', { cache: 'no-store', ...options }).catch(() => null)
  if (response?.status === 204) return null

  const body = await response?.json().catch(() => null)
  if (!response?.ok || !body) {
    throw new Error(body?.error || 'Sign-in is unavailable.')
  }
  return body
}

export function restoreSession() {
  initialSession ??= sessionRequest()
    .then(updateSession)
    .catch(clearSession)
  return initialSession
}

export async function signIn(key) {
  const session = await sessionRequest({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  })
  try {
    await updateSession(session)
    if (!signedIn.value) throw new Error()
  } catch {
    throw new Error('The library could not load. Try signing in again.')
  }
}

export async function signOut() {
  await sessionRequest({ method: 'DELETE' })
  clearSession()
}
