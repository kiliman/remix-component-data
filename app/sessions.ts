// app/sessions.js
import { createCookieSessionStorage } from 'remix'

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: '__session',
      path: '/',
    },
  })

export { getSession, commitSession, destroySession }
