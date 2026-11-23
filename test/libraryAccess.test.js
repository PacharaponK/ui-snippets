import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { after, test } from 'node:test'
import libraryProxy from '../server/libraryProxy.js'

const origin = 'https://library.example'
const key = randomBytes(32).toString('hex')
const previousKey = process.env.UI_SNIPPETS_ACCESS_KEY
process.env.UI_SNIPPETS_ACCESS_KEY = key
after(() => {
  if (previousKey === undefined) delete process.env.UI_SNIPPETS_ACCESS_KEY
  else process.env.UI_SNIPPETS_ACCESS_KEY = previousKey
})

function request(path, options) {
  return libraryProxy(new Request(origin + path, options))
}

function signIn(submitted, requestOrigin = origin) {
  return request('/api/session', {
    method: 'POST',
    headers: { Origin: requestOrigin, 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: submitted }),
  })
}

test('guests cannot fetch Customize bundles', async () => {
  const session = await request('/api/session')
  assert.deepEqual(await session.json(), { expiresAt: null })

  const asset = await request('/member-assets/customize.js')
  assert.equal(asset.status, 401)
  assert.match(asset.headers.get('cache-control'), /no-store/)
})

test('rejects incorrect keys, oversized input and cross-origin sign-in', async () => {
  const invalid = await signIn(randomBytes(32).toString('hex'))
  assert.equal(invalid.status, 401)
  assert.equal(invalid.headers.has('set-cookie'), false)
  assert.equal((await signIn('x'.repeat(256))).status, 401)
  assert.equal((await signIn(key, 'https://other.example')).status, 403)
})

test('only a valid signed session can access assets', async () => {
  const login = await signIn(key)
  assert.equal(login.status, 200)
  const cookie = login.headers.get('set-cookie')
  assert.match(cookie, /^__Host-ui-snippets=/)
  assert.match(cookie, /Path=\/; Max-Age=28800; HttpOnly; Secure; SameSite=Strict/)
  const headers = { Cookie: cookie.split(';')[0] }
  const session = await request('/api/session', { headers })
  assert.ok((await session.json()).expiresAt > Date.now())
  const asset = await request('/member-assets/customize.js', { headers })
  assert.equal(asset.status, 200)
  assert.match(asset.headers.get('cache-control'), /no-store/)

  const modified = headers.Cookie.slice(0, -1) + (headers.Cookie.endsWith('0') ? '1' : '0')
  const tampered = await request('/member-assets/customize.js', { headers: { Cookie: modified } })
  assert.equal(tampered.status, 401)
})

test('expires signed sessions at their recorded expiry', async t => {
  const login = await signIn(key)
  const { expiresAt } = await login.json()
  const headers = { Cookie: login.headers.get('set-cookie').split(';')[0] }

  t.mock.method(Date, 'now', () => expiresAt)
  const asset = await request('/member-assets/customize.js', { headers })
  assert.equal(asset.status, 401)
})

test('sign-out clears the session cookie and requires a same-origin request', async () => {
  const invalid = await request('/api/session', { method: 'DELETE', headers: { Origin: 'https://other.example' } })
  assert.equal(invalid.status, 403)
  const signOut = await request('/api/session', { method: 'DELETE', headers: { Origin: origin } })
  assert.equal(signOut.status, 204)
  assert.match(signOut.headers.get('set-cookie'), /^__Host-ui-snippets=; Path=\/; Max-Age=0/)
})

test('stays in guest mode without a configured access key', async () => {
  delete process.env.UI_SNIPPETS_ACCESS_KEY
  try {
    const login = await signIn(key)
    assert.equal(login.status, 503)
    assert.equal(login.headers.has('set-cookie'), false)
    const session = await request('/api/session')
    assert.deepEqual(await session.json(), { expiresAt: null })
  } finally {
    process.env.UI_SNIPPETS_ACCESS_KEY = key
  }
})
