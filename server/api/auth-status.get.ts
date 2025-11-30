import { defineEventHandler, getCookie } from 'h3'

const COOKIE_NAME = 'speek_auth'

export default defineEventHandler((event) => {
  const cookie = getCookie(event, COOKIE_NAME)
  return { authenticated: cookie === '1' }
})
