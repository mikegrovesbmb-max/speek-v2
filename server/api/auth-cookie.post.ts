import { defineEventHandler, readBody, setCookie } from 'h3'

const COOKIE_NAME = 'speek_auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body || {}

  // If empty username/password, treat as logout (clear cookie)
  if (!username) {
    setCookie(event, COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 })
    return { success: true, cleared: true }
  }

  // Temporary users list - replace with real user storage in production
  const users = [
    { username: 'wifey', password: 'adminimda', displayName: 'wifey' },
    { username: 'mike', password: 'adminimda', displayName: 'Mike' }
  ]

  const user = users.find(u => u.username === username && u.password === password)
  if (user) {
    setCookie(event, COOKIE_NAME, '1', { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
    return { success: true, username: user.username, displayName: user.displayName }
  } else {
    setCookie(event, COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 })
    return { success: false, error: 'Invalid username or password.' }
  }
})
