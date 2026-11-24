import { next } from '@vercel/functions'
import { authorizeMemberAsset, handleSession, libraryCredentials, memberAssetsPath, privateHeaders, sessionPath } from './libraryAccess.js'

export default function libraryProxy(request) {
  const credentials = libraryCredentials(process.env.UI_SNIPPETS_ACCESS_KEY, process.env.UI_SNIPPETS_SESSION_SECRET)
  const { pathname } = new URL(request.url)
  if (pathname === sessionPath || pathname === `${sessionPath}/`) {
    return handleSession(request, credentials)
  }
  if (pathname.startsWith(memberAssetsPath)) {
    return authorizeMemberAsset(request, credentials) ?? next({ headers: privateHeaders })
  }
  return next()
}
