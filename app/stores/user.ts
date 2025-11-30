import { piniaPluginPersistedstate } from '#imports'
import { defineStore } from 'pinia'

interface user {
  username: string
  displayName?: string
  isAuthenticated: boolean
  authCookie: string
}


export const useUserStore = defineStore('user', {


  state: () => {
    return {
      // for ini
    username: '',
    displayName: '',
    isAuthenticated: false,
    authCookie: '',
    }
  },
  actions: {
    setUser(username: string, displayName?: string) {
      this.username = username
      if (displayName) this.displayName = displayName
      this.isAuthenticated = true
    },
    clearUser() {
      this.username = ''
      this.isAuthenticated = false
      this.authCookie = ''
      this.displayName = ''
    },
    setAuthCookie(cookie: string) {
      this.authCookie = cookie
    },
  },
    persist: [
    {
      storage: piniaPluginPersistedstate.localStorage(),
    },
    {
      storage: piniaPluginPersistedstate.sessionStorage(),
    },
        {
      storage: piniaPluginPersistedstate.cookies(),
    },
  ]
})
