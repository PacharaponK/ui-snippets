import { next } from '@vercel/functions'
import { authorizeMemberAsset, handleSession, memberAssetsPath, privateHeaders, sessionPath } from './libraryAccess.js'

export default function libraryProxy(request) {
  const key = process.env.UI_SNIPPETS_ACCESS_KEY
  const { pathname } = new URL(request.url)
  if (pathname === sessionPath || pathname === `${sessionPath}/`) {
    return handleSession(request, key)
  }
  if (pathname.startsWith(memberAssetsPath)) {
    return authorizeMemberAsset(request, key) ?? next({ headers: privateHeaders })
  }
  return next()
}
