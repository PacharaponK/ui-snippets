import { createHmac, timingSafeEqual } from 'node:crypto'

export const sessionPath = '/api/session'
export const memberAssetsPath = '/member-assets/'
export const privateHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
}

const cookieName = '__Host-ui-snippets'
const sessionSeconds = 8 * 60 * 60
const hexKey = /^[a-f0-9]{64}$/i

function signature(key, expiry) {
  return createHmac('sha256', Buffer.from(key, 'hex'))
    .update(`ui-snippets session v1:${expiry}`)
    .digest()
}

function getExpiry(request, key) {
  if (!hexKey.test(key)) return null

  const cookie = request.headers.get('cookie')?.split(';')
    .map(item => item.trim())
    .find(item => item.startsWith(`${cookieName}=`))
  const match = cookie?.slice(cookieName.length + 1).match(/^(\d{1,15})\.([a-f0-9]{64})$/)
  if (!match || Number(match[1]) <= Date.now()) return null

  return timingSafeEqual(signature(key, match[1]), Buffer.from(match[2], 'hex'))
    ? Number(match[1])
    : null
}

function sessionCookie(value, maxAge) {
  return `${cookieName}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`
}

function json(body, status, headers = {}) {
  return Response.json(body, { status, headers: { ...privateHeaders, ...headers } })
}

async function readKey(request) {
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') return null

  const reader = request.body?.getReader()
  if (!reader) return null

  let text = ''
  let bytes = 0
  const decoder = new TextDecoder()
  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > 256) {
        await reader.cancel()
        return null
      }
      text += decoder.decode(value, { stream: true })
    }
    const body = JSON.parse(text + decoder.decode())
    return typeof body?.key === 'string' && hexKey.test(body.key) ? body.key : null
  } catch {
    return null
  }
}

export function authorizeMemberAsset(request, key) {
  return getExpiry(request, key) ? null : json({ error: 'Sign in required.' }, 401)
}

export async function handleSession(request, key) {
  if (request.method === 'GET') return json({ expiresAt: getExpiry(request, key) }, 200)

  if (request.method !== 'POST' && request.method !== 'DELETE') {
    return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST, DELETE' })
  }
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return json({ error: 'Request must come from this site.' }, 403)
  }

  if (request.method === 'DELETE') {
    return new Response(null, {
      status: 204,
      headers: { ...privateHeaders, 'Set-Cookie': sessionCookie('', 0) },
    })
  }

  if (!hexKey.test(key)) return json({ error: 'Sign-in is unavailable.' }, 503)

  const submitted = await readKey(request)
  if (!submitted || !timingSafeEqual(Buffer.from(submitted, 'hex'), Buffer.from(key, 'hex'))) {
    return json({ error: 'The access key is incorrect.' }, 401)
  }

  const expiresAt = Date.now() + sessionSeconds * 1000
  const token = `${expiresAt}.${signature(key, expiresAt).toString('hex')}`
  return json({ expiresAt }, 200, { 'Set-Cookie': sessionCookie(token, sessionSeconds) })
}
