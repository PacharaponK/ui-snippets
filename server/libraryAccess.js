import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

export const sessionPath = '/api/session'
export const memberAssetsPath = '/member-assets/'
export const privateHeaders = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
}

const cookieName = '__Host-ui-snippets'
const sessionSeconds = 8 * 60 * 60
const hexKey = /^[a-f0-9]{64}$/i

function isAccessKey(value) {
  return typeof value === 'string' && value.length >= 8 && value.length <= 64
}

function keyDigest(key, caseInsensitive) {
  return createHash('sha256').update(caseInsensitive ? key.toLowerCase() : key, 'utf16le').digest()
}

export function libraryCredentials(key, secret) {
  const accessKey = key?.trim()
  const sessionSecret = secret?.trim()
  if (!isAccessKey(accessKey)) return null

  const caseInsensitive = hexKey.test(accessKey)
  const digest = keyDigest(accessKey, caseInsensitive)
  if (sessionSecret === undefined) {
    return caseInsensitive ? { digest, caseInsensitive, signingKey: Buffer.from(accessKey, 'hex') } : null
  }
  if (!hexKey.test(sessionSecret)) return null

  const signingKey = createHmac('sha256', Buffer.from(sessionSecret, 'hex'))
    .update('ui-snippets session signing key v2:')
    .update(digest)
    .digest()
  return { digest, caseInsensitive, signingKey }
}

function signature(signingKey, expiry) {
  return createHmac('sha256', signingKey)
    .update(`ui-snippets session v1:${expiry}`)
    .digest()
}

function getExpiry(request, credentials) {
  if (!credentials) return null

  const cookie = request.headers.get('cookie')?.split(';')
    .map(item => item.trim())
    .find(item => item.startsWith(`${cookieName}=`))
  const match = cookie?.slice(cookieName.length + 1).match(/^(\d{1,15})\.([a-f0-9]{64})$/)
  if (!match || Number(match[1]) <= Date.now()) return null

  return timingSafeEqual(signature(credentials.signingKey, match[1]), Buffer.from(match[2], 'hex'))
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
      if (bytes > 512) {
        await reader.cancel()
        return null
      }
      text += decoder.decode(value, { stream: true })
    }
    const body = JSON.parse(text + decoder.decode())
    return isAccessKey(body?.key) ? body.key : null
  } catch {
    return null
  }
}

export function authorizeMemberAsset(request, credentials) {
  return getExpiry(request, credentials) ? null : json({ error: 'Sign in required.' }, 401)
}

export async function handleSession(request, credentials) {
  if (request.method === 'GET') return json({ expiresAt: getExpiry(request, credentials) }, 200)

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

  if (!credentials) return json({ error: 'Sign-in is unavailable.' }, 503)

  const submitted = await readKey(request)
  if (!submitted || !timingSafeEqual(keyDigest(submitted, credentials.caseInsensitive), credentials.digest)) {
    return json({ error: 'The access key is incorrect.' }, 401)
  }

  const expiresAt = Date.now() + sessionSeconds * 1000
  const token = `${expiresAt}.${signature(credentials.signingKey, expiresAt).toString('hex')}`
  return json({ expiresAt }, 200, { 'Set-Cookie': sessionCookie(token, sessionSeconds) })
}
